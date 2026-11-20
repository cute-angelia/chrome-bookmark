import { checkUrlBookmarked, setExtensionBookmarkIcon, refreshActiveTabIcon, saveToShioriFolder, removeFromShioriFolder } from './services/nativeBookmarkSync.js';
import { remoteAddBookmark, remoteDeleteBookmark, openRemoteLibraries } from './services/shioriApi.js';

console.log('CutBookmark 2.0 Background Service Worker 初始化');

// 标签页切换时自动检测收藏状态并切换图标
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('about:')) {
      const isBookmarked = await checkUrlBookmarked(tab.url);
      setExtensionBookmarkIcon(isBookmarked, activeInfo.tabId);
    } else {
      setExtensionBookmarkIcon(false, activeInfo.tabId);
    }
  } catch (err) {
    // 忽略异常
  }
});

// 标签页完成加载/URL 改变时检测
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('about:')) {
    const isBookmarked = await checkUrlBookmarked(tab.url);
    setExtensionBookmarkIcon(isBookmarked, tabId);
  }
});

// 监听书签变动，实时同步当前激活标签页的图标状态
if (typeof chrome !== 'undefined' && chrome.bookmarks) {
  const onBookmarkChange = () => {
    refreshActiveTabIcon();
  };
  chrome.bookmarks.onCreated?.addListener(onBookmarkChange);
  chrome.bookmarks.onRemoved?.addListener(onBookmarkChange);
  chrome.bookmarks.onChanged?.addListener(onBookmarkChange);
  chrome.bookmarks.onMoved?.addListener(onBookmarkChange);
}

// 扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('CutBookmark 2.0 扩展安装成功');
  refreshActiveTabIcon();
});

// 扩展间消息通信监听
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const type = request.type || request.action || request.cmd;

  switch (type) {
    case 'ping':
      sendResponse({ status: 'pong' });
      break;

    case 'BOOKMARK_UPDATED':
      refreshActiveTabIcon();
      sendResponse({ status: 'success' });
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

          // 1. 本地书签文件夹同步
          await saveToShioriFolder(url, title);
          setExtensionBookmarkIcon(true);

          // 2. 远程 API 同步 (若未传截图则尝试通过 background 兜底截屏)
          let imgbase64 = request.imgbase64 || '';
          if (!imgbase64 && chrome.tabs?.captureVisibleTab) {
            try {
              imgbase64 = await new Promise((resolve) => {
                chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 90 }, (dataUrl) => {
                  if (chrome.runtime?.lastError || !dataUrl) {
                    resolve('');
                  } else {
                    resolve(dataUrl);
                  }
                });
              });
            } catch (err) {
              // 忽略兜底截图失败
            }
          }

          const res = await remoteAddBookmark({
            url,
            title,
            tags: request.tags || [],
            imgbase64
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

          // 1. 本地书签文件夹移除
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
      const targetUrl = request.targetUrl || request.url || '';
      const targetQuery = targetUrl ? `?url=${encodeURIComponent(targetUrl)}` : '';
      const baseOptionsUrl = chrome.runtime.getURL('options.html');
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
        } else {
          chrome.tabs.create({ url: fullOptionsUrl });
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
