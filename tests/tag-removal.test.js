import { test, beforeEach, afterEach } from 'node:test';
import { IDBFactory } from 'fake-indexeddb';
import assert from 'node:assert/strict';
import * as library from '../src/services/bookmarkLibrary.js';
import {
  getStoredBookmarks, saveStoredBookmarks, updateStoredBookmark,
  getLastBookmarkSyncTime, setLastBookmarkSyncTime, isBookmarkSyncNeeded
} from '../src/services/bookmarkStorage.js';

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

afterEach(() => {
  delete globalThis.chrome;
});

test('scenario 1: single chrome bookmark tag removal and page reload', async () => {
  // 1. Initial chrome bookmark in library
  const chromeBookmarks = [
    {
      id: 'chrome:1', nativeId: '1', source: 'chrome',
      title: 'Google', url: 'https://google.com', domain: 'google.com',
      folderId: 'chrome:0', folder: '', ancestorIds: [],
      dateAdded: Date.now(), tags: ['search'], notes: '', screenshot: '', visits: 0, pinned: false
    }
  ];
  await saveStoredBookmarks(chromeBookmarks);

  // 2. User reloads page or mounts
  const storedList = await getStoredBookmarks();
  let bookmarks = library.aggregateBookmarksByUrl(storedList);

  assert.equal(bookmarks.length, 1);
  assert.deepEqual(bookmarks[0].tags, ['search']);

  // 3. User clicks x to remove tag
  bookmarks[0].tags.splice(0, 1);
  await updateStoredBookmark(bookmarks[0]);

  // 4. User refreshes page (F5)
  const reloadedList = await getStoredBookmarks();
  const reloadedBookmarks = library.aggregateBookmarksByUrl(reloadedList);

  assert.deepEqual(reloadedBookmarks[0].tags, []);
});

test('scenario 2: multi-source (chrome + remote) tag removal and reload', async () => {
  // URL exists in both Chrome and Remote
  const initial = [
    {
      id: 'chrome:1', nativeId: '1', source: 'chrome',
      title: 'Vue', url: 'https://vuejs.org', tags: ['frontend'],
      notes: '', screenshot: '', visits: 0, pinned: false
    },
    {
      id: 'remote:https://shiori:10', remoteId: 10, source: 'remote', server: 'https://shiori',
      title: 'Vue', url: 'https://vuejs.org', tags: ['frontend'],
      notes: '', screenshot: '', visits: 0, pinned: false
    }
  ];
  await saveStoredBookmarks(initial);

  // Mount
  const storedList = await getStoredBookmarks();
  let bookmarks = library.aggregateBookmarksByUrl(storedList);
  assert.equal(bookmarks.length, 1);
  assert.deepEqual(bookmarks[0].tags, ['frontend']);

  // Remove tag on active bookmark
  bookmarks[0].tags.splice(0, 1);
  await updateStoredBookmark(bookmarks[0]);

  // Reload page
  const reloadedList = await getStoredBookmarks();
  const reloadedBookmarks = library.aggregateBookmarksByUrl(reloadedList);

  assert.deepEqual(reloadedBookmarks[0].tags, []);
});

test('scenario 3: duplicate chrome bookmarks with same url', async () => {
  const initial = [
    {
      id: 'chrome:1', nativeId: '1', source: 'chrome',
      title: 'Vue', url: 'https://vuejs.org', tags: ['frontend'],
      notes: '', screenshot: '', visits: 0, pinned: false
    },
    {
      id: 'chrome:2', nativeId: '2', source: 'chrome',
      title: 'Vue JS', url: 'https://vuejs.org', tags: ['frontend'],
      notes: '', screenshot: '', visits: 0, pinned: false
    }
  ];
  await saveStoredBookmarks(initial);

  const storedList = await getStoredBookmarks();
  let bookmarks = library.aggregateBookmarksByUrl(storedList);
  assert.equal(bookmarks.length, 1);
  assert.deepEqual(bookmarks[0].tags, ['frontend']);

  // Remove tag
  bookmarks[0].tags.splice(0, 1);
  await updateStoredBookmark(bookmarks[0]);

  // Reload
  const reloadedList = await getStoredBookmarks();
  const reloadedBookmarks = library.aggregateBookmarksByUrl(reloadedList);
  assert.deepEqual(reloadedBookmarks[0].tags, []);
});

test('scenario 4: refreshRemote with multi-source (chrome primary, incoming remote)', async () => {
  // Currently stored aggregated bookmark (primary is chrome:1, but has remote source as well)
  const currentBookmarks = [
    {
      id: 'chrome:1', nativeId: '1', remoteId: 10, source: 'chrome', isRemote: true, isNative: true,
      title: 'Vue', url: 'https://vuejs.org', tags: [], // tag was removed by user
      notes: '', screenshot: '', visits: 0, pinned: false
    }
  ];

  // Incoming from remote server (which still has tag 'frontend')
  const incomingRemote = [
    {
      id: 'remote:https://shiori:10', remoteId: 10, source: 'remote', server: 'https://shiori',
      title: 'Vue', url: 'https://vuejs.org', tags: ['frontend'],
      notes: '', screenshot: '', visits: 0, pinned: false
    }
  ];

  // refreshRemote does:
  // mergeLibraryBookmarks(bookmarks.value, [ ...chrome, ...remote ])
  const merged = library.mergeLibraryBookmarks(currentBookmarks, [
    ...currentBookmarks.filter(b => b.source === 'chrome'),
    ...incomingRemote
  ]);
  const aggregated = library.aggregateBookmarksByUrl(merged);

  assert.deepEqual(aggregated[0].tags, []);
});
