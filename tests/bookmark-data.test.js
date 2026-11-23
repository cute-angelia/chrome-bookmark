import { test, beforeEach, afterEach } from 'node:test';
import { IDBFactory } from 'fake-indexeddb';
import assert from 'node:assert/strict';
import * as api from '../src/services/shioriApi.js';
import * as library from '../src/services/bookmarkLibrary.js';
import {
  getStoredBookmarks, getStoredFolders, saveStoredBookmarks, saveStoredFolders,
  getLastBookmarkSyncTime, setLastBookmarkSyncTime, isSameDay, isBookmarkSyncNeeded,
  getLastUsedFolderId, setLastUsedFolderId
} from '../src/services/bookmarkStorage.js';
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

test('cached multi-source bookmarks with remoteId or remote:... id stop pagination', async () => {
  const pages = [];
  globalThis.fetch = async (_url, options) => {
    const page = JSON.parse(options.body).page;
    pages.push(page);
    return { ok: true, json: async () => ({ code: 0, data: { page, maxPage: 5,
      bookmarks: [{ id: 101, title: 'Item 101' }, { id: 102, title: 'Item 102' }] } }) };
  };
  const result = await api.fetchRemoteBookmarkUpdates({ server: 'https://server.test', token: 'secret' }, [
    { id: 'chrome:12', source: 'chrome', remoteId: 101, isRemote: true },
    { id: 'remote:https://server.test:102', source: 'remote' }
  ]);
  assert.deepEqual(pages, [1]);
  assert.equal(result.complete, false);
});

test('fetchRemoteBookmarkUpdates uses total from API to paginate and returns total', async () => {
  const pages = [];
  globalThis.fetch = async (_url, options) => {
    const page = JSON.parse(options.body).page;
    pages.push(page);
    return {
      ok: true,
      json: async () => ({
        code: 0,
        data: {
          page,
          total: 5,
          limit: 2,
          bookmarks: page === 1
            ? [{ id: 1 }, { id: 2 }]
            : page === 2
              ? [{ id: 3 }, { id: 4 }]
              : [{ id: 5 }]
        }
      })
    };
  };

  const result = await api.fetchRemoteBookmarkUpdates({ server: 'https://server.test', token: 'secret' }, []);
  assert.deepEqual(pages, [1, 2, 3]);
  assert.equal(result.bookmarks.length, 5);
  assert.equal(result.total, 5);
  assert.equal(result.complete, true);
});

test('mergeLibraryBookmarks preserves tags and notes from stored popup bookmark when incoming chrome library has empty tags', () => {
  const stored = [
    {
      id: 'chrome:100',
      nativeId: '100',
      source: 'chrome',
      url: 'https://example.com/popup',
      title: 'Popup Bookmark',
      tags: ['popup-tag1', 'popup-tag2'],
      screenshot: 'data:image/png;base64,abc',
      notes: 'popup note'
    }
  ];
  const incoming = [
    {
      id: 'chrome:100',
      nativeId: '100',
      source: 'chrome',
      url: 'https://example.com/popup',
      title: 'Popup Bookmark',
      tags: [],
      screenshot: '',
      notes: ''
    }
  ];
  const merged = library.mergeLibraryBookmarks(stored, incoming);
  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0].tags, ['popup-tag1', 'popup-tag2']);
  assert.equal(merged[0].screenshot, 'data:image/png;base64,abc');
  assert.equal(merged[0].notes, 'popup note');
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

test('isSameDay accurately compares dates and handles invalid inputs', () => {
  const morning = new Date(2026, 9, 21, 9, 0, 0).getTime();
  const evening = new Date(2026, 9, 21, 21, 30, 0).getTime();
  const nextDay = new Date(2026, 9, 22, 9, 0, 0).getTime();

  assert.equal(isSameDay(morning, evening), true);
  assert.equal(isSameDay(morning, nextDay), false);
  assert.equal(isSameDay(0, evening), false);
  assert.equal(isSameDay(null, evening), false);
  assert.equal(isSameDay(NaN, evening), false);
});

test('isBookmarkSyncNeeded ensures full sync runs only once per day unless empty', () => {
  const now = Date.now();
  const yesterday = now - 24 * 60 * 60 * 1000 - 1000;

  // Never synced: needed
  assert.equal(isBookmarkSyncNeeded(0, true), true);
  assert.equal(isBookmarkSyncNeeded(null, true), true);

  // Cached list is empty: needed
  assert.equal(isBookmarkSyncNeeded(now, false), true);

  // Synced yesterday: needed
  assert.equal(isBookmarkSyncNeeded(yesterday, true), true);

  // Synced today and has cached bookmarks: not needed
  assert.equal(isBookmarkSyncNeeded(now, true), false);
});

