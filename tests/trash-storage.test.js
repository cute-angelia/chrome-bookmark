import { test, beforeEach } from 'node:test';
import { IDBFactory } from 'fake-indexeddb';
import assert from 'node:assert/strict';
import {
  getTrashBookmarks, saveTrashBookmarks, moveToTrashStorage,
  restoreFromTrashStorage, deleteFromTrashPermanently, clearTrashStorage,
  SEVEN_DAYS_MS
} from '../src/services/bookmarkStorage.js';

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

test('moveToTrashStorage stores items with deletedAt and retrieves them', async () => {
  await clearTrashStorage();
  const bm1 = { id: 'bm1', title: 'Test 1', url: 'https://test1.com' };
  const bm2 = { id: 'bm2', title: 'Test 2', url: 'https://test2.com' };

  await moveToTrashStorage([bm1, bm2]);
  const trash = await getTrashBookmarks();

  assert.equal(trash.length, 2);
  assert.equal(trash[0].id, 'bm1');
  assert.ok(trash[0].deletedAt > 0);
  assert.equal(trash[1].id, 'bm2');
});

test('getTrashBookmarks automatically removes items older than 7 days', async () => {
  await clearTrashStorage();
  const now = Date.now();
  const freshItem = {
    id: 'fresh',
    title: 'Fresh Deleted',
    url: 'https://fresh.com',
    deletedAt: now - (2 * 24 * 60 * 60 * 1000) // 2 天前
  };
  const expiredItem = {
    id: 'expired',
    title: 'Expired Deleted',
    url: 'https://expired.com',
    deletedAt: now - (8 * 24 * 60 * 60 * 1000) // 8 天前 (超过7天)
  };

  // 直接保存包含过期项的列表
  await saveTrashBookmarks([freshItem, expiredItem]);

  // 读取时自动清理过期项
  const cleaned = await getTrashBookmarks();
  assert.equal(cleaned.length, 1);
  assert.equal(cleaned[0].id, 'fresh');

  // 再次读取确认持久化已生效
  const recheck = await getTrashBookmarks();
  assert.equal(recheck.length, 1);
  assert.equal(recheck[0].id, 'fresh');
});

test('restoreFromTrashStorage removes item from trash and returns it', async () => {
  await clearTrashStorage();
  const item = { id: 'restore_me', title: 'To Restore', url: 'https://restore.com' };
  await moveToTrashStorage(item);

  const restored = await restoreFromTrashStorage('restore_me');
  assert.ok(restored);
  assert.equal(restored.id, 'restore_me');

  const trash = await getTrashBookmarks();
  assert.equal(trash.length, 0);
});

test('deleteFromTrashPermanently removes target item from trash', async () => {
  await clearTrashStorage();
  const item1 = { id: 'perm1', title: 'Perm 1', url: 'https://perm1.com' };
  const item2 = { id: 'perm2', title: 'Perm 2', url: 'https://perm2.com' };
  await moveToTrashStorage([item1, item2]);

  await deleteFromTrashPermanently('perm1');
  const remaining = await getTrashBookmarks();
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].id, 'perm2');
});

test('clearTrashStorage completely empties trash list', async () => {
  await moveToTrashStorage([
    { id: '1', title: '1', url: 'https://1.com' },
    { id: '2', title: '2', url: 'https://2.com' }
  ]);
  assert.ok((await getTrashBookmarks()).length > 0);

  await clearTrashStorage();
  assert.equal((await getTrashBookmarks()).length, 0);
});
