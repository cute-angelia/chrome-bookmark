import Swal from 'sweetalert2';
import {
  isChromeExtension,
  getStoredBookmarks,
  saveStoredBookmarks,
  getStoredFolders,
  saveStoredFolders,
  showToast
} from './bookmarkStorage.js';

export {
  isChromeExtension as isExtension,
  getStoredBookmarks as loadBookmarks,
  saveStoredBookmarks as saveBookmarks,
  getStoredFolders,
  saveStoredFolders,
  showToast as toastSuccess
};

/**
 * 获取当前活动 Tab 信息
 */
export async function getCurrentPageInfo() {
  requireCaptureEnvironment();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) throw new Error('未找到当前网页');
  return {
    title: tab.title || tab.url,
    url: tab.url,
    favIconUrl: tab.favIconUrl || '',
    tabId: tab.id
  };
}

/**
 * 执行网页截屏
 */
export async function captureCurrentTab() {
  requireCaptureEnvironment();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) throw new Error('未找到当前网页');
  webUrl(tab.url);
  return captureVerifiedTab(tab);
}

function requireCaptureEnvironment() {
  if (!isChromeExtension() || !chrome.tabs.captureVisibleTab) {
    throw new Error('真实截图仅支持 Chrome 扩展，请加载 dist 后重试');
  }
}

function webUrl(url) {
  let parsed;
  try { parsed = new URL(url); } catch { throw new Error('书签网址无效'); }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('仅支持 HTTP / HTTPS 网页截图');
  return parsed.href;
}

async function assertActive(tab) {
  const [active] = await chrome.tabs.query({ active: true, windowId: tab.windowId });
  if (active?.id !== tab.id || active.url !== tab.url || active.pendingUrl || active.status === 'loading') {
    throw new Error('截图时页面已切换或仍在加载，请重试');
  }
}

async function captureVerifiedTab(tab) {
  await assertActive(tab);
  const image = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
  await assertActive(tab);
  if (!image?.startsWith('data:image/png;base64,') || image.endsWith(',')) throw new Error('浏览器没有返回有效截图');
  return image;
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let captureInProgress = false;

export async function captureBookmark(url) {
  requireCaptureEnvironment();
  const targetUrl = webUrl(url);
  if (captureInProgress) throw new Error('已有截图任务进行中，请稍候');
  captureInProgress = true;
  let temporary;
  let original;
  try {
    [original] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!original) throw new Error('未找到当前浏览器窗口');
    temporary = await chrome.tabs.create({ url: targetUrl, windowId: original.windowId, active: true });
    const deadline = Date.now() + 30000;
    let loaded;
    do {
      loaded = await chrome.tabs.get(temporary.id);
      if (loaded.status === 'complete') break;
      if (Date.now() >= deadline) throw new Error('网页加载超时，原快照未修改');
      await delay(250);
    } while (true);
    webUrl(loaded.url);
    // Give the loaded document a rendering interval before reading the visible pixels.
    await delay(600);
    return await captureVerifiedTab(loaded);
  } finally {
    if (temporary?.id != null) {
      try {
        const [active] = await chrome.tabs.query({ active: true, windowId: original.windowId });
        if (active?.id === temporary.id) await chrome.tabs.update(original.id, { active: true });
      } catch { /* The original window or tab may have been closed by the user. */ }
      try { await chrome.tabs.remove(temporary.id); } catch { /* Already closed. */ }
    }
    captureInProgress = false;
  }
}
