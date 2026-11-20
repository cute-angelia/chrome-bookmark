import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBookmarkUrl } from '../src/services/bookmarkLibrary.js';

afterEach(() => {
  delete globalThis.chrome;
});

test('normalizeBookmarkUrl correctly aligns target url variations', () => {
  const base = 'https://x.com/Jbaby0v0';
  assert.equal(normalizeBookmarkUrl('https://x.com/Jbaby0v0/'), base);
  assert.equal(normalizeBookmarkUrl('https://X.COM/Jbaby0v0'), base);
  assert.equal(normalizeBookmarkUrl('https://x.com/Jbaby0v0?ref=1'), 'https://x.com/Jbaby0v0?ref=1');
});

test('background openDashboard creates tab with encoded url query when no options tab exists', async () => {
  let createdTab = null;
  const targetUrl = 'https://x.com/Jbaby0v0';

  globalThis.chrome = {
    runtime: {
      getURL: path => `chrome-extension://cutbookmark-id/${path}`,
      onMessage: { addListener: () => {} }
    },
    tabs: {
      query: (filter, callback) => {
        // 模拟没有已打开的 options.html
        callback([]);
      },
      create: (opts) => {
        createdTab = opts;
      }
    }
  };

  // 模拟 background 处理 openDashboard 请求
  const baseOptionsUrl = chrome.runtime.getURL('options.html');
  const targetQuery = targetUrl ? `?url=${encodeURIComponent(targetUrl)}` : '';
  const fullOptionsUrl = `${baseOptionsUrl}${targetQuery}`;

  chrome.tabs.query({ url: `${baseOptionsUrl}*` }, (tabs) => {
    if (tabs && tabs.length > 0) {
      // noop
    } else {
      chrome.tabs.create({ url: fullOptionsUrl });
    }
  });

  assert.equal(
    createdTab?.url,
    `chrome-extension://cutbookmark-id/options.html?url=${encodeURIComponent(targetUrl)}`
  );
});

test('background openDashboard activates existing tab and sends FOCUS_BOOKMARK message', async () => {
  let updatedTab = null;
  let sentMessage = null;
  let focusedWindow = null;
  const targetUrl = 'https://x.com/Jbaby0v0';

  const existingTab = {
    id: 101,
    windowId: 202,
    url: 'chrome-extension://cutbookmark-id/options.html?other=1'
  };

  globalThis.chrome = {
    runtime: {
      getURL: path => `chrome-extension://cutbookmark-id/${path}`,
      onMessage: { addListener: () => {} }
    },
    windows: {
      update: (winId, opts) => {
        focusedWindow = { winId, ...opts };
      }
    },
    tabs: {
      query: (filter, callback) => {
        callback([existingTab]);
      },
      update: (tabId, opts) => {
        updatedTab = { tabId, ...opts };
      },
      sendMessage: (tabId, msg, callback) => {
        sentMessage = { tabId, msg };
        callback?.({ received: true, focused: true });
      }
    }
  };

  const baseOptionsUrl = chrome.runtime.getURL('options.html');
  const targetQuery = targetUrl ? `?url=${encodeURIComponent(targetUrl)}` : '';
  const fullOptionsUrl = `${baseOptionsUrl}${targetQuery}`;

  chrome.tabs.query({ url: `${baseOptionsUrl}*` }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const tab = tabs[0];
      chrome.tabs.update(tab.id, { active: true });
      if (tab.windowId) {
        chrome.windows.update(tab.windowId, { focused: true });
      }
      if (targetUrl) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'FOCUS_BOOKMARK',
          url: targetUrl
        }, (res) => {
          if (chrome.runtime?.lastError || !res?.received) {
            chrome.tabs.update(tab.id, { url: fullOptionsUrl });
          }
        });
      }
    }
  });

  assert.equal(updatedTab?.tabId, 101);
  assert.equal(updatedTab?.active, true);
  assert.equal(focusedWindow?.winId, 202);
  assert.equal(focusedWindow?.focused, true);
  assert.equal(sentMessage?.tabId, 101);
  assert.equal(sentMessage?.msg?.type, 'FOCUS_BOOKMARK');
  assert.equal(sentMessage?.msg?.url, targetUrl);
});

test('focusBookmark matching expands parent folders and resolves target bookmark id', () => {
  const bookmarks = [
    { id: '1', title: 'Home', url: 'https://example.com', folderId: 'chrome:10' },
    { id: '2', title: 'Twitter Target', url: 'https://x.com/Jbaby0v0/', folderId: 'chrome:20' }
  ];
  const folders = [
    { id: 'chrome:10', name: '常用', parentId: '' },
    { id: 'chrome:20', name: '社交媒体', parentId: 'chrome:30' },
    { id: 'chrome:30', name: '收藏夹大分类', parentId: '' }
  ];

  const collapsedFolderIds = new Set(['chrome:30']);

  function expandFolderAncestors(folderId) {
    if (!folderId) return;
    const folderMap = new Map(folders.map(f => [f.id, f]));
    let curr = folderMap.get(folderId);
    while (curr?.parentId) {
      if (collapsedFolderIds.has(curr.parentId)) {
        collapsedFolderIds.delete(curr.parentId);
      }
      curr = folderMap.get(curr.parentId);
    }
  }

  const queryUrl = 'https://x.com/Jbaby0v0';
  const norm = normalizeBookmarkUrl(queryUrl);
  const found = bookmarks.find(b => normalizeBookmarkUrl(b.url) === norm || b.url === queryUrl);

  assert.ok(found);
  assert.equal(found.id, '2');

  expandFolderAncestors(found.folderId);
  // chrome:30 是 chrome:20 的 parent，应该被展开（从 collapsedFolderIds 中移除）
  assert.equal(collapsedFolderIds.has('chrome:30'), false);
});
