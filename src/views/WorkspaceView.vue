<template>
  <div class="h-full min-h-0 min-w-[1040px] flex bg-white overflow-hidden">
    <!-- 栏目 1: 左侧导航控制台 (Sidebar) -->
    <aside class="w-80 bg-slate-50 text-slate-700 flex flex-col shrink-0 border-r border-slate-200 select-none">
      <!-- 快捷统计与添加按钮 -->
      <div class="px-3 py-3 border-b border-slate-200 bg-white">
        <button
          @click="showCreateModal = true"
          class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm shadow-indigo-200 transition cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>添加书签</span>
        </button>
      </div>

      <!-- 智能视图与目录列表 (可滚动) -->
      <div class="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <!-- 智能过滤视图 -->
        <div>
          <div class="px-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            快捷视图
          </div>
          <nav class="space-y-0.5">
            <button
              v-for="v in smartViews"
              :key="v.id"
              @click="activeView = v.id"
              class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
              :class="activeView === v.id ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <div class="flex items-center space-x-2 truncate">
                <component :is="v.icon" class="w-3.5 h-3.5 shrink-0" />
                <span class="truncate">{{ v.name }}</span>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                :class="activeView === v.id ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ v.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- 分类文件夹树 -->
        <div>
          <div class="px-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>分类文件夹</span>
            <button
              @click="showFolderModal = true"
              class="text-indigo-600 hover:text-indigo-700 transition text-[10px] flex items-center space-x-0.5 cursor-pointer"
            >
              <span>管理</span>
            </button>
          </div>
          <nav class="space-y-0.5">
            <button
              v-for="folder in customFolders"
              :key="folder.id"
              @click="selectFolder(folder.id)"
              :style="{ paddingLeft: `${12 + (folder.depth || 0) * 12}px` }"
              :title="folder.path || folder.name"
              class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
              :class="selectedFolderFilter === folder.id ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <div class="flex items-center space-x-2 truncate">
                <Folder class="w-3.5 h-3.5 shrink-0 text-slate-400" :class="{ '!text-indigo-600': selectedFolderFilter === folder.id }" />
                <span class="truncate">{{ folder.name }}</span>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                :class="selectedFolderFilter === folder.id ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ getFolderBookmarkCount(folder) }}
              </span>
            </button>
          </nav>
        </div>

        <!-- 标签云 -->
        <div>
          <div class="px-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>标签</span>
            <button
              v-if="selectedTagFilter"
              @click="selectedTagFilter = ''"
              class="text-[10px] text-amber-600 hover:underline cursor-pointer"
            >
              清除筛选
            </button>
          </div>
          <div class="flex flex-wrap gap-1 px-1">
            <button
              v-for="tag in allUniqueTags"
              :key="tag"
              @click="toggleTagFilter(tag)"
              class="text-[11px] px-2 py-0.5 rounded-lg border transition cursor-pointer"
              :class="selectedTagFilter === tag ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'"
            >
              #{{ tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- 底部系统状态与数据导入导出 -->
      <div class="p-3 border-t border-slate-200 text-xs bg-white space-y-2">
        <div class="flex items-center justify-between text-[11px] text-slate-500">
          <span>书签总数</span>
          <span class="font-mono text-slate-500">{{ bookmarks.length }} 项</span>
        </div>

        <div class="grid grid-cols-2 gap-1.5 pt-1">
          <button
            @click="exportData"
            class="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center space-x-1 transition cursor-pointer"
            title="导出备份为 JSON 文件"
          >
            <Download class="w-3 h-3" />
            <span>导出备份</span>
          </button>
          <label
            class="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center space-x-1 transition cursor-pointer text-center"
            title="从 JSON 文件恢复备份"
          >
            <Upload class="w-3 h-3" />
            <span>导入恢复</span>
            <input type="file" accept=".json" class="hidden" @change="handleImportFile" />
          </label>
        </div>
      </div>
    </aside>

    <!-- 栏目 2: 中间书签列表流 (Master List) -->
    <section class="w-96 flex flex-col border-r border-slate-200 bg-slate-50/70 shrink-0">
      <!-- 搜索与工具条 -->
      <div class="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
        <!-- 搜索输入框 -->
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索书签标题、域名、标签或笔记..."
            class="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- 视图切换与排序控制 -->
        <div class="flex items-center justify-between text-xs text-slate-500">
          <div class="flex items-center space-x-1.5">
            <span>排序:</span>
            <select
              v-model="sortBy"
              class="text-xs bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="dateDesc">最新添加</option>
              <option value="dateAsc">最早添加</option>
              <option value="visits">高频访问</option>
              <option value="title">标题拼音</option>
            </select>
          </div>

          <div class="flex items-center space-x-1.5">
            <button
              @click="toggleBatchMode"
              class="px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer"
              :class="isBatchMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ isBatchMode ? '退出批量' : '批量整理' }}
            </button>

            <button
              @click="isCompactView = !isCompactView"
              class="p-1 rounded hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              :title="isCompactView ? '切换为详细卡片流' : '切换为紧凑列表'"
            >
              <List class="w-4 h-4" :class="{ 'text-indigo-600': isCompactView }" />
            </button>
          </div>
        </div>

        <!-- 批量操作工具条 (当处于批量模式时展开) -->
        <div v-if="isBatchMode" class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
              class="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span class="text-slate-600">已选 {{ selectedBatchIds.length }} 项</span>
          </div>

          <div class="flex items-center space-x-1">
            <button
              @click="batchDelete"
              :disabled="selectedBatchIds.length === 0"
              class="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-[11px] disabled:opacity-40 transition cursor-pointer"
            >
              批量删除
            </button>
          </div>
        </div>
      </div>

      <!-- 可滚动书签列表项 -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div
          v-for="bm in filteredList"
          :key="bm.id"
          @click="selectBookmark(bm.id)"
          class="p-2.5 rounded-2xl border transition cursor-pointer flex gap-3 group relative select-none"
          :class="selectedBookmarkId === bm.id ? 'bg-indigo-50/80 border-indigo-300 shadow-xs' : 'bg-white border-slate-200/80 hover:border-slate-300'"
        >
          <!-- 批量选择框 -->
          <div v-if="isBatchMode" class="flex items-center shrink-0" @click.stop>
            <input
              type="checkbox"
              :value="bm.id"
              v-model="selectedBatchIds"
              class="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <!-- 缩略截屏图 (非紧凑模式显示) -->
          <div
            v-if="!isCompactView"
            class="w-16 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative group/thumb"
          >
            <img v-if="bm.screenshot" :src="bm.screenshot" class="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-300" />
            <FolderArchive v-else class="w-6 h-6 m-auto mt-4 text-slate-300" />
            <div
              v-if="bm.pinned"
              class="absolute top-1 left-1 w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center shadow-xs"
              title="置顶"
            >
              <Pin class="w-2.5 h-2.5" />
            </div>
          </div>

          <!-- 书签文字信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <h3 class="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate transition">
                {{ bm.title }}
              </h3>
            </div>
            <p class="text-[11px] text-slate-400 font-mono truncate mt-0.5">{{ bm.domain }}</p>

            <div class="flex items-center justify-between mt-1.5">
              <div class="flex items-center gap-1 flex-wrap">
                <span class="text-[10px] text-indigo-600">{{ bm.source === 'chrome' ? 'Chrome' : bm.source === 'remote' ? '远程' : '本地' }}</span>
                <span
                  v-for="tag in bm.tags?.slice(0, 2)"
                  :key="tag"
                  class="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200"
                >
                  #{{ tag }}
                </span>
                <span v-if="bm.tags?.length > 2" class="text-[9px] text-slate-400">+{{ bm.tags.length - 2 }}</span>
              </div>

              <span class="text-[10px] text-slate-400 font-mono">
                {{ bm.visits || 1 }}次
              </span>
            </div>
          </div>
        </div>

        <div v-if="filteredList.length === 0" class="text-center py-12 text-slate-400 text-xs">
          没有找到匹配的书签
        </div>
      </div>
    </section>

    <!-- 栏目 3: 右侧详情与快照检视器 (Inspector Detail Panel) -->
    <main class="flex-1 flex flex-col bg-slate-50 overflow-y-auto min-w-0">
      <template v-if="activeBookmark">
        <!-- 全宽顶部信息栏 -->
        <header class="shrink-0 sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 space-y-2.5">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0">
              <span class="shrink-0 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 truncate max-w-[180px]">
                {{ activeBookmark.folder }}
              </span>
              <span class="text-[11px] text-slate-400 font-mono whitespace-nowrap min-w-0 truncate">
                {{ new Date(activeBookmark.dateAdded).toLocaleDateString() }} 录入 · 累计 <strong class="text-indigo-600">{{ activeBookmark.visits || 1 }}</strong> 次访问
              </span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="togglePin(activeBookmark.id)"
                class="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
                :class="activeBookmark.pinned ? 'text-amber-500 border-amber-300 bg-amber-50/40' : 'text-slate-400'"
                title="置顶书签"
              >
                <Pin class="w-4 h-4" />
              </button>
              <button
                @click="deleteSingle(activeBookmark.id)"
                class="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="删除此书签"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- 可直接编辑的标题（链接图标紧跟标题文字） -->
          <div class="flex items-center gap-2">
            <input
              v-model="activeBookmark.title"
              :readonly="!!activeBookmark.source"
              @change="persistChanges"
              class="w-auto min-w-0 max-w-full [field-sizing:content] text-lg font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition py-0.5 leading-snug"
              placeholder="书签标题"
            />
            <a
              :href="activeBookmark.url"
              target="_blank"
              @click="recordVisit(activeBookmark.id)"
              class="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
              title="打开链接"
            >
              <ExternalLink class="w-4 h-4" />
            </a>
          </div>
        </header>

        <!-- 全宽截图检视区 -->
        <section class="shrink-0 border-b border-slate-200">
          <div class="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-100 text-xs text-slate-500">
            <span class="font-medium flex items-center gap-1.5 text-slate-700">
              <Camera class="w-3.5 h-3.5 text-indigo-600" />
              <span>网页截图</span>
            </span>
            <button
              @click="updateSnapshot(activeBookmark)"
              :disabled="!!snapshotUpdatingId || !isExtEnv"
              class="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              :title="isExtEnv ? '临时打开书签网页，截取可视区域后自动返回' : '真实截图仅支持 Chrome 扩展'"
            >
              <RotateCw class="w-3 h-3" :class="{ 'animate-spin': snapshotUpdatingId === activeBookmark.id }" />
              <span>{{ snapshotUpdatingId === activeBookmark.id ? '正在截屏…' : isExtEnv ? '刷新截屏' : '仅扩展可截屏' }}</span>
            </button>
          </div>

          <img
            v-if="activeBookmark.screenshot"
            :src="activeBookmark.screenshot"
            class="w-full h-auto"
          />
          <div v-else class="px-4 py-12 text-center text-xs text-slate-400 bg-white">尚无网页截图{{ isExtEnv ? '，点击刷新截屏生成真实快照' : '，请在 Chrome 扩展中生成' }}</div>
        </section>

        <!-- 全宽属性编辑区（单栏堆叠） -->
        <section class="flex-1 bg-white px-4 py-4 space-y-5">
          <!-- 分类文件夹 -->
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5">{{ isExtEnv ? '整理到 Chrome 文件夹' : '分类文件夹' }}</label>
            <select
              v-if="isExtEnv"
              :value="activeBookmark.source === 'chrome' ? activeBookmark.folderId : activeBookmark.nativeFolderId || ''"
              :disabled="movingBookmark"
              @change="moveActiveToFolder"
              aria-label="整理到 Chrome 文件夹"
              class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-50"
            >
              <option value="" disabled>选择 Chrome 文件夹</option>
              <option v-for="folder in nativeFolders" :key="folder.id" :value="folder.id">{{ folder.path || folder.name }}</option>
            </select>
            <p v-else-if="activeBookmark.source" class="text-xs text-slate-600 break-words py-2">{{ activeBookmark.folder }}</p>
            <select
              v-else
              v-model="activeBookmark.folder"
              @change="persistChanges"
              class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option v-for="f in editableFolders" :key="f.id" :value="f.name">
                {{ f.name }}
              </option>
            </select>
          </div>

          <!-- 标签 -->
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5">标签</label>
            <div class="flex flex-wrap gap-1.5 mb-2">
              <span
                v-for="(t, idx) in activeBookmark.tags"
                :key="idx"
                class="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-lg flex items-center gap-1.5"
              >
                <span>#{{ t }}</span>
                <button @click="removeActiveTag(idx)" class="hover:text-indigo-900 cursor-pointer text-sm">×</button>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="newTagInput"
                @keydown.enter.prevent="addActiveTag"
                placeholder="输入标签，回车添加"
                class="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
              />
              <button
                @click="addActiveTag"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                添加标签
              </button>
            </div>
          </div>

          <!-- 笔记 -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold text-slate-600">笔记</label>
              <span class="text-[10px] text-slate-400">失焦自动保存</span>
            </div>
            <textarea
              v-model="activeBookmark.notes"
              @blur="persistChanges"
              rows="5"
              placeholder="记录笔记…"
              class="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            ></textarea>
          </div>
        </section>
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <FolderArchive class="w-12 h-12 text-slate-300 mb-3" />
        <p class="text-sm font-medium text-slate-600">选择书签查看详情</p>
      </div>
    </main>

    <!-- 模态框与灯箱 -->
    <CreateBookmarkModal
      :visible="showCreateModal"
      :folders="editableFolders"
      @close="showCreateModal = false"
      @create="handleCreateBookmark"
    />

    <FolderManageModal
      :visible="showFolderModal"
      :folders="editableFolders"
      @close="showFolderModal = false"
      @add-folder="handleAddFolder"
      @delete-folder="handleDeleteFolder"
    />

    <ServerSettingsModal
      :visible="showServerModal"
      :connected="isServerConnected"
      @close="showServerModal = false"
      @status-change="onServerStatusChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import {
  Camera, Plus, Folder, Search, List, Pin, ExternalLink, Trash2,
  RotateCw, Download, Upload, FolderArchive,
  Star, Image, Clock, Flame
} from 'lucide-vue-next';
import CreateBookmarkModal from '../components/CreateBookmarkModal.vue';
import FolderManageModal from '../components/FolderManageModal.vue';
import ServerSettingsModal from '../components/ServerSettingsModal.vue';
import {
  getStoredBookmarks, saveStoredBookmarks,
  getStoredFolders, saveStoredFolders,
  exportDataAsJson, importDataFromJson,
  showToast, confirmDialog, isChromeExtension
} from '../services/bookmarkStorage.js';
import { getServerConfig, fetchRemoteBookmarkUpdates, remoteAddBookmark, remoteDeleteBookmark } from '../services/shioriApi.js';
import { saveToShioriFolder, findNativeBookmarkMatches, moveNativeBookmark } from '../services/nativeBookmarkSync.js';
import { readChromeLibrary, normalizeRemoteBookmarks, mergeLibraryBookmarks, mergeRemoteBookmarks, reconcileRecords, mergeSourceFolders } from '../services/bookmarkLibrary.js';
import { captureBookmark } from '../services/bookmarkService.js';

