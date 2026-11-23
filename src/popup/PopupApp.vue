<template>
  <div class="p-4 flex flex-col h-full bg-slate-50 text-slate-800 select-none">
    <!-- Popup Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200">
      <div class="flex items-center space-x-2">
        <img src="/icons/icon.svg" alt="CutBookmark Logo" class="w-7 h-7 rounded-lg shadow-xs shrink-0" />
        <div>
          <h1 class="text-xs font-bold text-slate-900 leading-none">截屏书签 CutBookmark</h1>
          <div class="flex items-center space-x-1 mt-0.5">
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="isServerConnected ? 'bg-emerald-500' : 'bg-slate-300'"
            />
            <span class="text-[10px] text-slate-400">
              {{ isServerConnected ? '远程服务已连' : '本地离线模式' }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-1">
        <!-- View remote library button (原项目核心功能) -->
        <button
          v-if="isServerConnected"
          @click="openRemoteLibrary"
          class="text-indigo-600 hover:text-indigo-700 p-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
          title="打开远程书签库"
        >
          <ExternalLink class="w-3.5 h-3.5" />
        </button>

        <!-- Open Dashboard -->
        <button
          @click="openDashboard"
          class="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          title="打开管理页面"
        >
          <LayoutGrid class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Active Tab & Status Badge -->
    <div class="my-3 space-y-2">
      <!-- Bookmarked Status Bar -->
      <div
        v-if="isCurrentBookmarked"
        class="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800"
      >
        <div class="flex items-center space-x-1.5">
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
          <span class="font-medium text-[11px]">当前网页已在书签库中</span>
        </div>
        <button
          @click="handleRemoveBookmark"
          :disabled="isRemoving"
          class="text-[10px] font-semibold text-rose-600 hover:text-rose-800 underline cursor-pointer disabled:opacity-50"
        >
          {{ isRemoving ? '删除中...' : '移除此书签' }}
        </button>
      </div>

      <!-- Page title & url -->
      <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
        <div class="flex items-center space-x-2">
          <Globe class="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <input
            v-model="pageTitle"
            placeholder="输入书签标题..."
            class="text-xs font-semibold text-slate-800 w-full focus:outline-none focus:border-b border-indigo-500 truncate"
          />
        </div>
        <div class="text-[10px] text-slate-400 font-mono truncate">
          {{ pageUrl }}
        </div>
      </div>

      <!-- Screenshot Snapshot Box -->
      <div class="relative h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 group">
        <img
          v-if="screenshotUrl"
          :src="screenshotUrl"
          class="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs">
          <span>{{ isCapturing ? '正在生成页面快照...' : screenshotError || '尚无页面截图' }}</span>
        </div>

        <button
          @click="takeScreenshot"
          :disabled="isCapturing"
          class="absolute bottom-2 right-2 px-2 py-1 bg-black/60 hover:bg-black/80 text-white rounded-lg text-[10px] flex items-center space-x-1 backdrop-blur-xs transition cursor-pointer"
        >
          <Camera class="w-3 h-3" :class="{ 'animate-pulse': isCapturing }" />
          <span>{{ isCapturing ? '捕获中...' : '重新截屏' }}</span>
        </button>
      </div>

      <!-- Select Folder & Tags -->
      <div class="space-y-1.5 pt-1">
        <div class="flex items-center space-x-1.5">
          <Folder class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            v-model="selectedFolderId"
            @change="onFolderChange"
            class="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
          >
            <option
              v-for="folder in folderOptions"
              :key="folder.id"
              :value="folder.id"
            >
              📂 {{ folder.path || folder.name }}
            </option>
          </select>
        </div>

        <!-- Tags Input -->
        <div class="space-y-1">
          <div class="flex items-center space-x-1">
            <Tag class="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              v-model="tagsInputText"
              @keydown.enter.prevent="addCustomTag"
              @blur="addCustomTag"
              placeholder="添加标签以逗号或回车分隔..."
              class="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div v-if="selectedTags.length > 0" class="flex items-center gap-1 flex-wrap pt-0.5">
            <span
              v-for="tag in selectedTags"
              :key="tag"
              class="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1"
            >
              <span>#{{ tag }}</span>
              <button @click="removeTag(tag)" class="hover:text-indigo-900 cursor-pointer text-xs">×</button>
            </span>
          </div>
        </div>

        <!-- Notes Input -->
        <div class="flex items-center space-x-1">
          <FileText class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            v-model="pageNotes"
            @keydown.enter.prevent="saveBookmark"
            placeholder="添加笔记备注 (回车快捷保存)..."
            class="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-auto space-y-2 pt-2 border-t border-slate-100">
      <button
        @click="saveBookmark"
        :disabled="isSaving"
        class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm shadow-indigo-200 transition cursor-pointer"
      >
        <BookmarkCheck class="w-4 h-4" />
        <span>{{ isSaving ? (isCapturing ? '生成快照并保存中...' : '同步保存中...') : (isCurrentBookmarked ? '覆盖更新快照与标签' : '保存为截屏书签') }}</span>
      </button>

      <button
        @click="openDashboard"
        class="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-medium flex items-center justify-center space-x-1 border border-slate-200 transition cursor-pointer"
      >
        <LayoutGrid class="w-3.5 h-3.5" />
        <span>打开管理页面</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Camera, Globe, Folder, Tag, BookmarkCheck, LayoutGrid,
  ExternalLink, CheckCircle2, FileText
} from 'lucide-vue-next';
import { getCurrentPageInfo, captureCurrentTab } from '../services/bookmarkService.js';
import {
  isChromeExtension, getStoredBookmarks, saveStoredBookmarks, getStoredFolders,
  showToast, moveToTrashStorage, getLastUsedFolderId, setLastUsedFolderId
} from '../services/bookmarkStorage.js';
import { getServerConfig, remoteAddBookmark, remoteDeleteBookmark, openRemoteLibraries } from '../services/shioriApi.js';
import {
  saveToShioriFolder, removeFromShioriFolder, checkUrlInShioriFolder,
  findNativeBookmarkMatches, setExtensionBookmarkIcon
} from '../services/nativeBookmarkSync.js';
import { readChromeLibrary, normalizeBookmarkUrl, aggregateBookmarksByUrl, extractDomainTag } from '../services/bookmarkLibrary.js';

