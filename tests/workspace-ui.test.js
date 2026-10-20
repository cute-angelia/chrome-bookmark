import { test } from 'node:test';
import assert from 'node:assert/strict';

test('workspace fills the viewport, combines sources, filters hierarchy and updates its status lamp', {
  skip: !process.env.PLAYWRIGHT_MODULE
}, async () => {
  const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let online = true;
    let remoteDelay = 0;
    const remotePages = [];
    await page.route('https://fixture.test/api/bookmarks', async route => {
      const pageNumber = route.request().postDataJSON().page;
      remotePages.push(pageNumber);
      if (remoteDelay) await new Promise(resolve => setTimeout(resolve, remoteDelay));
      await route.fulfill({ json: online ? { code: 0, data: { page: pageNumber, maxPage: 2,
        bookmarks: [{ id: pageNumber, title: `Remote ${pageNumber}`, url: `https://remote.test/${pageNumber}` }] } }
        : { code: -999, msg: 'expired' } });
    });
    await page.addInitScript(() => {
      const listeners = new Map();
      window.emitNativeEvent = name => listeners.get(name)?.();
      window.getTreeCalls = 0;
      window.chrome = {
        runtime: {}, tabs: {},
        storage: { local: {
          get(keys, callback) {
            const result = { cutbookmark_shiori_config_v2: { server: 'https://fixture.test', token: 'fixture', username: 'test' } };
            keys.forEach(key => { const value = localStorage.getItem(key); if (value) result[key] = JSON.parse(value); });
            callback(result);
          },
          set(value, callback) {
            Object.entries(value).forEach(([key, data]) => localStorage.setItem(key, JSON.stringify(data)));
            callback?.();
          }
        }, onChanged: { addListener() {}, removeListener() {} } },
        bookmarks: {
          getTree(callback) { window.getTreeCalls++; callback([{ id: '0', children: [{ id: '1', title: 'Bookmark bar', children: [
            { id: '2', title: 'Nested', children: [{ id: '3', title: 'Chrome real', url: 'https://native.test', dateAdded: 1 }] }
          ] }] }]); },
          ...Object.fromEntries(['onCreated', 'onRemoved', 'onChanged', 'onMoved', 'onChildrenReordered', 'onImportEnded'].map(name => [name, {
            addListener(callback) { listeners.set(name, callback); }, removeListener() {}
          }]))
        }
      };
    });
    await page.goto(process.env.WORKSPACE_URL || 'http://127.0.0.1:5174');
    await page.getByRole('heading', { name: 'Remote 2', exact: true }).waitFor();
    assert.equal(await page.getByRole('heading', { name: 'Chrome real', exact: true }).count(), 1);
    assert.equal(await page.getByRole('heading', { name: /CutBookmark/ }).count(), 1);
    assert.equal(await page.getByText('独立弹窗预览', { exact: false }).count(), 0);
    const rootBounds = await page.locator('main > div').first().boundingBox();
    assert.equal(rootBounds.x, 0);
    assert.equal(rootBounds.width, 1440);
    assert.equal((await page.locator('aside').boundingBox()).width, 320);
    assert.equal(await page.locator('aside').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(248, 250, 252)');
    const headerBounds = await page.locator('header').boundingBox();
    assert.equal(rootBounds.y, headerBounds.height);
    assert.equal(rootBounds.height + rootBounds.y, 900);
    const lamp = page.getByRole('button', { name: '远程服务设置' });
    assert.equal(await lamp.innerText(), '');
    assert.equal(await lamp.getAttribute('title'), null);
    assert.match(await lamp.locator('span').getAttribute('class'), /connection-breathe/);
    const initialSidebar = await page.locator('aside').innerText();
    const treeCalls = await page.evaluate(() => window.getTreeCalls);
    remotePages.length = 0;
    remoteDelay = 200;
    await page.evaluate(() => {
      for (let index = 0; index < 12; index++) window.emitNativeEvent('onChanged');
      for (let index = 0; index < 6; index++) window.dispatchEvent(new Event('focus'));
    });
    await page.waitForFunction(before => window.getTreeCalls > before && !!document.querySelector('.connection-breathe'), treeCalls);
    assert.equal(await page.evaluate(() => window.getTreeCalls), treeCalls + 1);
    assert.deepEqual(remotePages, [1]);
    assert.equal(await page.locator('aside').innerText(), initialSidebar);
    remoteDelay = 0;
    await page.getByRole('button', { name: /^Bookmark bar/ }).click();
    assert.equal(await page.getByRole('heading', { name: 'Chrome real', exact: true }).count(), 1);
    assert.equal(await page.getByRole('heading', { name: 'Remote 2', exact: true }).count(), 0);
    await page.getByRole('button', { name: /^远程书签/ }).click();
    assert.equal(await page.getByRole('heading', { name: /^Remote [12]$/, exact: true }).count(), 2);
    online = false;
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await page.waitForFunction(() => document.querySelector('[aria-label="远程服务设置"] span')?.classList.contains('bg-slate-400'));
    assert.equal(await page.getByRole('heading', { name: 'Remote 2', exact: true }).count(), 1);
    assert.equal(await page.locator('.swal2-container').count(), 0);
    online = true;
    remotePages.length = 0;
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await page.waitForFunction(() => document.querySelector('.connection-breathe'));
    assert.deepEqual(remotePages, [1]);
    assert.equal(await page.getByRole('heading', { name: 'Remote 2', exact: true }).count(), 1);
    remotePages.length = 0;
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.connection-breathe'));
    assert.deepEqual(remotePages, [1]);
    assert.equal(await page.getByRole('heading', { name: 'Remote 2', exact: true }).count(), 1);
    await lamp.click();
    await page.getByRole('heading', { name: '自建远程服务连接设置' }).waitFor();
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('header').evaluate(node => node.getBoundingClientRect().width), 390);
    const lampBounds = await lamp.boundingBox();
    assert.ok(lampBounds.x >= 0 && lampBounds.x + lampBounds.width <= 390);
  } finally {
    await browser.close();
  }
});
