# RunpengNie.github.io

Runpeng "Jerry" Nie 的个人网站，包括个人介绍和摄影作品集，部署在 GitHub Pages 上。

## 技术栈

| 用途 | 选型 |
|---|---|
| UI | React 18 |
| 路由 | React Router 6（`BrowserRouter`） |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3（PostCSS + Autoprefixer） |
| 动画 | framer-motion |
| 图标 | react-icons |
| 图片处理 | sharp（仅在构建时使用） |

## 快速开始

需要 Node.js 18.17 或更高版本（CI 使用 Node 20）。

```bash
npm ci            # 安装依赖
npm run dev       # 本地开发
npm run build     # 生产构建，输出到 dist/
npm run preview   # 本地预览构建结果
npm run images    # 只重新生成图片
```

`dev` 和 `build` 运行前都会先执行 `npm run images`，平时不需要手动运行。

## 目录结构

```text
├── .github/workflows/deploy.yml   # push 到 main 后自动构建并部署到 GitHub Pages
├── scripts/optimize-images.mjs    # 图片多尺寸生成脚本
├── public/
│   └── assets/
│       ├── landscape/             # 作品集：风景（原图）
│       ├── portrait/              # 作品集：人像（原图）
│       ├── generated/             # 脚本生成的多尺寸 WebP，不要手动修改
│       ├── backgroundPic*.jpg     # 首页背景图（原图）
│       └── profilepic.jpg         # 头像
├── src/
│   ├── main.jsx                   # 入口，挂载 BrowserRouter
│   ├── App.jsx                    # 布局（Navbar / 页面 / Footer）和路由切换动画
│   ├── components/
│   │   ├── Navbar.jsx             # 固定导航栏
│   │   ├── Footer.jsx
│   │   ├── ProgressiveImage.jsx   # 根据分辨率选尺寸、分步加载的图片组件
│   │   └── FullscreenViewer.jsx   # 全屏查看器：缩放、拖动、滑动切换、下滑关闭
│   ├── pages/
│   │   ├── Home.jsx               # 首页：Hero / About / Contact
│   │   └── Gallery.jsx            # 作品集，照片列表和描述也写在这里
│   ├── lib/
│   │   ├── images.js              # 读取 manifest、选择尺寸、预加载
│   │   ├── useDevicePixelRatio.js # 监听设备像素比变化
│   │   ├── useScrollLock.js       # 弹层打开时锁定页面滚动
│   │   └── motion.js              # 减少动画偏好（reduced motion）相关的滚动工具函数
│   └── data/imageManifest.json    # 脚本生成的图片清单，不要手动修改
├── vite.config.js
├── tailwind.config.js             # 主题色 accentColor / backGroundColor
└── todo.md                        # 已知问题清单
```

## 架构

### 页面与路由

- 只有两个路由：`/`（Home）和 `/gallery`（Gallery）。`App.jsx` 用 `AnimatePresence` 给路由切换加了淡入和位移动画；旧页面淡出后滚动回顶部，新页面从顶部开始显示。
- Home 是单页滚动结构，包括 `#home`、`#about`、`#contact` 几个区块。导航栏里的 Home / About 用平滑滚动定位到对应区块。如果当前不在首页，就先跳转到 `/`，再通过路由 `state.scrollToId` 告诉 Home 要滚动到哪里。
- 导航栏一开始是透明的。Home 用 `IntersectionObserver` 监听 Hero 区的副标题，副标题完全滚出视口顶部后，通过 `onHeroPassedChange` 通知 `App`，`App` 再把 `solid` 传给 Navbar，让它变成不透明。离开首页时会重置为透明。

### 移动端与无障碍

- **Hero**：手机上占满一屏（`100svh`），背景图裁切填充；`md` 以上保持原图比例。标题字号用 `clamp()` 随屏幕宽度连续变化。
- **导航栏**：窄屏显示简短名称；手机菜单的图标在 ☰ 和 ✕ 之间切换，点击菜单外部、按 Esc 或切换页面时自动关闭。
- **Gallery**：
  - 手机上隐藏图片两侧的箭头，改为左右滑动切换，位置指示（如 `3 / 18`）两侧也有箭头按钮。
  - 类别切换用标签按钮。
  - 底部有缩略图条，当前缩略图自动居中。
  - 弹层打开时锁定页面滚动。
- **全屏查看器**（`FullscreenViewer`）：
  - 用 Pointer Events 自己实现手势：双指缩放、放大后拖动、双击缩放、左右滑切换、下滑或点击背景关闭；桌面端支持滚轮缩放、方向键和 Esc。
  - 缩放倍数会传给 `ProgressiveImage`，放大后自动换成更高分辨率的版本，最大放大到 1 个图片像素对应 1 个设备像素。