const pageTitle = ref('');
const pageUrl = ref('');
const pageTabId = ref(null);
const pageNotes = ref('');
const screenshotUrl = ref('');
const screenshotError = ref('');
const folderOptions = ref([]);
const selectedFolderId = ref('');
const selectedTags = ref([]);
const tagsInputText = ref('');

const isCapturing = ref(false);
const isSaving = ref(false);
const isRemoving = ref(false);
const isCurrentBookmarked = ref(false);
const serverConfig = ref({});

const isServerConnected = computed(() => {
  return !!serverConfig.value.token && serverConfig.value.token.length > 10;
});

async function initPage() {
  serverConfig.value = await getServerConfig();

  const info = await getCurrentPageInfo();
  pageTitle.value = info.title;
  pageUrl.value = info.url;
  pageTabId.value = info.tabId;

  // 1. 动态加载真实 Chrome 书签目录树
  if (isChromeExtension()) {
    try {
      const { folders } = await readChromeLibrary();
      if (folders && folders.length > 0) {
        folderOptions.value = folders.map(f => ({
          id: f.id,
          name: f.name,
          path: f.path || f.name,
          depth: f.depth || 0
        }));
      }
    } catch (e) {
      console.warn('读取 Chrome 原生目录失败:', e);
    }
  }

  // 2. 若未获取到原生目录（如 Web 预览环境），加载本地已有分类
  if (folderOptions.value.length === 0) {
    const storedFolders = await getStoredFolders();
    folderOptions.value = storedFolders.filter(f => f.id !== 'all').map(f => ({
      id: f.id,
      name: f.name,
      path: f.name,
      depth: 0
    }));
  }

  // 3. 兜底默认分类选项
  if (folderOptions.value.length === 0) {
    folderOptions.value = [
      { id: 'chrome:2', name: '其他书签', path: '其他书签', depth: 0 }
    ];
  }

  // 4. 检查当前 URL 是否已在书签库
  isCurrentBookmarked.value = await checkUrlInShioriFolder(info.url);
  const normUrl = normalizeBookmarkUrl(info.url);
  const list = await getStoredBookmarks();
  const existing = list.find(b => normalizeBookmarkUrl(b.url) === normUrl);

  const defaultDomainTag = extractDomainTag(info.url);
  if (existing) {
    isCurrentBookmarked.value = true;
    if (Array.isArray(existing.tags) && existing.tags.length > 0) {
      selectedTags.value = [...existing.tags];
    } else if (defaultDomainTag) {
      selectedTags.value = [defaultDomainTag];
    }
    if (existing.notes) {
      pageNotes.value = existing.notes;
    }
    if (existing.folderId && folderOptions.value.some(f => f.id === existing.folderId)) {
      selectedFolderId.value = existing.folderId;
    }
    if (existing.screenshot) {
      screenshotUrl.value = existing.screenshot;
    }
  } else {
    // 新增书签时，默认添加无后缀的 domain 标签
    if (defaultDomainTag) {
      selectedTags.value = [defaultDomainTag];
    }
  }

  // 5. 若未匹配到已有归属文件夹，优先采用记忆的上次选择，兜底使用书签栏
  if (!selectedFolderId.value) {
    const nativeMatches = await findNativeBookmarkMatches({ url: info.url });
    if (nativeMatches && nativeMatches.length > 0) {
      isCurrentBookmarked.value = true;
      selectedFolderId.value = `chrome:${nativeMatches[0].parentId}`;
    } else {
      const lastFolderId = await getLastUsedFolderId();
      if (lastFolderId && folderOptions.value.some(f => f.id === lastFolderId)) {
        selectedFolderId.value = lastFolderId;
      } else {
        const bookmarksBar = folderOptions.value.find(f => f.id === 'chrome:1' || f.name === '书签栏');
        if (bookmarksBar) {
          selectedFolderId.value = bookmarksBar.id;
        } else {
          const otherBookmarks = folderOptions.value.find(f => f.name === '其他书签');
          selectedFolderId.value = otherBookmarks ? otherBookmarks.id : folderOptions.value[0]?.id;
        }
      }
    }
  }

  setExtensionBookmarkIcon(isCurrentBookmarked.value, pageTabId.value);

  if (!screenshotUrl.value) {
    await takeScreenshot();
  }
}

