<template>
  <div class="h-full min-h-0 min-w-[1040px] flex bg-white overflow-hidden">
    <!-- 栏目 1: 左侧导航控制台 (Sidebar) -->
    <aside class="w-80 bg-slate-50 text-slate-700 flex flex-col shrink-0 border-r border-slate-200 select-none">
      <!-- 快捷统计与添加按钮 -->
      <div class="px-3 py-3 border-b border-slate-200 bg-white">
        <button
          @click="showCreateModal = true"
          class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm shadow-indigo-200 transition cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>添加书签</span>
        </button>
      </div>

      <!-- 智能视图与目录列表 (可滚动) -->
      <div class="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <!-- 智能过滤视图 -->
        <div>
          <div class="px-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            快捷视图
          </div>
          <nav class="space-y-0.5">
            <button
              v-for="v in smartViews"
              :key="v.id"
              @click="selectSmartView(v.id)"
              class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
              :class="activeView === v.id && !selectedFolderFilter && !selectedTagFilter ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <div class="flex items-center space-x-2 truncate">
                <component :is="v.icon" class="w-3.5 h-3.5 shrink-0" />
                <span class="truncate">{{ v.name }}</span>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                :class="activeView === v.id && !selectedFolderFilter && !selectedTagFilter ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ v.count }}
              </span>
            </button>
          </nav>

          <!-- 回收站专属入口 -->
          <div class="pt-2 mt-2 border-t border-slate-200/70">
            <button
              @click="selectTrashView"
              class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
              :class="activeView === 'trash' && !selectedFolderFilter && !selectedTagFilter ? 'bg-rose-50 text-rose-700 shadow-xs' : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/50'"
            >
              <div class="flex items-center space-x-2 truncate">
                <Trash2 class="w-3.5 h-3.5 shrink-0" :class="activeView === 'trash' ? 'text-rose-600' : 'text-slate-400'" />
                <span class="truncate">回收站</span>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                :class="activeView === 'trash' ? 'bg-white text-rose-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ trashBookmarks.length }}
              </span>
            </button>
          </div>
        </div>

        <!-- 标签云 (放于分类文件夹上方) -->
        <div>
          <div class="px-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>标签</span>
            <button
              v-if="selectedTagFilter"
              @click="selectedTagFilter = ''"
              class="text-[10px] text-amber-600 hover:underline cursor-pointer"
            >
              清除筛选
            </button>
          </div>
          <div class="flex flex-wrap gap-1 px-1">
            <button
              v-for="tag in allUniqueTags"
              :key="tag"
              @click="toggleTagFilter(tag)"
              class="text-[11px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer"
              :class="selectedTagFilter === tag ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'"
            >
              #{{ tag }}
            </button>
          </div>
        </div>

        <!-- 分类文件夹树 -->
        <div>
          <div class="px-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <button
              @click="isFolderSectionCollapsed = !isFolderSectionCollapsed"
              class="flex items-center space-x-1 hover:text-slate-700 transition cursor-pointer select-none"
              title="点击展开/收起分类文件夹"
            >
              <ChevronDown
                class="w-3 h-3 transition-transform duration-200"
                :class="{ '-rotate-90': isFolderSectionCollapsed }"
              />
              <span>分类文件夹</span>
            </button>
            <div class="flex items-center space-x-2">
              <button
                v-if="selectedFolderFilter"
                @click="selectedFolderFilter = ''"
                class="text-[10px] text-amber-600 hover:underline cursor-pointer"
              >
                清除筛选
              </button>
              <button
                @click="showFolderModal = true"
                class="text-indigo-600 hover:text-indigo-700 transition text-[10px] flex items-center space-x-0.5 cursor-pointer"
              >
                <span>管理</span>
              </button>
            </div>
          </div>
          <nav v-show="!isFolderSectionCollapsed" class="space-y-0.5">
            <!-- 全部文件夹 / 清除筛选入口 -->
            <button
              @click="selectFolder('')"
              class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
              :class="!selectedFolderFilter && activeView === 'all' && !selectedTagFilter ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <div class="flex items-center space-x-2 truncate">
                <FolderArchive class="w-3.5 h-3.5 shrink-0" :class="!selectedFolderFilter && activeView === 'all' && !selectedTagFilter ? 'text-indigo-600' : 'text-slate-400'" />
                <span class="truncate">全部文件夹</span>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                :class="!selectedFolderFilter && activeView === 'all' && !selectedTagFilter ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ bookmarks.length }}
              </span>
            </button>

            <button
              v-for="folder in visibleCustomFolders"
              :key="folder.id"
              draggable="true"
              @dragstart="handleFolderDragStart($event, folder)"
              @dragend="handleFolderDragEnd"
              @click="selectFolder(folder.id)"
              @contextmenu.prevent="openFolderContextMenu($event, folder)"
              @dragover.prevent="handleFolderDragOver($event, folder)"
              @dragleave="handleFolderDragLeave($event, folder)"
              @drop.prevent="handleFolderDrop($event, folder)"
              :style="{ paddingLeft: `${8 + (folder.depth || 0) * 12}px` }"
              :title="`${folder.path || folder.name} (可拖动排序，右键可操作)`"
              class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-grab active:cursor-grabbing relative group select-none"
              :class="[
                draggedFolderId === folder.id ? 'opacity-40 scale-[0.98] border-dashed border-indigo-400 bg-indigo-50/50' : '',
                dragOverFolderSortTarget?.id === folder.id && dragOverFolderSortTarget.position === 'before' ? 'before:absolute before:top-0 before:left-2 before:right-2 before:h-0.5 before:bg-indigo-600 before:rounded-full before:z-10 bg-indigo-50/40' : '',
                dragOverFolderSortTarget?.id === folder.id && dragOverFolderSortTarget.position === 'after' ? 'after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-indigo-600 after:rounded-full after:z-10 bg-indigo-50/40' : '',
                dragOverFolderId === folder.id ? '!bg-indigo-100 !text-indigo-800 ring-2 ring-indigo-500 ring-inset shadow-sm scale-[1.02]' : '',
                selectedFolderFilter === folder.id ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <div class="flex items-center space-x-1 truncate">
                <!-- 折叠/展开小箭头（若有子文件夹显示小箭头，无子文件夹显示占位） -->
                <span
                  v-if="parentFolderIds.has(folder.id)"
                  @click.stop="toggleFolderCollapse(folder.id, $event)"
                  class="w-3.5 h-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer rounded"
                  :title="collapsedFolderIds.has(folder.id) ? '展开子文件夹' : '收起子文件夹'"
                >
                  <ChevronRight
                    class="w-3 h-3 transition-transform duration-150"
                    :class="{ 'rotate-90': !collapsedFolderIds.has(folder.id) }"
                  />
                </span>
                <span v-else class="w-3.5 h-3.5 shrink-0"></span>

                <Folder class="w-3.5 h-3.5 shrink-0 text-slate-400" :class="{ '!text-indigo-600': selectedFolderFilter === folder.id || dragOverFolderId === folder.id }" />
                <span class="truncate">{{ folder.name }}</span>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ml-1"
                :class="selectedFolderFilter === folder.id ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ getFolderBookmarkCount(folder) }}
              </span>
            </button>
          </nav>
        </div>

        <!-- 底部系统状态与数据导入导出 (置于滚动区域最下方，不常驻吸底) -->
        <div class="pt-4 border-t border-slate-200/80 text-xs space-y-2">
          <div class="flex items-center justify-between text-[11px] text-slate-500">
            <span>书签总数</span>
            <div class="flex items-center space-x-1.5">
              <span class="font-mono text-slate-500">{{ bookmarks.length }} 项</span>
              <button
                @click="handleManualSync"
                :disabled="isSyncing"
                class="p-0.5 text-slate-400 hover:text-indigo-600 transition cursor-pointer disabled:opacity-50"
                title="每天自动读取一次书签，点击可立即强制刷新"
              >
                <RotateCw class="w-3 h-3" :class="{ 'animate-spin': isSyncing }" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-1.5 pt-1">
            <button
              @click="exportData"
              class="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center space-x-1 transition cursor-pointer"
              title="导出备份为 JSON 文件"
            >
              <Download class="w-3 h-3" />
              <span>导出备份</span>
            </button>
            <label
              class="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center space-x-1 transition cursor-pointer text-center"
              title="从 JSON 文件恢复备份"
            >
              <Upload class="w-3 h-3" />
              <span>导入恢复</span>
              <input type="file" accept=".json" class="hidden" @change="handleImportFile" />
            </label>
          </div>
        </div>
      </div>
    </aside>

    <!-- 栏目 2: 中间书签列表流 (Master List) -->
    <section class="w-96 flex flex-col border-r border-slate-200 bg-slate-50/70 shrink-0">
      <!-- 搜索与工具条 -->
      <div class="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
        <!-- 搜索输入框 -->
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索书签标题、域名、标签或笔记..."
            class="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- 回收站状态横幅 -->
        <div v-if="activeView === 'trash'" class="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <div class="flex items-center space-x-1.5">
            <Trash2 class="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span class="font-medium text-[11px]">回收站（系统自动清理 7 天前书签）</span>
          </div>
          <button
            v-if="trashBookmarks.length > 0"
            @click="clearAllTrash"
            class="text-[10px] font-semibold text-rose-600 hover:text-rose-800 underline cursor-pointer"
          >
            清空回收站
          </button>
        </div>

        <!-- 当前过滤状态胶囊 (文件夹或标签筛选激活时显示) -->
        <div v-if="selectedFolderFilter || selectedTagFilter" class="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span class="text-[11px] text-slate-400">当前筛选:</span>
          <span
            v-if="selectedFolderFilter"
            class="inline-flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg border border-indigo-200"
          >
            <Folder class="w-3 h-3 text-indigo-600" />
            <span class="max-w-[120px] truncate">{{ currentFolderName }}</span>
            <button @click="selectedFolderFilter = ''" class="hover:text-indigo-900 cursor-pointer ml-0.5 font-bold" title="清除文件夹筛选">×</button>
          </span>
          <span
            v-if="selectedTagFilter"
            class="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-200"
          >
            <span>#{{ selectedTagFilter }}</span>
            <button @click="selectedTagFilter = ''" class="hover:text-amber-900 cursor-pointer ml-0.5 font-bold" title="清除标签筛选">×</button>
          </span>
          <button
            @click="clearAllFilters"
            class="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer ml-auto"
          >
            重置
          </button>
        </div>

        <!-- 视图切换与排序控制 -->
        <div class="flex items-center justify-between text-xs text-slate-500">
          <div class="flex items-center space-x-1.5">
            <span>排序:</span>
            <select
              v-model="sortBy"
              class="text-xs bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="dateDesc">最新添加</option>
              <option value="dateAsc">最早添加</option>
              <option value="visits">高频访问</option>
              <option value="title">标题拼音</option>
            </select>
          </div>

          <div class="flex items-center space-x-1.5">
            <button
              @click="toggleBatchMode"
              class="px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer"
              :class="isBatchMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ isBatchMode ? '退出批量' : '批量整理' }}
            </button>

            <button
              @click="isCompactView = !isCompactView"
              class="p-1 rounded hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              :title="isCompactView ? '切换为详细卡片流' : '切换为紧凑列表'"
            >
              <List class="w-4 h-4" :class="{ 'text-indigo-600': isCompactView }" />
            </button>
          </div>
        </div>

        <!-- 批量操作工具条 (当处于批量模式时展开) -->
        <div v-if="isBatchMode" class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
              class="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span class="text-slate-600">已选 {{ selectedBatchIds.length }} 项</span>
          </div>

          <div class="flex items-center space-x-1.5">
            <button
              @click="batchSyncToRemote"
              :disabled="selectedBatchIds.length === 0 || isBatchSyncing"
              class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[11px] disabled:opacity-40 transition cursor-pointer flex items-center space-x-1"
            >
              <CloudUpload class="w-3.5 h-3.5" :class="{ 'animate-spin': isBatchSyncing }" />
              <span>{{ isBatchSyncing ? '同步中…' : '同步至远程' }}</span>
            </button>
            <button
              @click="batchDelete"
              :disabled="selectedBatchIds.length === 0 || isBatchSyncing"
              class="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-[11px] disabled:opacity-40 transition cursor-pointer"
            >
              批量删除
            </button>
          </div>
        </div>
      </div>

      <!-- 可滚动书签列表项 -->
      <div
        ref="bookmarkListRef"
        class="flex-1 overflow-y-auto p-3 space-y-2 relative select-none"
        @mousedown="handleListMouseDown"
      >
        <!-- 矩形拉取选框 (Marquee Box) -->
        <div
          v-if="marqueeBox && isSelecting"
          class="absolute border border-indigo-500 bg-indigo-500/15 rounded-xl pointer-events-none z-30 transition-none shadow-sm"
          :style="{
            left: `${marqueeBox.left}px`,
            top: `${marqueeBox.top}px`,
            width: `${marqueeBox.width}px`,
            height: `${marqueeBox.height}px`
          }"
        />

        <div
          v-for="bm in filteredList"
          :key="bm.id"
          :data-bookmark-id="bm.id"
          draggable="true"
          @dragstart="handleBookmarkDragStart($event, bm)"
          @dragend="handleBookmarkDragEnd"
          @click="selectBookmark(bm.id, $event)"
          class="p-2.5 rounded-2xl border transition cursor-pointer flex gap-3 group relative select-none"
          :class="[
            selectedBatchIds.includes(bm.id)
              ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-400/50 shadow-xs'
              : selectedBookmarkId === bm.id
                ? 'bg-indigo-50/60 border-indigo-300 shadow-xs'
                : 'bg-white border-slate-200/80 hover:border-slate-300',
            draggedBookmarkIds.includes(bm.id) ? 'opacity-40 scale-[0.98] border-dashed border-indigo-400 bg-indigo-50/50' : ''
          ]"
        >
          <!-- 批量选择框 -->
          <div v-if="isBatchMode" class="flex items-center shrink-0" @click.stop>
            <input
              type="checkbox"
              :value="bm.id"
              v-model="selectedBatchIds"
              class="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <!-- 缩略截屏图 (非紧凑模式显示) -->
          <div
            v-if="!isCompactView"
            class="w-16 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative group/thumb"
          >
            <img v-if="bm.screenshot" :src="bm.screenshot" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-300" />
            <FolderArchive v-else class="w-6 h-6 m-auto mt-4 text-slate-300" />
            <div
              v-if="bm.pinned"
              class="absolute top-1 left-1 w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center shadow-xs"
              title="置顶"
            >
              <Pin class="w-2.5 h-2.5" />
            </div>
          </div>

          <!-- 书签文字信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <h3 class="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate transition">
                {{ bm.title }}
              </h3>
              <!-- 回收站专属快捷恢复/永久删除按钮 -->
              <div v-if="bm.deletedAt" class="flex items-center gap-1 shrink-0 ml-1.5" @click.stop>
                <button
                  @click="restoreSingle(bm.id)"
                  class="p-1 rounded-md text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition cursor-pointer"
                  title="恢复此书签"
                >
                  <RotateCcw class="w-3 h-3" />
                </button>
                <button
                  @click="permanentDeleteSingle(bm.id)"
                  class="p-1 rounded-md text-rose-500 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                  title="彻底删除"
                >
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
            </div>
            <p class="text-[11px] text-slate-400 font-mono truncate mt-0.5">{{ bm.domain }}</p>

            <div class="flex items-center justify-between mt-1.5">
              <div v-if="bm.deletedAt" class="text-[10px] text-amber-600 font-medium">
                {{ formatTrashTime(bm.deletedAt) }}
              </div>
              <div v-else class="flex items-center gap-1 flex-wrap">
                <span v-if="bm.isNative || bm.source === 'chrome'" class="text-[9px] px-1.5 py-0.2 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-medium">本机</span>
                <span v-if="bm.isRemote || bm.source === 'remote'" class="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">远程</span>
                <span v-if="!bm.isNative && !bm.isRemote && bm.source !== 'chrome' && bm.source !== 'remote'" class="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-medium">本地</span>
                <button
                  v-for="tag in bm.tags?.slice(0, 2)"
                  :key="tag"
                  @click.stop="toggleTagFilter(tag)"
                  class="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition cursor-pointer"
                >
                  #{{ tag }}
                </button>
                <span v-if="bm.tags?.length > 2" class="text-[9px] text-slate-400">+{{ bm.tags.length - 2 }}</span>
              </div>

              <span class="text-[10px] text-slate-400 font-mono">
                {{ bm.visits || 1 }}次
              </span>
            </div>
          </div>
        </div>

        <div v-if="filteredList.length === 0" class="text-center py-12 text-slate-400 text-xs">
          没有找到匹配的书签
        </div>
      </div>
    </section>

    <!-- 栏目 3: 右侧详情与快照检视器 (Inspector Detail Panel) -->
    <main class="flex-1 flex flex-col bg-slate-50 overflow-y-auto min-w-0">
      <template v-if="activeBookmark">
        <!-- 全宽顶部信息栏 -->
        <header class="shrink-0 sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 space-y-2.5">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0 flex-wrap">
              <span v-if="activeBookmark.isNative || activeBookmark.source === 'chrome'" class="shrink-0 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                Chrome 本机
              </span>
              <span v-if="activeBookmark.isRemote || activeBookmark.source === 'remote'" class="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                远程书签
              </span>
              <span v-if="!activeBookmark.isNative && !activeBookmark.isRemote && activeBookmark.source !== 'chrome' && activeBookmark.source !== 'remote'" class="shrink-0 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                本地缓存
              </span>
              <span class="shrink-0 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 truncate max-w-[180px]">
                {{ activeBookmark.folder }}
              </span>
              <span class="text-[11px] text-slate-400 font-mono whitespace-nowrap min-w-0 truncate">
                {{ new Date(activeBookmark.dateAdded).toLocaleDateString() }} 录入 · 累计 <strong class="text-indigo-600">{{ activeBookmark.visits || 1 }}</strong> 次访问
              </span>
            </div>
            <div v-if="isCurrentInTrash" class="flex items-center gap-1.5 shrink-0">
              <button
                @click="restoreSingle(activeBookmark.id)"
                class="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
                title="恢复此书签"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>恢复书签</span>
              </button>
              <button
                @click="permanentDeleteSingle(activeBookmark.id)"
                class="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition cursor-pointer flex items-center gap-1 text-xs font-medium shadow-2xs"
                title="彻底永久删除"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>彻底删除</span>
              </button>
            </div>
            <div v-else class="flex items-center gap-1.5 shrink-0">
              <button
                @click="syncSingleToRemote(activeBookmark)"
                :disabled="isSingleSyncing"
                class="px-2.5 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 text-xs shadow-2xs"
                :class="activeBookmark.isRemote || activeBookmark.source === 'remote'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold'"
                :title="activeBookmark.isRemote || activeBookmark.source === 'remote' ? '书签已在远程，点击覆盖更新' : '将此本地书签同步至远程服务'"
              >
                <CloudUpload class="w-3.5 h-3.5" :class="{ 'animate-spin': isSingleSyncing }" />
                <span>{{ isSingleSyncing ? '同步中…' : (activeBookmark.isRemote || activeBookmark.source === 'remote' ? '更新远端' : '同步至远程') }}</span>
              </button>
              <button
                @click="togglePin(activeBookmark.id)"
                class="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
                :class="activeBookmark.pinned ? 'text-amber-500 border-amber-300 bg-amber-50/40' : 'text-slate-400'"
                title="置顶书签"
              >
                <Pin class="w-4 h-4" />
              </button>
              <button
                @click="deleteSingle(activeBookmark.id)"
                class="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="移入回收站"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- 回收站提示胶囊 -->
          <div
            v-if="isCurrentInTrash"
            class="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between"
          >
            <span>此书签已在回收站中（{{ formatTrashTime(activeBookmark.deletedAt) }}）</span>
            <button
              @click="restoreSingle(activeBookmark.id)"
              class="font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              点击恢复
            </button>
          </div>

          <!-- 可直接点击跳转的标题（链接图标紧跟标题文字） -->
          <div class="flex items-center gap-2 min-w-0">
            <a
              :href="activeBookmark.url"
              target="_blank"
              rel="noopener noreferrer"
              @click="recordVisit(activeBookmark.id)"
              class="group flex items-center gap-2 min-w-0 max-w-full text-lg font-bold text-slate-900 hover:text-indigo-600 transition py-0.5 leading-snug cursor-pointer"
              :title="`在浏览器新标签页打开: ${activeBookmark.url}`"
            >
              <span class="truncate">{{ activeBookmark.title || activeBookmark.url }}</span>
              <ExternalLink class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 transition" />
            </a>
          </div>
        </header>

        <!-- 全宽截图检视区 -->
        <section class="shrink-0 border-b border-slate-200">
          <div class="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-100 text-xs text-slate-500">
            <span class="font-medium flex items-center gap-1.5 text-slate-700">
              <Camera class="w-3.5 h-3.5 text-indigo-600" />
              <span>网页截图</span>
            </span>
            <button
              @click="updateSnapshot(activeBookmark)"
              :disabled="!!snapshotUpdatingId || !isExtEnv"
              class="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              :title="isExtEnv ? '临时打开书签网页，截取可视区域后自动返回' : '真实截图仅支持 Chrome 扩展'"
            >
              <RotateCw class="w-3 h-3" :class="{ 'animate-spin': snapshotUpdatingId === activeBookmark.id }" />
              <span>{{ snapshotUpdatingId === activeBookmark.id ? '正在截屏…' : isExtEnv ? '刷新截屏' : '仅扩展可截屏' }}</span>
            </button>
          </div>

          <img
            v-if="activeBookmark.screenshot"
            :src="activeBookmark.screenshot"
            class="w-full h-auto"
          />
          <div v-else class="px-4 py-12 text-center text-xs text-slate-400 bg-white">尚无网页截图{{ isExtEnv ? '，点击刷新截屏生成真实快照' : '，请在 Chrome 扩展中生成' }}</div>
        </section>

        <!-- 全宽属性编辑区（单栏堆叠） -->
        <section class="flex-1 bg-white px-4 py-4 space-y-5">
          <!-- 分类文件夹 -->
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5">{{ isExtEnv ? '整理到 Chrome 文件夹' : '分类文件夹' }}</label>
            <select
              v-if="isExtEnv"
              :value="activeBookmark.folderId?.startsWith('chrome:') ? activeBookmark.folderId : (activeBookmark.nativeFolderId || '')"
              :disabled="movingBookmark"
              @change="moveActiveToFolder"
              aria-label="整理到 Chrome 文件夹"
              class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-50"
            >
              <option value="" disabled>选择 Chrome 文件夹</option>
              <option v-for="folder in nativeFolders" :key="folder.id" :value="folder.id">{{ folder.path || folder.name }}</option>
            </select>
            <p v-else-if="activeBookmark.source" class="text-xs text-slate-600 break-words py-2">{{ activeBookmark.folder }}</p>
            <select
              v-else
              v-model="activeBookmark.folder"
              @change="persistActiveBookmark"
              class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option v-for="f in editableFolders" :key="f.id" :value="f.name">
                {{ f.name }}
              </option>
            </select>
          </div>

          <!-- 标签 -->
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5">标签</label>
            <div class="flex flex-wrap gap-1.5 mb-2">
              <span
                v-for="(t, idx) in activeBookmark.tags"
                :key="idx"
                class="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-lg flex items-center gap-1.5"
              >
                <span>#{{ t }}</span>
                <button @click="removeActiveTag(idx)" class="hover:text-indigo-900 cursor-pointer text-sm">×</button>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="newTagInput"
                @keydown.enter.prevent="addActiveTag"
                placeholder="输入标签，回车添加"
                class="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
              />
              <button
                @click="addActiveTag"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                添加标签
              </button>
            </div>
          </div>

          <!-- 笔记 -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold text-slate-600">笔记</label>
              <span class="text-[10px] text-slate-400">失焦自动保存</span>
            </div>
            <textarea
              v-model="activeBookmark.notes"
              @blur="persistActiveBookmark"
              rows="5"
              placeholder="记录笔记…"
              class="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            ></textarea>
          </div>
        </section>
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <FolderArchive class="w-12 h-12 text-slate-300 mb-3" />
        <p class="text-sm font-medium text-slate-600">选择书签查看详情</p>
      </div>
    </main>

    <!-- 模态框与灯箱 -->
    <CreateBookmarkModal
      :visible="showCreateModal"
      :folders="editableFolders"
      @close="showCreateModal = false"
      @create="handleCreateBookmark"
    />

    <FolderManageModal
      :visible="showFolderModal"
      :folders="editableFolders"
      @close="showFolderModal = false"
      @add-folder="handleAddFolder"
      @delete-folder="handleDeleteFolder"
    />

    <ServerSettingsModal
      :visible="showServerModal"
      :connected="isServerConnected"
      @close="showServerModal = false"
      @status-change="onServerStatusChange"
    />

    <!-- 文件夹右键菜单 (Context Menu) -->
    <Teleport to="body">
      <div
        v-if="folderContextMenu.visible"
        :style="{ left: `${folderContextMenu.x}px`, top: `${folderContextMenu.y}px` }"
        class="fixed z-50 min-w-[150px] bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 text-xs text-slate-700 select-none"
        @click.stop
      >
        <div class="px-3.5 py-1.5 text-[10px] font-semibold text-slate-400 border-b border-slate-100 truncate max-w-[200px]">
          {{ folderContextMenu.folder?.name }}
        </div>
        <button
          @click="createSubfolderAction(folderContextMenu.folder)"
          class="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
        >
          <FolderPlus class="w-3.5 h-3.5 text-indigo-600" />
          <span>新建文件夹</span>
        </button>
        <button
          @click="renameFolderAction(folderContextMenu.folder)"
          class="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
        >
          <Pencil class="w-3.5 h-3.5 text-slate-500" />
          <span>重命名</span>
        </button>
        <div class="my-1 border-t border-slate-100"></div>
        <button
          @click="deleteFolderAction(folderContextMenu.folder)"
          class="w-full px-3.5 py-2 text-left flex items-center space-x-2.5 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <Trash2 class="w-3.5 h-3.5 text-rose-500" />
          <span>删除</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import {
  Camera, Plus, Folder, Search, List, Pin, ExternalLink, Trash2,
  FolderPlus, Pencil,
  RotateCw, RotateCcw, Download, Upload, FolderArchive,
  Star, Image, Clock, Flame, CloudUpload,
  ChevronDown, ChevronRight
} from 'lucide-vue-next';
import CreateBookmarkModal from '../components/CreateBookmarkModal.vue';
import FolderManageModal from '../components/FolderManageModal.vue';
import ServerSettingsModal from '../components/ServerSettingsModal.vue';
import {
  getStoredBookmarks, saveStoredBookmarks, updateStoredBookmark, deleteStoredBookmark,
  getStoredFolders, saveStoredFolders,
  getLastBookmarkSyncTime, setLastBookmarkSyncTime,
  isBookmarkSyncNeeded,
  exportDataAsJson, importDataFromJson,
  getTrashBookmarks, saveTrashBookmarks, moveToTrashStorage,
  restoreFromTrashStorage, deleteFromTrashPermanently, clearTrashStorage,
  showToast, confirmDialog, isChromeExtension
} from '../services/bookmarkStorage.js';
import { getServerConfig, fetchRemoteBookmarkUpdates, fetchRemoteBookmarkByUrl, remoteAddBookmark, remoteDeleteBookmark } from '../services/shioriApi.js';
import { saveToShioriFolder, findNativeBookmarkMatches, moveNativeBookmark } from '../services/nativeBookmarkSync.js';
import { readChromeLibrary, normalizeRemoteBookmarks, mergeLibraryBookmarks, mergeRemoteBookmarks, reconcileRecords, mergeSourceFolders, aggregateBookmarksByUrl, normalizeBookmarkUrl } from '../services/bookmarkLibrary.js';
import { captureBookmark } from '../services/bookmarkService.js';

