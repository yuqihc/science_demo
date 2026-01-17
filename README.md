# Science Demo Project (React Version)

这个项目已经成功迁移到 **React + Vite** 技术栈。

## 🚀 快速开始

由于你的环境中尚未检测到 Node.js，你需要先安装它才能运行此项目。

### 1. 安装 Node.js
请访问 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。
安装完成后，重启你的 IDE 或终端。

### 2. 安装依赖
在项目根目录 (`D:\science_demo`) 打开终端，运行：
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```
启动后，控制台会显示一个本地链接（通常是 `http://localhost:5173`），在浏览器中打开即可看到新的 React 版本。

## 📂 项目结构 (New)

- `src/`: 源代码目录
  - `main.jsx`: 入口文件
  - `App.jsx`: 路由配置
  - `pages/`: 页面组件
    - `Home.jsx`: 首页仪表盘
    - `Acceleration.jsx`: 加速度演示 (已重构为 React 组件)
  - `index.css`: 全局样式 (迁移自原 style.css)
- `package.json`: 项目依赖配置
- `vite.config.js`: 构建工具配置
- `legacy_static/`: 旧版静态 HTML 文件备份

## � 技术栈优势

- **组件化**: `Acceleration.jsx` 现在是一个独立的组件，状态管理更加清晰。
- **路由管理**: 使用 `react-router-dom` 管理页面跳转，体验如原生应用般流畅 (SPA)。
- **构建优化**: Vite 提供极速的热更新和打包优化。
- **扩展性**: 现在可以轻松引入 `axios` 进行网络请求，或引入 `Three.js` / `React Three Fiber` 制作 3D 演示。