const emit = defineEmits(['connection-state']);
defineExpose({ openServerSettings: () => { showServerModal.value = true; } });

const isExtEnv = computed(() => isChromeExtension());

const bookmarks = ref([]);
const folders = ref([]);
const serverConfig = ref({});
const showServerModal = ref(false);

const connectionState = ref('disconnected');
const isServerConnected = computed(() => connectionState.value === 'connected');
const editableFolders = computed(() => folders.value.filter(folder => !folder.source));
const nativeFolders = computed(() => folders.value.filter(folder => folder.source === 'chrome'));
const movingBookmark = ref(false);

function setConnectionState(state) {
  connectionState.value = state;
  emit('connection-state', state);
}

function onServerStatusChange(cfg) {
  serverConfig.value = cfg;
  refreshRemote();
}

const activeView = ref('all');
const selectedFolderFilter = ref('');
const selectedTagFilter = ref('');
const searchQuery = ref('');
const sortBy = ref('dateDesc');
const isCompactView = ref(false);

const isBatchMode = ref(false);
const selectedBatchIds = ref([]);

const selectedBookmarkId = ref(null);
const newTagInput = ref('');

// Modals
const showCreateModal = ref(false);
const showFolderModal = ref(false);
const snapshotUpdatingId = ref('');

const smartViews = computed(() => [
  { id: 'all', name: '全部书签', icon: FolderArchive, count: bookmarks.value.length },
  { id: 'pinned', name: '已置顶书签', icon: Star, count: bookmarks.value.filter(b => b.pinned).length },
  { id: 'withScreenshot', name: '有截图', icon: Image, count: bookmarks.value.filter(b => !!b.screenshot).length },
  { id: 'recent', name: '最近 7 天添加', icon: Clock, count: bookmarks.value.filter(b => Date.now() - (b.dateAdded || 0) < 7 * 86400000).length },
  { id: 'hot', name: '高频访问 (>20次)', icon: Flame, count: bookmarks.value.filter(b => (b.visits || 0) >= 20).length }
]);

