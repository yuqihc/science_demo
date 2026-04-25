import React from 'react';
import { Atom, Calculator, FlaskConical, Leaf } from 'lucide-react';
import DirectoryPage from '../components/DirectoryPage';

const subjects = [
  {
    key: 'physics',
    to: '/physics',
    icon: Atom,
    title: '物理实验室',
    subtitle: 'Physics',
    desc: '用动画和可调参数观察运动、力、光和能量，把公式变成可以看见的现象。',
    meta: '进入物理目录',
    accent: '#2563eb',
    enabled: true
  },
  {
    key: 'math',
    to: '/math',
    icon: Calculator,
    title: '数学乐园',
    subtitle: 'Math',
    desc: '从数感、加减法到立体图形，用点击、拖动和分步演示建立直观理解。',
    meta: '进入数学目录',
    accent: '#f97316',
    enabled: true
  },
  {
    key: 'chemistry',
    to: null,
    icon: FlaskConical,
    title: '化学探索',
    subtitle: 'Chemistry',
    desc: '分子结构、化学反应和元素周期表的互动演示模块正在规划中。',
    meta: '敬请期待',
    accent: '#dc2626',
    enabled: false
  },
  {
    key: 'biology',
    to: null,
    icon: Leaf,
    title: '生命科学',
    subtitle: 'Biology',
    desc: '细胞、遗传与生态系统等生命科学主题后续会加入可视化实验。',
    meta: '规划中',
    accent: '#16a34a',
    enabled: false
  }
];

function Home() {
  return (
    <DirectoryPage
      tone="science"
      badge="互动式科学学习平台"
      title="科学原理可视化"
      subtitle="面向课堂和自学的互动演示集合。通过可操作的动画、公式和实验场景，帮助学生把抽象概念转化为直观经验。"
      primaryAction={{ to: '/math', label: '进入数学乐园' }}
      secondaryAction={{ to: '/physics', label: '浏览物理实验' }}
      aside={{
        label: '今日推荐',
        title: '20 以内数的认识',
        text: '从小棒、计数器和大小比较开始，先建立稳固的数感。',
        to: '/math/number-sense-20',
        cta: '开始学习'
      }}
      cards={subjects}
      about={{
        label: '关于项目',
        title: '把知识点做成可触摸的实验',
        text: '项目基于 React 和 Vite 构建，目标是把数学与科学课程中的关键概念拆成小而完整的互动体验。'
      }}
    />
  );
}

export default Home;
