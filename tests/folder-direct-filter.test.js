import { test } from 'node:test';
import assert from 'node:assert/strict';

function isInFolder(bookmark, folder) {
  if (folder.source === 'remote') {
    return bookmark.folderId === folder.id || bookmark.remoteFolderId === folder.id ||
      (bookmark.isRemote && (!bookmark.server || folder.id === `remote:${bookmark.server}`));
  }
  return bookmark.folderId === folder.id || bookmark.nativeFolderId === folder.id ||
    (!folder.source && !bookmark.folderId && bookmark.folder === folder.name);
}

test('folder direct filter: root folder matches only direct bookmarks and excludes subfolders', () => {
  const rootFolder = { id: 'chrome:1', name: '书签栏', source: 'chrome', depth: 0, parentId: '' };
  const subFolder = { id: 'chrome:10', name: '天天发圈', source: 'chrome', depth: 1, parentId: 'chrome:1' };
  const deepFolder = { id: 'chrome:20', name: 'SiteUs', source: 'chrome', depth: 3, parentId: 'chrome:15' };

  const directBookmark = {
    id: 'chrome:100',
    folderId: 'chrome:1',
    ancestorIds: ['chrome:1'],
    title: '直接存放在书签栏的书签'
  };

  const subBookmark = {
    id: 'chrome:101',
    folderId: 'chrome:10',
    ancestorIds: ['chrome:1', 'chrome:10'],
    title: '存放在天天发圈的书签'
  };

  const deepBookmark = {
    id: 'chrome:102',
    folderId: 'chrome:20',
    ancestorIds: ['chrome:1', 'chrome:15', 'chrome:20'],
    title: '存放在深层目录的书签'
  };

  // 1. 书签栏根目录只匹配 directBookmark
  assert.equal(isInFolder(directBookmark, rootFolder), true);
  assert.equal(isInFolder(subBookmark, rootFolder), false);
  assert.equal(isInFolder(deepBookmark, rootFolder), false);

  // 2. 子文件夹天天发圈只匹配 subBookmark
  assert.equal(isInFolder(directBookmark, subFolder), false);
  assert.equal(isInFolder(subBookmark, subFolder), true);
  assert.equal(isInFolder(deepBookmark, subFolder), false);

  // 3. 深层目录只匹配 deepBookmark
  assert.equal(isInFolder(deepBookmark, deepFolder), true);
  assert.equal(isInFolder(directBookmark, deepFolder), false);
});

test('folder direct counts: counts accurately reflect direct bookmark quantities', () => {
  const folders = [
    { id: 'chrome:1', name: '书签栏', source: 'chrome' },
    { id: 'chrome:10', name: '天天发圈', source: 'chrome' },
    { id: 'chrome:11', name: 'Collect', source: 'chrome' }
  ];

  const bookmarks = [
    { id: 'bm:1', folderId: 'chrome:1', ancestorIds: ['chrome:1'] },
    { id: 'bm:2', folderId: 'chrome:1', ancestorIds: ['chrome:1'] },
    { id: 'bm:3', folderId: 'chrome:10', ancestorIds: ['chrome:1', 'chrome:10'] },
    { id: 'bm:4', folderId: 'chrome:11', ancestorIds: ['chrome:1', 'chrome:11'] },
    { id: 'bm:5', folderId: 'chrome:11', ancestorIds: ['chrome:1', 'chrome:11'] }
  ];

  const counts = new Map();
  for (const f of folders) counts.set(f.id, 0);
  for (const b of bookmarks) {
    for (const f of folders) {
      if (isInFolder(b, f)) {
        counts.set(f.id, counts.get(f.id) + 1);
      }
    }
  }

  // 书签栏直属只有 2 个，不再是 5 个
  assert.equal(counts.get('chrome:1'), 2);
  // 天天发圈只有 1 个
  assert.equal(counts.get('chrome:10'), 1);
  // Collect 只有 2 个
  assert.equal(counts.get('chrome:11'), 2);
});