test('getLastBookmarkSyncTime and setLastBookmarkSyncTime persist timestamps across IndexedDB and chrome.storage', async () => {
  // Test IndexedDB fallback when chrome.storage is not available
  assert.equal(await getLastBookmarkSyncTime(), 0);
  const now = Date.now();
  await setLastBookmarkSyncTime(now);
  assert.equal(await getLastBookmarkSyncTime(), now);

  // Test chrome.storage.local when available
  const mockStorage = new Map();
  globalThis.chrome = {
    storage: {
      local: {
        get: (keys, cb) => {
          const res = {};
          keys.forEach(k => { if (mockStorage.has(k)) res[k] = mockStorage.get(k); });
          cb(res);
        },
        set: (obj, cb) => {
          Object.entries(obj).forEach(([k, v]) => mockStorage.set(k, v));
          cb();
        }
      }
    }
  };

  assert.equal(await getLastBookmarkSyncTime(), 0);
  const extNow = 1776789000000;
  await setLastBookmarkSyncTime(extNow);
  assert.equal(await getLastBookmarkSyncTime(), extNow);
  assert.equal(mockStorage.get('cutbookmark_last_sync_time'), extNow);
});

test('normalizeBookmarkUrl accurately standardizes URLs with varying protocols, slashes and casings', () => {
  assert.equal(library.normalizeBookmarkUrl('https://example.com/'), 'https://example.com');
  assert.equal(library.normalizeBookmarkUrl('HTTPS://EXAMPLE.COM/path/'), 'https://example.com/path');
  assert.equal(library.normalizeBookmarkUrl('https://example.com/path?foo=bar#hash'), 'https://example.com/path?foo=bar');
  assert.equal(library.normalizeBookmarkUrl(''), '');
  assert.equal(library.normalizeBookmarkUrl(null), '');
});

test('aggregateBookmarksByUrl merges local phantom, Chrome and Remote bookmarks into 1 unified record', () => {
  const localPhantom = {
    id: 'bm-12345',
    title: 'Vue Doc',
    url: 'https://vuejs.org/guide',
    folder: '常用收集箱',
    folderId: 'folder-custom',
    screenshot: 'data:image/png;base64,localHQ',
    tags: ['vue', 'frontend'],
    notes: 'Personal study notes',
    visits: 5,
    pinned: true,
    dateAdded: 1000
  };
  const chromeNative = {
    id: 'chrome:101',
    nativeId: '101',
    source: 'chrome',
    title: 'Vue.js Guide',
    url: 'https://vuejs.org/guide/',
    folder: '其他书签 / CutBookmark',
    folderId: 'chrome:2',
    ancestorIds: ['chrome:2'],
    screenshot: '',
    tags: [],
    notes: '',
    visits: 0,
    pinned: false,
    dateAdded: 2000
  };
  const remoteRecord = {
    id: 'remote:https://shiori.test:202',
    remoteId: 202,
    server: 'https://shiori.test',
    source: 'remote',
    title: 'Vue.js Guide - Upstream',
    url: 'https://vuejs.org/guide',
    folder: '远程书签',
    folderId: 'remote:https://shiori.test',
    ancestorIds: ['remote:https://shiori.test'],
    screenshot: 'https://shiori.test/thumb.png',
    tags: ['official', 'vue'],
    notes: 'Excerpt from remote',
    visits: 1,
    pinned: false,
    dateAdded: 1500
  };

  const aggregated = library.aggregateBookmarksByUrl([localPhantom, chromeNative, remoteRecord]);
  assert.equal(aggregated.length, 1);

  const unified = aggregated[0];
  assert.equal(unified.id, 'chrome:101');
  assert.equal(unified.nativeId, '101');
  assert.equal(unified.remoteId, 202);
  assert.equal(unified.isNative, true);
  assert.equal(unified.isRemote, true);
  assert.deepEqual(unified.sources.sort(), ['chrome', 'remote']);

  // Local screenshot takes precedence over remote thumbnail
  assert.equal(unified.screenshot, 'data:image/png;base64,localHQ');

  // Tags are deduplicated union
  assert.deepEqual(unified.tags.sort(), ['frontend', 'official', 'vue']);

  // Local notes preserved
  assert.equal(unified.notes, 'Personal study notes');
  assert.equal(unified.pinned, true);
  assert.equal(unified.visits, 5);

  // Belongs to Chrome folder primarily, but retains remoteFolderId for remote folder matching
  assert.equal(unified.folder, '其他书签 / CutBookmark');
  assert.equal(unified.remoteFolderId, 'remote:https://shiori.test');
});