- **通用**：
  - 可点击区域至少 44×44px；开启 Tailwind 的 `hoverOnlyWhenSupported`，触屏设备上不会出现残留的 hover 样式，触屏反馈用 `active:` 样式。
  - 适配刘海屏安全区域（`viewport-fit=cover` + `env(safe-area-inset-*)`），并设置了 `theme-color`。
  - 系统开启“减少动画”时，关闭平滑滚动，过渡动画缩短到几乎为零，framer-motion 也会跳过位移类动画（`MotionConfig reducedMotion="user"`）。
  - 视口高度用 `svh`/`dvh`，避免 iOS Safari 地址栏伸缩时布局跳动；不支持的浏览器回退到 `vh`（见 `index.css` 中的 `--svh` / `--dvh`）。

### 部署

- 每次 push 到 `main`，GitHub Actions 会运行 `npm ci` 和 `npm run build`，然后把 `dist/` 发布到 GitHub Pages。
- 这是用户主页，网站部署在域名根目录，所以 `vite.config.js` 里设置了 `base: '/'`，代码中的资源也统一用 `/assets/...` 绝对路径。
- GitHub Pages 不支持 SPA 路由回退。`vite.config.js` 里的 `copy-404` 插件会在构建结束后把 `index.html` 复制成 `404.html`，这样直接访问 `/gallery` 时也能由 React Router 接管。

## 图片方案

原图单张 2–23MB，最大分辨率 8000×6000，直接加载太慢。目标是让用户看到足够清晰的图，同时尽量少下载数据。

### 构建时：生成多个尺寸

`scripts/optimize-images.mjs` 会为首页背景图和作品集照片生成以下版本：

| 尺寸 | 长边 | 格式 | 用途 |
|---|---|---|---|
| thumb | 480px | WebP | 缩略图、加载过程中的过渡图 |
| 1080p | 1920px | WebP | 普通屏幕、手机 |
| 2k | 2560px | WebP | 2K 屏或高分屏 |
| 4k | 3840px | WebP | 4K 屏、全屏查看 |
| original | 原始尺寸 | 原文件 | 只在需要超过 4K 时使用 |

- 按长边缩放，比原图大的尺寸不生成（不放大）。
- 根据 EXIF 方向自动旋转，统一转换为 sRGB。生成的文件不含 EXIF，原图保持不变。
- 每张图还会生成一个 24px 的模糊占位图，以 base64 写进 manifest，随 JS 一起下发。
- 生成结果写入 `public/assets/generated/` 和 `src/data/imageManifest.json`。manifest 记录了每个尺寸的路径、宽高和体积，以及原图的 SHA-1 值。
- 生成是增量的：原图的 SHA-1 没变、生成的文件也都在时，直接跳过。原图删除后，对应的生成文件会被一起清理。修改编码参数后，需要把脚本里的 `ENCODER_VERSION` 加 1，或者运行 `npm run images -- --force` 全部重新生成。

### 运行时：根据设备选择尺寸

`ProgressiveImage` 组件的选择规则：

1. 用 `offsetWidth` / `offsetHeight` 取图片框的 CSS 尺寸。它们不受 transform 动画影响。
2. 计算图片实际渲染的宽度：默认（`fit="frame"`）等于图片框宽度；`fit="cover"` 时图片会被裁切，渲染宽度可能大于图片框。
3. 计算需要的物理像素：渲染宽度 × `devicePixelRatio` × 缩放倍数（`zoom`，全屏放大时使用）。
4. 从小到大选第一个宽度不小于这个值的尺寸。如果连 4K 都不够，才使用原图。

其他行为：

- **只升级不降级**：窗口变大、浏览器放大，或者窗口拖到更高分辨率的屏幕时，会换成更大的尺寸。窗口变小时保持当前尺寸，不会重复下载。
- **分步加载**：图片框按宽高比提前占位，页面不会跳动。内容分三层叠放：
  1. 内嵌的模糊占位图，不需要网络请求，立即显示；
  2. 缩略图，如果已经缓存了更大的尺寸就直接用那张；
  3. 目标尺寸，加载完成后淡入。
- **预加载**：Gallery 会预加载当前照片前后各 2 张，按它们在当前视图（普通或全屏）中的实际显示尺寸选择版本，不会预加载原图。
- 首页背景图设置了 `fetchpriority="high"`，优先加载；它还设置了 `maxDpr={2}`，按最多 2 倍像素比选择尺寸。因为手机上背景图被裁切放大、还盖着半透明遮罩，按 3 倍算会加载原图，多出来的清晰度看不出来。

## 添加照片

1. 把 JPG 或 PNG 放进 `public/assets/landscape/` 或 `public/assets/portrait/`。RAW 格式（如 `.dng`）不支持，需要先导出成 JPG。
2. 在 `src/pages/Gallery.jsx` 的 `categories` 中添加图片路径和对应描述。`images` 和 `descriptions` 按下标一一对应。
3. 运行 `npm run dev` 或 `npm run build`，会自动生成各个尺寸。把 `public/assets/generated/` 和 `src/data/imageManifest.json` 一起提交。

## 已知问题

见 [todo.md](./todo.md)。
