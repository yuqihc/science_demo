import React from 'react';
import {
  Blocks,
  Calculator,
  CircleEqual,
  Grid3X3,
  Minus,
  Plus,
  SplitSquareHorizontal
} from 'lucide-react';
import DirectoryPage from '../components/DirectoryPage';

const lessons = [
  {
    key: 'number-sense-20',
    to: '/math/number-sense-20',
    icon: Grid3X3,
    title: '20 以内数的认识',
    subtitle: 'Number Sense',
    desc: '通过小棒捆十、计数器和大小比较，建立十位、个位和数量关系的直观认识。',
    meta: '开始学习',
    accent: '#f97316',
    enabled: true
  },
  {
    key: 'add-subtract',
    to: '/math/add-subtract',
    icon: Plus,
    title: '10 以内加减法',
    subtitle: 'Add & Subtract',
    desc: '用物品合并、拿走和数的分成，理解加法和减法的真实含义。',
    meta: '开始练习',
    accent: '#16a34a',
    enabled: true
  },
  {
    key: 'carry-add',
    to: '/math/carry-add',
    icon: Calculator,
    title: '20 以内进位加法',
    subtitle: 'Make Ten',
    desc: '用凑十法分步演示进位过程，让 9 + 4 这类题目更容易理解。',
    meta: '挑战一下',
    accent: '#db2777',
    enabled: true
  },
  {
    key: 'subtract-break-ten',
    to: '/math/subtract-break-ten',
    icon: Minus,
    title: '20 以内退位减法',
    subtitle: 'Break Ten',
    desc: '用破十法拆分被减数，帮助学生看清每一步为什么成立。',
    meta: '开始学习',
    accent: '#9333ea',
    enabled: true
  },
  {
    key: 'mixed-operations-20',
    to: '/math/mixed-operations-20',
    icon: Calculator,
    title: '20以内加减混合',
    subtitle: 'Mixed Operations',
    desc: '用数量池演示先加入、再拿走的变化过程，帮助学生理解加减混合要按步骤观察数量。',
    meta: '综合练习',
    accent: '#16a34a',
    enabled: true
  },
  {
    key: 'chain-operations-20',
    to: '/math/chain-operations-20',
    icon: Plus,
    title: '20以内连加连减',
    subtitle: 'Step by Step',
    desc: '把连加连减拆成一步一步的中间结果，训练学生稳定地记录和推进口算过程。',
    meta: '分步计算',
    accent: '#f97316',
    enabled: true
  },
  {
    key: 'make-ten-friends',
    to: '/math/make-ten-friends',
    icon: Grid3X3,
    title: '找朋友凑十',
    subtitle: 'Make 10 Pairs',
    desc: '给一个数找能凑成 10 的朋友，强化进位加法和退位减法都会用到的核心数感。',
    meta: '专项练习',
    accent: '#7c3aed',
    enabled: true
  },
  {
    key: 'word-problems',
    to: '/math/word-problems',
    icon: CircleEqual,
    title: '简单应用题',
    subtitle: 'Story Problems',
    desc: '先读故事，再把故事转成算式，训练学生从文字情境中找数量关系。',
    meta: '读题列式',
    accent: '#0ea5e9',
    enabled: true
  },
  {
    key: 'vertical-arithmetic',
    to: '/math/vertical-arithmetic',
    icon: SplitSquareHorizontal,
    title: '竖式加减法入门',
    subtitle: 'Vertical Form',
    desc: '用十位、个位对齐的竖式演示，理解从个位开始算以及进位的基本规则。',
    meta: '位值书写',
    accent: '#db2777',
    enabled: true
  },
  {
    key: 'solid-shapes',
    to: '/math/solid-shapes',
    icon: Blocks,
    title: '认识立体图形',
    subtitle: '3D Shapes',
    desc: '旋转、展开和搭建立体图形，观察正方体、长方体、圆柱、圆锥和球。',
    meta: '探索空间',
    accent: '#0284c7',
    enabled: true
  },
  {
    key: 'equation-solver',
    to: '/math/equation-solver',
    icon: CircleEqual,
    title: '解方程演示',
    subtitle: 'Equation',
    desc: '通过移动、抵消和可视化公式，理解未知数和移项的基本思想。',
    meta: '开始探索',
    accent: '#7c3aed',
    enabled: true
  },
  {
    key: 'place-value-2d',
    to: '/math/place-value-2d',
    icon: SplitSquareHorizontal,
    title: '数字分解 2D',
    subtitle: 'Place Value',
    desc: '用十位条和个位块拆解两位数，清楚展示 35 = 3 个十 + 5 个一。',
    meta: '体验新版',
    accent: '#0ea5e9',
    enabled: true
  }
];

function MathHome() {
  return (
    <DirectoryPage
      tone="math"
      navBackTo="/"
      navBackLabel="返回首页"
      badge="数学乐园"
      title="从操作中理解数学"
      subtitle="每个模块都围绕一个核心概念设计，保留大按钮、清晰步骤和可重复练习，让低龄学生在触屏上也能顺畅操作。"
      primaryAction={{ to: '/math/number-sense-20', label: '先学数感' }}
      secondaryAction={{ to: '/math/add-subtract', label: '练习加减法' }}
      cards={lessons}
      about={{
        label: '学习路径',
        title: '数感、运算、空间逐步推进',
        text: '建议先完成 20 以内数的认识，再进入加减法和进退位，最后用 3D 图形模块训练空间想象。'
      }}
    />
  );
}

export default MathHome;
