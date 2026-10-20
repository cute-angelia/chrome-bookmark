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