test('remoteAddBookmark pushes local bookmark data to remote server', async () => {
  await api.saveServerConfig({ server: 'https://server.test', token: 'valid-token' });
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options });
    return { ok: true, json: async () => ({ code: 0, msg: 'ok' }) };
  };

  const res = await api.remoteAddBookmark({
    url: 'https://example.com/page',
    title: 'My Page',
    tags: ['tool', 'dev'],
    imgbase64: 'data:image/png;base64,abc'
  });

  assert.equal(res.success, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://server.test/api/bookmarks/add');
  assert.equal(calls[0].headers.Authorization, 'Bearer valid-token');
  const payload = JSON.parse(calls[0].body);
  assert.equal(payload.url, 'https://example.com/page');
  assert.equal(payload.title, 'My Page');
  assert.equal(payload.tags, 'tool,dev');
  assert.equal(payload.imgbase64, 'data:image/png;base64,abc');
});

test('fetchRemoteBookmarkByUrl queries remote using exact url keyword instead of full list paging', async () => {
  await api.saveServerConfig({ server: 'https://server.test', token: 'valid-token' });
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options });
    const body = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({
        code: 0,
        data: {
          page: 1,
          maxPage: 1,
          bookmarks: [
            { id: 999, url: 'https://example.com/target', title: 'Target Book' },
            { id: 1000, url: 'https://example.com/other', title: 'Other' }
          ]
        }
      })
    };
  };

  const matched = await api.fetchRemoteBookmarkByUrl('https://example.com/target');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://server.test/api/bookmarks');
  const body = JSON.parse(calls[0].body);
  assert.equal(body.keyword, 'https://example.com/target');
  assert.equal(body.page, 1);
  assert.equal(matched?.id, 999);
  assert.equal(matched?.title, 'Target Book');
});

test('extractDomainTag: extracts clean main domain tag without suffix', () => {
  assert.equal(
    library.extractDomainTag('https://github.com/anefzaoui/misterdownloadmanager'),
    'github'
  );
  assert.equal(
    library.extractDomainTag('https://www.github.com/anefzaoui/misterdownloadmanager'),
    'github'
  );
  assert.equal(
    library.extractDomainTag('https://bilibili.com/video/BV1xx'),
    'bilibili'
  );
  assert.equal(
    library.extractDomainTag('https://news.sina.com.cn/world'),
    'sina'
  );
  assert.equal(
    library.extractDomainTag('https://www.baidu.com.cn'),
    'baidu'
  );
  assert.equal(
    library.extractDomainTag('https://bbc.co.uk/news'),
    'bbc'
  );
  assert.equal(
    library.extractDomainTag('https://v2ex.com/t/12345'),
    'v2ex'
  );
  assert.equal(
    library.extractDomainTag('https://juejin.cn/post/1'),
    'juejin'
  );
  assert.equal(
    library.extractDomainTag('http://localhost:3000/app'),
    'localhost'
  );
  assert.equal(
    library.extractDomainTag('http://192.168.1.1/config'),
    '192.168.1.1'
  );
  assert.equal(
    library.extractDomainTag('chrome://extensions'),
    ''
  );
  assert.equal(
    library.extractDomainTag(''),
    ''
  );
});

test('getLastUsedFolderId and setLastUsedFolderId persist folder across IndexedDB and chrome.storage', async () => {
  // 1. 默认无记忆时返回空字符串
  assert.equal(await getLastUsedFolderId(), '');

  // 2. 在纯 IndexedDB 环境下写入并读取
  await setLastUsedFolderId('chrome:10');
  assert.equal(await getLastUsedFolderId(), 'chrome:10');

  // 3. 模拟 chrome.storage.local 环境
  const store = {};
  globalThis.chrome = {
    storage: {
      local: {
        get: (keys, cb) => cb({ cutbookmark_last_used_folder_id: store.cutbookmark_last_used_folder_id }),
        set: (data, cb) => { Object.assign(store, data); cb?.(); }
      }
    }
  };

  assert.equal(await getLastUsedFolderId(), '');
  await setLastUsedFolderId('chrome:20');
  assert.equal(store.cutbookmark_last_used_folder_id, 'chrome:20');
  assert.equal(await getLastUsedFolderId(), 'chrome:20');
});