const emit = defineEmits(['connection-state']);

const isExtEnv = computed(() => isChromeExtension());

const bookmarks = ref([]);
const folders = ref([]);
const serverConfig = ref({});
const showServerModal = ref(false);

const connectionState = ref('disconnected');
const isServerConnected = computed(() => connectionState.value === 'connected');
const editableFolders = computed(() => folders.value.filter(folder => !folder.source));
const nativeFolders = computed(() => folders.value.filter(folder => folder.source === 'chrome'));
const movingBookmark = ref(false);

function setConnectionState(state) {
  connectionState.value = state;
  emit('connection-state', state);
}

function onServerStatusChange(cfg) {
  serverConfig.value = cfg;
  refreshRemote();
}

const activeView = ref('all');
const selectedFolderFilter = ref('');
const selectedTagFilter = ref('');
const searchQuery = ref('');
const sortBy = ref('dateDesc');
const isCompactView = ref(false);

const isBatchMode = ref(false);
const selectedBatchIds = ref([]);

const draggedBookmarkId = ref(null);
const draggedBookmarkIds = ref([]);
const dragOverFolderId = ref(null);
const draggedFolderId = ref(null);
const dragOverFolderSortTarget = ref(null);

const bookmarkListRef = ref(null);
const marqueeBox = ref(null);
const isSelecting = ref(false);

