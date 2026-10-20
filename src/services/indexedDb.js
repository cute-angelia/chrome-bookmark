const DATABASE_NAME = 'cutbookmark';
const STORES = ['bookmarks', 'folders', 'settings'];
const LEGACY_KEYS = ['cutbookmark_store_bookmarks_v2', 'cutbookmark_store_folders_v2', 'cutbookmark_shiori_config_v2'];

export function removeLegacyLocalStorage() {
  try {
    for (const key of LEGACY_KEYS) globalThis.localStorage?.removeItem(key);
  } catch (error) {
    console.warn('Could not remove legacy CutBookmark localStorage:', error);
  }
}

function openDatabase() {
  removeLegacyLocalStorage();
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error('当前环境无法使用 IndexedDB'));
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('IndexedDB 正被旧页面占用，请关闭旧页面后重试'));
  });
}

async function transact(store, mode, run) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, mode);
    let result;
    transaction.oncomplete = () => { db.close(); resolve(result); };
    transaction.onabort = () => { db.close(); reject(transaction.error || new Error('IndexedDB 写入已取消')); };
    try {
      run(transaction.objectStore(store), value => { result = value; });
    } catch (error) {
      transaction.abort();
      reject(error);
    }
  });
}

export function readIndexedRecords(store) {
  return transact(store, 'readonly', (records, done) => {
    const request = records.getAll();
    request.onsuccess = () => done(request.result);
  });
}

export async function writeIndexedRecords(store, records) {
  // Vue state contains proxies; serialize before passing records to IndexedDB's structured clone.
  const snapshot = JSON.parse(JSON.stringify(records));
  await transact(store, 'readwrite', collection => {
    collection.clear();
    snapshot.forEach(record => collection.put(record));
  });
  return records;
}
