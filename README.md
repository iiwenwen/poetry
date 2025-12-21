# Poetry - 个人诗歌展示网站

基于 Next.js 构建的现代化个人网站,用于展示和管理诗歌作品。

## ✨ 特性

- 🎨 现代化的 UI 设计,使用 Tailwind CSS
- 📱 完全响应式布局
- 🏷️ 基于标签的内容分类(俳句、诗歌等)
- 📄 无限滚动加载
- ⚡ 使用 SWR 进行数据缓存和状态管理
- 🔄 自动错误重试机制
- 💾 与 Memos API 集成

## 🛠️ 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript / JavaScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn-ui
- **数据获取**: SWR
- **包管理**: Bun

## 🚀 快速开始

### 安装依赖

```bash
bun install
```

### 环境配置

复制 `.env.example` 为 `.env.local` 并配置你的 API 地址:

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-memos-api.com/api/v1
```

### 开发

```bash
bun run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建

```bash
bun run build
```

### 启动生产服务器

```bash
bun run start
```

## 📁 项目结构

```
poetry/
├── components/          # React 组件
│   ├── ui/             # UI 基础组件
│   ├── CardContent.tsx # 卡片内容组件
│   ├── CardImage.tsx   # 卡片图片组件
│   ├── Header.js       # 页面头部
│   ├── Tabs.tsx        # 标签页组件
│   └── TabDataContext.tsx  # 数据上下文
├── lib/                # 工具函数和配置
│   ├── apiUtils.ts     # API 工具函数
│   ├── config.ts       # 应用配置
│   └── utils.ts        # 通用工具函数
├── pages/              # Next.js 页面
│   ├── _app.js         # 应用入口
│   ├── _document.js    # 文档配置
│   └── index.tsx       # 首页
├── public/             # 静态资源
├── styles/             # 全局样式
├── types/              # TypeScript 类型定义
└── MEMOS_API_DOCUMENTATION.md  # API 文档
```

## 📖 API 集成

本项目使用 Memos API 作为后端。详细的 API 使用说明请参考 [MEMOS_API_DOCUMENTATION.md](./MEMOS_API_DOCUMENTATION.md)。

### 主要功能

- 按标签获取内容
- 分页加载
- 自动重试和错误处理
- 响应数据缓存

## 🎯 配置

### 标签配置

在 `lib/config.ts` 中配置内容标签:

```typescript
export const TAGS = {
  HAIKU: '来写首俳句吧',
  POEM: '来写首诗吧'
} as const
```

### SWR 配置

在 `lib/config.ts` 中调整缓存策略:

```typescript
SWR: {
  dedupingInterval: 5000,
  refreshInterval: 0,
  revalidateOnFocus: false,
  // ...
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📄 许可证

MIT

---

**最后更新**: 2025-12-11
