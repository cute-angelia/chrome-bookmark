<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all"
    @click.self="close"
  >
    <div class="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
      <!-- Modal Header -->
      <div class="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
        <div class="flex items-center space-x-2 text-white truncate pr-4">
          <Camera class="w-4 h-4 text-indigo-400 shrink-0" />
          <span class="font-medium text-sm truncate">{{ bookmark?.title || '截屏快照预览' }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <a
            :href="bookmark?.url"
            target="_blank"
            class="px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex items-center space-x-1 transition"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>访问原网页</span>
          </a>
          <button
            @click="close"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Screenshot Big Preview -->
      <div class="relative bg-black flex items-center justify-center max-h-[70vh] overflow-hidden p-2">
        <img
          :src="bookmark?.screenshot"
          :alt="bookmark?.title"
          class="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg"
        />
      </div>

      <!-- Footer Info -->
      <div class="px-5 py-3 bg-slate-800/80 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center space-x-3">
          <span>所属分类: <strong class="text-slate-200">{{ bookmark?.folder || '未分类' }}</strong></span>
          <span v-if="bookmark?.notes" class="text-slate-300">备注: {{ bookmark.notes }}</span>
        </div>
        <div>
          <span>{{ new Date(bookmark?.dateAdded || Date.now()).toLocaleDateString() }} 截取</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Camera, ExternalLink, X } from 'lucide-vue-next';

defineProps({
  visible: Boolean,
  bookmark: Object
});

const emit = defineEmits(['close']);

function close() {
  emit('close');
}
</script>