const customFolders = computed(() => {
  return folders.value.filter(f => f.id !== 'all');
});

const allUniqueTags = computed(() => {
  const set = new Set();
  bookmarks.value.forEach(b => {
    b.tags?.forEach(t => set.add(t));
  });
  return Array.from(set);
});

const activeBookmark = computed(() => {
  return bookmarks.value.find(b => b.id === selectedBookmarkId.value) || bookmarks.value[0];
});

function isInFolder(bookmark, folder) {
  return bookmark.folderId === folder.id || bookmark.ancestorIds?.includes(folder.id) ||
    (!folder.source && bookmark.folder === folder.name);
}

function getFolderBookmarkCount(folder) {
  return bookmarks.value.filter(b => isInFolder(b, folder)).length;
}

function selectFolder(folderName) {
  if (selectedFolderFilter.value === folderName) {
    selectedFolderFilter.value = '';
  } else {
    selectedFolderFilter.value = folderName;
    activeView.value = 'all';
  }
}

function toggleTagFilter(tag) {
  if (selectedTagFilter.value === tag) {
    selectedTagFilter.value = '';
  } else {
    selectedTagFilter.value = tag;
  }
}

const filteredList = computed(() => {
  let list = [...bookmarks.value];

  // 1. 智能视图
  if (activeView.value === 'pinned') {
    list = list.filter(b => b.pinned);
  } else if (activeView.value === 'withScreenshot') {
    list = list.filter(b => !!b.screenshot);
  } else if (activeView.value === 'recent') {
    list = list.filter(b => Date.now() - (b.dateAdded || 0) < 7 * 86400000);
  } else if (activeView.value === 'hot') {
    list = list.filter(b => (b.visits || 0) >= 20);
  }

  // 2. 文件夹过滤
  if (selectedFolderFilter.value) {
    const folder = folders.value.find(f => f.id === selectedFolderFilter.value);
    list = folder ? list.filter(b => isInFolder(b, folder)) : list;
  }

  // 3. 标签过滤
  if (selectedTagFilter.value) {
    list = list.filter(b => b.tags?.includes(selectedTagFilter.value));
  }

  // 4. 关键字搜索
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      b.domain.toLowerCase().includes(q) ||
      (b.notes && b.notes.toLowerCase().includes(q)) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // 5. 排序规则
  list.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sortBy.value === 'visits') return (b.visits || 0) - (a.visits || 0);
    if (sortBy.value === 'dateAsc') return (a.dateAdded || 0) - (b.dateAdded || 0);
    if (sortBy.value === 'title') return a.title.localeCompare(b.title);
    return (b.dateAdded || 0) - (a.dateAdded || 0);
  });

  return list;
});

