<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none">
    <div
      class="flex items-center gap-2 px-3.5 py-2 bg-slate-900/95 backdrop-blur-md text-white rounded-full shadow-2xl border border-slate-700/60 transition-all hover:border-indigo-500/80 hover:shadow-indigo-500/20"
    >
      <!-- Prototype Badge -->
      <span class="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
        PROTOTYPE
      </span>

      <!-- Previous Arrow -->
      <button
        @click="cyclePrev"
        class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-white transition cursor-pointer"
        title="上一个方案 (快捷键 ←)"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <!-- Current Variant Label & Picker -->
      <div class="flex items-center gap-1.5 px-2 cursor-pointer" @click="cycleNext">
        <span class="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
          {{ current }}
        </span>
        <span class="text-xs font-semibold text-slate-200">
          {{ currentVariantMeta?.name || '方案' }}
        </span>
      </div>

      <!-- Quick Option Dots -->
      <div class="flex items-center gap-1 px-1">
        <button
          v-for="v in variants"
          :key="v.id"
          @click.stop="selectVariant(v.id)"
          class="w-2.5 h-2.5 rounded-full transition-all cursor-pointer"
          :class="current === v.id ? 'bg-indigo-400 scale-125' : 'bg-slate-600 hover:bg-slate-400'"
          :title="`${v.id}: ${v.name}`"
        />
      </div>

      <!-- Next Arrow -->
      <button
        @click="cycleNext"
        class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-white transition cursor-pointer"
        title="下一个方案 (快捷键 →)"
      >
        <ChevronRight class="w-4 h-4" />
      </button>

      <!-- Key hint -->
      <span class="hidden sm:inline-block pl-1 text-[10px] text-slate-400 border-l border-slate-700 ml-1">
        按 <kbd class="px-1 py-0.5 bg-slate-800 rounded text-slate-300">←</kbd> <kbd class="px-1 py-0.5 bg-slate-800 rounded text-slate-300">→</kbd> 键切换
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  variants: {
    type: Array,
    required: true
  },
  current: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['change']);

const currentIndex = computed(() => {
  return props.variants.findIndex(v => v.id === props.current);
});

const currentVariantMeta = computed(() => {
  return props.variants[currentIndex.value] || props.variants[0];
});

function selectVariant(id) {
  emit('change', id);
}

function cyclePrev() {
  const len = props.variants.length;
  if (len === 0) return;
  const prevIdx = (currentIndex.value - 1 + len) % len;
  emit('change', props.variants[prevIdx].id);
}

function cycleNext() {
  const len = props.variants.length;
  if (len === 0) return;
  const nextIdx = (currentIndex.value + 1) % len;
  emit('change', props.variants[nextIdx].id);
}

function handleKeydown(e) {
  // 不在输入框或可编辑元素中拦截方向键
  const tag = e.target?.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) {
    return;
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    cyclePrev();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    cycleNext();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
