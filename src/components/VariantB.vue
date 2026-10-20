<template>
  <div class="h-[90vh] flex bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden my-4">
    <!-- Column 1: Left Navigation Sidebar -->
    <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      <!-- Brand -->
      <div class="p-5 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/50">
            <Bookmark class="w-4 h-4" />
          </div>
          <div>
            <h1 class="text-sm font-bold text-white tracking-tight">截屏书签工作台</h1>
            <p class="text-[10px] text-slate-400">Variant B · 三栏系统</p>
          </div>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="px-4 py-3 bg-slate-800/40 border-b border-slate-800/80 grid grid-cols-2 gap-2 text-center text-xs">
        <div class="p-2 rounded-xl bg-slate-800/60">
          <span class="text-[10px] text-slate-400 block">书签总量</span>
          <span class="text-base font-bold text-indigo-400">{{ bookmarks.length }}</span>
        </div>
        <div class="p-2 rounded-xl bg-slate-800/60">
          <span class="text-[10px] text-slate-400 block">分类目录</span>
          <span class="text-base font-bold text-slate-200">{{ folders.length }}</span>
        </div>
      </div>

      <!-- Folders & Quick Filters -->
      <div class="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <div>
          <div class="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>书签目录导航</span>
          </div>
          <nav class="space-y-1">
            <button
              v-for="folder in folders"
              :key="folder.id"
              @click="activeFolderId = folder.id"
              class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
              :class="activeFolderId === folder.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              <div class="flex items-center space-x-2 truncate">
                <Folder class="w-3.5 h-3.5 shrink-0" />
                <span class="truncate">{{ folder.name }}</span>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded-full"
                :class="activeFolderId === folder.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'"
              >
                {{ getFolderCount(folder.id, folder.name) }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tags filter cloud -->
        <div>
          <div class="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>标签快速筛选</span>
          </div>
          <div class="flex flex-wrap gap-1 px-1">
            <button
              v-for="tag in allUniqueTags"
              :key="tag"
              @click="toggleTagFilter(tag)"
              class="text-[11px] px-2 py-0.5 rounded-lg border transition cursor-pointer"
              :class="selectedTagFilter === tag ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'"
            >
              #{{ tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Status -->
      <div class="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>支持批量整理与拖拽</span>
        <span class="text-indigo-400">已启用索引</span>
      </div>
    </aside>

    <!-- Column 2: Middle Bookmarks Master List -->
    <section class="w-96 flex flex-col border-r border-slate-200 bg-slate-50/70 shrink-0">
      <!-- Search & Sorting Header -->
      <div class="p-4 border-b border-slate-200 bg-white space-y-3">
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索书签标题、URL 或标签..."
            class="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500">
          <div class="flex items-center space-x-1.5">
            <span>排序:</span>
            <select
              v-model="sortBy"
              class="text-xs bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="dateAdded">按添加时间</option>
              <option value="visits">按访问频次</option>
              <option value="title">按标题拼音</option>
            </select>
          </div>

          <div class="flex items-center space-x-1">
            <button
              @click="isCompactView = !isCompactView"
              class="p-1 rounded hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              :title="isCompactView ? '切换为图文详细视图' : '切换为紧凑列表视图'"
            >
              <List class="w-4 h-4" :class="{ 'text-indigo-600': isCompactView }" />
            </button>
          </div>
        </div>
      </div>

      <!-- Scrollable List Items -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div
          v-for="bm in filteredList"
          :key="bm.id"
          @click="selectedBookmarkId = bm.id"
          class="p-3 rounded-2xl border transition cursor-pointer flex gap-3 group relative"
          :class="selectedBookmarkId === bm.id ? 'bg-indigo-50/80 border-indigo-300 shadow-sm' : 'bg-white border-slate-200/80 hover:border-slate-300'"
        >
          <!-- Thumbnail -->
          <div
            v-if="!isCompactView"
            class="w-16 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative"
          >
            <img :src="bm.screenshot" class="w-full h-full object-cover group-hover:scale-105 transition" />
            <div
              v-if="bm.pinned"
              class="absolute top-1 left-1 w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center shadow-xs"
            >
              <Pin class="w-2.5 h-2.5" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <h3 class="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate transition">
                {{ bm.title }}
              </h3>
            </div>
            <p class="text-[11px] text-slate-400 font-mono truncate mt-0.5">{{ bm.domain }}</p>

            <div class="flex items-center gap-1 mt-2 flex-wrap">
              <span
                v-for="tag in bm.tags?.slice(0, 2)"
                :key="tag"
                class="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200"
              >
                #{{ tag }}
              </span>
              <span v-if="bm.tags?.length > 2" class="text-[9px] text-slate-400">+{{ bm.tags.length - 2 }}</span>
            </div>
          </div>
        </div>

        <div v-if="filteredList.length === 0" class="text-center py-12 text-slate-400 text-xs">
          没有找到匹配的书签
        </div>
      </div>
    </section>

    <!-- Column 3: Right Inspector Detail Panel -->
    <main class="flex-1 flex flex-col bg-slate-50/30 overflow-y-auto">
      <div v-if="activeBookmark" class="p-6 max-w-2xl mx-auto w-full space-y-6">
        <!-- Inspector Header -->
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              {{ activeBookmark.folder }}
            </span>
            <h2 class="text-lg font-bold text-slate-900 mt-2 leading-snug">
              {{ activeBookmark.title }}
            </h2>
            <a
              :href="activeBookmark.url"
              target="_blank"
              class="text-xs text-indigo-600 hover:underline flex items-center space-x-1 mt-1 truncate"
            >
              <ExternalLink class="w-3 h-3" />
              <span class="truncate">{{ activeBookmark.url }}</span>
            </a>
          </div>

          <div class="flex items-center space-x-2 shrink-0">
            <button
              @click="togglePin(activeBookmark.id)"
              class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
              :class="activeBookmark.pinned ? 'text-amber-500 border-amber-300' : 'text-slate-400'"
              title="置顶书签"
            >
              <Pin class="w-4 h-4" />
            </button>
            <button
              @click="handleDelete(activeBookmark.id)"
              class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title="删除书签"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Big Screenshot Preview Card -->
        <div class="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div class="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span class="font-medium flex items-center space-x-1.5">
              <Camera class="w-3.5 h-3.5 text-indigo-600" />
              <span>网页快照存档 (高保真)</span>
            </span>
            <button
              @click="previewBigSnapshot(activeBookmark.screenshot, activeBookmark.title)"
              class="text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1 cursor-pointer"
            >
              <Maximize2 class="w-3.5 h-3.5" />
              <span>灯箱放大预览</span>
            </button>
          </div>
          <div class="relative bg-slate-100 max-h-72 overflow-hidden flex items-center justify-center">
            <img :src="activeBookmark.screenshot" class="w-full object-cover" />
          </div>
        </div>

        <!-- Metadata & Notes Editor -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-xs">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5">标签体系</label>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in activeBookmark.tags"
                :key="tag"
                class="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-lg flex items-center space-x-1"
              >
                <span>#{{ tag }}</span>
              </span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5">研究笔记 / 快速备注</label>
            <textarea
              v-model="activeBookmark.notes"
              rows="3"
              placeholder="在此记录对此网站的要点分析、参考价值或备忘..."
              class="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div class="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
            <span>首次归档：{{ new Date(activeBookmark.dateAdded).toLocaleDateString() }}</span>
            <span>已累计访问 {{ activeBookmark.visits || 0 }} 次</span>
          </div>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <Bookmark class="w-12 h-12 text-slate-200 mb-2" />
        <p class="text-sm">在中间列表中选择任意书签查看详情与快照</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Bookmark, Folder, Search, List, Pin, Camera, Maximize2, ExternalLink, Trash2
} from 'lucide-vue-next';
import { INITIAL_FOLDERS } from '../data/mockBookmarks.js';
import { toastSuccess } from '../services/bookmarkService.js';

