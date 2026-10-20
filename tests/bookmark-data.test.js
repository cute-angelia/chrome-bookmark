import { test, beforeEach, afterEach } from 'node:test';
import { IDBFactory } from 'fake-indexeddb';
import assert from 'node:assert/strict';
import * as api from '../src/services/shioriApi.js';
import * as library from '../src/services/bookmarkLibrary.js';
import { getStoredBookmarks, getStoredFolders, saveStoredBookmarks, saveStoredFolders } from '../src/services/bookmarkStorage.js';
import { INITIAL_BOOKMARKS, INITIAL_FOLDERS } from '../src/data/mockBookmarks.js';

const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key)
};
const originalFetch = globalThis.fetch;
beforeEach(() => { globalThis.indexedDB = new IDBFactory(); });
afterEach(() => { values.clear(); delete globalThis.chrome; globalThis.fetch = originalFetch; });

test('IndexedDB starts empty and never reads legacy localStorage demo data', async () => {
  assert.deepEqual(await getStoredBookmarks(), []);
  assert.deepEqual(await getStoredFolders(), []);
  assert.equal(values.size, 0);
  values.set('cutbookmark_store_bookmarks_v2', JSON.stringify([...INITIAL_BOOKMARKS, { id: 'mine', url: 'https://mine.test' }]));
  values.set('cutbookmark_store_folders_v2', JSON.stringify(INITIAL_FOLDERS));
  assert.deepEqual(await getStoredBookmarks(), []);
  assert.deepEqual(await getStoredFolders(), []);
});

test('bookmarks, screenshots and folders persist exclusively in IndexedDB', async () => {
  const bookmarks = [{ id: 'remote:1', source: 'remote', remoteId: 1, screenshot: 'data:image/png;base64,real' }];
  const folders = [{ id: 'folder:1', name: 'Work' }];
  await saveStoredBookmarks(bookmarks);
  await saveStoredFolders(folders);
  assert.deepEqual(await getStoredBookmarks(), bookmarks);
  assert.deepEqual(await getStoredFolders(), folders);
  assert.equal(values.size, 0);
  await saveStoredBookmarks([]);
  assert.deepEqual(await getStoredBookmarks(), []);
});

test('invalid writes roll back without losing the previous IndexedDB records', async () => {
  await saveStoredBookmarks([{ id: 'safe', title: 'Keep' }]);
  await assert.rejects(saveStoredBookmarks([{ title: 'Missing key' }]));
  assert.deepEqual(await getStoredBookmarks(), [{ id: 'safe', title: 'Keep' }]);
});

test('saving Vue reactive state produces IndexedDB-cloneable records', async () => {
  const { reactive } = await import('vue');
  const records = reactive([{ id: 'vue', tags: ['tag'], screenshot: 'data:image/png;base64,real' }]);
  await saveStoredBookmarks(records);
  assert.deepEqual(await getStoredBookmarks(), [{ id: 'vue', tags: ['tag'], screenshot: 'data:image/png;base64,real' }]);
});

test('legacy cleanup removes only CutBookmark keys and does not migrate them', async () => {
  values.set('cutbookmark_store_bookmarks_v2', JSON.stringify([{ id: 'legacy' }]));
  values.set('cutbookmark_store_folders_v2', '[]');
  values.set('cutbookmark_shiori_config_v2', JSON.stringify({ token: 'legacy' }));
  values.set('unrelated', 'keep');
  assert.deepEqual(await getStoredBookmarks(), []);
  assert.deepEqual([...values.entries()], [['unrelated', 'keep']]);
});

test('web connection settings use IndexedDB rather than localStorage', async () => {
  await api.saveServerConfig({ server: 'https://server.test', token: 'saved', username: 'test' });
  assert.equal((await api.getServerConfig()).token, 'saved');
  assert.equal(values.size, 0);
});

test('reads Chrome hierarchy including empty folders and duplicate folder names', async () => {
  globalThis.chrome = { tabs: {}, runtime: {}, bookmarks: { getTree: cb => cb([{ id: '0', children: [
    { id: '1', title: 'Bar', children: [{ id: '3', title: 'Work', children: [{ id: '4', title: 'Real', url: 'https://real.test', dateAdded: 123 }] }] },
    { id: '2', title: 'Other', children: [{ id: '5', title: 'Work', children: [] }] }
  ] }]) } };
  const result = await library.readChromeLibrary();
  assert.equal(result.bookmarks.length, 1);
  assert.equal(result.bookmarks[0].folderId, 'chrome:3');
  assert.equal(result.bookmarks[0].source, 'chrome');
  assert.deepEqual(result.bookmarks[0].ancestorIds, ['chrome:1', 'chrome:3']);
  assert.equal(result.folders.length, 4);
  assert.equal(result.folders[1].depth, 1);
  assert.equal(result.folders[3].id, 'chrome:5');
});

test('remote list uses authenticated POST and loads every page', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options });
    const page = JSON.parse(options.body).page;
    return { ok: true, json: async () => ({ code: 0, data: { page, maxPage: 2, bookmarks: [
      { id: page, title: `Remote ${page}`, url: `https://remote.test/${page}`, tags_detail: [{ name: 'tag' }], imageURL: '/image.png', created: '2026-10-20T00:00:00Z' }
    ] } }) };
  };
  const result = await api.fetchRemoteBookmarks({ server: 'https://server.test/', token: 'secret' });
  assert.equal(result.length, 2);
  assert.equal(calls[0].url, 'https://server.test/api/bookmarks');
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].headers.Authorization, 'Bearer secret');
  const mapped = library.normalizeRemoteBookmarks(result, 'https://server.test');
  assert.equal(mapped[0].id, 'remote:https://server.test:1');
  assert.deepEqual(mapped[0].tags, ['tag']);
  assert.equal(mapped[0].screenshot, 'https://server.test/image.png');
});

