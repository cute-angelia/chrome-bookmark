<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    @click.self="close"
  >
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Plus class="w-4 h-4" />
          </div>
          <h3 class="text-sm font-bold text-slate-900">新建书签</h3>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-600 p-1">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">网址</label>
          <input
            v-model="form.url"
            @blur="handleUrlBlur"
            type="text"
            placeholder="https://example.com"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
          />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">书签标题</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="输入书签标题..."
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">文件夹</label>
            <select
              v-model="form.folder"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option v-for="f in availableFolders" :key="f.id" :value="f.name">
                {{ f.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">截图地址（可选）</label>
            <input
              v-model="form.screenshot"
              type="text"
              placeholder="留空则不添加截图"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate font-mono text-[11px]"
            />
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block font-semibold text-slate-700 mb-1">标签</label>
          <input
            v-model="tagsInput"
            @keydown.enter.prevent="addTagFromInput"
            placeholder="输入标签，回车添加"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="(t, idx) in form.tags"
              :key="idx"
              class="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] flex items-center space-x-1"
            >
              <span>#{{ t }}</span>
              <button @click="removeTag(idx)" class="hover:text-indigo-900 cursor-pointer">×</button>
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block font-semibold text-slate-700 mb-1">笔记</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="记录此书签的要点、使用场景或备忘..."
            class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
        <button
          @click="close"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          取消
        </button>
        <button
          @click="submit"
          class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition cursor-pointer"
        >
          保存书签
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Plus, X } from 'lucide-vue-next';
import { showToast } from '../services/bookmarkStorage.js';

const props = defineProps({
  visible: Boolean,
  folders: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'create']);

const tagsInput = ref('');
const form = ref({
  title: '',
  url: '',
  folder: '',
  screenshot: '',
  tags: [],
  notes: '',
  pinned: false
});

const availableFolders = ref([]);

watch(() => props.folders, (newVal) => {
  availableFolders.value = newVal.filter(f => f.id !== 'all');
  if (availableFolders.value.length && !form.value.folder) {
    form.value.folder = availableFolders.value[0].name;
  }
}, { immediate: true });

function handleUrlBlur() {
  if (form.value.url && !form.value.title) {
    try {
      const u = new URL(form.value.url);
      form.value.title = u.hostname;
    } catch (e) {
      // ignore
    }
  }
}

function addTagFromInput() {
  const val = tagsInput.value.trim().replace(/^#/, '');
  if (val && !form.value.tags.includes(val)) {
    form.value.tags.push(val);
  }
  tagsInput.value = '';
}

function removeTag(idx) {
  form.value.tags.splice(idx, 1);
}

function close() {
  emit('close');
}

function submit() {
  if (!form.value.url || !form.value.title) {
    showToast('请填写完整的网址和标题', 'warning');
    return;
  }

  let domain = 'example.com';
  try {
    domain = new URL(form.value.url).hostname;
  } catch (e) {
    //
  }

  const newBm = {
    id: `bm-${Date.now()}`,
    title: form.value.title,
    url: form.value.url,
    domain,
    folder: form.value.folder,
    folderId: 'custom-folder',
    tags: [...form.value.tags],
    screenshot: form.value.screenshot.trim(),
    color: '#6366f1',
    notes: form.value.notes,
    dateAdded: Date.now(),
    pinned: form.value.pinned,
    visits: 1
  };

  emit('create', newBm);
  showToast('书签已成功添加！');
  close();
}
</script>
