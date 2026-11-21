import { isChromeExtension, getStoredBookmarks } from './bookmarkStorage.js';
import { normalizeBookmarkUrl } from './bookmarkLibrary.js';

const DEFAULT_FOLDER_NAME = 'CutBookmark';

export async function findNativeBookmarkMatches(bookmark) {
  if (!isChromeExtension()) return [];
  if (bookmark.nativeId) {
    try {
      const matches = await chrome.bookmarks.get(bookmark.nativeId);
      return matches.filter(item => item.url === bookmark.url);
    } catch (error) {
      if (bookmark.source === 'chrome') throw error;
    }
  }
  return chrome.bookmarks.search({ url: bookmark.url });
}

export async function moveNativeBookmark(native, folder, bookmark) {
  if (!isChromeExtension()) throw new Error('请在 Chrome 扩展中整理本机书签');
  if (!folder.id.startsWith('chrome:')) throw new Error('请选择 Chrome 书签文件夹');
  const parentId = folder.id.slice('chrome:'.length);
  if (native) return chrome.bookmarks.move(native.id, { parentId });
  return chrome.bookmarks.create({ parentId, title: bookmark.title, url: bookmark.url });
}

/**
 * 获取或创建 Chrome 原生书签中的默认书签文件夹（位于「其他书签」目录下）
 */
export async function getOrCreateShioriFolder() {
  if (!isChromeExtension()) return null;

  return new Promise((resolve) => {
    // Chrome 中「其他书签」的 id 通常为 "2"
    const parentId = '2';

    chrome.bookmarks.getChildren(parentId, (children) => {
      if (chrome.runtime.lastError || !children) {
        return resolve(null);
      }
      const existing = children.find(el => !el.url && (el.title === DEFAULT_FOLDER_NAME || el.title === 'Shiori'));
      if (existing) {
        return resolve(existing);
      }
      chrome.bookmarks.create({
        parentId,
        title: DEFAULT_FOLDER_NAME
      }, (newFolder) => {
        resolve(newFolder);
      });
    });
  });
}

async function findShioriFolder() {
  if (!isChromeExtension()) return null;
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getChildren('2', children => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve(children?.find(folder => !folder.url && (folder.title === DEFAULT_FOLDER_NAME || folder.title === 'Shiori')) || null);
    });
  });
}

/**
 * 将书签保存到本地 Chrome 原生书签文件夹（支持指定父级目录，默认为 CutBookmark 目录）
 */
export async function saveToShioriFolder(url, title, parentId = null) {
  if (!isChromeExtension()) return null;

  let targetParentId = parentId;
  if (targetParentId && typeof targetParentId === 'string' && targetParentId.startsWith('chrome:')) {
    targetParentId = targetParentId.slice('chrome:'.length);
  }
  if (!targetParentId) {
    const folder = await getOrCreateShioriFolder();
    if (folder) targetParentId = folder.id;
  }
  if (!targetParentId) return null;

  return new Promise((resolve) => {
    chrome.bookmarks.search({ url }, (existing) => {
      const found = (existing || []).find(b => b.parentId === targetParentId);
      if (!found) {
        chrome.bookmarks.create({
          parentId: targetParentId,
          title,
          url
        }, (node) => resolve(node));
      } else {
        if (title && found.title !== title) {
          chrome.bookmarks.update(found.id, { title }, (node) => resolve(node));
        } else {
          resolve(found);
        }
      }
    });
  });
}

/**
 * 从本地 Chrome 原生书签文件夹删除指定 URL 的书签
 */
export async function removeFromShioriFolder(url, specificId = null) {
  if (!isChromeExtension()) return;

  if (specificId) {
    try {
      await chrome.bookmarks.remove(specificId);
      return;
    } catch {
      // 忽略找不到特定 ID 的异常，继续按 URL 兜底清理
    }
  }

  const folder = await findShioriFolder();
  return new Promise((resolve) => {
    chrome.bookmarks.search({ url }, (existing) => {
      if (existing) {
        existing.forEach(b => {
          if (!folder || b.parentId === folder.id) {
            chrome.bookmarks.remove(b.id);
          }
        });
      }
      resolve();
    });
  });
}

/**
 * 全面检查指定 URL 是否已被收藏（涵盖 Chrome 原生书签任意目录以及本地存储库）
 */
