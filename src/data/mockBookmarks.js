export const INITIAL_BOOKMARKS = [
  {
    id: "bm-1",
    title: "Vue.js 3 - 渐进式 JavaScript 框架官方文档",
    url: "https://cn.vuejs.org/guide/introduction.html",
    domain: "cn.vuejs.org",
    folder: "前端技术/Vue生态",
    folderId: "folder-1",
    tags: ["Vue3", "前端开发", "文档", "核心库"],
    screenshot: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    color: "#42b883",
    notes: "Vue 3 组合式 API (Composition API) 核心指南与响应式基础。",
    dateAdded: 1711000000000,
    pinned: true,
    visits: 42
  },
  {
    id: "bm-2",
    title: "Tailwind CSS - 实用优先的现代化 CSS 框架",
    url: "https://tailwindcss.com/docs/installation",
    domain: "tailwindcss.com",
    folder: "前端技术/样式设计",
    folderId: "folder-2",
    tags: ["CSS", "Tailwind", "UI设计", "工具"],
    screenshot: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    color: "#38bdf8",
    notes: "原子化 CSS 快速查询手册，包含 Flex、Grid、间距与响应式断点。",
    dateAdded: 1711200000000,
    pinned: true,
    visits: 28
  },
  {
    id: "bm-3",
    title: "GitHub - vitejs/vite: Next Generation Frontend Tooling",
    url: "https://github.com/vitejs/vite",
    domain: "github.com",
    folder: "开源项目/构建工具",
    folderId: "folder-3",
    tags: ["Vite", "开源", "工程化", "前端开发"],
    screenshot: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
    color: "#646cff",
    notes: "极速的冷启动构建工具源码仓库，值得深读其插件机制与热更新原理。",
    dateAdded: 1711400000000,
    pinned: false,
    visits: 19
  },
  {
    id: "bm-4",
    title: "Dribbble - 探索全球顶级 UI/UX 设计师作品",
    url: "https://dribbble.com/shots/popular",
    domain: "dribbble.com",
    folder: "设计灵感/UI界面",
    folderId: "folder-4",
    tags: ["设计", "灵感", "UI/UX", "创意"],
    screenshot: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
    color: "#ea4c89",
    notes: "收集移动端 App 界面、毛玻璃卡片、微动效设计参考素材。",
    dateAdded: 1711600000000,
    pinned: false,
    visits: 35
  },
  {
    id: "bm-5",
    title: "MDN Web Docs - 开发者最权威的 Web 标准参考",
    url: "https://developer.mozilla.org/zh-CN/docs/Web",
    domain: "developer.mozilla.org",
    folder: "前端技术/参考文档",
    folderId: "folder-2",
    tags: ["MDN", "文档", "Web标准", "JavaScript"],
    screenshot: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    color: "#111827",
    notes: "查阅 Web API、DOM 事件规范与 CSS Grid 最新标准必看的参考指南。",
    dateAdded: 1711800000000,
    pinned: true,
    visits: 64
  },
  {
    id: "bm-6",
    title: "Lucide Icons - 美观一致的开源 SVG 图标库",
    url: "https://lucide.dev/icons",
    domain: "lucide.dev",
    folder: "设计灵感/资源库",
    folderId: "folder-4",
    tags: ["图标", "SVG", "资源", "UI设计"],
    screenshot: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80",
    color: "#f97316",
    notes: "支持 Vue 3、React 的高品质矢量图标库，现代应用界面必备。",
    dateAdded: 1712000000000,
    pinned: false,
    visits: 12
  },
  {
    id: "bm-7",
    title: "V2EX - 程序员、极客与创意工作者社区",
    url: "https://www.v2ex.com/?tab=hot",
    domain: "v2ex.com",
    folder: "社区资讯/技术论坛",
    folderId: "folder-5",
    tags: ["社区", "职场", "独立开发", "资讯"],
    screenshot: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    color: "#333333",
    notes: "关注独立开发者动态、技术杂谈与科技圈新闻分享。",
    dateAdded: 1712200000000,
    pinned: false,
    visits: 53
  },
  {
    id: "bm-8",
    title: "Figma - 基于浏览器的协同界面设计平台",
    url: "https://www.figma.com",
    domain: "figma.com",
    folder: "设计灵感/设计工具",
    folderId: "folder-4",
    tags: ["设计", "Figma", "协作", "原型"],
    screenshot: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80",
    color: "#a259ff",
    notes: "多人在线 UI 设计、组件库管理以及高保真原型交互制作。",
    dateAdded: 1712400000000,
    pinned: true,
    visits: 47
  }
];

export const INITIAL_FOLDERS = [
  { id: "all", name: "全部书签", count: 8, icon: "FolderArchive" },
  { id: "folder-1", name: "前端技术/Vue生态", count: 1, icon: "Code2" },
  { id: "folder-2", name: "前端技术/样式设计", count: 2, icon: "Palette" },
  { id: "folder-3", name: "开源项目/构建工具", count: 1, icon: "GitFork" },
  { id: "folder-4", name: "设计灵感/UI界面", count: 3, icon: "Sparkles" },
  { id: "folder-5", name: "社区资讯/技术论坛", count: 1, icon: "MessageSquare" }
];

export const ALL_TAGS = [
  "Vue3", "前端开发", "文档", "核心库", "CSS", "Tailwind",
  "UI设计", "工具", "Vite", "开源", "工程化", "设计",
  "灵感", "UI/UX", "创意", "MDN", "Web标准", "图标",
  "SVG", "资源", "社区", "职场", "独立开发", "Figma", "协作"
];
