<template>
  <div class="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
    <!-- Main Floating Card Container -->
    <div class="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 overflow-hidden flex flex-col">
      <!-- Top Brand & Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <Camera class="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-base font-bold tracking-tight">截屏书签 · 快照模式</h2>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-medium">Variant A</span>
            </div>
            <p class="text-xs text-indigo-100/80">专注即时网页快照与快捷归类</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="triggerCapture"
            :disabled="capturing"
            class="px-3 py-1.5 text-xs font-semibold bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95 rounded-xl flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
          >
            <Camera class="w-3.5 h-3.5" :class="{ 'animate-pulse text-indigo-500': capturing }" />
            <span>{{ capturing ? '正在截屏...' : '重新截屏' }}</span>
          </button>
        </div>
      </div>

      <!-- Current Page Snapshot Preview Box -->
      <div class="p-6 border-b border-slate-100 bg-slate-50/50">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>当前页面捕获快照</span>
          <span class="text-[11px] text-indigo-600 font-normal">自动识别网页元数据</span>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <!-- Page Info -->
          <div class="flex items-start space-x-3">
            <div class="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
              <Globe class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <input
                v-model="currentPage.title"
                class="w-full text-sm font-semibold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition py-0.5"
                placeholder="书签标题"
              />
              <p class="text-xs text-slate-400 truncate mt-0.5 font-mono">{{ currentPage.url }}</p>
            </div>
          </div>

          <!-- Screenshot Preview Strip -->
          <div class="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 h-36">
            <img
              :src="currentScreenshot"
              alt="页面快照"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-3">
              <span class="text-white text-xs font-medium flex items-center space-x-1.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-400" />
                <span>高清视口已就绪 (1280x800)</span>
              </span>
              <button
                @click="previewBigSnapshot(currentScreenshot, currentPage.title)"
                class="px-2 py-1 text-[11px] bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-xs flex items-center space-x-1 transition cursor-pointer"
              >
                <Maximize2 class="w-3 h-3" />
                <span>放大</span>
              </button>
            </div>
          </div>

          <!-- Tags & Category Quick Assignment -->
          <div class="space-y-2 pt-1">
            <div class="flex items-center space-x-2">
              <Folder class="w-3.5 h-3.5 text-slate-400" />
              <select
                v-model="selectedFolder"
                class="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-1"
              >
                <option value="前端技术/Vue生态">📂 前端技术 / Vue生态</option>
                <option value="前端技术/样式设计">📂 前端技术 / 样式设计</option>
                <option value="开源项目/构建工具">📂 开源项目 / 构建工具</option>
                <option value="设计灵感/UI界面">📂 设计灵感 / UI界面</option>
                <option value="未分类书签">📂 常用收集箱 (默认)</option>
              </select>
            </div>

            <!-- Quick Tags -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <Tag class="w-3.5 h-3.5 text-slate-400 mr-1" />
              <span
                v-for="tag in quickTags"
                :key="tag"
                @click="toggleTag(tag)"
                class="text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition border"
                :class="selectedTags.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Save Button -->
          <button
            @click="saveCurrentBookmark"
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-medium text-xs rounded-xl flex items-center justify-center space-x-2 shadow-sm shadow-indigo-300 transition cursor-pointer"
          >
            <BookmarkCheck class="w-4 h-4" />
            <span>保存截屏书签 (Cmd + S)</span>
          </button>
        </div>
      </div>

      <!-- Quick Search & Recent Bookmarks -->
      <div class="p-6 flex-1 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock class="w-3.5 h-3.5" />
            <span>最近已存快照 ({{ filteredBookmarks.length }})</span>
          </div>

          <!-- Filter Search -->
          <div class="relative w-48">
            <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索标题 / 标签..."
              class="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <!-- Recent List -->
        <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
          <div
            v-for="bm in filteredBookmarks"
            :key="bm.id"
            class="p-2.5 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition flex items-center justify-between group"
          >
            <div class="flex items-center space-x-3 min-w-0 pr-2">
              <div
                @click="previewBigSnapshot(bm.screenshot, bm.title)"
                class="w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-200 cursor-pointer relative group/thumb"
              >
                <img :src="bm.screenshot" class="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-300" />
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition">
                  <Eye class="w-3 h-3 text-white" />
                </div>
              </div>

              <div class="min-w-0">
                <a
                  :href="bm.url"
                  target="_blank"
                  class="text-xs font-semibold text-slate-800 hover:text-indigo-600 truncate block transition"
                >
                  {{ bm.title }}
                </a>
                <div class="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400">
                  <span class="truncate">{{ bm.domain }}</span>
                  <span>•</span>
                  <span class="text-indigo-600 font-medium">{{ bm.folder }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
              <a
                :href="bm.url"
                target="_blank"
                class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                title="打开网页"
              >
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
              <button
                @click="deleteBookmark(bm.id)"
                class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                title="删除"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Camera, Globe, CheckCircle2, Maximize2, Folder, Tag, BookmarkCheck,
  Clock, Search, Eye, ExternalLink, Trash2
} from 'lucide-vue-next';
import { toastSuccess } from '../services/bookmarkService.js';

const props = defineProps({
  bookmarks: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add', 'delete', 'preview']);

const capturing = ref(false);
const searchQuery = ref('');
const selectedFolder = ref('前端技术/Vue生态');
const selectedTags = ref(['Vue3', '前端开发']);
const quickTags = ['Vue3', '前端开发', 'UI设计', '灵感', '工具', '参考'];

const currentPage = ref({
  title: 'Vue 3 组合式 API 核心设计与响应式系统详解',
  url: 'https://cn.vuejs.org/guide/extras/composition-api-faq.html',
  domain: 'cn.vuejs.org'
});

const currentScreenshot = ref('https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80');

const filteredBookmarks = computed(() => {
  if (!searchQuery.value.trim()) return props.bookmarks;
  const q = searchQuery.value.toLowerCase();
  return props.bookmarks.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.url.toLowerCase().includes(q) ||
    (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
  );
});

function toggleTag(tag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
}

function triggerCapture() {
  capturing.value = true;
  setTimeout(() => {
    const list = [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80'
    ];
    currentScreenshot.value = list[Math.floor(Math.random() * list.length)];
    capturing.value = false;
    toastSuccess('快照重新截取完成！');
  }, 600);
}

function saveCurrentBookmark() {
  const newBm = {
    id: `bm-${Date.now()}`,
    title: currentPage.value.title,
    url: currentPage.value.url,
    domain: currentPage.value.domain,
    folder: selectedFolder.value,
    folderId: 'folder-custom',
    tags: [...selectedTags.value],
    screenshot: currentScreenshot.value,
    color: '#6366f1',
    notes: '一键截屏快照保存',
    dateAdded: Date.now(),
    pinned: false,
    visits: 1
  };
  emit('add', newBm);
  toastSuccess('截屏书签已成功保存！');
}

function deleteBookmark(id) {
  emit('delete', id);
  toastSuccess('已移除该书签');
}

function previewBigSnapshot(imgUrl, title) {
  emit('preview', { screenshot: imgUrl, title });
}
</script>
