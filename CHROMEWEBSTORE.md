# Chrome Web Store Listing — 截屏书签 (CutBookmark)

> Last Updated: 2026-11-21

## Store Listing

**Extension Name** [REQUIRED]
> 截屏书签 CutBookmark - 智能网页截屏与书签管理工具

**Short Description** [REQUIRED]
> 一键捕获网页高清快照，支持 Chrome 原生书签实时双向整合、标签与笔记管理、视觉画廊工作台与离线安全存储。

**Detailed Description** [REQUIRED]
> 截屏书签 CutBookmark 是一款专为知识工作者、研究者和多标签重度用户打造的高效视觉书签管理扩展。
> 
> 不再对着枯燥无味的一行行纯文本链接发愁！CutBookmark 在你收藏网页的瞬间自动捕获当前视口的高清快照，并提供三栏式现代化视觉画廊工作台，帮你一眼认出曾经看过的网页。
> 
> 【核心功能亮点】
> 
> 1. 一键高清网页截屏与快捷收藏
> 点击右上角扩展图标，自动捕获当前网页快照，输入标题、标签与笔记，支持回车一键快捷保存。
> 
> 2. 原生书签无缝整合（双向实时同步）
> 深度打通 Chrome 原生书签树目录，无需放弃已有书签结构。既能在扩展内整理原生分类，也能直接与原生书签保持完全一致。
> 
> 3. 三栏式画廊管理工作台
> 支持三级目录树导航、多标签筛选检索、大图视觉灯箱浏览、详情编辑与即时全库搜索。
> 
> 4. 纯本地安全离线模式（零门槛免费使用）
> 所有快照与书签数据默认保存在本地 IndexedDB 中，不上传任何隐私数据，断网环境依然飞速可用。
> 
> 5. 官方云端实时漫游与自建兼容（Pro 版可选）
> 支持升级官方托管云服务，实现公司电脑与家用电脑跨设备实时漫游；同时开放自建服务器 API 接入，满足极客自由掌控。
> 
> 6. 安全回收站防护
> 移除书签无需繁琐二次确认，一键移入回收站，7天内随时一键无损还原，防误删更省心。
> 
> 【使用方法】
> 1. 打开任何网页，点击浏览器右上角 CutBookmark 图标；
> 2. 扩展自动完成页面快照截取，选择归属文件夹并添加自定义标签或备忘笔记；
> 3. 按下回车或点击「保存」，图标立即点亮五角星徽章提示已收藏；
> 4. 点击「打开管理工作台」，进入三栏视觉界面沉浸式管理你的所有知识资产。
> 
> 【隐私与安全承诺】
> 截屏书签严格尊重您的个人隐私：
> - 免费离线版的所有快照数据与书签均严格加密存储在用户浏览器本地；
> - 绝不收集、不出售任何个人浏览历史或隐私数据；
> - 仅在用户主动点击截图与保存时读取当前网页标题与视口图像。
> 
> 如有任何问题、建议或功能反馈，欢迎通过扩展选项页或 GitHub 社区与我们联系。

**Category** [REQUIRED]
> Productivity (生产力工具)

**Single Purpose** [REQUIRED]
> 捕获网页高清快照并与 Chrome 原生书签双向整合，提供三栏视觉化书签管理与分类检索。

**Primary Language** [REQUIRED]
> 中文 (简体) / Chinese (Simplified)

---

## English Store Listing (for Global Distribution)

**Extension Name (EN)**
> CutBookmark - Visual Screenshot & Bookmark Manager

**Short Description (EN)**
> Capture webpage screenshot snapshots instantly, organize with Chrome native bookmarks, tags, notes, and a 3-pane gallery workspace.

**Detailed Description (EN)**
> CutBookmark is a modern visual bookmarking tool designed for researchers, designers, and tab hoarders.
> 
> Never lose track of valuable web pages again. CutBookmark automatically takes a high-resolution screenshot snapshot when you save a page, helping you visually identify sites at a glance.
> 
> Key Features:
> - Instant Screenshot Capture: One-click visual snapshot with instant keyboard shortcut saving.
> - Chrome Native Bookmark Integration: Seamless two-way integration with your existing Chrome bookmark folders.
> - 3-Pane Gallery Workspace: Organize with folders, tags, notes, and full-text instant search.
> - 100% Offline & Private: Works completely offline using local IndexedDB without cloud fees or telemetry.
> - Cloud Sync & Multi-Device Roaming (Pro): Real-time sync across all your computers and web dashboard.
> - Trash Protection: Easy one-click deletion with automatic 7-day trash recovery.
> 
> Permissions & Privacy:
> All bookmark data and screenshots stay on your local machine by default. No personal browsing history is ever tracked, sold, or shared.

---

## Graphics & Assets Checklist

| 资产类型 | 官方规格标准 | 状态 | 存放位置 / 文件名 |
| :--- | :--- | :--- | :--- |
| **Store Icon [必需]** | 128×128 PNG | ✅ 已就绪 | `icons/icon-128.png` |
| **Screenshot 1 [必需]** | 1280×800 PNG | 🟡 待截取 | 快捷弹窗保存与网页截屏展示 |
| **Screenshot 2 [推荐]** | 1280×800 PNG | 🟡 待截取 | 三栏式工作台画廊卡片与大图灯箱 |
| **Screenshot 3 [推荐]** | 1280×800 PNG | 🟡 待截取 | Chrome 原生书签目录树与标签多选筛选 |
| **Screenshot 4 [推荐]** | 1280×800 PNG | 🟡 待截取 | 离线模式与云端多端漫游说明 |
| **Small Promo Tile [推荐]**| 440×280 PNG | 🟡 待制作 | 商店搜索推荐展位图 |
| **Marquee Promo Tile** | 1400×560 PNG | 🟡 待制作 | 商店首页 Banner 推荐大图 |

---

## Permissions Justification (审查团队权限声明)

| 权限 (Permission) | 类型 | 官方审查答辩说明 (Reviewer Justification) |
| :--- | :--- | :--- |
| `bookmarks` | API Permission | 用于读取、展示和双向同步用户现有的 Chrome 原生书签树目录，使用户在扩展内可以直接管理书签。 |
| `tabs` | API Permission | 用于在用户点击保存时获取当前活动网页的标题、URL 和 favicon，并在后台识别该网址是否已被收藏以更新状态。 |
| `activeTab` | API Permission | 用于在用户点击扩展图标时，调用 captureVisibleTab 截取当前视口生成书签快照预览。 |
| `storage` | API Permission | 用于持久化用户的个性化配置、上次同步时间戳及本地缓存设置。 |
| `notifications` | API Permission | 用于在全量书签同步完成或云端连接异常时向用户提供非阻塞系统状态提示。 |
| `<all_urls>` | Host Permission | 允许扩展将快照同步至用户自定义配置的远程自建服务器或官方云端 API 地址。 |

---

## Privacy & Data Use (数据隐私声明表)

- **是否收集用户数据？**：否（免费离线模式下无任何数据离开用户设备）。
- **认证凭证**：用户使用云同步服务时的登录 Token 仅加密存储于本地用于请求鉴权，绝不出售或共享。
- **网站内容**：仅在用户显式触发收藏时捕获当前网页可视范围快照，不注入脚本读取用户页面私密输入。
- **第三方共享**：绝对不与任何第三方广告商、数据中介共享或出售数据。
- **最小权限原则**：已遵循 Chrome Web Store 最小权限实践。
