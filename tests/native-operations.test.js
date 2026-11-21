import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as sync from '../src/services/nativeBookmarkSync.js';

afterEach(() => { delete globalThis.chrome; });

test('native bookmark lookup uses its exact ID instead of touching duplicates', async () => {
  let searches = 0;
  globalThis.chrome = { tabs: {}, bookmarks: {
    get: async id => [{ id, url: 'https://page.test' }],
    search: async () => { searches++; return []; }
  } };
  const matches = await sync.findNativeBookmarkMatches({ source: 'chrome', nativeId: '42', url: 'https://page.test' });
  assert.equal(matches[0].id, '42');
  assert.equal(searches, 0);
});

test('remote records discover matching local Chrome bookmarks without deleting all copies', async () => {
  globalThis.chrome = { tabs: {}, bookmarks: {
    search: async query => { assert.equal(query.url, 'https://page.test'); return [{ id: '1', url: query.url }, { id: '2', url: query.url }]; }
  } };
  assert.equal((await sync.findNativeBookmarkMatches({ source: 'remote', url: 'https://page.test' })).length, 2);
});

test('folder move calls Chrome move with an exact parent ID', async () => {
  const calls = [];
  globalThis.chrome = { tabs: {}, bookmarks: {
    move: async (id, destination) => { calls.push({ id, destination }); return { id, ...destination }; }
  } };
  await sync.moveNativeBookmark({ id: '42' }, { id: 'chrome:7' }, { title: 'Page', url: 'https://page.test' });
  assert.deepEqual(calls, [{ id: '42', destination: { parentId: '7' } }]);
});

test('moving a record without a local counterpart creates it in the selected Chrome folder', async () => {
  let created;
  globalThis.chrome = { tabs: {}, bookmarks: { create: async record => { created = record; return { ...record, id: 'new' }; } } };
  await sync.moveNativeBookmark(null, { id: 'chrome:7' }, { title: 'Page', url: 'https://page.test' });
  assert.deepEqual(created, { parentId: '7', title: 'Page', url: 'https://page.test' });
});

test('Chrome move failures propagate and do not appear successful', async () => {
  globalThis.chrome = { tabs: {}, bookmarks: { move: async () => { throw new Error('Managed folder'); } } };
  await assert.rejects(sync.moveNativeBookmark({ id: '42' }, { id: 'chrome:7' }, {}), /Managed folder/);
});

test('read-only bookmark checks never create a missing Shiori folder', async () => {
  let creates = 0;
  globalThis.chrome = { tabs: {}, runtime: {}, bookmarks: {
    getChildren: (_parent, callback) => callback([]),
    create: (_record, callback) => { creates++; callback({ id: 'new' }); },
    search: (_query, callback) => callback([])
  } };
  assert.equal(await sync.checkUrlInShioriFolder('https://page.test'), false);
  assert.equal(creates, 0);
});

test('checkUrlBookmarked detects URL anywhere in Chrome tree or IndexedDB', async () => {
  globalThis.chrome = {
    tabs: {},
    runtime: {},
    bookmarks: {
      search: (query, callback) => {
        if (query.url === 'https://bookmarked.com') {
          callback([{ id: '99', url: 'https://bookmarked.com', parentId: 'any-folder' }]);
        } else {
          callback([]);
        }
      }
    }
  };

  assert.equal(await sync.checkUrlBookmarked('https://bookmarked.com'), true);
  assert.equal(await sync.checkUrlBookmarked('https://not-bookmarked.com'), false);
});

test('setExtensionBookmarkIcon switches icon path, badge and title between bookmarked and default', () => {
  let iconDetails = null;
  let badgeDetails = null;
  let titleDetails = null;

  globalThis.chrome = {
    tabs: {},
    bookmarks: {},
    action: {
      setIcon: (details, cb) => { iconDetails = details; cb?.(); },
      setBadgeText: (details, cb) => { badgeDetails = details; cb?.(); },
      setBadgeBackgroundColor: (details, cb) => { cb?.(); },
      setTitle: (details, cb) => { titleDetails = details; cb?.(); }
    }
  };

  // 1. 已收藏：设置为紫罗兰靶心勾选图标 + ★ 五角星 Badge + 已收藏提示
  sync.setExtensionBookmarkIcon(true, 123);
  assert.equal(iconDetails.tabId, 123);
  assert.equal(iconDetails.path[16], 'icons/action-bookmarked-16.png');
  assert.equal(badgeDetails.text, '★');
  assert.equal(titleDetails.title.includes('已收藏'), true);

  // 2. 未收藏：设置为默认图标 + 清空 Badge
  sync.setExtensionBookmarkIcon(false, 123);
  assert.equal(iconDetails.path[16], 'icons/action-default-16.png');
  assert.equal(badgeDetails.text, '');
  assert.equal(titleDetails.title.includes('添加'), true);
});

test('setExtensionBookmarkIcon without tabId queries active tab and clearGlobalBadge empties badge text', () => {
  let badgeCalls = [];
  let queried = false;

  globalThis.chrome = {
    tabs: {
      query: (filter, cb) => {
        queried = true;
        cb([{ id: 999 }]);
      }
    },
    bookmarks: {},
    action: {
      setIcon: (details, cb) => { cb?.(); },
      setBadgeText: (details, cb) => { badgeCalls.push(details); cb?.(); },
      setBadgeBackgroundColor: (details, cb) => { cb?.(); },
      setTitle: (details, cb) => { cb?.(); }
    }
  };

  // 1. clearGlobalBadge 显式清空全局 Badge
  sync.clearGlobalBadge();
  assert.equal(badgeCalls[0].text, '');
  assert.equal(badgeCalls[0].tabId, undefined);

  // 2. 未传 tabId 时，自动委托给当前激活标签页设置，杜绝全局 Badge 污染
  sync.setExtensionBookmarkIcon(true);
  assert.equal(queried, true);
  assert.equal(badgeCalls[1].text, '★');
  assert.equal(badgeCalls[1].tabId, 999);
});