function selectBookmark(id) {
  selectedBookmarkId.value = id;
}

async function persistChanges() {
  await saveStoredBookmarks(bookmarks.value);
}

function togglePin(id) {
  const bm = bookmarks.value.find(b => b.id === id);
  if (bm) {
    bm.pinned = !bm.pinned;
    persistChanges();
    showToast(bm.pinned ? '已将该书签置顶' : '已取消置顶');
  }
}

async function deleteSingle(id) {
  const ok = await confirmDialog('确定要删除此书签吗？', '对应的 Chrome 本机书签也会删除，此操作无法撤销');
  if (ok) {
    const target = bookmarks.value.find(b => b.id === id);
    try {
      await deleteAtSource(target);
    } catch (error) {
      showToast(error.message || '删除失败', 'error');
      return;
    }
    bookmarks.value = bookmarks.value.filter(b => b.id !== id);
    try { await persistChanges(); }
    catch (error) { showToast(`来源已删除，但本地缓存保存失败：${error.message}`, 'error'); return; }
    if (selectedBookmarkId.value === id) {
      selectedBookmarkId.value = bookmarks.value[0]?.id || null;
    }

    showToast('书签已删除');
  }
}

async function deleteAtSource(target) {
  if (!target) return;
  if (target.source === 'chrome' && !isExtEnv.value) throw new Error('请在 Chrome 扩展中删除原生书签');
  const native = await selectNativeMatch(target);
  let remoteDeleted = false;
  if (target.source === 'remote') {
    if (target.server !== serverConfig.value.server?.replace(/\/+$/, '')) throw new Error('远程服务配置已改变');
    const result = await remoteDeleteBookmark(target.url);
    if (!result.success) throw new Error(result.error || result.data?.msg || '远程删除失败');
    remoteDeleted = true;
  }
  if (native) {
    try { await chrome.bookmarks.remove(native.id); }
    catch (error) { throw new Error(`${remoteDeleted ? '远程已删除，但 Chrome 删除失败：' : 'Chrome 删除失败：'}${error.message}`); }
    await refreshChrome();
  }
}