const props = defineProps({
  bookmarks: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add', 'delete', 'preview', 'update']);

const folders = ref([...INITIAL_FOLDERS]);
const activeFolderId = ref('all');
const selectedTagFilter = ref('');
const searchQuery = ref('');
const sortBy = ref('dateAdded');
const isCompactView = ref(false);

const selectedBookmarkId = ref(props.bookmarks[0]?.id || null);

const activeBookmark = computed(() => {
  return props.bookmarks.find(b => b.id === selectedBookmarkId.value) || props.bookmarks[0];
});

const allUniqueTags = computed(() => {
  const set = new Set();
  props.bookmarks.forEach(b => {
    b.tags?.forEach(t => set.add(t));
  });
  return Array.from(set);
});

function getFolderCount(folderId, folderName) {
  if (folderId === 'all') return props.bookmarks.length;
  return props.bookmarks.filter(b => b.folder === folderName).length;
}

function toggleTagFilter(tag) {
  if (selectedTagFilter.value === tag) {
    selectedTagFilter.value = '';
  } else {
    selectedTagFilter.value = tag;
  }
}

const filteredList = computed(() => {
  let list = [...props.bookmarks];

  // 文件夹过滤
  if (activeFolderId.value !== 'all') {
    const fObj = folders.value.find(f => f.id === activeFolderId.value);
    if (fObj) {
      list = list.filter(b => b.folder === fObj.name);
    }
  }

  // 标签过滤
  if (selectedTagFilter.value) {
    list = list.filter(b => b.tags?.includes(selectedTagFilter.value));
  }

  // 关键字搜索
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // 排序
  list.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sortBy.value === 'visits') return (b.visits || 0) - (a.visits || 0);
    if (sortBy.value === 'title') return a.title.localeCompare(b.title);
    return (b.dateAdded || 0) - (a.dateAdded || 0);
  });

  return list;
});

function togglePin(id) {
  const bm = props.bookmarks.find(b => b.id === id);
  if (bm) {
    bm.pinned = !bm.pinned;
    toastSuccess(bm.pinned ? '已将书签置顶' : '已取消置顶');
  }
}

function handleDelete(id) {
  emit('delete', id);
  if (selectedBookmarkId.value === id) {
    selectedBookmarkId.value = props.bookmarks.find(b => b.id !== id)?.id || null;
  }
  toastSuccess('已移除该书签');
}

function previewBigSnapshot(imgUrl, title) {
  emit('preview', { screenshot: imgUrl, title });
}
</script>