export async function checkUrlBookmarked(url) {
  if (!url) return false;
  const normTarget = normalizeBookmarkUrl(url);
  if (!normTarget) return false;

  // 1. 在 Chrome 原生书签树中全面检索
  if (isChromeExtension() && chrome.bookmarks?.search) {
    try {
      const results = await new Promise((resolve) => {
        chrome.bookmarks.search({ url }, (items) => {
          if (chrome.runtime?.lastError) resolve([]);
          else resolve(items || []);
        });
      });
      if (results && results.length > 0) return true;

      // 若带参数或尾部斜杠，用规范化 URL 再次匹配
      if (normTarget !== url) {
        const normResults = await new Promise((resolve) => {
          chrome.bookmarks.search({ url: normTarget }, (items) => {
            if (chrome.runtime?.lastError) resolve([]);
            else resolve(items || []);
          });
        });
        if (normResults && normResults.length > 0) return true;
      }
    } catch (e) {
      // 忽略 search 异常
    }
  }

  // 2. 在本地 IndexedDB 存储的书签库中检索（涵盖远程书签与本地快照）
  try {
    const stored = await getStoredBookmarks();
    if (stored && stored.length > 0) {
      if (stored.some(b => normalizeBookmarkUrl(b.url) === normTarget)) {
        return true;
      }
    }
  } catch (e) {
    // 忽略存储异常
  }

  return false;
}

// 保持向后兼容
export const checkUrlInShioriFolder = checkUrlBookmarked;

/**
 * 确保全局默认徽章永远清空，防止新标签页无意继承五角星
 */
export function clearGlobalBadge() {
  if (!isChromeExtension() || !chrome.action?.setBadgeText) return;
  chrome.action.setBadgeText({ text: '' }, () => {
    if (chrome.runtime?.lastError) { /* ignore */ }
  });
}

/**
 * 根据是否已收藏动态设置指定 Tab 的扩展图标及 Badge / Title 视觉反馈
 * 严格针对具体 tabId 设置，杜绝全局 Badge 污染
 */
export function setExtensionBookmarkIcon(isBookmarked, tabId = null) {
  if (!isChromeExtension() || !chrome.action) return;

  // 严禁不带 tabId 直接设置，防止 Chrome 将其设为全局默认徽章污染新页面
  if (typeof tabId !== 'number') {
    if (chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]?.id) {
          setExtensionBookmarkIcon(isBookmarked, tabs[0].id);
        }
      });
    }
    return;
  }

  const iconPath = isBookmarked
    ? {
        16: 'icons/action-bookmarked-16.png',
        32: 'icons/action-bookmarked-32.png',
        64: 'icons/action-bookmarked-64.png'
      }
    : {
        16: 'icons/action-default-16.png',
        32: 'icons/action-default-32.png',
        64: 'icons/action-default-64.png'
      };

  const iconDetails = { path: iconPath, tabId };
  const badgeDetails = { text: isBookmarked ? '★' : '', tabId };
  const badgeColorDetails = { color: '#4f46e5', tabId };
  const titleDetails = { title: isBookmarked ? '已收藏至书签 (截屏书签)' : '添加截屏书签', tabId };

  if (chrome.action.setIcon) {
    chrome.action.setIcon(iconDetails, () => {
      if (chrome.runtime?.lastError) { /* ignore */ }
    });
  }

  if (chrome.action.setBadgeBackgroundColor && isBookmarked) {
    chrome.action.setBadgeBackgroundColor(badgeColorDetails, () => {
      if (chrome.runtime?.lastError) { /* ignore */ }
    });
  }

  if (chrome.action.setBadgeText) {
    chrome.action.setBadgeText(badgeDetails, () => {
      if (chrome.runtime?.lastError) { /* ignore */ }
    });
  }

  if (chrome.action.setTitle) {
    chrome.action.setTitle(titleDetails, () => {
      if (chrome.runtime?.lastError) { /* ignore */ }
    });
  }
}

/**
 * 刷新当前激活 Tab 的书签图标状态
 */
export async function refreshActiveTabIcon() {
  if (!isChromeExtension()) return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('about:')) {
      const isBookmarked = await checkUrlBookmarked(tab.url);
      setExtensionBookmarkIcon(isBookmarked, tab.id);
    } else if (tab) {
      setExtensionBookmarkIcon(false, tab.id);
    }
  } catch (e) {
    //
  }
}