const selectedBookmarkId = ref(null);
const newTagInput = ref('');
const trashBookmarks = ref([]);
const isTrashView = computed(() => activeView.value === 'trash');
const isCurrentInTrash = computed(() => {
  return isTrashView.value || trashBookmarks.value.some(b => b.id === selectedBookmarkId.value);
});

// Modals
const showCreateModal = ref(false);
const showFolderModal = ref(false);
const snapshotUpdatingId = ref('');

const smartViews = computed(() => [
  { id: 'all', name: '全部书签', icon: FolderArchive, count: bookmarks.value.length },
  { id: 'pinned', name: '已置顶书签', icon: Star, count: bookmarks.value.filter(b => b.pinned).length },
  { id: 'withScreenshot', name: '有截图', icon: Image, count: bookmarks.value.filter(b => !!b.screenshot).length },
  { id: 'recent', name: '最近 7 天添加', icon: Clock, count: bookmarks.value.filter(b => Date.now() - (b.dateAdded || 0) < 7 * 86400000).length },
  { id: 'hot', name: '高频访问 (>20次)', icon: Flame, count: bookmarks.value.filter(b => (b.visits || 0) >= 20).length }
]);

const customFolders = computed(() => {
  return folders.value.filter(f => f.id !== 'all');
});

// 控制整个“分类文件夹”板块的展开/收缩
const isFolderSectionCollapsed = ref(false);

// 记录哪些父文件夹被用户手动收缩折叠了子文件夹
const collapsedFolderIds = ref(new Set());

// 具有子文件夹的父文件夹 ID 集合
const parentFolderIds = computed(() => {
  const set = new Set();
  customFolders.value.forEach(f => {
    if (f.parentId) set.add(f.parentId);
  });
  return set;
});

// 计算可见的文件夹列表（若其任意层级的父级被收缩，则不显示）
const visibleCustomFolders = computed(() => {
  const folderMap = new Map(customFolders.value.map(f => [f.id, f]));
  return customFolders.value.filter(folder => {
    let curr = folder;
    while (curr?.parentId) {
      if (collapsedFolderIds.value.has(curr.parentId)) {
        return false;
      }
      curr = folderMap.get(curr.parentId);
    }
    return true;
  });
});

function toggleFolderCollapse(folderId, event) {
  if (event) event.stopPropagation();
  const next = new Set(collapsedFolderIds.value);
  if (next.has(folderId)) {
    next.delete(folderId);
  } else {
    next.add(folderId);
  }
  collapsedFolderIds.value = next;
}

function expandFolderAncestors(folderId) {
  if (!folderId) return;
  const folderMap = new Map(customFolders.value.map(f => [f.id, f]));
  let curr = folderMap.get(folderId);
  if (!curr?.parentId) return;
  const next = new Set(collapsedFolderIds.value);
  let changed = false;
  while (curr?.parentId) {
    if (next.has(curr.parentId)) {
      next.delete(curr.parentId);
      changed = true;
    }
    curr = folderMap.get(curr.parentId);
  }
  if (changed) {
    collapsedFolderIds.value = next;
  }
}

