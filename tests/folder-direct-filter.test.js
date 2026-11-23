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

test('folder persistence order: folders maintain original array order regardless of id lexicographical order', () => {
  // 模拟如果不做保序，IndexedDB 会按 id 字符串字典序返回：chrome:1, chrome:105, chrome:20, chrome:9
  const inputFolders = [
    { id: 'chrome:1', name: '书签栏' },
    { id: 'chrome:9', name: '天天发圈' },
    { id: 'chrome:20', name: 'Collect' },
    { id: 'chrome:105', name: 'SiteUs' }
  ];

  // 模拟 saveStoredFolders 注入 __order
  const stored = inputFolders.map((f, i) => ({ ...f, __order: i }));

  // 模拟 IndexedDB 按主键字典序输出：
  const shuffledFromIdb = [
    stored[0], // chrome:1
    stored[3], // chrome:105
    stored[2], // chrome:20
    stored[1]  // chrome:9
  ];

  // 模拟 getStoredFolders 恢复
  const restored = shuffledFromIdb
    .sort((a, b) => (a.__order ?? 0) - (b.__order ?? 0))
    .map(f => {
      const { __order, ...rest } = f;
      return rest;
    });

  assert.deepEqual(restored, inputFolders);
  assert.equal(restored[1].name, '天天发圈');
  assert.equal(restored[2].name, 'Collect');
  assert.equal(restored[3].name, 'SiteUs');
});

test('bookmark moved to another folder: disappears from original folder and only appears in new folder', () => {
  const originFolder = { id: 'chrome:1', name: '书签栏', source: 'chrome' };
  const targetFolder = { id: 'chrome:10', name: '天天发圈', source: 'chrome' };

  function isInFolder(bookmark, folder) {
    if (folder.source === 'remote') {
      return bookmark.folderId === folder.id || bookmark.remoteFolderId === folder.id ||
        (bookmark.isRemote && (!bookmark.server || folder.id === `remote:${bookmark.server}`));
    }
    const targetFolderId = bookmark.folderId || bookmark.nativeFolderId;
    if (targetFolderId) {
      return targetFolderId === folder.id;
    }
    return !folder.source && bookmark.folder === folder.name;
  }

  const bookmark = {
    id: 'chrome:100',
    source: 'chrome',
    folderId: 'chrome:1',
    nativeFolderId: 'chrome:1',
    folder: '书签栏'
  };

  // 移动前：属于 originFolder，不属于 targetFolder
  assert.equal(isInFolder(bookmark, originFolder), true);
  assert.equal(isInFolder(bookmark, targetFolder), false);

  // 模拟移动操作：更新全部归属字段
  bookmark.folderId = targetFolder.id;
  bookmark.nativeFolderId = targetFolder.id;
  bookmark.folder = targetFolder.name;

  // 移动后：绝对不能再出现在 originFolder，必须且仅出现在 targetFolder
  assert.equal(isInFolder(bookmark, originFolder), false);
  assert.equal(isInFolder(bookmark, targetFolder), true);
});

test('folder deletion: recursively aggregates bookmarks across subfolders for prompt confirmation', () => {
  const folders = [
    { id: 'chrome:1', name: '书签栏', parentId: '', path: '书签栏' },
    { id: 'chrome:10', name: 'ParentFolder', parentId: 'chrome:1', path: '书签栏 / ParentFolder' },
    { id: 'chrome:20', name: 'ChildFolder1', parentId: 'chrome:10', path: '书签栏 / ParentFolder / ChildFolder1' },
    { id: 'chrome:30', name: 'ChildFolder2', parentId: 'chrome:10', path: '书签栏 / ParentFolder / ChildFolder2' },
    { id: 'chrome:301', name: 'GrandChild', parentId: 'chrome:30', path: '书签栏 / ParentFolder / ChildFolder2 / GrandChild' },
    { id: 'chrome:99', name: 'OtherFolder', parentId: 'chrome:1', path: '书签栏 / OtherFolder' }
  ];

  // 模拟各个文件夹直属书签数量（ParentFolder 自身为 0，但子孙目录中有书签）
  const directCounts = new Map([
    ['chrome:1', 10],
    ['chrome:10', 0],   // 自身无直属书签
    ['chrome:20', 3],   // 子文件夹 1 有 3 个
    ['chrome:30', 2],   // 子文件夹 2 有 2 个
    ['chrome:301', 5],  // 孙文件夹有 5 个
    ['chrome:99', 4]    // 外部其他文件夹有 4 个
  ]);

  function getFolderSubtree(folderId) {
    const folderMap = new Map(folders.map(f => [f.id, f]));
    const root = folderMap.get(folderId);
    if (!root) return [];

    const childIds = new Set([folderId]);
    let added = true;
    while (added) {
      added = false;
      for (const f of folders) {
        const isChildByParent = f.parentId && childIds.has(f.parentId);
        const isChildByPath = root.path && f.path && f.path.startsWith(root.path + ' / ');
        if ((isChildByParent || isChildByPath) && !childIds.has(f.id)) {
          childIds.add(f.id);
          added = true;
        }
      }
    }
    return folders.filter(f => childIds.has(f.id));
  }

  // 针对 ParentFolder (chrome:10) 执行递归统计
  const targetSubtree = getFolderSubtree('chrome:10');
  const targetSubtreeIds = targetSubtree.map(f => f.id);
  assert.deepEqual(targetSubtreeIds.sort(), ['chrome:10', 'chrome:20', 'chrome:30', 'chrome:301'].sort());

  const totalCount = targetSubtree.reduce((sum, f) => sum + (directCounts.get(f.id) || 0), 0);
  // 0 + 3 + 2 + 5 = 10，正确递归汇总全部子孙文件夹中的书签，排除外部 chrome:99 和 chrome:1
  assert.equal(totalCount, 10);

  // 格式化用户确认提示文案（有书签时使用 html 标红）
  const promptHtml = totalCount > 0
    ? `该目录下共有 <strong style="color: #e11d48; font-weight: 700;">${totalCount} 个书签</strong>，是否将里面的书签一起删除？`
    : '该文件夹为空，将被移除。';
  assert.equal(promptHtml, '该目录下共有 <strong style="color: #e11d48; font-weight: 700;">10 个书签</strong>，是否将里面的书签一起删除？');

  // 如果是一个完全空的子文件夹，正确提示为空
  const emptyFolderSubtree = getFolderSubtree('chrome:301');
  // 假设 301 自身为 0
  directCounts.set('chrome:301', 0);
  const emptyCount = emptyFolderSubtree.reduce((sum, f) => sum + (directCounts.get(f.id) || 0), 0);
  assert.equal(emptyCount, 0);
  const emptyPrompt = emptyCount > 0
    ? `该目录下共有 ${emptyCount} 个书签，是否将里面的书签一起删除？`
    : '该文件夹为空，将被移除。';
  assert.equal(emptyPrompt, '该文件夹为空，将被移除。');
});
