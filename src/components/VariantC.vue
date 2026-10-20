<template>
  <div class="space-y-6 my-4">
    <!-- Top Gallery Control & Toolbar -->
    <div class="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <LayoutGrid class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h2 class="text-base font-bold text-slate-900 tracking-tight">视觉画廊与灵感看板</h2>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
              Variant C
            </span>
          </div>
          <p class="text-xs text-slate-500">以视觉快照为核心，适合灵感收集与跨维度浏览</p>
        </div>
      </div>

      <!-- View Switcher & Size Control -->
      <div class="flex items-center flex-wrap gap-3">
        <!-- View Mode: Gallery vs Kanban -->
        <div class="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            @click="viewMode = 'grid'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            :class="viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'"
          >
            <Grid class="w-3.5 h-3.5" />
            <span>瀑布流画廊</span>
          </button>
          <button
            @click="viewMode = 'kanban'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            :class="viewMode === 'kanban' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'"
          >
            <Columns3 class="w-3.5 h-3.5" />
            <span>分类泳道看板</span>
          </button>
        </div>

        <!-- Card Size Zoom (Only for Grid mode) -->
        <div v-if="viewMode === 'grid'" class="hidden sm:flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600">
          <ZoomIn class="w-3.5 h-3.5 text-slate-400" />
          <span>卡片尺度:</span>
          <select
            v-model="gridCols"
            class="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
          >
            <option :value="2">大图聚焦 (2列)</option>
            <option :value="3">标准画廊 (3列)</option>
            <option :value="4">高密网格 (4列)</option>
          </select>
        </div>

        <!-- Search Bar -->
        <div class="relative w-48">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索画廊..."
            class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    <!-- Mode 1: Visual Grid Gallery -->
    <div
      v-if="viewMode === 'grid'"
      class="grid gap-6"
      :class="{
        'grid-cols-1 md:grid-cols-2': gridCols === 2,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': gridCols === 3,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': gridCols === 4,
      }"
    >
      <div
        v-for="bm in filteredBookmarks"
        :key="bm.id"
        class="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all duration-300 relative"
      >
        <!-- Screenshot Banner -->
        <div class="relative overflow-hidden bg-slate-100 aspect-16/10 cursor-pointer" @click="previewBigSnapshot(bm.screenshot, bm.title)">
          <img
            :src="bm.screenshot"
            :alt="bm.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <!-- Floating Badges -->
          <div class="absolute top-3 left-3 flex items-center space-x-1.5">
            <span
              v-if="bm.pinned"
              class="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30"
              title="置顶书签"
            >
              <Pin class="w-3.5 h-3.5" />
            </span>
            <span class="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
              {{ bm.folder?.split('/')[1] || bm.folder }}
            </span>
          </div>

          <!-- Color Accent Pill -->
          <div
            v-if="bm.color"
            class="absolute top-3 right-3 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
            :style="{ backgroundColor: bm.color }"
            :title="`网站色系: ${bm.color}`"
          />

          <!-- Hover Overlay Actions -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition flex items-center justify-center space-x-2">
            <button
              @click.stop="previewBigSnapshot(bm.screenshot, bm.title)"
              class="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg transition cursor-pointer active:scale-95"
            >
              <Maximize2 class="w-3.5 h-3.5 text-indigo-600" />
              <span>高清预览</span>
            </button>
            <a
              :href="bm.url"
              target="_blank"
              @click.stop
              class="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-xl shadow-lg transition cursor-pointer active:scale-95"
              title="访问原网址"
            >
              <ExternalLink class="w-4 h-4 text-indigo-600" />
            </a>
          </div>
        </div>

        <!-- Card Footer Info -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1 transition">
              {{ bm.title }}
            </h3>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{{ bm.domain }}</p>
            <p v-if="bm.notes" class="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {{ bm.notes }}
            </p>
          </div>

          <!-- Tags & Actions -->
          <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div class="flex items-center gap-1 flex-wrap">
              <span
                v-for="tag in bm.tags?.slice(0, 3)"
                :key="tag"
                class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                #{{ tag }}
              </span>
            </div>

            <button
              @click.stop="deleteBookmark(bm.id)"
              class="text-slate-300 hover:text-rose-500 p-1 rounded transition cursor-pointer"
              title="删除"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mode 2: Kanban Board Swimlanes -->
    <div v-else class="flex gap-5 overflow-x-auto pb-4">
      <div
        v-for="folder in kanbanColumns"
        :key="folder.name"
        class="w-80 shrink-0 bg-slate-200/60 rounded-3xl p-4 flex flex-col max-h-[75vh]"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-300/60">
          <div class="flex items-center space-x-2">
            <Folder class="w-4 h-4 text-indigo-600" />
            <h3 class="text-xs font-bold text-slate-800 truncate">{{ folder.name }}</h3>
          </div>
          <span class="text-xs font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full">
            {{ folder.items.length }}
          </span>
        </div>

        <!-- Column Cards -->
        <div class="flex-1 overflow-y-auto space-y-3 pr-1">
          <div
            v-for="bm in folder.items"
            :key="bm.id"
            class="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-2 hover:shadow-md transition"
          >
            <div class="h-28 rounded-xl overflow-hidden bg-slate-100 cursor-pointer relative" @click="previewBigSnapshot(bm.screenshot, bm.title)">
              <img :src="bm.screenshot" class="w-full h-full object-cover" />
            </div>
            <h4 class="text-xs font-bold text-slate-800 line-clamp-1">{{ bm.title }}</h4>
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="font-mono truncate">{{ bm.domain }}</span>
              <a :href="bm.url" target="_blank" class="text-indigo-600 hover:underline">访问</a>
            </div>
          </div>

          <div v-if="folder.items.length === 0" class="text-center py-8 text-slate-400 text-xs">
            此分类暂无书签
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  LayoutGrid, Grid, Columns3, ZoomIn, Search, Pin, Maximize2, ExternalLink, Trash2, Folder
} from 'lucide-vue-next';
import { toastSuccess } from '../services/bookmarkService.js';

const props = defineProps({
  bookmarks: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add', 'delete', 'preview']);

const viewMode = ref('grid');
const gridCols = ref(3);
const searchQuery = ref('');

const filteredBookmarks = computed(() => {
  if (!searchQuery.value.trim()) return props.bookmarks;
  const q = searchQuery.value.toLowerCase();
  return props.bookmarks.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.url.toLowerCase().includes(q) ||
    (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
  );
});

const kanbanColumns = computed(() => {
  const folders = [
    '前端技术/Vue生态',
    '前端技术/样式设计',
    '开源项目/构建工具',
    '设计灵感/UI界面',
    '社区资讯/技术论坛'
  ];
  return folders.map(fName => {
    return {
      name: fName,
      items: filteredBookmarks.value.filter(b => b.folder === fName)
    };
  });
});

function deleteBookmark(id) {
  emit('delete', id);
  toastSuccess('已移除该书签');
}

function previewBigSnapshot(imgUrl, title) {
  emit('preview', { screenshot: imgUrl, title });
}
</script>
