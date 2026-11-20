import { isChromeExtension } from './bookmarkStorage.js';

export function domainOf(url) {
  try { return new URL(url).hostname; } catch { return ''; }
}

export function normalizeBookmarkUrl(url) {
  if (!url || typeof url !== 'string') return '';
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase();
    let pathname = parsed.pathname || '';
    if (pathname === '/') {
      pathname = '';
    } else if (pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    return `${parsed.protocol}//${host}${parsed.port ? ':' + parsed.port : ''}${pathname}${parsed.search}`;
  } catch {
    return url.trim().replace(/\/+$/, '');
  }
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
    try {
      if (record.imageURL) {
        const fullUrl = new URL(record.imageURL, `${server}/`);
        const pathSegments = fullUrl.pathname.split('/').filter(Boolean);
        const lastSegment = pathSegments.at(-1) || '';
        if (lastSegment && !['bookmark', 'minio'].includes(lastSegment.toLowerCase())) {
          screenshot = fullUrl.href;
        }
      }
    } catch { /* No valid image. */ }
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

export function aggregateBookmarksByUrl(bookmarks) {
  if (!Array.isArray(bookmarks) || bookmarks.length === 0) return [];

  const map = new Map();
  const noUrlList = [];

  for (const bm of bookmarks) {
    if (!bm) continue;
    const norm = normalizeBookmarkUrl(bm.url);
    if (!norm) {
      noUrlList.push(bm);
      continue;
    }
    if (!map.has(norm)) {
      map.set(norm, []);
    }
    map.get(norm).push(bm);
  }

  const result = [];

  for (const [normUrl, items] of map.entries()) {
    if (items.length === 1) {
      const item = items[0];
      const isNative = item.source === 'chrome' || !!item.nativeId;
      const isRemote = item.source === 'remote' || !!item.remoteId;
      const sources = Array.from(new Set([
        ...(item.sources || []),
        ...(isNative ? ['chrome'] : []),
        ...(isRemote ? ['remote'] : [])
      ]));
      result.push({
        ...item,
        sources,
        isNative,
        isRemote
      });
      continue;
    }

    // 多源聚合：将 Chrome、远程以及本地孤立记录融合成单条复合书签
    const chromeItem = items.find(b => b.source === 'chrome' || (b.id && b.id.startsWith('chrome:')));
    const remoteItem = items.find(b => b.source === 'remote' || (b.id && b.id.startsWith('remote:')) || b.remoteId);
    const localItem = items.find(b => !b.source || (b.source !== 'chrome' && b.source !== 'remote'));

    const primary = chromeItem || remoteItem || localItem || items[0];

    // 标签多端并集去重
    const allTags = new Set();
    items.forEach(b => {
      if (Array.isArray(b.tags)) b.tags.forEach(t => t && allTags.add(t));
    });

    // 截图优先使用本地高清快照，其次回退远程图片
    let bestScreenshot = '';
    for (const b of items) {
      if (b.screenshot) {
        if (!bestScreenshot || b.screenshot.startsWith('data:')) {
          bestScreenshot = b.screenshot;
        }
      }
    }

    const bestNotes = items.map(b => b.notes).find(n => n && n.trim()) || '';
    const maxVisits = Math.max(...items.map(b => b.visits || 0), 0);
    const isPinned = items.some(b => b.pinned);
    const dateAdded = items.map(b => b.dateAdded).find(d => typeof d === 'number' && d > 0) || Date.now();

    const nativeId = chromeItem?.nativeId || items.find(b => b.nativeId)?.nativeId;
    const remoteId = remoteItem?.remoteId || items.find(b => b.remoteId)?.remoteId;
    const server = remoteItem?.server || items.find(b => b.server)?.server;
    const remoteFolderId = remoteItem?.folderId || (server ? `remote:${server}` : '');

    const isNative = !!nativeId || items.some(b => b.source === 'chrome');
    const isRemote = !!remoteId || items.some(b => b.source === 'remote');
    const sources = Array.from(new Set([
      ...items.flatMap(b => b.sources || []),
      ...(isNative ? ['chrome'] : []),
      ...(isRemote ? ['remote'] : [])
    ]));

    const folder = chromeItem?.folder || localItem?.folder || remoteItem?.folder || primary.folder;
    const folderId = chromeItem?.folderId || localItem?.folderId || remoteItem?.folderId || primary.folderId;
    const ancestorIds = chromeItem?.ancestorIds || localItem?.ancestorIds || remoteItem?.ancestorIds || primary.ancestorIds || [];

    result.push({
      ...primary,
      id: primary.id,
      url: primary.url || normUrl,
      title: chromeItem?.title || localItem?.title || remoteItem?.title || primary.title,
      domain: primary.domain || domainOf(primary.url || normUrl),
      nativeId,
      remoteId,
      server,
      remoteFolderId,
      isNative,
      isRemote,
      sources,
      folder,
      folderId,
      ancestorIds,
      screenshot: bestScreenshot,
      tags: Array.from(allTags),
      notes: bestNotes,
      pinned: isPinned,
      visits: maxVisits,
      dateAdded
    });
  }

  return [...result, ...noUrlList];
}

export function mergeLibraryBookmarks(stored, incoming) {
  const previousById = new Map();
  const previousByUrl = new Map();
  const previousByRemote = new Map();
  const previousByNative = new Map();

  for (const bookmark of stored) {
    if (bookmark.id) previousById.set(bookmark.id, bookmark);
    const norm = normalizeBookmarkUrl(bookmark.url);
    if (norm) previousByUrl.set(norm, bookmark);
    if (bookmark.remoteId != null) previousByRemote.set(String(bookmark.remoteId), bookmark);
    if (bookmark.nativeId != null) previousByNative.set(String(bookmark.nativeId), bookmark);
  }

  return [...stored.filter(bookmark => !['chrome', 'remote'].includes(bookmark.source)), ...incoming.map(bookmark => {
    const norm = normalizeBookmarkUrl(bookmark.url);
    const old = previousById.get(bookmark.id) ||
      (bookmark.remoteId != null ? previousByRemote.get(String(bookmark.remoteId)) : null) ||
      (bookmark.nativeId != null ? previousByNative.get(String(bookmark.nativeId)) : null) ||
      (norm ? previousByUrl.get(norm) : null);

    if (!old) return bookmark;
    // Source fields stay authoritative; workspace-only annotations survive refreshes.
    // For remote bookmarks with an upstream image, let incoming screenshot take precedence.
    const preservedKeys = ['pinned', 'visits', 'notes', 'tags', ...(bookmark.source === 'remote' ? ['nativeId'] : ['screenshot']), 'nativeFolderId']
      .filter(key => old[key] !== undefined && (old[key] !== '' || bookmark[key] === ''));
    if (bookmark.source === 'remote' && !bookmark.screenshot && old.screenshot) {
      preservedKeys.push('screenshot');
    }
    return { ...bookmark, ...Object.fromEntries(preservedKeys.map(key => [key, old[key]])) };
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
