import Swal from 'sweetalert2';
import { readIndexedRecords, writeIndexedRecords, removeLegacyLocalStorage } from './indexedDb.js';

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
