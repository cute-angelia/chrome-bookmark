<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    @click.self="close"
  >
    <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Server class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">自建远程服务连接设置</h3>
            <p class="text-[10px] text-slate-400">Shiori / 自建书签服务后端 API</p>
          </div>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Connection Status Card -->
      <div
        class="p-3.5 rounded-2xl border flex items-center justify-between"
        :class="connected ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'"
      >
        <div class="flex items-center space-x-2.5">
          <div
            class="w-3 h-3 rounded-full shrink-0"
            :class="connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'"
          />
          <div>
            <div class="text-xs font-bold">
              {{ connected ? `已连接服务 (${config.username})` : '未连接远程服务' }}
            </div>
            <div class="text-[10px] font-mono text-slate-500 truncate max-w-[220px]">
              {{ config.server || '未配置' }}
            </div>
          </div>
        </div>

        <button
          v-if="isLoggedIn"
          @click="openLibraries"
          class="px-2.5 py-1 text-[11px] bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 rounded-lg flex items-center space-x-1 shadow-2xs transition cursor-pointer"
        >
          <ExternalLink class="w-3 h-3" />
          <span>访问远程库</span>
        </button>
      </div>

      <!-- Form Inputs -->
      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">服务器 API 地址 (Server URL)</label>
          <input
            v-model="form.server"
            type="text"
            placeholder="http://192.168.3.36:38112"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
          />
        </div>

        <div v-if="!isLoggedIn" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">账号 (Username)</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="请输入用户名..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">密码 (Password)</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="请输入密码..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>
        </div>

        <!-- Token Information if logged in -->
        <div v-else class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">认证凭证 Token:</span>
            <span class="font-medium">{{ connected ? '已验证' : '尚未验证或已失效' }}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-mono truncate">
            {{ config.token }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          v-if="isLoggedIn"
          @click="handleLogout"
          class="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          退出当前登录
        </button>
        <span v-else class="text-[10px] text-slate-400">未连接时工作台本地离线可用</span>

        <div class="flex items-center space-x-2">
          <button
            @click="close"
            class="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            关闭
          </button>
          <button
            v-if="!isLoggedIn"
            @click="handleLogin"
            :disabled="loggingIn"
            class="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition cursor-pointer disabled:opacity-50"
          >
            {{ loggingIn ? '正在连接...' : '登录并连接' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Server, X, ExternalLink } from 'lucide-vue-next';
import { getServerConfig, loginServer, logoutServer, openRemoteLibraries } from '../services/shioriApi.js';
import { showToast } from '../services/bookmarkStorage.js';

const props = defineProps({
  visible: Boolean,
  connected: Boolean
});

const emit = defineEmits(['close', 'status-change']);

const config = ref({
  server: 'http://192.168.3.36:38112',
  username: '',
  token: ''
});

const form = ref({
  server: 'http://192.168.3.36:38112',
  username: '',
  password: ''
});

const loggingIn = ref(false);

const isLoggedIn = computed(() => {
  return !!config.value.token;
});

async function loadConfig() {
  const c = await getServerConfig();
  config.value = c;
  form.value.server = c.server || 'http://192.168.3.36:38112';
  form.value.username = c.username || '';
}

watch(() => props.visible, (val) => {
  if (val) loadConfig();
});

async function handleLogin() {
  loggingIn.value = true;
  try {
    const updated = await loginServer(form.value.server, form.value.username, form.value.password);
    config.value = updated;
    emit('status-change', updated);
  } catch (err) {
    showToast(err.message || '连接失败，请检查服务地址与密码', 'error');
  } finally {
    loggingIn.value = false;
  }
}

async function handleLogout() {
  const updated = await logoutServer();
  config.value = updated;
  form.value.password = '';
  emit('status-change', updated);
}

function openLibraries() {
  openRemoteLibraries();
}

function close() {
  emit('close');
}
</script>
