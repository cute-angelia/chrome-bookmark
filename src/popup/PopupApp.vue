<template>
  <div class="p-4 flex flex-col h-full bg-slate-50 text-slate-800 select-none">
    <!-- Popup Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200">
      <div class="flex items-center space-x-2">
        <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
          <Camera class="w-4 h-4" />
        </div>
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
          title="打开三栏管理工作台"
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
            v-model="selectedFolder"
            class="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="前端技术/Vue生态">📂 前端技术 / Vue生态</option>
            <option value="前端技术/样式设计">📂 前端技术 / 样式设计</option>
            <option value="开源项目/构建工具">📂 开源项目 / 构建工具</option>
            <option value="设计灵感/UI界面">📂 设计灵感 / UI界面</option>
            <option value="常用收集箱">📂 常用收集箱 (默认)</option>
          </select>
        </div>

        <!-- Tags Input -->
        <div class="space-y-1">
          <div class="flex items-center space-x-1">
            <Tag class="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              v-model="tagsInputText"
              @keydown.enter.prevent="addCustomTag"
              placeholder="添加标签以逗号或回车分隔..."
              class="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div class="flex items-center gap-1 flex-wrap pt-0.5">
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
        <span>{{ isSaving ? '同步保存中...' : (isCurrentBookmarked ? '覆盖更新快照与标签' : '保存为截屏书签') }}</span>
      </button>

      <button
        @click="openDashboard"
        class="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-medium flex items-center justify-center space-x-1 border border-slate-200 transition cursor-pointer"
      >
        <LayoutGrid class="w-3.5 h-3.5" />
        <span>打开三栏管理工作台</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Camera, Globe, Folder, Tag, BookmarkCheck, LayoutGrid,
  ExternalLink, CheckCircle2
} from 'lucide-vue-next';
import { getCurrentPageInfo, captureCurrentTab } from '../services/bookmarkService.js';
import { getStoredBookmarks, saveStoredBookmarks, showToast } from '../services/bookmarkStorage.js';
import { getServerConfig, remoteAddBookmark, remoteDeleteBookmark, openRemoteLibraries } from '../services/shioriApi.js';
import {
  saveToShioriFolder, removeFromShioriFolder, checkUrlInShioriFolder,
  setExtensionBookmarkIcon
} from '../services/nativeBookmarkSync.js';

const pageTitle = ref('');
const pageUrl = ref('');
const screenshotUrl = ref('');
const screenshotError = ref('');
const selectedFolder = ref('常用收集箱');
const selectedTags = ref(['开发']);
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

  // 检查当前 URL 是否已在书签库
  isCurrentBookmarked.value = await checkUrlInShioriFolder(info.url);
  if (!isCurrentBookmarked.value) {
    const list = await getStoredBookmarks();
    isCurrentBookmarked.value = list.some(b => b.url === info.url);
  }
  setExtensionBookmarkIcon(isCurrentBookmarked.value);

  await takeScreenshot();
}

async function takeScreenshot() {
  isCapturing.value = true;
  screenshotError.value = '';
  try {
    screenshotUrl.value = await captureCurrentTab();
  } catch (error) {
    screenshotError.value = error.message || '截图失败，请重试';
  } finally {
    isCapturing.value = false;
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
  isSaving.value = true;
  try {
    let domain = 'example.com';
    try {
      domain = new URL(pageUrl.value || 'https://example.com').hostname;
    } catch (e) {
      //
    }

    const newBm = {
      id: `bm-${Date.now()}`,
      title: pageTitle.value || '未命名书签',
      url: pageUrl.value || 'https://example.com',
      domain,
      folder: selectedFolder.value,
      folderId: 'folder-custom',
      tags: [...selectedTags.value],
      screenshot: screenshotUrl.value,
      color: '#6366f1',
      notes: '来自快捷弹窗保存',
      dateAdded: Date.now(),
      pinned: false,
      visits: 1
    };

    // 1. 同步保存到工作台持久化存储
    const list = await getStoredBookmarks();
    const existingIdx = list.findIndex(b => b.url === pageUrl.value);
    if (existingIdx >= 0) {
      list[existingIdx] = Object.assign({}, list[existingIdx], newBm);
    } else {
      list.unshift(newBm);
    }
    await saveStoredBookmarks(list);

    // 2. 同步保存到 Chrome 原生 Shiori 文件夹
    await saveToShioriFolder(pageUrl.value, pageTitle.value);
    setExtensionBookmarkIcon(true);
    isCurrentBookmarked.value = true;

    // 3. 同步向远程自建服务 POST /api/bookmarks/add 提交
    if (isServerConnected.value) {
      const remoteRes = await remoteAddBookmark({
        url: pageUrl.value,
        title: pageTitle.value,
        tags: selectedTags.value,
        imgbase64: screenshotUrl.value
      });
      if (remoteRes.success) {
        showToast('已同步保存至远程服务与本地！');
      } else {
        showToast('已保存至本地 (远程同步未成功)', 'warning');
      }
    } else {
      showToast(screenshotUrl.value ? '书签与快照已保存至本地工作台！' : '书签已保存（未生成截图）');
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
    // 1. 本地原生 Shiori 文件夹移除
    await removeFromShioriFolder(pageUrl.value);

    // 2. 工作台存储移除
    const list = await getStoredBookmarks();
    const updated = list.filter(b => b.url !== pageUrl.value);
    await saveStoredBookmarks(updated);

    // 3. 远程服务器删除
    if (isServerConnected.value) {
      await remoteDeleteBookmark(pageUrl.value);
    }

    // 4. 重置图标与状态
    setExtensionBookmarkIcon(false);
    isCurrentBookmarked.value = false;
    showToast('书签已从本地与远程移除');

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
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  } else {
    window.open('/options.html', '_blank');
  }
}

onMounted(() => {
  initPage().catch(error => { screenshotError.value = error.message || '读取当前网页失败'; });
});
</script>
