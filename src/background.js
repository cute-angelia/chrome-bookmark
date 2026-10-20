import { checkUrlInShioriFolder, setExtensionBookmarkIcon, saveToShioriFolder, removeFromShioriFolder } from './services/nativeBookmarkSync.js';
import { remoteAddBookmark, remoteDeleteBookmark, openRemoteLibraries } from './services/shioriApi.js';

console.log('CutBookmark 2.0 Background Service Worker 初始化');

// 标签页切换时自动检测收藏状态并切换图标
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
      const isBookmarked = await checkUrlInShioriFolder(tab.url);
      setExtensionBookmarkIcon(isBookmarked);
    } else {
      setExtensionBookmarkIcon(false);
    }
  } catch (err) {
    // 忽略异常
  }
});

// 标签页完成加载/URL 改变时检测
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab && tab.url && !tab.url.startsWith('chrome://')) {
    const isBookmarked = await checkUrlInShioriFolder(tab.url);
    setExtensionBookmarkIcon(isBookmarked);
  }
});

// 扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('CutBookmark 2.0 扩展安装成功');
});

// 扩展间消息通信监听
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const type = request.type || request.action || request.cmd;

  switch (type) {
    case 'ping':
      sendResponse({ status: 'pong' });
      break;

    case 'open-libraries':
    case 'openRemoteLibraries':
      openRemoteLibraries();
      sendResponse({ status: 'success' });
      break;

    case 'save-bookmark':
      // 支持通过 background 保存
      (async () => {
        try {
          const tab = request.tab || (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
          const url = tab.url;
          const title = tab.title;

          // 1. 本地 Shiori 文件夹同步
          await saveToShioriFolder(url, title);
          setExtensionBookmarkIcon(true);

          // 2. 远程 API 同步
          const res = await remoteAddBookmark({
            url,
            title,
            tags: request.tags || [],
            imgbase64: request.imgbase64 || ''
          });

          sendResponse({ status: 'success', remote: res });
        } catch (e) {
          sendResponse({ status: 'error', message: e.message });
        }
      })();
      return true;

    case 'remove-bookmark':
      (async () => {
        try {
          const tab = request.tab || (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
          const url = tab.url;

          // 1. 本地 Shiori 文件夹移除
          await removeFromShioriFolder(url);
          setExtensionBookmarkIcon(false);

          // 2. 远程 API 同步删除
          const res = await remoteDeleteBookmark(url);

          sendResponse({ status: 'success', remote: res });
        } catch (e) {
          sendResponse({ status: 'error', message: e.message });
        }
      })();
      return true;

    case 'openDashboard':
    case 'openOptions': {
      const url = chrome.runtime.getURL('options.html');
      chrome.tabs.query({ url }, (tabs) => {
        if (tabs && tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, { active: true });
          chrome.windows.update(tabs[0].windowId, { focused: true });
        } else {
          chrome.tabs.create({ url });
        }
      });
      sendResponse({ success: true });
      break;
    }

    case 'captureScreen':
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        sendResponse({ dataUrl });
      });
      return true;
  }
});