const allUniqueTags = computed(() => {
  const set = new Set();
  bookmarks.value.forEach(b => {
    b.tags?.forEach(t => {
      if (t) set.add(t);
    });
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-CN'));
});

const activeBookmark = computed(() => {
  if (isCurrentInTrash.value) {
    return trashBookmarks.value.find(b => b.id === selectedBookmarkId.value) || trashBookmarks.value[0];
  }
  if (selectedFolderFilter.value || selectedTagFilter.value || searchQuery.value.trim() || activeView.value !== 'all') {
    return filteredList.value.find(b => b.id === selectedBookmarkId.value) || filteredList.value[0];
  }
  return bookmarks.value.find(b => b.id === selectedBookmarkId.value) || bookmarks.value[0];
});

function formatTrashTime(deletedAt) {
  if (!deletedAt) return '';
  const diff = Math.max(0, Date.now() - deletedAt);
  const daysAgo = Math.floor(diff / 86400000);
  const remainDays = Math.max(1, 7 - daysAgo);
  if (daysAgo === 0) {
    return `今天删除 · 约 ${remainDays} 天后清理`;
  }
  return `${daysAgo} 天前删除 · 约 ${remainDays} 天后清理`;
}

function isInFolder(bookmark, folder) {
  if (folder.source === 'remote') {
    return bookmark.folderId === folder.id || bookmark.remoteFolderId === folder.id ||
      (bookmark.isRemote && (!bookmark.server || folder.id === `remote:${bookmark.server}`));
  }
  // 仅匹配直属于该文件夹的书签，排除子文件夹内的书签
  return bookmark.folderId === folder.id || bookmark.nativeFolderId === folder.id ||
    (!folder.source && !bookmark.folderId && bookmark.folder === folder.name);
}

const folderCounts = computed(() => {
  const counts = new Map();
  const folderList = customFolders.value;
  for (const f of folderList) {
    counts.set(f.id, 0);
  }
  for (const b of bookmarks.value) {
    for (const f of folderList) {
      if (isInFolder(b, f)) {
        counts.set(f.id, (counts.get(f.id) || 0) + 1);
      }
    }
  }
  return counts;
});

function getFolderBookmarkCount(folder) {
  return folderCounts.value.get(folder.id) || 0;
}

function selectSmartView(viewId) {
  activeView.value = viewId;
  selectedFolderFilter.value = '';
  selectedTagFilter.value = '';
  if (viewId === 'trash') {
    selectedBookmarkId.value = trashBookmarks.value[0]?.id || null;
  } else {
    if (bookmarks.value.length > 0 && (!selectedBookmarkId.value || isCurrentInTrash.value)) {
      selectedBookmarkId.value = bookmarks.value[0]?.id || null;
    }
  }
}

function selectTrashView() {
  selectSmartView('trash');
}

function selectFolder(folderId) {
  if (selectedFolderFilter.value === folderId || !folderId) {
    selectedFolderFilter.value = '';
  } else {
    selectedFolderFilter.value = folderId;
    activeView.value = 'all';
    // 切换文件夹时清空标签筛选，保持干净的文件夹视图
    selectedTagFilter.value = '';
    expandFolderAncestors(folderId);
  }
  nextTick(() => {
    if (filteredList.value.length > 0) {
      if (!filteredList.value.some(b => b.id === selectedBookmarkId.value)) {
        selectedBookmarkId.value = filteredList.value[0].id;
      }
    } else {
      selectedBookmarkId.value = null;
    }
  });
}

function toggleTagFilter(tag) {
  if (selectedTagFilter.value === tag) {
    selectedTagFilter.value = '';
  } else {
    selectedTagFilter.value = tag;
    // 点击标签时改为【全局筛选】：自动清除文件夹限制和快捷视图限制，全库按标签筛选
    selectedFolderFilter.value = '';
    activeView.value = 'all';
  }
}

const currentFolderName = computed(() => {
  const f = folders.value.find(folder => folder.id === selectedFolderFilter.value);
  return f ? f.name : selectedFolderFilter.value;
});

function clearAllFilters() {
  selectedFolderFilter.value = '';
  selectedTagFilter.value = '';
  searchQuery.value = '';
  activeView.value = 'all';
}

const filteredList = computed(() => {
  if (activeView.value === 'trash') {
    let list = [...trashBookmarks.value];
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      list = list.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.url?.toLowerCase().includes(q) ||
        b.domain?.toLowerCase().includes(q) ||
        (b.notes && b.notes.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    list.sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));
    return list;
  }

  let list = [...bookmarks.value];

  // 1. 智能视图
  if (activeView.value === 'pinned') {
    list = list.filter(b => b.pinned);
  } else if (activeView.value === 'withScreenshot') {
    list = list.filter(b => !!b.screenshot);
  } else if (activeView.value === 'recent') {
    list = list.filter(b => Date.now() - (b.dateAdded || 0) < 7 * 86400000);
  } else if (activeView.value === 'hot') {
    list = list.filter(b => (b.visits || 0) >= 20);
  }

  // 2. 文件夹过滤
  if (selectedFolderFilter.value) {
    const folder = folders.value.find(f => f.id === selectedFolderFilter.value);
    list = folder ? list.filter(b => isInFolder(b, folder)) : list;
  }

  // 3. 标签过滤
  if (selectedTagFilter.value) {
    list = list.filter(b => b.tags?.includes(selectedTagFilter.value));
  }

  // 4. 关键字搜索
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      b.domain.toLowerCase().includes(q) ||
      (b.notes && b.notes.toLowerCase().includes(q)) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // 5. 排序规则
  list.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sortBy.value === 'visits') return (b.visits || 0) - (a.visits || 0);
    if (sortBy.value === 'dateAsc') return (a.dateAdded || 0) - (b.dateAdded || 0);
    if (sortBy.value === 'title') return a.title.localeCompare(b.title);
    return (b.dateAdded || 0) - (a.dateAdded || 0);
  });

  return list;
});

let lastSelectedBmIndex = -1;

function selectBookmark(id, event) {
  selectedBookmarkId.value = id;
  const currentIndex = filteredList.value.findIndex(b => b.id === id);

  // 1. Shift 范围连选
  if (event?.shiftKey && lastSelectedBmIndex !== -1 && currentIndex !== -1) {
    const start = Math.min(lastSelectedBmIndex, currentIndex);
    const end = Math.max(lastSelectedBmIndex, currentIndex);
    const rangeIds = filteredList.value.slice(start, end + 1).map(b => b.id);
    const merged = new Set([...selectedBatchIds.value, ...rangeIds]);
    selectedBatchIds.value = Array.from(merged);
    isBatchMode.value = true;
    return;
  }

  // 2. Ctrl / Cmd 单项加选或反选
  if (event?.ctrlKey || event?.metaKey) {
    if (selectedBatchIds.value.includes(id)) {
      selectedBatchIds.value = selectedBatchIds.value.filter(i => i !== id);
    } else {
      selectedBatchIds.value = [...selectedBatchIds.value, id];
    }
    if (selectedBatchIds.value.length > 0) {
      isBatchMode.value = true;
    }
    lastSelectedBmIndex = currentIndex;
    return;
  }

  // 3. 处于批量模式时，点击卡片直接切换选中
  if (isBatchMode.value) {
    if (selectedBatchIds.value.includes(id)) {
      selectedBatchIds.value = selectedBatchIds.value.filter(i => i !== id);
    } else {
      selectedBatchIds.value = [...selectedBatchIds.value, id];
    }
    lastSelectedBmIndex = currentIndex;
    return;
  }

  lastSelectedBmIndex = currentIndex;
}

function handleListMouseDown(event) {
  if (event.button !== 0) return;
  // 排除按钮、链接、输入框等交互元素
  if (event.target.closest('button, a, input, select, textarea, [role="button"]')) {
    return;
  }

  const clickedCard = event.target.closest('[data-bookmark-id]');
  // 若按住 Shift，或者点击在卡片外部空白处，触发拉框多选
  if (!clickedCard || event.shiftKey) {
    if (event.shiftKey) event.preventDefault();
    startMarqueeSelection(event);
  }
}

