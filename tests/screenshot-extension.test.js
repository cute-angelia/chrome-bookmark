import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { resolve } from 'node:path';

async function poll(check) {
  const deadline = Date.now() + 30000;
  while (!await check()) {
    if (Date.now() >= deadline) throw new Error('Extension state did not settle');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

test('real extension captures a loaded webpage and persists its PNG without leaving a temporary tab', {
  skip: !process.env.PLAYWRIGHT_MODULE || !process.env.EXTENSION_BROWSER,
  timeout: 60000
}, async () => {
  const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('<html><body style="margin:0;background:rgb(18,130,77);color:white"><h1>Real Screenshot Fixture</h1></body></html>');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  let context;
  try {
    const extension = resolve('dist');
    context = await chromium.launchPersistentContext('', {
      executablePath: process.env.EXTENSION_BROWSER,
      headless: false,
      viewport: { width: 1100, height: 800 },
      args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`]
    });
    const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    const id = new URL(worker.url()).host;
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.readTestBookmarks = () => new Promise((resolve, reject) => {
        const open = indexedDB.open('cutbookmark', 1);
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          const transaction = db.transaction('bookmarks');
          const request = transaction.objectStore('bookmarks').getAll();
          transaction.oncomplete = () => { db.close(); resolve(request.result); };
          transaction.onabort = () => { db.close(); reject(transaction.error); };
        };
      });
    });
    await page.goto(`chrome-extension://${id}/options.html`);
    await page.evaluate(async url => {
      await chrome.storage.local.set({
        cutbookmark_shiori_config_v2: { token: '', server: '' }
      });
      await new Promise((resolve, reject) => {
        const request = indexedDB.open('cutbookmark', 1);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction('bookmarks', 'readwrite');
          transaction.objectStore('bookmarks').put({ id: 'capture-test', title: 'Capture Fixture', url,
            domain: '127.0.0.1', tags: [], screenshot: '', folder: '', dateAdded: Date.now() });
          transaction.oncomplete = () => { db.close(); resolve(); };
          transaction.onabort = () => reject(transaction.error);
        };
      });
    }, url);
    await page.reload();
    await page.getByRole('button', { name: '刷新截屏', exact: true }).waitFor();
    await page.getByRole('button', { name: '刷新截屏', exact: true }).click();
    await poll(() => page.evaluate(async () => {
      return (await window.readTestBookmarks()).find(b => b.id === 'capture-test')?.screenshot?.startsWith('data:image/png;base64,');
    }));
    const image = await page.evaluate(async () => {
      return (await window.readTestBookmarks()).find(b => b.id === 'capture-test').screenshot;
    });
    assert.ok(image.length > 100, JSON.stringify({ image, body: await page.locator('body').innerText() }));
    const pixel = await page.evaluate(async image => {
      const img = new Image();
      img.src = image;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return [...ctx.getImageData(200, 200, 1, 1).data];
    }, image);
    assert.deepEqual(pixel, [18, 130, 77, 255]);
    assert.ok(!context.pages().some(page => page.url() === url));
    const active = await page.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab.url;
    });
    assert.equal(active, page.url());
    await page.reload();
    await page.waitForFunction(() => [...document.images].some(img => img.src.startsWith('data:image/png;base64,')));
    const native = await page.evaluate(async url => {
      const folder = await chrome.bookmarks.create({ parentId: '1', title: 'Move target' });
      const bookmark = await chrome.bookmarks.create({ parentId: '1', title: 'Native fixture', url });
      return { folderId: folder.id, id: bookmark.id };
    }, url);
    await page.getByRole('heading', { name: 'Native fixture', exact: true }).waitFor();
    await page.getByRole('heading', { name: 'Native fixture', exact: true }).click();
    await page.getByRole('combobox', { name: '整理到 Chrome 文件夹' }).selectOption(`chrome:${native.folderId}`);
    await poll(() => page.evaluate(async native => (await chrome.bookmarks.get(native.id))[0].parentId === native.folderId, native));
    await poll(() => page.evaluate(async native => (await window.readTestBookmarks()).some(bookmark =>
      bookmark.source === 'chrome' && bookmark.nativeId === native.id && bookmark.folderId === `chrome:${native.folderId}`), native));
    await page.getByRole('button', { name: '删除此书签', exact: true }).click();
    await page.getByRole('button', { name: '确定执行', exact: true }).click();
    await poll(() => page.evaluate(async id => {
      try { return (await chrome.bookmarks.get(id)).length === 0; } catch { return true; }
    }, native.id));
    await poll(() => page.evaluate(async id => !(await window.readTestBookmarks()).some(b => b.nativeId === id && b.source === 'chrome'), native.id));
  } finally {
    if (context) await context.close();
    await new Promise(resolve => server.close(resolve));
  }
});
