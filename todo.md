# TODO

## 1. 图片体积过大
- [x] `public/assets` 下原图单张 2–23MB（landscape 约 166MB、portrait 约 116MB、背景图约 8.5MB），加载很慢

## 2. Gallery 导航使用 `<a href>` 而非 `<Link>`
- [x] `src/components/Navbar.jsx` 中桌面端与移动端菜单的 Gallery 链接使用 `<a href="/gallery">`，会触发整页刷新，导致路由切换动画失效、SPA 状态丢失。

## 3. 资源路径写法不一致
- [x] `vite.config.js` 设置了 `base: './'`（相对路径），但代码中图片使用 `/assets/...` 绝对路径。

## 4. `.gitignore` 忽略了 `package-lock.json`
- [x] `.gitignore` 中有 `/package-lock.json`，但该文件已被 git 跟踪，CI 中的 `npm ci` 依赖它。
- [x] `node_modules/` 虽然写在 `.gitignore` 中，但已有约 5000 个文件被 git 跟踪

## 5. 代码细节
- [x] `src/pages/Gallery.jsx`：打乱图片的 `useEffect` 依赖数组只有 `[categoryIndex]`，但使用了 `images` / `descriptions`，会触发 `react-hooks/exhaustive-deps` 警告

## 6. 图片隐私与仓库体积
- [ ] 原图保留了完整 EXIF 信息（可能包含 GPS 定位），人像照片存在隐私风险
- [ ] 原图（约 290MB）直接存放在 git 仓库中，仓库体积大

## 7. 移动端体验
### Gallery
- [x] 图片两侧的切换按钮（`p-4 text-3xl` + `gap-6`）在窄屏上占用约一半宽度，375px 宽的手机上图片只剩约 170px 宽
- [x] 不支持左右滑动切换图片
- [x] 全屏模式不支持双指缩放、下滑关闭
- [x] 没有当前位置指示（如 3 / 18），也没有缩略图总览，无法快速跳转
- [x] 类别切换使用 ‹ › 箭头，不直观
- [x] 全屏打开时背景页面仍可滚动
- [x] 使用 `90vh`，iOS Safari 地址栏伸缩时会导致图片被遮挡或跳动

### 首页 Hero
- [x] 背景图为 `w-full h-auto`，横版图在手机上只有约 190–280px 高，标题拥挤，且被 64px 高的导航栏遮挡
- [x] 标题字号只有两档（`text-4xl` / `md:text-6xl`），小屏适配不够细
- [ ] 首页背景图更适合横屏而非竖屏，应在未来寻找更适合移动端竖屏的背景图替换

### 导航栏
- [x] 移动端菜单打开后 ☰ 图标不会变为 ✕，点击菜单外部不会关闭菜单
- [x] “Hi, I am Jerry, nice to meet you” 在窄屏上过长，会换行或挤压
- [x] 部分可点击区域小于 44×44px；`hover:` 效果在触屏上无效，缺少 `active:` 状态反馈
- [x] 滚动监听未使用 `passive`，每次滚动都调用 `getBoundingClientRect`

### 通用
- [x] 动画未适配 `prefers-reduced-motion`
- [x] 未适配刘海屏安全区域（`viewport-fit=cover` / `safe-area-inset`）
- [x] 缺少 `<meta name="theme-color">`，手机浏览器顶栏颜色与网站不一致
