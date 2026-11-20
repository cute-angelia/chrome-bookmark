import Swal from 'sweetalert2';
import { readIndexedRecords, writeIndexedRecords, updateIndexedRecord, deleteIndexedRecord, removeLegacyLocalStorage } from './indexedDb.js';
import { normalizeBookmarkUrl } from './bookmarkLibrary.js';

removeLegacyLocalStorage();

export function isChromeExtension() {
  return typeof chrome !== 'undefined' && !!chrome.bookmarks && !!chrome.tabs;
}

/**
 * 读取所有书签
 */
export async function getStoredBookmarks() {
  return readIndexedRecords('bookmarks');
}

/**
 * 保存全部书签
 */
export async function saveStoredBookmarks(list) {
  return writeIndexedRecords('bookmarks', list);
}

/**
 * 更新单条书签（增量更新，不重写整表）
 */
export async function updateStoredBookmark(bookmark) {
  await updateIndexedRecord('bookmarks', bookmark);
  const normUrl = normalizeBookmarkUrl(bookmark.url);
  if (normUrl) {
    try {
      const all = await readIndexedRecords('bookmarks');
      const duplicates = all.filter(b => b.id !== bookmark.id && normalizeBookmarkUrl(b.url) === normUrl);
      for (const dup of duplicates) {
        dup.tags = Array.isArray(bookmark.tags) ? [...bookmark.tags] : [];
        if (bookmark.notes !== undefined) dup.notes = bookmark.notes;
        if (bookmark.pinned !== undefined) dup.pinned = bookmark.pinned;
        await updateIndexedRecord('bookmarks', dup);
      }
    } catch (e) {
      console.warn('Sync duplicate records failed:', e);
    }
  }
  return bookmark;
}

/**
 * 删除单条书签
 */
export async function deleteStoredBookmark(id) {
  return deleteIndexedRecord('bookmarks', id);
}

/**
 * 读取文件夹列表
 */
export async function getStoredFolders() {
  return readIndexedRecords('folders');
}

/**
 * 保存文件夹列表
 */
export async function saveStoredFolders(folders) {
  return writeIndexedRecords('folders', folders);
}

const SYNC_META_KEY = 'cutbookmark_last_sync_time';

/**
 * 判断两个时间戳是否为同一自然天
 */
export function isSameDay(t1, t2) {
  if (!t1 || !t2) return false;
  const d1 = new Date(t1);
  const d2 = new Date(t2);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return false;
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

/**
 * 判断是否需要同步书签（一天只自动全量读取一次）
 */
export function isBookmarkSyncNeeded(lastSyncTime, hasBookmarks = true) {
  if (!lastSyncTime || !hasBookmarks) return true;
  return !isSameDay(lastSyncTime, Date.now());
}

/**
 * 获取上次全量读取书签的时间戳
 */
export async function getLastBookmarkSyncTime() {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get([SYNC_META_KEY], (res) => {
        resolve(res?.[SYNC_META_KEY] || 0);
      });
    });
  }
  try {
    const settings = await readIndexedRecords('settings');
    const record = settings.find(r => r.id === SYNC_META_KEY);
    return record?.value || 0;
  } catch {
    return 0;
  }
}

/**
 * 更新上次全量读取书签的时间戳
 */
export async function setLastBookmarkSyncTime(time = Date.now()) {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [SYNC_META_KEY]: time }, () => {
        resolve(time);
      });
    });
  }
  try {
    const settings = await readIndexedRecords('settings');
    const filtered = settings.filter(r => r.id !== SYNC_META_KEY);
    filtered.push({ id: SYNC_META_KEY, value: time });
    await writeIndexedRecords('settings', filtered);
  } catch (error) {
    console.warn('Could not save last sync time:', error);
  }
  return time;
}

/**
 * 导出数据为 JSON 文件
 */
