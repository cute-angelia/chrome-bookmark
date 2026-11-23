import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { recordBookmarkVisitIfMatched } from '../src/services/nativeBookmarkSync.js';
import * as storage from '../src/services/bookmarkStorage.js';

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

test('recordBookmarkVisitIfMatched: non-bookmarked URL returns counted: false', async () => {
  const result = await recordBookmarkVisitIfMatched('https://not-bookmarked.example.com/page');
  assert.equal(result.counted, false);
  assert.equal(result.bookmark, null);
});

test('recordBookmarkVisitIfMatched: bookmarked URL increments visits and sets lastVisited, throttles within 30 minutes', async () => {
  const testUrl = 'https://my-visited-bookmark.example.com';
  const initialBookmark = {
    id: 'test-visit-1',
    title: 'Visit Test',
    url: testUrl,
    visits: 2,
    lastVisited: 0
  };

  await storage.saveStoredBookmarks([initialBookmark]);

  // 1. 首次打开已识别书签：应增加访问计数
  const firstResult = await recordBookmarkVisitIfMatched(testUrl);
  assert.equal(firstResult.counted, true);
  assert.equal(firstResult.bookmark.visits, 3);
  assert.ok(firstResult.bookmark.lastVisited > 0);

  const storedAfterFirst = (await storage.getStoredBookmarks()).find(b => b.id === 'test-visit-1');
  assert.equal(storedAfterFirst.visits, 3);
  assert.equal(storedAfterFirst.lastVisited, firstResult.bookmark.lastVisited);

  // 2. 5分钟后再次打开（< 30分钟）：防抖生效，不增加计数
  const secondResult = await recordBookmarkVisitIfMatched(testUrl);
  assert.equal(secondResult.counted, false);
  assert.equal(secondResult.bookmark.visits, 3);

  const storedAfterSecond = (await storage.getStoredBookmarks()).find(b => b.id === 'test-visit-1');
  assert.equal(storedAfterSecond.visits, 3);

  // 3. 模拟时间流逝超过 30 分钟（设置为 31 分钟前）
  storedAfterSecond.lastVisited = Date.now() - (31 * 60 * 1000);
  await storage.updateStoredBookmark(storedAfterSecond);

  // 再次打开：应突破 30 分钟限制，计数加 1
  const thirdResult = await recordBookmarkVisitIfMatched(testUrl);
  assert.equal(thirdResult.counted, true);
  assert.equal(thirdResult.bookmark.visits, 4);

  const storedAfterThird = (await storage.getStoredBookmarks()).find(b => b.id === 'test-visit-1');
  assert.equal(storedAfterThird.visits, 4);
});
