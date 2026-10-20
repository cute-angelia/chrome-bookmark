<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    @click.self="close"
  >
    <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Folder class="w-4 h-4" />
          </div>
          <h3 class="text-sm font-bold text-slate-900">分类文件夹管理</h3>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-600 p-1">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Add New Folder input -->
      <div class="flex items-center space-x-2">
        <input
          v-model="newFolderName"
          @keydown.enter.prevent="createFolder"
          placeholder="输入新分类名称 (例如：工作工具/常用)"
          class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          @click="createFolder"
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition"
        >
          添加
        </button>
      </div>

      <!-- Existing Folders List -->
      <div class="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        <div
          v-for="folder in editableFolders"
          :key="folder.id"
          class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between group"
        >
          <div class="flex items-center space-x-2 truncate">
            <Folder class="w-4 h-4 text-indigo-500 shrink-0" />
            <span class="text-xs font-medium text-slate-700 truncate">{{ folder.name }}</span>
          </div>

          <button
            @click="deleteFolder(folder.id)"
            class="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer"
            title="删除分类"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-100 flex justify-end">
        <button
          @click="close"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Folder, X, Trash2 } from 'lucide-vue-next';
import { showToast, confirmDialog } from '../services/bookmarkStorage.js';

const props = defineProps({
  visible: Boolean,
  folders: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'add-folder', 'delete-folder']);

const newFolderName = ref('');

const editableFolders = computed(() => {
  return props.folders.filter(f => f.id !== 'all');
});

function createFolder() {
  const name = newFolderName.value.trim();
  if (!name) return;
  if (props.folders.some(f => f.name === name)) {
    showToast('该分类名称已存在', 'warning');
    return;
  }
  emit('add-folder', {
    id: `folder-${Date.now()}`,
    name,
    count: 0
  });
  newFolderName.value = '';
  showToast('新分类创建成功！');
}

async function deleteFolder(id) {
  const ok = await confirmDialog('确定要删除此分类文件夹吗？', '该分类下的书签将变为未分类状态。');
  if (ok) {
    emit('delete-folder', id);
    showToast('已删除分类');
  }
}

function close() {
  emit('close');
}
</script>
