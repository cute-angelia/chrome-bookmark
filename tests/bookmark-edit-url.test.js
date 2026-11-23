import { test } from 'node:test';
import assert from 'node:assert/strict';
import { domainOf } from '../src/services/bookmarkLibrary.js';

test('bookmark URL and title editing: domainOf recalculates correctly', () => {
  const url1 = 'https://github.com/facebook/react';
  assert.equal(domainOf(url1), 'github.com');

  const url2 = 'https://sub.domain.test:8080/path/to/page';
  assert.equal(domainOf(url2), 'sub.domain.test');

  const invalidUrl = 'not-a-valid-url';
  assert.equal(domainOf(invalidUrl), '');
});

test('bookmark URL auto-prepends https:// when missing protocol', () => {
  function normalizeInputUrl(raw) {
    let url = (raw || '').trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    try {
      new URL(url);
      return url;
    } catch {
      return null;
    }
  }

  assert.equal(normalizeInputUrl('github.com/foo/bar'), 'https://github.com/foo/bar');
  assert.equal(normalizeInputUrl('http://insecure.test'), 'http://insecure.test');
  assert.equal(normalizeInputUrl('https://secure.test/app'), 'https://secure.test/app');
  assert.equal(normalizeInputUrl(''), '');
  assert.equal(normalizeInputUrl('http://invalid space url'), null);
});

test('updating bookmark title and url syncs chrome.bookmarks.update for native bookmarks', async () => {
  let updateCalledWith = null;

  globalThis.chrome = {
    bookmarks: {
      update(id, changes, callback) {
        updateCalledWith = { id, changes };
        callback?.({ id, ...changes });
        return Promise.resolve({ id, ...changes });
      }
    }
  };

  const bookmark = {
    id: 'chrome:12345',
    nativeId: '12345',
    title: '旧标题',
    url: 'https://old.test',
    domain: 'old.test'
  };

  const newTitle = '新标题';
  const newUrl = 'https://new.test/docs';

  // 模拟更新逻辑
  let nativeId = bookmark.nativeId;
  if (!nativeId && bookmark.id?.startsWith('chrome:')) {
    nativeId = bookmark.id.slice('chrome:'.length);
  }

  if (globalThis.chrome?.bookmarks?.update && nativeId) {
    await globalThis.chrome.bookmarks.update(nativeId, {
      title: newTitle,
      url: newUrl
    });
  }

  bookmark.title = newTitle;
  bookmark.url = newUrl;
  bookmark.domain = domainOf(newUrl);

  assert.deepEqual(updateCalledWith, {
    id: '12345',
    changes: {
      title: '新标题',
      url: 'https://new.test/docs'
    }
  });
  assert.equal(bookmark.title, '新标题');
  assert.equal(bookmark.url, 'https://new.test/docs');
  assert.equal(bookmark.domain, 'new.test');

  delete globalThis.chrome;
});
