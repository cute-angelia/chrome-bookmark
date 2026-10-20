<template>
  <div class="h-dvh bg-slate-100 flex flex-col font-sans overflow-hidden">
    <!-- Top Global App Bar -->
    <header class="bg-white border-b border-slate-200/90 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div class="px-4 h-14 flex items-center justify-between gap-3">
        <div class="flex items-center space-x-3 min-w-0">
          <div class="w-8 h-8 shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-400/50">
            <Camera class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <h1 class="text-sm font-bold text-slate-900 leading-none truncate">截屏书签 · CutBookmark 2.0</h1>
          </div>
        </div>

        <!-- Right Quick Actions -->
        <div class="flex items-center space-x-3 shrink-0">
          <button
            @click="workspace?.openServerSettings()"
            aria-label="远程服务设置"
            class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100"
          >
            <span class="w-2.5 h-2.5 rounded-full" :class="connectionState === 'connected' ? 'bg-emerald-500 connection-breathe' : connectionState === 'connecting' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Workspace Container -->
    <main class="flex-1 min-h-0 w-full flex flex-col overflow-auto">
      <WorkspaceView ref="workspace" @connection-state="connectionState = $event" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Camera } from 'lucide-vue-next';
import WorkspaceView from './views/WorkspaceView.vue';
const workspace = ref(null);
const connectionState = ref('disconnected');
</script>

<style scoped>
.connection-breathe { animation: breathe 2.6s ease-in-out infinite; }
@keyframes breathe {
  0%, 100% { opacity: 0.55; box-shadow: 0 0 0 0 rgb(16 185 129 / 0.1); }
  50% { opacity: 1; box-shadow: 0 0 0 5px rgb(16 185 129 / 0.12); }
}
@media (prefers-reduced-motion: reduce) {
  .connection-breathe { animation: none; }
}
</style>