function onFolderChange() {
  if (selectedFolderId.value) {
    setLastUsedFolderId(selectedFolderId.value).catch(() => {});
  }
}

let pendingCapture = null;

async function takeScreenshot() {
  isCapturing.value = true;
  screenshotError.value = '';
  try {
    pendingCapture = captureCurrentTab();
    screenshotUrl.value = await pendingCapture;
  } catch (error) {
    screenshotError.value = error.message || '截图失败，请重试';
    screenshotUrl.value = '';
  } finally {
    isCapturing.value = false;
    pendingCapture = null;
  }
}

function addCustomTag() {
  const parts = tagsInputText.value.split(/[,，\s]+/).filter(Boolean);
  parts.forEach(p => {
    const clean = p.replace(/^#/, '');
    if (clean && !selectedTags.value.includes(clean)) {
      selectedTags.value.push(clean);
    }
  });
  tagsInputText.value = '';
}

function removeTag(tag) {
  selectedTags.value = selectedTags.value.filter(t => t !== tag);
}

async function saveBookmark() {
  if (isSaving.value) return;
  // 确保输入框内未按回车提交的标签被自动收录
  addCustomTag();
  isSaving.value = true;
  try {
    // 1. 如果截图仍在捕获中，先等待捕获完成
    if (isCapturing.value && pendingCapture) {
      try {
        await pendingCapture;
      } catch {
        // 捕获异常已在 takeScreenshot 记录
      }
    }

    // 2. 如果此前未获取到截图，进行一次现场主动兜底截屏
    if (!screenshotUrl.value) {
      try {
        screenshotUrl.value = await captureCurrentTab();
      } catch (err) {
        console.warn('现场截图兜底失败:', err);
      }
    }

    let domain = 'example.com';
    try {
      domain = new URL(pageUrl.value || 'https://example.com').hostname;
    } catch {}

    // 3. 同步保存到 Chrome 原生书签对应文件夹
    let nativeNode = null;
    let targetParentId = selectedFolderId.value;
    if (targetParentId && typeof targetParentId === 'string' && targetParentId.startsWith('chrome:')) {
      targetParentId = targetParentId.slice('chrome:'.length);
    }
    if (isChromeExtension()) {
      nativeNode = await saveToShioriFolder(pageUrl.value, pageTitle.value, targetParentId);
      setExtensionBookmarkIcon(true, pageTabId.value);
      isCurrentBookmarked.value = true;
    }

    // 4. 将快照、标签、笔记等元数据存入 IndexedDB（复用原生 ID，不生成脱节的「常用收集箱」条目）
    const selectedOpt = folderOptions.value.find(f => f.id === selectedFolderId.value);
    const folderPath = selectedOpt?.path || selectedOpt?.name || '其他书签';
    const folderId = selectedFolderId.value || (nativeNode ? `chrome:${nativeNode.parentId}` : 'default');

    const notesValue = pageNotes.value ? pageNotes.value.trim() : '';

    const newBm = {
      id: nativeNode ? `chrome:${nativeNode.id}` : `bm-${Date.now()}`,
      nativeId: nativeNode?.id || undefined,
      source: nativeNode ? 'chrome' : undefined,
      title: pageTitle.value || '未命名书签',
      url: pageUrl.value || 'https://example.com',
      domain,
      folder: folderPath,
      folderId,
      ancestorIds: [folderId],
      tags: [...selectedTags.value],
      screenshot: screenshotUrl.value,
      color: '#6366f1',
      notes: notesValue,
      dateAdded: Date.now(),
      pinned: false,
      visits: 1
    };

    const normUrl = normalizeBookmarkUrl(pageUrl.value);
    const list = await getStoredBookmarks();
    const existingIdx = list.findIndex(b => normalizeBookmarkUrl(b.url) === normUrl);
    if (existingIdx >= 0) {
      list[existingIdx] = Object.assign({}, list[existingIdx], newBm, {
        id: nativeNode ? `chrome:${nativeNode.id}` : list[existingIdx].id,
        visits: list[existingIdx].visits || 1,
        pinned: list[existingIdx].pinned || false,
        notes: notesValue
      });
    } else {
      list.unshift(newBm);
    }
    list.forEach(b => {
      if (normalizeBookmarkUrl(b.url) === normUrl) {
        b.notes = notesValue;
      }
    });
    await saveStoredBookmarks(aggregateBookmarksByUrl(list));
    if (selectedFolderId.value) {
      await setLastUsedFolderId(selectedFolderId.value);
    }

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      try {
        chrome.runtime.sendMessage({ type: 'BOOKMARK_UPDATED', url: pageUrl.value });
      } catch (e) {
        // ignore
      }
    }

    // 5. 同步向远程自建服务 POST /api/bookmarks/add 提交
    if (isServerConnected.value) {
      const remoteRes = await remoteAddBookmark({
        url: pageUrl.value,
        title: pageTitle.value,
        tags: selectedTags.value,
        imgbase64: screenshotUrl.value
      });
      if (remoteRes.success) {
        showToast(screenshotUrl.value ? '已同步保存至远程服务与本地！' : '书签已同步（未获取到网页截图）');
      } else {
        showToast('已保存至本地 (远程同步未成功)', 'warning');
      }
    } else {
      showToast(screenshotUrl.value ? '书签与快照已保存至本地！' : '书签已保存（未生成截图）');
    }

    setTimeout(() => {
      if (typeof window !== 'undefined' && window.close) {
        window.close();
      }
    }, 900);
  } finally {
    isSaving.value = false;
  }
}

