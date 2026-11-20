import { isChromeExtension } from './bookmarkStorage.js';

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
 * 检查指定 URL 是否已被收藏进原生书签文件夹
 */
export async function checkUrlInShioriFolder(url) {
  if (!isChromeExtension() || !url) return false;

  const folder = await findShioriFolder();
  if (!folder) return false;

  return new Promise((resolve) => {
    chrome.bookmarks.search({ url }, (existing) => {
      const isFound = (existing || []).some(b => b.parentId === folder.id);
      resolve(isFound);
    });
  });
}

/**
 * 根据是否已收藏动态设置扩展图标
 */
export function setExtensionBookmarkIcon(isBookmarked) {
  if (!isChromeExtension() || !chrome.action || !chrome.action.setIcon) return;

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

  chrome.action.setIcon({ path: iconPath }, () => {
    if (chrome.runtime.lastError) {
      // 忽略图标设置异常
    }
  });
}

/**
 * 刷新当前激活 Tab 的书签图标状态
 */
export async function refreshActiveTabIcon() {
  if (!isChromeExtension()) return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
      const isBookmarked = await checkUrlInShioriFolder(tab.url);
      setExtensionBookmarkIcon(isBookmarked);
    } else {
      setExtensionBookmarkIcon(false);
    }
  } catch (e) {
    //
  }
}
