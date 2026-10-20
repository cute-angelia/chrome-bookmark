import { isChromeExtension } from './bookmarkStorage.js';
import { readIndexedRecords, writeIndexedRecords } from './indexedDb.js';

const CONFIG_KEY = 'cutbookmark_shiori_config_v2';

export const DEFAULT_SERVER_CONFIG = {
  server: 'http://192.168.3.36:38112',
  username: '',
  token: '',
  remember: true
};

/**
 * 获取服务端配置
 */
export async function getServerConfig() {
  if (isChromeExtension()) {
    return new Promise((resolve) => {
      chrome.storage.local.get([CONFIG_KEY, 'server', 'token', 'username'], (res) => {
        if (res && res[CONFIG_KEY]) {
          resolve(Object.assign({}, DEFAULT_SERVER_CONFIG, res[CONFIG_KEY]));
        } else {
          resolve({ ...DEFAULT_SERVER_CONFIG, ...Object.fromEntries(
            ['server', 'token', 'username'].filter(key => res?.[key] !== undefined).map(key => [key, res[key]])
          ) });
        }
      });
    });
  }

  const settings = await readIndexedRecords('settings');
  return { ...DEFAULT_SERVER_CONFIG, ...settings.find(record => record.id === CONFIG_KEY)?.value };
}

/**
 * 保存服务端配置
 */
export async function saveServerConfig(config) {
  if (isChromeExtension()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [CONFIG_KEY]: config }, () => {
        resolve(config);
      });
    });
  }
  await writeIndexedRecords('settings', [{ id: CONFIG_KEY, value: config }]);
  return config;
}

/**
 * 清除登录状态
 */
export async function logoutServer() {
  const current = await getServerConfig();
  current.token = '';
  current.username = '';
  await saveServerConfig(current);
  return current;
}

export async function fetchRemoteBookmarks(config) {
  return (await fetchRemoteBookmarkUpdates(config)).bookmarks;
}

export async function fetchRemoteBookmarkUpdates(config, cached = []) {
  if (!config.server || !config.token) return { bookmarks: [], complete: false };
  const server = config.server.replace(/\/+$/, '');
  const knownIds = new Set(cached.filter(bookmark => bookmark.remoteId != null).map(bookmark => String(bookmark.remoteId)));
  const bookmarks = [];
  let maxPage = 1;
  for (let page = 1; page <= maxPage; page++) {
    const response = await fetch(`${server}/api/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.token}` },
      body: JSON.stringify({ keyword: '', tags: '', exclude: '', page }),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (json.code !== 0) throw new Error(json.msg || 'Remote request failed');
    const data = json.data;
    if (!Array.isArray(data?.bookmarks)) throw new Error('Invalid bookmark response');
    maxPage = Number(data.maxPage ?? 1);
    if (!Number.isInteger(maxPage) || maxPage < 0 || (data.page != null && Number(data.page) !== page)) {
      throw new Error('Invalid bookmark pagination');
    }
    bookmarks.push(...data.bookmarks);
    if (page >= maxPage) return { bookmarks, complete: true };
    // A fully known page is the boundary of the already cached history.
    if (data.bookmarks.every(bookmark => bookmark.id != null && knownIds.has(String(bookmark.id)))) {
      return { bookmarks, complete: false };
    }
  }
  return { bookmarks, complete: true };
}

/**
 * 登录服务端
 */
export async function loginServer(server, username, password) {
  if (!server) throw new Error('服务器地址不能为空');
  if (!username) throw new Error('用户名不能为空');
  if (!password) throw new Error('密码不能为空');

  let cleanServer = server.trim();
  if (cleanServer.endsWith('/')) {
    cleanServer = cleanServer.slice(0, -1);
  }

  const loginUrl = `${cleanServer}/api/auth/login`;

  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
      remember_me: true
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.code !== 0) {
    throw new Error(json.msg || '登录失败');
  }

  const token = json.data?.token || json.token || '';
  const newConfig = {
    server: cleanServer,
    username,
    token,
    remember: true
  };

  await saveServerConfig(newConfig);
  return newConfig;
}

/**
 * 向远程服务器保存书签 (原项目核心接口 POST /api/bookmarks/add)
 */
export async function remoteAddBookmark({ url, title, tags = [], imgbase64 = '' }) {
  const config = await getServerConfig();
  if (!config.server || !config.token) {
    // 未配置远程服务时静默跳过或返回未配置状态
    return { success: false, reason: 'unconfigured' };
  }

  const addUrl = `${config.server}/api/bookmarks/add`;
  const payload = {
    url,
    title,
    from: 'ext',
    tags: Array.isArray(tags) ? tags.join(',') : (tags || ''),
    imgbase64: imgbase64 || ''
  };

  try {
    const response = await fetch(addUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`远程服务响应异常: HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json.code !== 0) {
      throw new Error(json.msg || '远程添加书签失败');
    }

    return { success: true, data: json };
  } catch (err) {
    console.error('Remote add bookmark error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 向远程服务器删除书签 (原项目核心接口 POST /api/bookmarks/deleteUrl)
 */
export async function remoteDeleteBookmark(url) {
  const config = await getServerConfig();
  if (!config.server || !config.token) {
    return { success: false, reason: 'unconfigured' };
  }

  const delUrl = `${config.server}/api/bookmarks/deleteUrl`;
  try {
    const response = await fetch(delUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token}`
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    return { success: json.code === 0, data: json };
  } catch (err) {
    console.error('Remote delete bookmark error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 打开远程服务书签库
 */
export async function openRemoteLibraries() {
  const config = await getServerConfig();
  const targetUrl = config.server || 'http://192.168.3.36:38112';
  if (isChromeExtension() && chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url: targetUrl });
  } else {
    window.open(targetUrl, '_blank');
  }
}