test('expired authentication and malformed responses never report successful loads', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ code: -999, msg: 'expired' }) });
  await assert.rejects(api.fetchRemoteBookmarks({ server: 'https://server.test', token: 'bad' }), /expired/);
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ code: 0, data: {} }) });
  await assert.rejects(api.fetchRemoteBookmarks({ server: 'https://server.test', token: 'bad' }));
});

test('merge preserves both source records and local metadata without reviving stale imports', () => {
  const fresh = [{ id: 'chrome:4', source: 'chrome', title: 'New', url: 'https://same.test', tags: [] },
    { id: 'remote:s:4', source: 'remote', title: 'Remote', url: 'https://same.test', tags: [] }];
  const result = library.mergeLibraryBookmarks([
    { id: 'chrome:4', source: 'chrome', title: 'Old', pinned: true, notes: 'mine' },
    { id: 'chrome:gone', source: 'chrome' }, { id: 'local', title: 'Local' }
  ], fresh);
  assert.equal(result.length, 3);
  assert.equal(result.find(b => b.id === 'chrome:4').title, 'New');
  assert.equal(result.find(b => b.id === 'chrome:4').notes, 'mine');
  assert.equal(result.find(b => b.id === 'chrome:4').pinned, true);
});

test('legacy extension connection config remains available', async () => {
  globalThis.chrome = { bookmarks: {}, tabs: {}, storage: { local: { get: (keys, cb) => cb({ server: 'https://legacy.test', token: 'legacy', username: 'me' }) } } };
  const config = await api.getServerConfig();
  assert.equal(config.token, 'legacy');
  assert.equal(config.server, 'https://legacy.test');
});

test('cached first page stops pagination even when the server has more pages', async () => {
  const pages = [];
  globalThis.fetch = async (_url, options) => {
    const page = JSON.parse(options.body).page;
    pages.push(page);
    return { ok: true, json: async () => ({ code: 0, data: { page, maxPage: 9,
      bookmarks: [{ id: 2, title: 'Updated' }, { id: 1 }] } }) };
  };
  const result = await api.fetchRemoteBookmarkUpdates({ server: 'https://server.test', token: 'secret' }, [
    { remoteId: 1 }, { remoteId: '2' }, { remoteId: 0 }
  ]);
  assert.deepEqual(pages, [1]);
  assert.equal(result.complete, false);
  assert.equal(result.bookmarks[0].title, 'Updated');
});

test('new records continue paging until the entire next page is already cached', async () => {
  const pages = [];
  globalThis.fetch = async (_url, options) => {
    const page = JSON.parse(options.body).page;
    pages.push(page);
    return { ok: true, json: async () => ({ code: 0, data: { page, maxPage: 8,
      bookmarks: page === 1 ? [{ id: 4 }, { id: 3 }] : [{ id: 2 }, { id: 1 }] } }) };
  };
  const result = await api.fetchRemoteBookmarkUpdates({ server: 'https://server.test', token: 'secret' }, [
    { remoteId: 3 }, { remoteId: 2 }, { remoteId: 1 }
  ]);
  assert.deepEqual(pages, [1, 2]);
  assert.deepEqual(result.bookmarks.map(b => b.id), [4, 3, 2, 1]);
  assert.equal(result.complete, false);
});

test('partial refresh retains untouched cached pages while refreshing fetched records', () => {
  const result = library.mergeRemoteBookmarks([
    { id: 'remote:1', title: 'Old' }, { id: 'remote:2', title: 'Untouched' }
  ], [{ id: 'remote:1', title: 'Updated' }], false);
  assert.equal(result.length, 2);
  assert.equal(result.find(b => b.id === 'remote:1').title, 'Updated');
  assert.equal(result.find(b => b.id === 'remote:2').title, 'Untouched');
  assert.equal(library.mergeRemoteBookmarks(result, [], true).length, 0);
});

test('alternating source refreshes keep folder positions and references stable', () => {
  const native = [{ id: 'chrome:1', source: 'chrome', name: 'Bar' }, { id: 'chrome:2', source: 'chrome', name: 'Other' }];
  const remote = [{ id: 'remote:s', source: 'remote', name: 'Remote' }];
  const initial = [...native, ...remote];
  const afterChrome = library.mergeSourceFolders(initial, structuredClone(native), 'chrome');
  assert.deepEqual(afterChrome.map(f => f.id), initial.map(f => f.id));
  assert.equal(afterChrome, initial);
  const afterRemote = library.mergeSourceFolders(afterChrome, structuredClone(remote), 'remote');
  assert.equal(afterRemote, initial);
});

test('unchanged refresh preserves bookmark references and only replaces actual changes', () => {
  const old = [{ id: 'one', title: 'One', tags: ['tag'], ancestorIds: ['chrome:1'], screenshot: 'large-image' }];
  assert.equal(library.reconcileRecords(old, structuredClone(old)), old);
  const changed = library.reconcileRecords(old, [{ ...old[0], title: 'Changed' }]);
  assert.equal(changed[0].title, 'Changed');
  assert.notEqual(changed[0], old[0]);
});