async function selectNativeMatch(bookmark) {
  const matches = await findNativeBookmarkMatches(bookmark);
  if (matches.length <= 1) return matches[0] || null;
  const choices = Object.fromEntries(matches.map(match => [match.id,
    `${nativeFolders.value.find(folder => folder.id === `chrome:${match.parentId}`)?.path || match.parentId} / ${match.title || match.url}`]));
  const result = await Swal.fire({ title: '选择对应的本机书签', text: '同一网址存在多个副本，本次只操作所选项',
    input: 'select', inputOptions: choices, showCancelButton: true, confirmButtonText: '确定', cancelButtonText: '取消' });
  if (!result.isConfirmed) throw new Error('已取消操作');
  return matches.find(match => match.id === result.value);
}

async function moveActiveToFolder(event) {
  const bookmark = activeBookmark.value;
  const oldValue = bookmark.source === 'chrome' ? bookmark.folderId : bookmark.nativeFolderId || '';
  const folder = nativeFolders.value.find(item => item.id === event.target.value);
  if (!folder || movingBookmark.value) return;
  movingBookmark.value = true;
  try {
    const native = await selectNativeMatch(bookmark);
    const moved = await moveNativeBookmark(native, folder, bookmark);
    await refreshChrome();
    const current = bookmarks.value.find(item => item.id === bookmark.id);
    if (current) {
      current.nativeId = moved.id;
      current.nativeFolderId = folder.id;
      if (!current.source) {
        current.folderId = folder.id;
        current.folder = folder.path || folder.name;
        current.ancestorIds = [];
        let ancestor = folder;
        while (ancestor) {
          current.ancestorIds.unshift(ancestor.id);
          ancestor = nativeFolders.value.find(item => item.id === ancestor.parentId);
        }
      }
    }
    await persistChanges();
    showToast('Chrome 本机书签已移动');
  } catch (error) {
    event.target.value = oldValue;
    await refreshChrome();
    showToast(error.message || '整理失败', 'error');
  } finally {
    movingBookmark.value = false;
  }
}

