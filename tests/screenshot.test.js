import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as service from '../src/services/bookmarkService.js';

afterEach(() => { delete globalThis.chrome; });

test('web preview rejects capture instead of returning a stock photo', async () => {
  await assert.rejects(service.captureCurrentTab(), /扩展/);
});

test('Chrome capture errors propagate instead of replacing the screenshot with a stock photo', async () => {
  globalThis.chrome = { bookmarks: {}, tabs: {
    query: async () => [{ id: 1, windowId: 2, url: 'https://page.test', status: 'complete' }],
    captureVisibleTab: async () => { throw new Error('permission denied'); }
  } };
  await assert.rejects(service.captureCurrentTab(), /permission denied/);
});

function fixture({ captureError, switched = false, loading = false } = {}) {
  const actions = [];
  let activeId = 1;
  let reads = 0;
  globalThis.chrome = { bookmarks: {}, tabs: {
    query: async () => [{ id: activeId, windowId: 7, url: activeId === 1 ? 'chrome-extension://test/options.html' : 'https://target.test' }],
    create: async options => { actions.push(['create', options]); activeId = 2; return { id: 2 }; },
    get: async id => { reads++; return { id, windowId: 7, url: 'https://target.test', status: loading && reads < 2 ? 'loading' : 'complete' }; },
    captureVisibleTab: async (windowId, options) => {
      actions.push(['capture', windowId, options]);
      if (captureError) throw new Error(captureError);
      if (switched) activeId = 3;
      return 'data:image/png;base64,captured';
    },
    remove: async id => { actions.push(['remove', id]); },
    update: async (id, options) => { actions.push(['update', id, options]); activeId = id; }
  } };
  return actions;
}

test('bookmark refresh opens the target, waits for load, captures its window and restores the original tab', async () => {
  const actions = fixture({ loading: true });
  assert.equal(await service.captureBookmark('https://target.test'), 'data:image/png;base64,captured');
  assert.deepEqual(actions[0], ['create', { url: 'https://target.test/', windowId: 7, active: true }]);
  assert.ok(actions.some(action => action[0] === 'capture' && action[1] === 7));
  assert.ok(actions.some(action => action[0] === 'remove' && action[1] === 2));
  assert.ok(actions.some(action => action[0] === 'update' && action[1] === 1));
});

test('failed capture closes its temporary tab without returning a replacement image', async () => {
  const actions = fixture({ captureError: 'denied' });
  await assert.rejects(service.captureBookmark('https://target.test'), /denied/);
  assert.ok(actions.some(action => action[0] === 'remove' && action[1] === 2));
});

test('switching tabs during capture discards the image and does not steal focus back', async () => {
  const actions = fixture({ switched: true });
  await assert.rejects(service.captureBookmark('https://target.test'), /切换/);
  assert.ok(!actions.some(action => action[0] === 'update'));
  assert.ok(actions.some(action => action[0] === 'remove' && action[1] === 2));
});

test('non-web URLs are rejected before opening a tab', async () => {
  const actions = fixture();
  await assert.rejects(service.captureBookmark('chrome://settings'), /HTTP/);
  assert.deepEqual(actions, []);
});