async function handleRemoveBookmark() {
  isRemoving.value = true;
  try {
    // 1. 本地原生书签文件夹移除
    await removeFromShioriFolder(pageUrl.value);

    // 2. 工作台存储移除所有该 URL 的记录，并移入回收站
    const normUrl = normalizeBookmarkUrl(pageUrl.value);
    const list = await getStoredBookmarks();
    const removedItems = list.filter(b => normalizeBookmarkUrl(b.url) === normUrl);
    const updated = list.filter(b => normalizeBookmarkUrl(b.url) !== normUrl);
    await saveStoredBookmarks(updated);

    if (removedItems.length > 0) {
      await moveToTrashStorage(removedItems);
    } else {
      await moveToTrashStorage({
        id: `local:${Date.now()}`,
        title: pageTitle.value || pageUrl.value,
        url: pageUrl.value,
        screenshot: screenshotUrl.value || '',
        tags: [...selectedTags.value],
        dateAdded: Date.now()
      });
    }

    // 3. 重置图标与状态
    setExtensionBookmarkIcon(false, pageTabId.value);
    isCurrentBookmarked.value = false;
    pageNotes.value = '';
    selectedTags.value = [];
    showToast('书签已移入回收站');

    setTimeout(() => {
      if (typeof window !== 'undefined' && window.close) {
        window.close();
      }
    }, 700);
  } finally {
    isRemoving.value = false;
  }
}

function openRemoteLibrary() {
  openRemoteLibraries();
}

function openDashboard() {
  const targetUrl = pageUrl.value;
  if (isChromeExtension()) {
    chrome.runtime.sendMessage({
      action: 'openDashboard',
      targetUrl
    }, () => {
      window.close();
    });
    setTimeout(() => {
      window.close();
    }, 150);
  } else {
    const query = targetUrl ? `?url=${encodeURIComponent(targetUrl)}` : '';
    window.open(`/options.html${query}`, '_blank');
  }
}

onMounted(() => {
  initPage().catch(error => { screenshotError.value = error.message || '读取当前网页失败'; });
});
</script>