function recordVisit(id) {
  const bm = bookmarks.value.find(b => b.id === id);
  if (bm) {
    bm.visits = (bm.visits || 0) + 1;
    persistChanges();
  }
}

async function updateSnapshot(bm) {
  if (snapshotUpdatingId.value) return;
  snapshotUpdatingId.value = bm.id;
  let target;
  let previous;
  try {
    const screenshot = await captureBookmark(bm.url);
    // Returning to the workspace can refresh source data, replacing the original object.
    target = bookmarks.value.find(bookmark => bookmark.id === bm.id);
    if (!target) throw new Error('书签已不存在，截图未保存');
    previous = target.screenshot;
    target.screenshot = screenshot;
    await persistChanges();
    showToast('真实网页截图已保存');
  } catch (error) {
    if (target) target.screenshot = previous;
    showToast(error.message || '截图失败，原快照未修改', 'error');
  } finally {
    snapshotUpdatingId.value = '';
  }
}

function addActiveTag() {
  const tag = newTagInput.value.trim().replace(/^#/, '');
  if (tag && activeBookmark.value) {
    if (!activeBookmark.value.tags) activeBookmark.value.tags = [];
    if (!activeBookmark.value.tags.includes(tag)) {
      activeBookmark.value.tags.push(tag);
      persistChanges();
      showToast('标签添加成功');
    }
    newTagInput.value = '';
  }
}

function removeActiveTag(idx) {
  if (activeBookmark.value && activeBookmark.value.tags) {
    activeBookmark.value.tags.splice(idx, 1);
    persistChanges();
  }
}

// 批量操作
function toggleBatchMode() {
  isBatchMode.value = !isBatchMode.value;
  selectedBatchIds.value = [];
}

const isAllSelected = computed(() => {
  return filteredList.value.length > 0 && selectedBatchIds.value.length === filteredList.value.length;
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedBatchIds.value = [];
  } else {
    selectedBatchIds.value = filteredList.value.map(b => b.id);
  }
}

async function batchDelete() {
  const ok = await confirmDialog(`确定删除选中的 ${selectedBatchIds.value.length} 个书签吗？`, '对应的 Chrome 本机书签也会删除，此操作无法撤销');
  if (ok) {
    const targets = bookmarks.value.filter(b => selectedBatchIds.value.includes(b.id));
    const deleted = [];
    for (const target of targets) {
      try {
        await deleteAtSource(target);
        deleted.push(target.id);
      } catch (error) {
        showToast(error.message || '部分书签删除失败', 'error');
        break;
      }
    }
    bookmarks.value = bookmarks.value.filter(b => !deleted.includes(b.id));
    await persistChanges();

    selectedBatchIds.value = [];
    isBatchMode.value = false;
    if (deleted.length === targets.length) showToast('批量删除成功');
  }
}

// 增删文件夹
function handleAddFolder(newFolder) {
  folders.value.push(newFolder);
  saveStoredFolders(folders.value);
}

function handleDeleteFolder(id) {
  folders.value = folders.value.filter(f => f.id !== id);
  saveStoredFolders(folders.value);
}

async function handleCreateBookmark(newBm) {
  bookmarks.value.unshift(newBm);
  persistChanges();
  selectedBookmarkId.value = newBm.id;

  // 同步保存至本地原生 Shiori 文件夹
  await saveToShioriFolder(newBm.url, newBm.title);

  // 同步保存至远程自建服务
  if (isServerConnected.value) {
    await remoteAddBookmark({
      url: newBm.url,
      title: newBm.title,
      tags: newBm.tags,
      imgbase64: newBm.screenshot
    });
    await refreshRemote();
  }
}

// 导出与导入
function exportData() {
  exportDataAsJson({ bookmarks: bookmarks.value, folders: folders.value });
  showToast('备份文件已开始下载');
}

function handleImportFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const content = evt.target.result;
    const res = await importDataFromJson(content);
    if (res.success) {
      bookmarks.value = await getStoredBookmarks();
      folders.value = await getStoredFolders();
      await Promise.all([refreshChrome(), refreshRemote()]);
      showToast(`成功恢复 ${res.count} 个书签！`);
    } else {
      showToast(`导入失败: ${res.error}`, 'error');
    }
  };
  reader.readAsText(file);
}