function startMarqueeSelection(event) {
  const container = bookmarkListRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const startClientX = event.clientX;
  const startClientY = event.clientY;

  const marqueeInitialSelected = event.shiftKey || event.metaKey || event.ctrlKey
    ? new Set(selectedBatchIds.value)
    : new Set();

  let hasMoved = false;

  function onMouseMove(e) {
    const deltaX = e.clientX - startClientX;
    const deltaY = e.clientY - startClientY;

    if (!hasMoved && Math.hypot(deltaX, deltaY) > 4) {
      hasMoved = true;
      isSelecting.value = true;
      if (!isBatchMode.value) {
        isBatchMode.value = true;
      }
    }

    if (!hasMoved) return;

    // 视口坐标用于碰撞检测
    const boxVpLeft = Math.min(startClientX, e.clientX);
    const boxVpRight = Math.max(startClientX, e.clientX);
    const boxVpTop = Math.min(startClientY, e.clientY);
    const boxVpBottom = Math.max(startClientY, e.clientY);

    // 容器内坐标用于选框渲染
    const cLeft = rect.left;
    const cTop = rect.top;
    const cRight = rect.right;
    const cBottom = rect.bottom;

    const renderLeft = Math.max(boxVpLeft, cLeft) - cLeft + container.scrollLeft;
    const renderTop = Math.max(boxVpTop, cTop) - cTop + container.scrollTop;
    const renderWidth = Math.max(0, Math.min(boxVpRight, cRight) - Math.max(boxVpLeft, cLeft));
    const renderHeight = Math.max(0, Math.min(boxVpBottom, cBottom) - Math.max(boxVpTop, cTop));

    marqueeBox.value = {
      left: renderLeft,
      top: renderTop,
      width: renderWidth,
      height: renderHeight
    };

    // 碰撞检测
    const cards = container.querySelectorAll('[data-bookmark-id]');
    const newSelected = new Set(marqueeInitialSelected);

    cards.forEach(card => {
      const cr = card.getBoundingClientRect();
      const id = card.getAttribute('data-bookmark-id');
      if (!id) return;

      const isIntersecting = !(
        cr.right < boxVpLeft ||
        cr.left > boxVpRight ||
        cr.bottom < boxVpTop ||
        cr.top > boxVpBottom
      );

      if (isIntersecting) {
        newSelected.add(id);
      } else if (!marqueeInitialSelected.has(id)) {
        newSelected.delete(id);
      }
    });

    selectedBatchIds.value = Array.from(newSelected);
  }

  function onMouseUp(e) {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    isSelecting.value = false;
    marqueeBox.value = null;

    if (!hasMoved) {
      // 纯点击空白处：清空选择
      if (!event.shiftKey && !event.metaKey && !event.ctrlKey) {
        selectedBatchIds.value = [];
        if (isBatchMode.value) {
          isBatchMode.value = false;
        }
      }
    } else {
      if (selectedBatchIds.value.length > 0) {
        isBatchMode.value = true;
      }
    }
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

let pendingTargetUrl = '';

async function focusBookmarkByUrl(targetUrl) {
  if (!targetUrl) return false;
  const norm = normalizeBookmarkUrl(targetUrl);

  let found = bookmarks.value.find(b => {
    if (!b?.url) return false;
    return normalizeBookmarkUrl(b.url) === norm || b.url === targetUrl;
  });

  // 如果在当前内存中未命中，尝试从本地 IndexedDB 重新读取一次（应对并发新增场景）
  if (!found) {
    try {
      const stored = await getStoredBookmarks();
      if (stored && stored.length > 0) {
        bookmarks.value = reconcileRecords(bookmarks.value, aggregateBookmarksByUrl(stored));
        found = bookmarks.value.find(b => {
          if (!b?.url) return false;
          return normalizeBookmarkUrl(b.url) === norm || b.url === targetUrl;
        });
      }
    } catch {}
  }

  if (found) {
    // 1. 清除阻碍列表项展示的筛选限制
    selectedFolderFilter.value = '';
    selectedTagFilter.value = '';
    searchQuery.value = '';
    activeView.value = 'all';

    // 2. 展开分类文件夹大板块，并展开所属各级父文件夹
    isFolderSectionCollapsed.value = false;
    if (found.folderId) {
      expandFolderAncestors(found.folderId);
    }

    // 3. 选中该书签 ID
    selectedBookmarkId.value = found.id;

    // 4. 平滑滚动到当前书签可见
    const scrollTarget = () => {
      const escapedId = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(found.id) : found.id.replace(/"/g, '\\"');
      const el = document.querySelector(`[data-bookmark-id="${escapedId}"]`);
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    };
    nextTick(scrollTarget);
    setTimeout(scrollTarget, 100);
    return true;
  }
  return false;
}

watch(bookmarks, async () => {
  if (pendingTargetUrl) {
    const isAlreadySelected = bookmarks.value.some(b => b.id === selectedBookmarkId.value && (normalizeBookmarkUrl(b.url) === normalizeBookmarkUrl(pendingTargetUrl) || b.url === pendingTargetUrl));
    if (!isAlreadySelected) {
      const matched = await focusBookmarkByUrl(pendingTargetUrl);
      if (matched) {
        pendingTargetUrl = '';
      }
    } else {
      pendingTargetUrl = '';
    }
  }
});

async function persistChanges() {
  await saveStoredBookmarks(bookmarks.value);
}

async function persistBookmark(bookmark) {
  if (!bookmark) return;
  try {
    await updateStoredBookmark(bookmark);
  } catch {
    await persistChanges();
  }
}

async function persistActiveBookmark() {
  await persistBookmark(activeBookmark.value);
}

function togglePin(id) {
  const bm = bookmarks.value.find(b => b.id === id);
  if (bm) {
    bm.pinned = !bm.pinned;
    persistBookmark(bm);
    showToast(bm.pinned ? '已将该书签置顶' : '已取消置顶');
  }
}

async function deleteSingle(id) {
  const target = bookmarks.value.find(b => b.id === id);
  if (!target) return;

  // 1. 点 删除 不要确认了：静默尝试从 Chrome 原生书签树移除，避免书签栏继续堆积
  try {
    const native = await selectNativeMatch(target);
    if (native?.id && typeof chrome !== 'undefined' && chrome.bookmarks?.remove) {
      try { await chrome.bookmarks.remove(native.id); } catch {}
    }
  } catch {}

  // 2. 从活动书签列表及持久化存储中移除
  const normUrl = target ? normalizeBookmarkUrl(target.url) : '';
  bookmarks.value = bookmarks.value.filter(b => b.id !== id && (!normUrl || normalizeBookmarkUrl(b.url) !== normUrl));
  try {
    await deleteStoredBookmark(id);
    if (normUrl) {
      const stored = await getStoredBookmarks();
      for (const item of stored) {
        if (normalizeBookmarkUrl(item.url) === normUrl) {
          await deleteStoredBookmark(item.id);
        }
      }
    }
  } catch {
    try { await persistChanges(); } catch {}
  }

  // 3. 移入回收站存储
  trashBookmarks.value = await moveToTrashStorage(target);

  // 4. 重置选中项并提示
  if (selectedBookmarkId.value === id) {
    selectedBookmarkId.value = bookmarks.value[0]?.id || null;
  }
  showToast('已移入回收站（可保留 7 天）', 'info');
}

async function restoreSingle(id) {
  const restored = await restoreFromTrashStorage(id);
  if (!restored) return;

  delete restored.deletedAt;

  // 若在扩展环境中，在对应原生文件夹恢复创建 Chrome 原生书签
  if (isChromeExtension()) {
    try {
      let targetParentId = restored.folderId;
      if (targetParentId && typeof targetParentId === 'string' && targetParentId.startsWith('chrome:')) {
        targetParentId = targetParentId.slice('chrome:'.length);
      }
      await saveToShioriFolder(restored.url, restored.title, targetParentId);
    } catch (e) {
      console.warn('原生书签恢复创建失败:', e);
    }
  }

  // 存回本地活动书签库
  bookmarks.value = aggregateBookmarksByUrl([restored, ...bookmarks.value]);
  await updateStoredBookmark(restored);
  await persistChanges();

  trashBookmarks.value = trashBookmarks.value.filter(b => b.id !== id);
  selectedBookmarkId.value = restored.id;
  showToast('书签已从回收站恢复', 'success');
}

async function permanentDeleteSingle(id) {
  const target = trashBookmarks.value.find(b => b.id === id);
  trashBookmarks.value = await deleteFromTrashPermanently(id);

  // 若有关联远程，静默尝试向远程删除
  if (target && (target.isRemote || target.remoteId || target.source === 'remote')) {
    try {
      await remoteDeleteBookmark(target.url);
    } catch (e) {
      console.warn('远程永久删除失败:', e);
    }
  }

  if (selectedBookmarkId.value === id) {
    selectedBookmarkId.value = trashBookmarks.value[0]?.id || null;
  }
  showToast('已彻底删除');
}

async function clearAllTrash() {
  if (trashBookmarks.value.length === 0) return;
  const ok = await confirmDialog('确定要清空回收站吗？', '回收站中的所有书签将被永久删除，此操作无法撤销');
  if (ok) {
    trashBookmarks.value = await clearTrashStorage();
    if (activeView.value === 'trash') {
      selectedBookmarkId.value = null;
    }
    showToast('回收站已清空');
  }
}

async function deleteAtSource(target) {
  if (!target) return;
  if (target.source === 'chrome' && !isExtEnv.value) throw new Error('请在 Chrome 扩展中删除原生书签');
  const native = await selectNativeMatch(target);
  let remoteDeleted = false;
  if (target.isRemote || target.remoteId || target.source === 'remote') {
    const server = target.server || serverConfig.value.server?.replace(/\/+$/, '');
    if (server && serverConfig.value.server && server !== serverConfig.value.server.replace(/\/+$/, '')) {
      throw new Error('远程服务配置已改变');
    }
    const result = await remoteDeleteBookmark(target.url);
    if (!result.success) throw new Error(result.error || result.data?.msg || '远程删除失败');
    remoteDeleted = true;
  }
  if (native) {
    try { await chrome.bookmarks.remove(native.id); }
    catch (error) { throw new Error(`${remoteDeleted ? '远程已删除，但 Chrome 删除失败：' : 'Chrome 删除失败：'}${error.message}`); }
    await refreshChrome(true);
  }
}

async function selectNativeMatch(bookmark) {
  const matches = await findNativeBookmarkMatches(bookmark);
  if (matches.length <= 1) return matches[0] || null;
  const choices = Object.fromEntries(matches.map(match => [match.id,
    `${nativeFolders.value.find(folder => folder.id === `chrome:${match.parentId}`)?.path || match.parentId} / ${match.title || match.url}`]));
  const result = await Swal.fire({ title: '选择对应的本机书签', text: '同一网址存在多个副本，本次只操作所选项',
    input: 'select', inputOptions: choices, showCancelButton: true, confirmButtonText: '确定', cancelButtonText: '取消' });
  if (!result.isConfirmed) throw new Error('已取消操作');
  return matches.find(match => match.id === result.value);
}

async function moveBookmarksBatchToFolder(bookmarksList, folder) {
  if (!bookmarksList || bookmarksList.length === 0 || !folder || movingBookmark.value) return;
  movingBookmark.value = true;
  try {
    if (folder.source === 'chrome' && isExtEnv.value) {
      const parentId = folder.id.replace(/^chrome:/, '');
      for (const bm of bookmarksList) {
        try {
          let native = null;
          if (bm.nativeId) {
            try {
              const [node] = await chrome.bookmarks.get(bm.nativeId);
              if (node) native = node;
            } catch (_) {}
          }
          if (!native && bm.url) {
            const matches = await chrome.bookmarks.search({ url: bm.url });
            native = matches[0] || null;
          }

          let moved;
          if (native) {
            moved = await chrome.bookmarks.move(native.id, { parentId });
          } else {
            moved = await chrome.bookmarks.create({ parentId, title: bm.title, url: bm.url });
          }

          const current = bookmarks.value.find(item => item.id === bm.id);
          if (current) {
            current.nativeId = moved.id;
            current.nativeFolderId = folder.id;
            if (!current.source) {
              current.folderId = folder.id;
              current.folder = folder.path || folder.name;
              current.ancestorIds = [];
              let ancestor = folder;
              while (ancestor) {
                current.ancestorIds.unshift(ancestor.id);
                ancestor = nativeFolders.value.find(item => item.id === ancestor.parentId);
              }
            }
          }
        } catch (itemErr) {
          console.warn('Move bookmark item failed:', bm.title, itemErr);
        }
      }
      await refreshChrome(true);
      await persistChanges();
    } else {
      // 纯本地/自定义文件夹
      for (const bm of bookmarksList) {
        const current = bookmarks.value.find(item => item.id === bm.id);
        if (current) {
          current.folderId = folder.id;
          current.folder = folder.name;
          current.ancestorIds = [folder.id];
        }
      }
      await persistChanges();
    }

    const count = bookmarksList.length;
    showToast(count === 1 ? `已移动到「${folder.name}」` : `成功将 ${count} 个书签移动到「${folder.name}」`);
    selectedBatchIds.value = [];
    isBatchMode.value = false;
  } catch (error) {
    if (error.message !== '已取消操作') {
      showToast(error.message || '移动失败', 'error');
    }
  } finally {
    movingBookmark.value = false;
  }
}

async function moveBookmarkToFolder(bookmark, folder) {
  return moveBookmarksBatchToFolder([bookmark], folder);
}

async function moveActiveToFolder(event) {
  const bookmark = activeBookmark.value;
  const oldValue = bookmark.source === 'chrome' ? bookmark.folderId : bookmark.nativeFolderId || '';
  const folder = nativeFolders.value.find(item => item.id === event.target.value);
  if (!folder) return;
  try {
    await moveBookmarkToFolder(bookmark, folder);
  } catch {
    event.target.value = oldValue;
  }
}

function handleBookmarkDragStart(event, bm) {
  let idsToDrag = [];
  if (selectedBatchIds.value.includes(bm.id)) {
    idsToDrag = [...selectedBatchIds.value];
  } else {
    idsToDrag = [bm.id];
    selectedBatchIds.value = [bm.id];
  }

  draggedBookmarkIds.value = idsToDrag;
  draggedBookmarkId.value = bm.id;

  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', JSON.stringify(idsToDrag));

  if (idsToDrag.length > 1) {
    const badge = document.createElement('div');
    badge.style.position = 'fixed';
    badge.style.top = '-9999px';
    badge.style.left = '-9999px';
    badge.style.padding = '6px 14px';
    badge.style.background = '#4f46e5';
    badge.style.color = '#ffffff';
    badge.style.fontSize = '12px';
    badge.style.fontWeight = '600';
    badge.style.borderRadius = '9999px';
    badge.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.gap = '6px';
    badge.style.zIndex = '99999';
    badge.innerHTML = `<span>📑</span><span>移动 ${idsToDrag.length} 个书签</span>`;
    document.body.appendChild(badge);
    event.dataTransfer.setDragImage(badge, badge.offsetWidth / 2, badge.offsetHeight / 2);
    setTimeout(() => {
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    }, 0);
  }
}

function handleBookmarkDragEnd() {
  draggedBookmarkId.value = null;
  draggedBookmarkIds.value = [];
  dragOverFolderId.value = null;
}

function handleFolderDragStart(event, folder) {
  draggedFolderId.value = folder.id;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/folder-id', folder.id);
  event.dataTransfer.setData('text/plain', folder.id);
}

function handleFolderDragEnd() {
  draggedFolderId.value = null;
  dragOverFolderSortTarget.value = null;
  dragOverFolderId.value = null;
}

function isFolderDescendant(childId, ancestorId) {
  if (!childId || !ancestorId) return false;
  const folderMap = new Map(folders.value.map(f => [f.id, f]));
  let curr = folderMap.get(childId);
  while (curr?.parentId) {
    if (curr.parentId === ancestorId) return true;
    curr = folderMap.get(curr.parentId);
  }
  return false;
}

function getFolderSubtree(folderId) {
  const folderMap = new Map(folders.value.map(f => [f.id, f]));
  const root = folderMap.get(folderId);
  if (!root) return [];

  const childIds = new Set([folderId]);
  let added = true;
  while (added) {
    added = false;
    for (const f of folders.value) {
      if (f.parentId && childIds.has(f.parentId) && !childIds.has(f.id)) {
        childIds.add(f.id);
        added = true;
      }
    }
  }

  return folders.value.filter(f => childIds.has(f.id));
}

async function reorderFolders(srcFolder, targetFolder, position = 'before') {
  const subtree = getFolderSubtree(srcFolder.id);
  const subtreeIds = new Set(subtree.map(f => f.id));

  if (subtreeIds.has(targetFolder.id)) {
    showToast('无法将文件夹移动到其子文件夹内部', 'warning');
    return;
  }

  const remaining = folders.value.filter(f => !subtreeIds.has(f.id));
  const targetIdx = remaining.findIndex(f => f.id === targetFolder.id);
  if (targetIdx === -1) return;

  let insertIdx = targetIdx;
  if (position === 'before') {
    insertIdx = targetIdx;
  } else {
    const targetSubtree = getFolderSubtree(targetFolder.id);
    const targetSubtreeIds = new Set(targetSubtree.map(f => f.id));
    let lastIdx = targetIdx;
    for (let i = targetIdx + 1; i < remaining.length; i++) {
      if (targetSubtreeIds.has(remaining[i].id)) {
        lastIdx = i;
      } else {
        break;
      }
    }
    insertIdx = lastIdx + 1;
  }

  remaining.splice(insertIdx, 0, ...subtree);
  folders.value = reconcileRecords(folders.value, remaining);

  try {
    await saveStoredFolders(folders.value);
  } catch (e) {
    console.warn('保存文件夹排序失败:', e);
  }

  // 若处于 Chrome 扩展中且均为原生书签，同步移动 Chrome 原生书签树中的顺序
  if (isChromeExtension() && srcFolder.source === 'chrome' && targetFolder.source === 'chrome') {
    try {
      const srcNativeId = srcFolder.id.replace(/^chrome:/, '');
      const targetNativeId = targetFolder.id.replace(/^chrome:/, '');
      const targetNode = await new Promise(resolve => {
        chrome.bookmarks.get(targetNativeId, res => resolve(res?.[0]));
      });
      if (targetNode?.parentId) {
        const siblings = await new Promise(resolve => {
          chrome.bookmarks.getChildren(targetNode.parentId, resolve);
        });
        if (siblings && siblings.length > 0) {
          const siblingTargetIdx = siblings.findIndex(c => c.id === targetNativeId);
          if (siblingTargetIdx !== -1) {
            let chromeTargetIndex = position === 'before' ? siblingTargetIdx : siblingTargetIdx + 1;
            const currentSrcIdx = siblings.findIndex(c => c.id === srcNativeId);
            if (currentSrcIdx !== -1 && currentSrcIdx < siblingTargetIdx && position === 'before') {
              chromeTargetIndex = Math.max(0, chromeTargetIndex - 1);
            }
            await new Promise(resolve => {
              chrome.bookmarks.move(srcNativeId, {
                parentId: targetNode.parentId,
                index: chromeTargetIndex
              }, resolve);
            });
          }
        }
      }
    } catch (err) {
      console.warn('同步 Chrome 原生文件夹位置失败:', err);
    }
  }

  showToast(`已调整「${srcFolder.name}」排序`);
}

function handleFolderDragOver(event, folder) {
  if (draggedFolderId.value) {
    // 正在拖拽文件夹进行排序
    if (draggedFolderId.value === folder.id || isFolderDescendant(folder.id, draggedFolderId.value)) {
      dragOverFolderSortTarget.value = null;
      return;
    }
    event.dataTransfer.dropEffect = 'move';
    const rect = event.currentTarget.getBoundingClientRect();
    const relY = event.clientY - rect.top;
    const position = relY < rect.height / 2 ? 'before' : 'after';
    dragOverFolderSortTarget.value = { id: folder.id, position };
    dragOverFolderId.value = null;
  } else if (draggedBookmarkId.value || draggedBookmarkIds.value.length > 0) {
    // 正在拖拽书签移入文件夹
    event.dataTransfer.dropEffect = 'move';
    dragOverFolderId.value = folder.id;
    dragOverFolderSortTarget.value = null;
  }
}

function handleFolderDragLeave(event, folder) {
  if (dragOverFolderSortTarget.value?.id === folder.id) {
    dragOverFolderSortTarget.value = null;
  }
  if (dragOverFolderId.value === folder.id) {
    dragOverFolderId.value = null;
  }
}

async function handleFolderDrop(event, folder) {
  // 分流 1：如果拖入的是书签（单项或批量）
  if (draggedBookmarkId.value || draggedBookmarkIds.value.length > 0) {
    let ids = [];
    try {
      const dataStr = event.dataTransfer.getData('text/plain');
      if (dataStr && dataStr.startsWith('[') && dataStr.endsWith(']')) {
        ids = JSON.parse(dataStr);
      }
    } catch (_) {}
    if (!ids || ids.length === 0) {
      ids = draggedBookmarkIds.value.length > 0
        ? [...draggedBookmarkIds.value]
        : (draggedBookmarkId.value ? [draggedBookmarkId.value] : []);
    }

    dragOverFolderId.value = null;
    draggedBookmarkId.value = null;
    draggedBookmarkIds.value = [];

    const targetBookmarks = bookmarks.value.filter(b => ids.includes(b.id));
    if (targetBookmarks.length === 0) return;

    // 过滤掉原本已经在目标文件夹中的书签
    const toMove = targetBookmarks.filter(b => !isInFolder(b, folder));
    if (toMove.length === 0) {
      showToast(targetBookmarks.length === 1 ? `书签已在「${folder.name}」中` : `所选 ${targetBookmarks.length} 个书签均已在「${folder.name}」中`, 'info');
      return;
    }

    await moveBookmarksBatchToFolder(toMove, folder);
    return;
  }

  // 分流 2：如果拖入的是文件夹进行排序
  const srcId = draggedFolderId.value || event.dataTransfer.getData('text/folder-id');
  const sortTarget = dragOverFolderSortTarget.value;
  draggedFolderId.value = null;
  dragOverFolderSortTarget.value = null;
  dragOverFolderId.value = null;

  if (!srcId || !sortTarget || sortTarget.id !== folder.id || srcId === folder.id) {
    return;
  }

  const srcFolder = folders.value.find(f => f.id === srcId);
  if (!srcFolder) return;

  await reorderFolders(srcFolder, folder, sortTarget.position);
}

function recordVisit(id) {
  const bm = bookmarks.value.find(b => b.id === id);
  if (bm) {
    bm.visits = (bm.visits || 0) + 1;
    persistBookmark(bm);
  }
}

async function updateSnapshot(bm) {
  if (snapshotUpdatingId.value) return;
  snapshotUpdatingId.value = bm.id;
  let target;
  let previous;
  try {
    const screenshot = await captureBookmark(bm.url);
    // Returning to the workspace can refresh source data, replacing the original object.
    target = bookmarks.value.find(bookmark => bookmark.id === bm.id);
    if (!target) throw new Error('书签已不存在，截图未保存');
    previous = target.screenshot;
    target.screenshot = screenshot;
    await persistBookmark(target);
    showToast('真实网页截图已保存');
  } catch (error) {
    if (target) target.screenshot = previous;
    showToast(error.message || '截图失败，原快照未修改', 'error');
  } finally {
    snapshotUpdatingId.value = '';
  }
}

async function syncBookmarkTagsToRemote(bookmark) {
  if (isServerConnected.value && bookmark?.url) {
    try {
      await remoteAddBookmark({
        url: bookmark.url,
        title: bookmark.title,
        tags: bookmark.tags || [],
        imgbase64: bookmark.screenshot || ''
      });
    } catch (e) {
      console.warn('Sync tag to remote failed:', e);
    }
  }
}

function addActiveTag() {
  const tag = newTagInput.value.trim().replace(/^#/, '');
  if (tag && activeBookmark.value) {
    if (!activeBookmark.value.tags) activeBookmark.value.tags = [];
    if (!activeBookmark.value.tags.includes(tag)) {
      activeBookmark.value.tags.push(tag);
      persistBookmark(activeBookmark.value);
      syncBookmarkTagsToRemote(activeBookmark.value);
      showToast('标签添加成功');
    }
    newTagInput.value = '';
  }
}

function removeActiveTag(idx) {
  if (activeBookmark.value && activeBookmark.value.tags) {
    activeBookmark.value.tags.splice(idx, 1);
    persistBookmark(activeBookmark.value);
    syncBookmarkTagsToRemote(activeBookmark.value);
  }
}

const isSingleSyncing = ref(false);
const isBatchSyncing = ref(false);

async function syncSingleToRemote(bookmark) {
  if (!bookmark || !bookmark.url || isSingleSyncing.value) return;
  if (!isServerConnected.value) {
    showServerModal.value = true;
    showToast('请先配置并连接远程服务', 'info');
    return;
  }
  isSingleSyncing.value = true;
  try {
    const res = await remoteAddBookmark({
      url: bookmark.url,
      title: bookmark.title,
      tags: bookmark.tags || [],
      imgbase64: bookmark.screenshot || ''
    });
    if (res.success) {
      // 单独书签更新远端：就地更新本条书签状态，用 URL 查询远端单条返回的信息补齐 remoteId，不拉取全量列表
      const server = serverConfig.value.server?.replace(/\/+$/, '') || '';
      bookmark.isRemote = true;
      bookmark.server = server;
      if (!bookmark.sources) bookmark.sources = [];
      if (!bookmark.sources.includes('remote')) bookmark.sources.push('remote');

      let remoteRecord = res.data?.data?.bookmark || res.data?.bookmark || (res.data?.data?.id ? res.data?.data : null);
      if (!remoteRecord?.id) {
        remoteRecord = await fetchRemoteBookmarkByUrl(bookmark.url);
      }
      if (remoteRecord?.id != null) {
        bookmark.remoteId = remoteRecord.id;
        bookmark.remoteFolderId = `remote:${server}`;
      }

      await persistBookmark(bookmark);
      showToast(bookmark.isRemote || bookmark.source === 'remote' ? '已成功更新至远程服务！' : '书签已成功同步至远程服务！');
    } else {
      showToast(res.error || res.data?.msg || '同步至远程失败', 'error');
    }
  } catch (err) {
    showToast(err.message || '同步请求异常', 'error');
  } finally {
    isSingleSyncing.value = false;
  }
}

// 批量操作
function toggleBatchMode() {
  isBatchMode.value = !isBatchMode.value;
  selectedBatchIds.value = [];
}

const isAllSelected = computed(() => {
  return filteredList.value.length > 0 && selectedBatchIds.value.length === filteredList.value.length;
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedBatchIds.value = [];
  } else {
    selectedBatchIds.value = filteredList.value.map(b => b.id);
  }
}

async function batchSyncToRemote() {
  if (selectedBatchIds.value.length === 0 || isBatchSyncing.value) return;
  if (!isServerConnected.value) {
    showServerModal.value = true;
    showToast('请先配置并连接远程服务', 'info');
    return;
  }
  const targets = bookmarks.value.filter(b => selectedBatchIds.value.includes(b.id) && b.url);
  if (targets.length === 0) return;

  isBatchSyncing.value = true;
  try {
    let successCount = 0;
    const server = serverConfig.value.server?.replace(/\/+$/, '') || '';
    for (const bm of targets) {
      try {
        const res = await remoteAddBookmark({
          url: bm.url,
          title: bm.title,
          tags: bm.tags || [],
          imgbase64: bm.screenshot || ''
        });
        if (res.success) {
          successCount++;
          bm.isRemote = true;
          bm.server = server;
          if (!bm.sources) bm.sources = [];
          if (!bm.sources.includes('remote')) bm.sources.push('remote');
        }
      } catch (err) {
        console.warn(`Sync ${bm.url} to remote failed:`, err);
      }
    }
    if (successCount > 0) {
      await persistChanges();
      showToast(`成功同步 ${successCount} 个书签至远程！`);
    } else {
      showToast('批量同步失败，请检查远程连接', 'error');
    }
    selectedBatchIds.value = [];
    isBatchMode.value = false;
  } finally {
    isBatchSyncing.value = false;
  }
}

async function batchDelete() {
  if (selectedBatchIds.value.length === 0) return;
  // 点 删除 不要确认了：直接移入回收站
  const targets = bookmarks.value.filter(b => selectedBatchIds.value.includes(b.id));
  if (targets.length === 0) return;

  for (const target of targets) {
    try {
      const native = await selectNativeMatch(target);
      if (native?.id && typeof chrome !== 'undefined' && chrome.bookmarks?.remove) {
        try { await chrome.bookmarks.remove(native.id); } catch {}
      }
      await deleteStoredBookmark(target.id);
    } catch {}
  }

  const deletedIds = new Set(targets.map(t => t.id));
  bookmarks.value = bookmarks.value.filter(b => !deletedIds.has(b.id));
  await persistChanges();

  trashBookmarks.value = await moveToTrashStorage(targets);

  selectedBatchIds.value = [];
  isBatchMode.value = false;
  showToast(`已将 ${targets.length} 个书签移入回收站（可保留 7 天）`, 'info');
}

// 增删与管理文件夹
const folderContextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  folder: null
});

function openFolderContextMenu(event, folder) {
  event.preventDefault();
  event.stopPropagation();

  // 选中该文件夹
  selectedFolderFilter.value = folder.id;
  activeView.value = 'all';
  selectedTagFilter.value = '';

  const menuWidth = 160;
  const menuHeight = 140;
  const x = event.clientX + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 10 : event.clientX;
  const y = event.clientY + menuHeight > window.innerHeight ? window.innerHeight - menuHeight - 10 : event.clientY;

  folderContextMenu.value = {
    visible: true,
    x,
    y,
    folder
  };
}

function closeFolderContextMenu() {
  if (folderContextMenu.value.visible) {
    folderContextMenu.value.visible = false;
  }
}

async function createSubfolderAction(folder) {
  closeFolderContextMenu();
  if (!folder) return;

  const { value: folderName } = await Swal.fire({
    title: `在「${folder.name}」下新建文件夹`,
    input: 'text',
    placeholder: '请输入文件夹名称',
    showCancelButton: true,
    confirmButtonText: '创建',
    cancelButtonText: '取消',
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#94a3b8',
    inputValidator: (val) => {
      if (!val || !val.trim()) return '文件夹名称不能为空';
    }
  });

  if (!folderName || !folderName.trim()) return;

  try {
    if (folder.source === 'chrome' && isChromeExtension()) {
      const nativeParentId = folder.id.replace(/^chrome:/, '');
      await chrome.bookmarks.create({
        parentId: nativeParentId,
        title: folderName.trim()
      });
      scheduleChromeRefresh();
    } else {
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: folderName.trim(),
        parentId: folder.id,
        count: 0
      };
      folders.value.push(newFolder);
      await saveStoredFolders(folders.value);
    }
    showToast(`成功创建文件夹「${folderName.trim()}」`);
  } catch (error) {
    showToast(`创建失败: ${error.message}`, 'error');
  }
}

async function renameFolderAction(folder) {
  closeFolderContextMenu();
  if (!folder) return;

  const isSystemRoot = folder.source === 'chrome' && (
    ['chrome:1', 'chrome:2', 'chrome:3'].includes(folder.id) || folder.depth === 0
  );
  if (isSystemRoot) {
    showToast(`「${folder.name}」是浏览器内置根目录，无法重命名`, 'warning');
    return;
  }

  const { value: newName } = await Swal.fire({
    title: '重命名文件夹',
    input: 'text',
    inputValue: folder.name,
    showCancelButton: true,
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#94a3b8',
    inputValidator: (val) => {
      if (!val || !val.trim()) return '文件夹名称不能为空';
    }
  });

  if (!newName || newName.trim() === folder.name) return;

  try {
    if (folder.source === 'chrome' && isChromeExtension()) {
      const nativeId = folder.id.replace(/^chrome:/, '');
      await chrome.bookmarks.update(nativeId, { title: newName.trim() });
      scheduleChromeRefresh();
    } else {
      const target = folders.value.find(f => f.id === folder.id);
      if (target) {
        target.name = newName.trim();
        await saveStoredFolders(folders.value);
      }
    }
    showToast(`已重命名为「${newName.trim()}」`);
  } catch (error) {
    showToast(`重命名失败: ${error.message}`, 'error');
  }
}

async function deleteFolderAction(folder) {
  closeFolderContextMenu();
  if (!folder) return;

  const isSystemRoot = folder.source === 'chrome' && (
    ['chrome:1', 'chrome:2', 'chrome:3'].includes(folder.id) || folder.depth === 0
  );
  if (isSystemRoot) {
    showToast(`「${folder.name}」是浏览器内置根目录，无法删除`, 'warning');
    return;
  }

  const count = folderCounts.value.get(folder.id) || 0;

  // 如果里面还有书签，提示是否将里面书签一起删除；点取消就不要删了
  if (count > 0) {
    const result = await Swal.fire({
      title: `删除文件夹「${folder.name}」`,
      text: `该文件夹下还有 ${count} 个书签，是否将里面的书签一起删除？`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定一起删除',
      cancelButtonText: '取消',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8'
    });
    if (!result.isConfirmed) {
      return; // 点取消，就不要删了
    }
  } else {
    const result = await Swal.fire({
      title: `确定要删除文件夹「${folder.name}」吗？`,
      text: '该空文件夹将被移除。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8'
    });
    if (!result.isConfirmed) {
      return; // 点取消，就不要删了
    }
  }

  try {
    if (folder.source === 'chrome' && isChromeExtension()) {
      const nativeId = folder.id.replace(/^chrome:/, '');
      await new Promise((resolve, reject) => {
        chrome.bookmarks.removeTree(nativeId, () => {
          if (chrome.runtime?.lastError) reject(new Error(chrome.runtime.lastError.message));
          else resolve();
        });
      });
      scheduleChromeRefresh();
    } else {
      // 1. 删除该文件夹及其子树下的书签
      const subtreeIds = new Set(getFolderSubtree(folder.id).ids);
      const insideBmIds = new Set(bookmarks.value.filter(b => {
        if (isInFolder(b, folder)) return true;
        if (b.folderId && subtreeIds.has(b.folderId)) return true;
        if (b.nativeFolderId && subtreeIds.has(b.nativeFolderId)) return true;
        if (b.ancestorIds?.some(id => subtreeIds.has(id))) return true;
        return false;
      }).map(b => b.id));
      for (const bm of bookmarks.value) {
        if (insideBmIds.has(bm.id) && bm.source === 'remote') {
          try { await remoteDeleteBookmark(bm.remoteId); } catch (_) {}
        }
      }
      bookmarks.value = bookmarks.value.filter(b => !insideBmIds.has(b.id));
      await persistChanges();

      // 2. 从文件夹列表中删除
      handleDeleteFolder(folder.id);
    }

    if (selectedFolderFilter.value === folder.id) {
      selectedFolderFilter.value = '';
    }
    showToast(count > 0 ? `已删除文件夹及内部 ${count} 个书签` : `已删除文件夹「${folder.name}」`);
  } catch (error) {
    showToast(`删除失败: ${error.message}`, 'error');
  }
}

function handleAddFolder(newFolder) {
  folders.value.push(newFolder);
  saveStoredFolders(folders.value);
}

function handleDeleteFolder(id) {
  folders.value = folders.value.filter(f => f.id !== id);
  saveStoredFolders(folders.value);
}

async function handleCreateBookmark(newBm) {
  // 同步保存至本地原生书签文件夹
  if (isChromeExtension()) {
    const nativeNode = await saveToShioriFolder(newBm.url, newBm.title, newBm.folderId);
    if (nativeNode) {
      newBm.id = `chrome:${nativeNode.id}`;
      newBm.nativeId = nativeNode.id;
      newBm.source = 'chrome';
    }
  }

  bookmarks.value.unshift(newBm);
  bookmarks.value = aggregateBookmarksByUrl(bookmarks.value);
  persistChanges();
  selectedBookmarkId.value = newBm.id;

  // 同步保存至远程自建服务
  if (isServerConnected.value) {
    const res = await remoteAddBookmark({
      url: newBm.url,
      title: newBm.title,
      tags: newBm.tags,
      imgbase64: newBm.screenshot
    });
    if (res?.success) {
      newBm.isRemote = true;
      newBm.server = serverConfig.value.server?.replace(/\/+$/, '') || '';
      if (!newBm.sources) newBm.sources = [];
      if (!newBm.sources.includes('remote')) newBm.sources.push('remote');
      await persistBookmark(newBm);
    }
  }
}

// 导出与导入
function exportData() {
  exportDataAsJson({ bookmarks: bookmarks.value, folders: folders.value });
  showToast('备份文件已开始下载');
}

function handleImportFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const content = evt.target.result;
    const res = await importDataFromJson(content);
    if (res.success) {
      bookmarks.value = await getStoredBookmarks();
      folders.value = await getStoredFolders();
      await Promise.all([refreshChrome(true), refreshRemote()]);
      showToast(`成功恢复 ${res.count} 个书签！`);
    } else {
      showToast(`导入失败: ${res.error}`, 'error');
    }
  };
  reader.readAsText(file);
}

