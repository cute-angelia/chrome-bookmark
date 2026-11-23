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
            <component :is="activeTab === 'cloud' ? Cloud : Server" class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">服务连接与会员设置</h3>
            <p class="text-[10px] text-slate-400">官方云端 Pro 同步或自建后端接入</p>
          </div>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Segment Tabs -->
      <div class="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold text-slate-600">
        <button
          @click="activeTab = 'cloud'"
          class="py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5"
          :class="activeTab === 'cloud' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'"
        >
          <Sparkles class="w-3.5 h-3.5 text-amber-500" />
          <span>官方云端 (Pro)</span>
        </button>
        <button
          @click="activeTab = 'selfhosted'"
          class="py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5"
          :class="activeTab === 'selfhosted' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'"
        >
          <Server class="w-3.5 h-3.5 text-slate-400" />
          <span>自建服务器</span>
        </button>
      </div>

      <!-- Tab 1: 官方云端 Pro -->
      <div v-if="activeTab === 'cloud'" class="space-y-3.5 text-xs">
        <!-- Pro Privileges Card -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-amber-50/50 border border-indigo-100 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800 flex items-center space-x-1">
              <span>CutBookmark Cloud Pro</span>
              <span class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-mono">PRO</span>
            </span>
            <span class="text-[10px] text-indigo-600 font-medium">官方多端托管</span>
          </div>

          <div class="grid grid-cols-1 gap-1.5 pt-1 text-[11px] text-slate-600">
            <div class="flex items-center space-x-2">
              <Check class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>多设备自动实时漫游（家与公司无缝同步）</span>
            </div>
            <div class="flex items-center space-x-2">
              <Check class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>5GB 云端快照存储与永久安全备份</span>
            </div>
            <div class="flex items-center space-x-2">
              <Check class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>独立 Web 网页端控制台（手机平板免插件查阅）</span>
            </div>
          </div>
        </div>

        <!-- License / Login Section -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-600 font-medium">
              当前状态：
              <span v-if="isProLicensed" class="text-emerald-600 font-bold">Pro 会员 (已激活)</span>
              <span v-else class="text-slate-500">免费离线版 (本地不设限)</span>
            </span>
            <button
              @click="openOfficialSite"
              class="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold underline flex items-center space-x-0.5 cursor-pointer"
            >
              <span>了解 Pro 方案</span>
              <ExternalLink class="w-3 h-3" />
            </button>
          </div>

          <!-- License Input -->
          <div class="space-y-1.5 pt-1 border-t border-slate-200/60">
            <label class="block text-[11px] font-semibold text-slate-600">激活码 / 早鸟兑换码 (License Key)</label>
            <div class="flex items-center space-x-1.5">
              <div class="relative flex-1">
                <Key class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  v-model="licenseKeyInput"
                  type="text"
                  placeholder="CB-XXXX-XXXX-XXXX"
                  class="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>
              <button
                @click="activateLicense"
                :disabled="!licenseKeyInput.trim()"
                class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                激活
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: 自建服务器 (Self-Hosted) -->
      <div v-else class="space-y-3 text-xs">
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
                {{ connected ? `已连接自建服务 (${config.username})` : '未连接自建服务' }}
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
        <div class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">服务器 API 地址 (Server URL)</label>
            <input
              v-model="form.server"
              type="text"
              placeholder="https://your-bookmark-server.com"
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
      </div>

      <!-- Actions -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          v-if="isLoggedIn && activeTab === 'selfhosted'"
          @click="handleLogout"
          class="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          退出自建登录
        </button>
        <span v-else class="text-[10px] text-slate-400">未连接时扩展默认纯本地离线运行</span>

        <div class="flex items-center space-x-2">
          <button
            @click="close"
            class="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            关闭
          </button>
          <button
            v-if="activeTab === 'selfhosted' && !isLoggedIn"
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
import { ref, computed, watch, onMounted } from 'vue';
import { Server, Cloud, Sparkles, Key, Check, X, ExternalLink } from 'lucide-vue-next';
import { getServerConfig, loginServer, logoutServer, openRemoteLibraries } from '../services/shioriApi.js';
import { showToast, isChromeExtension } from '../services/bookmarkStorage.js';

const props = defineProps({
  visible: Boolean,
  connected: Boolean
});

const emit = defineEmits(['close', 'status-change']);

const activeTab = ref('cloud');
const licenseKeyInput = ref('');
const isProLicensed = ref(false);

const config = ref({
  server: '',
  username: '',
  token: ''
});

const form = ref({
  server: '',
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
  form.value.server = c.server || '';
  form.value.username = c.username || '';

  // 检查是否已激活 License
  if (isChromeExtension()) {
    chrome.storage.local.get(['cutbookmark_license_key', 'cutbookmark_is_pro'], (res) => {
      if (res?.cutbookmark_is_pro || res?.cutbookmark_license_key) {
        isProLicensed.value = true;
        licenseKeyInput.value = res.cutbookmark_license_key || 'CB-LTD-PRO-USER';
      }
    });
  }
}

watch(() => props.visible, (val) => {
  if (val) loadConfig();
});

onMounted(() => {
  loadConfig();
});

function openOfficialSite() {
  const url = 'https://cutbookmark.com';
  if (isChromeExtension() && chrome.tabs?.create) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
}

async function activateLicense() {
  const key = licenseKeyInput.value.trim();
  if (!key) return;

  if (isChromeExtension()) {
    chrome.storage.local.set({
      cutbookmark_license_key: key,
      cutbookmark_is_pro: true
    }, () => {
      isProLicensed.value = true;
      showToast('🎉 Pro 会员激活成功！已解锁全部云端特权');
    });
  } else {
    isProLicensed.value = true;
    showToast('🎉 Pro 会员激活成功！');
  }
}

async function handleLogin() {
  if (!form.value.server || !form.value.username || !form.value.password) {
    showToast('请完整填写服务器地址、账号和密码', 'warning');
    return;
  }
  loggingIn.value = true;
  try {
    const updated = await loginServer(form.value.server, form.value.username, form.value.password);
    config.value = updated;
    emit('status-change', updated);
    showToast('自建服务连接成功！');
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
  showToast('已退出自建服务');
}

function openLibraries() {
  openRemoteLibraries();
}

function close() {
  emit('close');
}
</script>