let remoteGeneration = 0;
let chromeGeneration = 0;
let disposed = false;
let refreshTimer;
let chromeRefreshTimer;
let pendingRemote = null;

function scheduleChromeRefresh() {
  clearTimeout(chromeRefreshTimer);
  chromeRefreshTimer = setTimeout(refreshChrome, 150);
}

async function refreshChrome() {
  const generation = ++chromeGeneration;
  try {
    const library = await readChromeLibrary();
    if (disposed || generation !== chromeGeneration) return;
    if (!isChromeExtension()) return;
    bookmarks.value = reconcileRecords(bookmarks.value, mergeLibraryBookmarks(bookmarks.value, [
      ...bookmarks.value.filter(b => b.source === 'remote'), ...library.bookmarks
    ]));
    folders.value = mergeSourceFolders(folders.value, library.folders, 'chrome');
  } catch (error) {
    console.warn('Chrome bookmarks could not be loaded:', error);
  }
}

function refreshRemote() {
  const key = JSON.stringify([serverConfig.value.server, serverConfig.value.token]);
  if (pendingRemote?.key === key) return pendingRemote.promise;
  const promise = loadRemote().finally(() => {
    if (pendingRemote?.promise === promise) pendingRemote = null;
  });
  pendingRemote = { key, promise };
  return promise;
}