const isSyncing = ref(false);

async function handleManualSync() {
  if (isSyncing.value) return;
  isSyncing.value = true;
  try {
    await Promise.all([refreshChrome(true), refreshRemote()]);
    showToast('已强制刷新全部书签！');
  } catch (error) {
    showToast(`刷新失败: ${error.message}`, 'error');
  } finally {
    isSyncing.value = false;
  }
}

let remoteGeneration = 0;
let chromeGeneration = 0;
let disposed = false;
let refreshTimer;
let chromeRefreshTimer;
let pendingRemote = null;
let lastRemoteSyncTime = 0;
const REMOTE_SYNC_THROTTLE_MS = 30000;

function scheduleChromeRefresh() {
  clearTimeout(chromeRefreshTimer);
  chromeRefreshTimer = setTimeout(() => refreshChrome(true), 150);
}

let lastChromeDiffTime = 0;
const CHROME_DIFF_THROTTLE_MS = 2000;

async function refreshChrome(force = false) {
  if (!isChromeExtension()) return;
  const now = Date.now();
  if (!force && (now - lastChromeDiffTime < CHROME_DIFF_THROTTLE_MS)) {
    return;
  }
  lastChromeDiffTime = now;

  const generation = ++chromeGeneration;
  try {
    const library = await readChromeLibrary();
    if (disposed || generation !== chromeGeneration) return;

    // 先从 IndexedDB 读取最新的持久化书签，作为合并的基底，避免外部（如 Popup）写入的 tags/截图等元数据被 options 内存的旧数据冲掉
    const stored = await getStoredBookmarks();
    const baseStored = stored && stored.length > 0 ? stored : bookmarks.value;

    const merged = mergeLibraryBookmarks(baseStored, [
      ...baseStored.filter(b => b.source === 'remote' || b.isRemote), ...library.bookmarks
    ]);
    const aggregated = aggregateBookmarksByUrl(merged);
    const reconciled = reconcileRecords(bookmarks.value, aggregated);

    const bookmarksChanged = reconciled !== bookmarks.value;
    const mergedFolders = mergeSourceFolders(folders.value, library.folders, 'chrome');
    const foldersChanged = JSON.stringify(mergedFolders) !== JSON.stringify(folders.value);

    // 仅在真实检测到本地变动或强制同步时才执行视图更新与磁盘写入，达成静默无感对齐
    if (bookmarksChanged || foldersChanged || force) {
      bookmarks.value = reconciled;
      folders.value = mergedFolders;
      try {
        if (bookmarksChanged || force) await persistChanges();
        if (foldersChanged || force) await saveStoredFolders(folders.value);
        await setLastBookmarkSyncTime(Date.now());
      } catch (e) {
        console.warn('Chrome bookmarks could not be cached:', e);
      }

      if (pendingTargetUrl) {
        const matched = await focusBookmarkByUrl(pendingTargetUrl);
        if (matched) pendingTargetUrl = '';
      }
    }
  } catch (error) {
    console.warn('Chrome bookmarks could not be loaded:', error);
  }
}

