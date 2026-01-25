---
alwaysApply: true
---
移动端优先（Mobile-First Optimization）

- 响应式布局：以 375–430 px 为基准断点，确保零横向溢出；组件流式伸缩，优先垂直堆叠。  
- 触控体验：可点击区域 ≥ 44×44 px，统一添加 `active:scale-95` 按压反馈，减少误触。  
- 可读性与美感：正文 `font-size ≥ 16 px` 禁用 iOS 自动缩放；容器圆角 `rounded-2xl` 以上，内边距 `p-4` 起步，留白充足，界面更轻盈。