async function loadRemote() {
  const generation = ++remoteGeneration;
  const config = { ...serverConfig.value };
  if (!config.server || !config.token) {
    bookmarks.value = reconcileRecords(bookmarks.value, bookmarks.value.filter(b => b.source !== 'remote'));
    folders.value = reconcileRecords(folders.value, folders.value.filter(f => f.source !== 'remote'));
    setConnectionState('disconnected');
    return;
  }
  setConnectionState('connecting');
  const server = config.server.replace(/\/+$/, '');
  bookmarks.value = reconcileRecords(bookmarks.value, bookmarks.value.filter(b => b.source !== 'remote' || b.server === server));
  folders.value = reconcileRecords(folders.value, folders.value.filter(f => f.source !== 'remote' || f.id === `remote:${server}`));
  try {
    const cached = bookmarks.value.filter(b => b.source === 'remote' && b.server === server);
    const { bookmarks: records, complete } = await fetchRemoteBookmarkUpdates(config, cached);
    if (disposed || generation !== remoteGeneration) return;
    bookmarks.value = reconcileRecords(bookmarks.value, mergeLibraryBookmarks(bookmarks.value, [
      ...bookmarks.value.filter(b => b.source === 'chrome'),
      ...mergeRemoteBookmarks(cached, normalizeRemoteBookmarks(records, server), complete)
    ]));
    folders.value = mergeSourceFolders(folders.value,
      [{ id: `remote:${server}`, name: '远程书签', source: 'remote', depth: 0 }], 'remote');
    setConnectionState('connected');
    // Cache successful reads so reopening the workspace can stop at a known page.
    try {
      await persistChanges();
      await saveStoredFolders(folders.value);
    } catch (error) {
      console.warn('Remote bookmarks could not be cached:', error);
    }
  } catch {
    if (!disposed && generation === remoteGeneration) setConnectionState('disconnected');
  }
}

async function reloadConfig() {
  serverConfig.value = await getServerConfig();
  if (!disposed) await refreshRemote();
}

function onStorageChanged(changes, area) {
  if (area === 'local' && ['cutbookmark_shiori_config_v2', 'server', 'token', 'username'].some(key => key in changes)) reloadConfig();
}

onMounted(async () => {
  bookmarks.value = await getStoredBookmarks();
  folders.value = await getStoredFolders();
  serverConfig.value = await getServerConfig();
  if (bookmarks.value.length > 0) {
    selectedBookmarkId.value = bookmarks.value[0].id;
  }
  if (disposed) return;
  if (isChromeExtension()) {
    for (const event of ['onCreated', 'onRemoved', 'onChanged', 'onMoved', 'onChildrenReordered', 'onImportEnded']) {
      chrome.bookmarks[event]?.addListener(scheduleChromeRefresh);
    }
    chrome.storage.onChanged?.addListener(onStorageChanged);
  }
  window.addEventListener('focus', reloadConfig);
  refreshTimer = window.setInterval(reloadConfig, 60000);
  await Promise.all([refreshChrome(), refreshRemote()]);
});

onUnmounted(() => {
  disposed = true;
  clearInterval(refreshTimer);
  clearTimeout(chromeRefreshTimer);
  window.removeEventListener('focus', reloadConfig);
  if (isChromeExtension()) {
    for (const event of ['onCreated', 'onRemoved', 'onChanged', 'onMoved', 'onChildrenReordered', 'onImportEnded']) {
      chrome.bookmarks[event]?.removeListener(scheduleChromeRefresh);
    }
    chrome.storage.onChanged?.removeListener(onStorageChanged);
  }
});
</script>