function refreshRemote() {
  const key = JSON.stringify([serverConfig.value.server, serverConfig.value.token]);
  if (pendingRemote?.key === key) return pendingRemote.promise;
  const promise = loadRemote().finally(() => {
    if (pendingRemote?.promise === promise) pendingRemote = null;
  });
  pendingRemote = { key, promise };
  return promise;
}

async function loadRemote() {
  const generation = ++remoteGeneration;
  const config = { ...serverConfig.value };
  if (!config.server || !config.token) {
    bookmarks.value = reconcileRecords(bookmarks.value, bookmarks.value.filter(b => b.source !== 'remote'));
    folders.value = reconcileRecords(folders.value, folders.value.filter(f => f.source !== 'remote'));
    setConnectionState('disconnected');
    return;
  }
  setConnectionState('connecting');
  const server = config.server.replace(/\/+$/, '');
  bookmarks.value = reconcileRecords(bookmarks.value, bookmarks.value.filter(b => b.source !== 'remote' || b.server === server));
  folders.value = reconcileRecords(folders.value, folders.value.filter(f => f.source !== 'remote' || f.id === `remote:${server}`));
  try {
    // 包含复合书签（如本地关联了远程的书签或带有 remoteId 的书签），以便 fetchRemoteBookmarkUpdates 能获取全部已知远程 ID
    const cached = bookmarks.value.filter(b => (b.source === 'remote' || b.isRemote || b.remoteId != null) && (!b.server || b.server === server));
    const { bookmarks: records, complete } = await fetchRemoteBookmarkUpdates(config, cached);
    if (disposed || generation !== remoteGeneration) return;
    const merged = mergeLibraryBookmarks(bookmarks.value, [
      ...bookmarks.value.filter(b => b.source === 'chrome'),
      ...mergeRemoteBookmarks(cached, normalizeRemoteBookmarks(records, server), complete)
    ]);
    bookmarks.value = reconcileRecords(bookmarks.value, aggregateBookmarksByUrl(merged));
    folders.value = mergeSourceFolders(folders.value,
      [{ id: `remote:${server}`, name: '远程书签', source: 'remote', depth: 0 }], 'remote');
    setConnectionState('connected');
    // Cache successful reads so reopening the workspace can stop at a known page.
    try {
      await persistChanges();
      await saveStoredFolders(folders.value);
    } catch (error) {
      console.warn('Remote bookmarks could not be cached:', error);
    }
  } catch {
    if (!disposed && generation === remoteGeneration) setConnectionState('disconnected');
  }
}

