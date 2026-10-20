import { isChromeExtension } from './bookmarkStorage.js';

function domainOf(url) {
  try { return new URL(url).hostname; } catch { return ''; }
}

export async function readChromeLibrary() {
  if (!isChromeExtension()) return { bookmarks: [], folders: [] };
  const tree = await new Promise((resolve, reject) => {
    chrome.bookmarks.getTree(nodes => {
      if (chrome.runtime?.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve(nodes);
    });
  });
  const bookmarks = [];
  const folders = [];
  function visit(node, ancestors = [], path = []) {
    if (node.url) {
      bookmarks.push({
        id: `chrome:${node.id}`, nativeId: node.id, source: 'chrome',
        title: node.title || node.url, url: node.url, domain: domainOf(node.url),
        folderId: ancestors.at(-1) || '', folder: path.join(' / '), ancestorIds: ancestors,
        dateAdded: node.dateAdded || 0, tags: [], notes: '', screenshot: '', visits: 0, pinned: false
      });
      return;
    }
    if (node.id !== '0') {
      const id = `chrome:${node.id}`;
      folders.push({ id, name: node.title, path: [...path, node.title].join(' / '),
        source: 'chrome', depth: ancestors.length, parentId: ancestors.at(-1) || '' });
      ancestors = [...ancestors, id];
      path = [...path, node.title];
    }
    node.children?.forEach(child => visit(child, ancestors, path));
  }
  tree.forEach(node => visit(node));
  return { bookmarks, folders };
}

export function normalizeRemoteBookmarks(records, server) {
  server = server.replace(/\/+$/, '');
  return records.filter(record => record.url).map(record => {
    let screenshot = '';
    try { screenshot = record.imageURL ? new URL(record.imageURL, `${server}/`).href : ''; } catch { /* No valid image. */ }
    const tags = record.tags_detail ?? record.tags ?? [];
    return {
      id: `remote:${server}:${record.id}`, remoteId: record.id, source: 'remote', server,
      title: record.title || record.url, url: record.url, domain: domainOf(record.url),
      folderId: `remote:${server}`, folder: '远程书签', ancestorIds: [`remote:${server}`],
      tags: (Array.isArray(tags) ? tags : String(tags).split(',')).map(tag => typeof tag === 'string' ? tag : tag.name).filter(Boolean),
      screenshot, notes: record.excerpt || '', dateAdded: Date.parse(record.created || record.modified || '') || 0,
      pinned: false, visits: 0
    };
  });
}

export function mergeLibraryBookmarks(stored, incoming) {
  const previous = new Map(stored.map(bookmark => [bookmark.id, bookmark]));
  return [...stored.filter(bookmark => !['chrome', 'remote'].includes(bookmark.source)), ...incoming.map(bookmark => {
    const old = previous.get(bookmark.id);
    if (!old) return bookmark;
    // Source fields stay authoritative; workspace-only annotations survive refreshes.
    return { ...bookmark, ...Object.fromEntries(['pinned', 'visits', 'notes', 'tags', 'screenshot', 'nativeFolderId', ...(bookmark.source === 'remote' ? ['nativeId'] : [])]
      .filter(key => old[key] !== undefined && (old[key] !== '' || bookmark[key] === ''))
      .map(key => [key, old[key]])) };
  })].sort((a, b) => sourceRank(a) - sourceRank(b));
}

function sourceRank(record) {
  return record.source === 'chrome' ? 1 : record.source === 'remote' ? 2 : 0;
}

export function mergeRemoteBookmarks(cached, incoming, complete) {
  if (complete) return incoming;
  const records = new Map(cached.map(bookmark => [bookmark.id, bookmark]));
  incoming.forEach(bookmark => records.set(bookmark.id, bookmark));
  return [...records.values()];
}

export function reconcileRecords(current, incoming) {
  const previous = new Map(current.map(record => [record.id, record]));
  const result = incoming.map(record => {
    const old = previous.get(record.id);
    if (!old || Object.keys(old).length !== Object.keys(record).length) return record;
    const unchanged = Object.keys(record).every(key => Object.is(old[key], record[key]) ||
      (Array.isArray(old[key]) && Array.isArray(record[key]) && old[key].length === record[key].length &&
        old[key].every((value, index) => Object.is(value, record[key][index]))));
    return unchanged ? old : record;
  });
  return result.length === current.length && result.every((record, index) => record === current[index]) ? current : result;
}

export function mergeSourceFolders(current, incoming, source) {
  const result = [...current.filter(folder => folder.source !== source), ...incoming];
  // Source refresh completion order must not determine sidebar order; keep native tree order within its group.
  result.sort((a, b) => sourceRank(a) - sourceRank(b));
  return reconcileRecords(current, result);
}
