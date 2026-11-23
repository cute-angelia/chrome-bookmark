import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

afterEach(() => {
  delete globalThis.chrome;
});

test('batch drag: parse dragged bookmark ids from dataTransfer', () => {
  function parseDragIds(dataStr, fallbackIds) {
    let ids = [];
    try {
      if (dataStr && dataStr.startsWith('[') && dataStr.endsWith(']')) {
        ids = JSON.parse(dataStr);
      }
    } catch (_) {}
    if (!ids || ids.length === 0) {
      ids = fallbackIds;
    }
    return ids;
  }

  // 1. JSON 数组字符串反序列化
  assert.deepEqual(parseDragIds('["bm:1","bm:2","bm:3"]', ['bm:1']), ['bm:1', 'bm:2', 'bm:3']);

  // 2. 单个 ID 字符串 fallback
  assert.deepEqual(parseDragIds('bm:1', ['bm:1']), ['bm:1']);

  // 3. 空数据走 fallback
  assert.deepEqual(parseDragIds('', ['bm:99']), ['bm:99']);
});

test('batch move: moves only bookmarks not already in destination folder', () => {
  const targetFolder = { id: 'chrome:2', name: 'Work' };
  const bookmarks = [
    { id: 'bm:1', title: 'Doc 1', folderId: 'chrome:1' },
    { id: 'bm:2', title: 'Doc 2', folderId: 'chrome:2' }, // 已在 Work
    { id: 'bm:3', title: 'Doc 3', folderId: 'chrome:3' }
  ];

  function isInFolder(bm, folder) {
    return bm.folderId === folder.id;
  }

  const toMove = bookmarks.filter(b => !isInFolder(b, targetFolder));
  assert.equal(toMove.length, 2);
  assert.deepEqual(toMove.map(b => b.id), ['bm:1', 'bm:3']);
});

test('batch move: executes chrome.bookmarks.move for each native bookmark', async () => {
  const movedCalls = [];
  globalThis.chrome = {
    bookmarks: {
      get: async (id) => [{ id }],
      move: async (id, destination) => {
        movedCalls.push({ id, destination });
        return { id, ...destination };
      }
    }
  };

  const bookmarksToMove = [
    { id: 'chrome:101', nativeId: '101', title: 'BM 1' },
    { id: 'chrome:102', nativeId: '102', title: 'BM 2' }
  ];
  const targetFolder = { id: 'chrome:5', name: 'Project' };
  const parentId = targetFolder.id.replace(/^chrome:/, '');

  for (const bm of bookmarksToMove) {
    const [node] = await chrome.bookmarks.get(bm.nativeId);
    if (node) {
      await chrome.bookmarks.move(node.id, { parentId });
    }
  }

  assert.equal(movedCalls.length, 2);
  assert.deepEqual(movedCalls[0], { id: '101', destination: { parentId: '5' } });
  assert.deepEqual(movedCalls[1], { id: '102', destination: { parentId: '5' } });
});

test('marquee selection: AABB intersection correctly identifies enclosed or touched items', () => {
  function isIntersecting(cardRect, box) {
    return !(
      cardRect.right < box.left ||
      cardRect.left > box.right ||
      cardRect.bottom < box.top ||
      cardRect.top > box.bottom
    );
  }

  const marqueeBox = { left: 100, top: 100, right: 300, bottom: 250 };

  const insideCard = { left: 120, top: 120, right: 280, bottom: 180 };
  const partialCard = { left: 50, top: 200, right: 150, bottom: 280 };
  const outsideCard = { left: 400, top: 400, right: 500, bottom: 500 };

  assert.equal(isIntersecting(insideCard, marqueeBox), true);
  assert.equal(isIntersecting(partialCard, marqueeBox), true);
  assert.equal(isIntersecting(outsideCard, marqueeBox), false);
});