const isManualSyncing = ref(false);

async function manualSyncRemote() {
  if (isManualSyncing.value) return;
  if (!serverConfig.value.server || !serverConfig.value.token) {
    showServerModal.value = true;
    showToast('请先配置并连接远程服务', 'info');
    return;
  }
  isManualSyncing.value = true;
  try {
    const beforeCount = bookmarks.value.length;
    await refreshRemote();
    const afterCount = bookmarks.value.length;
    const diff = Math.max(0, afterCount - beforeCount);
    showToast(diff > 0 ? `远程同步完成，新增 ${diff} 个书签！` : '远程书签已是对齐的最新状态！');
  } catch (err) {
    showToast(err.message || '远程同步失败', 'error');
  } finally {
    isManualSyncing.value = false;
  }
}

defineExpose({
  openServerSettings: () => { showServerModal.value = true; },
  manualSyncRemote,
  isManualSyncing
});

async function reloadConfig(force = false) {
  serverConfig.value = await getServerConfig();
  if (!disposed && force) await refreshRemote();
}

function handleRuntimeMessage(message, sender, sendResponse) {
  if (message?.type === 'BOOKMARK_UPDATED') {
    (async () => {
      const storedList = await getStoredBookmarks();
      if (storedList && storedList.length > 0) {
        bookmarks.value = reconcileRecords(bookmarks.value, aggregateBookmarksByUrl(storedList));
        if (pendingTargetUrl) {
          const matched = await focusBookmarkByUrl(pendingTargetUrl);
          if (matched) pendingTargetUrl = '';
        }
      }
    })();
  } else if (message?.type === 'FOCUS_BOOKMARK' && message?.url) {
    pendingTargetUrl = message.url;
    (async () => {
      const ok = await focusBookmarkByUrl(message.url);
      if (ok) pendingTargetUrl = '';
      try {
        const newQuery = `?url=${encodeURIComponent(message.url)}`;
        window.history.replaceState(null, '', newQuery);
      } catch {}
      sendResponse?.({ received: true, focused: ok });
    })();
    return true;
  }
}

function onGlobalKeyDown(e) {
  if (e.key === 'Escape') {
    closeFolderContextMenu();
  }
}

function onStorageChanged(changes, area) {
  if (area === 'local' && ['cutbookmark_shiori_config_v2', 'server', 'token', 'username'].some(key => key in changes)) reloadConfig(true);
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialUrl = urlParams.get('url') || urlParams.get('targetUrl');
  if (initialUrl) {
    pendingTargetUrl = initialUrl;
  }

  const storedList = await getStoredBookmarks();
  bookmarks.value = aggregateBookmarksByUrl(storedList);
  folders.value = await getStoredFolders();
  serverConfig.value = await getServerConfig();
  trashBookmarks.value = await getTrashBookmarks();

  let targetMatched = false;
  if (pendingTargetUrl) {
    targetMatched = await focusBookmarkByUrl(pendingTargetUrl);
    if (targetMatched) {
      pendingTargetUrl = '';
    }
  }

  if (!targetMatched && bookmarks.value.length > 0 && !selectedBookmarkId.value) {
    selectedBookmarkId.value = bookmarks.value[0].id;
  }

  if (disposed) return;
  if (isChromeExtension()) {
    for (const event of ['onCreated', 'onRemoved', 'onChanged', 'onMoved', 'onChildrenReordered', 'onImportEnded']) {
      chrome.bookmarks[event]?.addListener(scheduleChromeRefresh);
    }
    chrome.storage.onChanged?.addListener(onStorageChanged);
    chrome.runtime?.onMessage?.addListener(handleRuntimeMessage);
  }
  window.addEventListener('click', closeFolderContextMenu);
  window.addEventListener('scroll', closeFolderContextMenu, true);
  window.addEventListener('keydown', onGlobalKeyDown);
  // 初次加载：首屏本地缓存已就地展现，后台非阻塞静默对比 Chrome 原生书签与远程服务
  refreshChrome(false);
  refreshRemote();
});

onUnmounted(() => {
  disposed = true;
  clearTimeout(chromeRefreshTimer);
  window.removeEventListener('click', closeFolderContextMenu);
  window.removeEventListener('scroll', closeFolderContextMenu, true);
  window.removeEventListener('keydown', onGlobalKeyDown);
  if (isChromeExtension()) {
    for (const event of ['onCreated', 'onRemoved', 'onChanged', 'onMoved', 'onChildrenReordered', 'onImportEnded']) {
      chrome.bookmarks[event]?.removeListener(scheduleChromeRefresh);
    }
    chrome.storage.onChanged?.removeListener(onStorageChanged);
    chrome.runtime?.onMessage?.removeListener(handleRuntimeMessage);
  }
});
</script>