export async function exportDataAsJson(library) {
  const bookmarks = library?.bookmarks ?? await getStoredBookmarks();
  const folders = library?.folders ?? await getStoredFolders();
  const exportPayload = {
    appName: 'CutBookmark',
    version: '2.0.0',
    exportTime: new Date().toISOString(),
    folders,
    bookmarks
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `CutBookmark_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * 导入 JSON 备份数据
 */
export async function importDataFromJson(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
      throw new Error('无效的备份文件结构');
    }
    await saveStoredBookmarks(data.bookmarks);
    if (data.folders && Array.isArray(data.folders)) {
      await saveStoredFolders(data.folders);
    }
    return { success: true, count: data.bookmarks.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * 全局通用轻提示
 */
export function showToast(title, icon = 'success') {
  Swal.fire({
    title,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
}

/**
 * 确认对话框
 */
export async function confirmDialog(title, text = '此操作无法撤销') {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '确定执行',
    cancelButtonText: '取消',
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#94a3b8'
  });
  return result.isConfirmed;
}

const TRASH_STORAGE_KEY = 'cutbookmark_trash_records_v1';
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * 获取回收站中的全部书签（自动清理超过 7 天前的书签）
 */
export async function getTrashBookmarks() {
  try {
    const settings = await readIndexedRecords('settings');
    const record = settings.find(r => r.id === TRASH_STORAGE_KEY);
    const trash = Array.isArray(record?.value) ? record.value : [];
    const now = Date.now();
    // 自动清理 7 天前（即超过 7 天）的书签
    const valid = trash.filter(b => b && b.deletedAt && (now - b.deletedAt < SEVEN_DAYS_MS));
    if (valid.length !== trash.length) {
      const filtered = settings.filter(r => r.id !== TRASH_STORAGE_KEY);
      await writeIndexedRecords('settings', [...filtered, { id: TRASH_STORAGE_KEY, value: valid }]);
    }
    return valid;
  } catch (e) {
    console.warn('读取回收站失败:', e);
    return [];
  }
}

/**
 * 保存回收站列表
 */
export async function saveTrashBookmarks(trashList) {
  try {
    const now = Date.now();
    const valid = (trashList || []).filter(b => b && b.deletedAt && (now - b.deletedAt < SEVEN_DAYS_MS));
    const settings = await readIndexedRecords('settings');
    const filtered = settings.filter(r => r.id !== TRASH_STORAGE_KEY);
    await writeIndexedRecords('settings', [...filtered, { id: TRASH_STORAGE_KEY, value: valid }]);
    return valid;
  } catch (e) {
    console.warn('保存回收站失败:', e);
    return trashList || [];
  }
}

/**
 * 将单个或多个书签移入回收站
 */
export async function moveToTrashStorage(bookmarksToTrash) {
  const current = await getTrashBookmarks();
  const list = Array.isArray(bookmarksToTrash) ? bookmarksToTrash : [bookmarksToTrash];
  const now = Date.now();
  const additions = list.map(b => ({
    ...b,
    deletedAt: b.deletedAt || now
  }));
  const idSet = new Set(additions.map(item => item.id));
  const merged = [
    ...additions,
    ...current.filter(item => !idSet.has(item.id))
  ];
  return saveTrashBookmarks(merged);
}

/**
 * 从回收站恢复书签
 */
export async function restoreFromTrashStorage(id) {
  const current = await getTrashBookmarks();
  const target = current.find(b => b.id === id);
  if (target) {
    const remaining = current.filter(b => b.id !== id);
    await saveTrashBookmarks(remaining);
  }
  return target;
}

/**
 * 从回收站永久删除
 */
export async function deleteFromTrashPermanently(id) {
  const current = await getTrashBookmarks();
  const remaining = current.filter(b => b.id !== id);
  await saveTrashBookmarks(remaining);
  return remaining;
}

/**
 * 清空回收站
 */
export async function clearTrashStorage() {
  const settings = await readIndexedRecords('settings');
  const filtered = settings.filter(r => r.id !== TRASH_STORAGE_KEY);
  await writeIndexedRecords('settings', [...filtered, { id: TRASH_STORAGE_KEY, value: [] }]);
  return [];
}

