import React from 'react';
import { CircleDashed, Gauge, Lightbulb, Orbit } from 'lucide-react';
import DirectoryPage from '../components/DirectoryPage';

const labs = [
  {
    key: 'acceleration',
    to: '/physics/acceleration',
    icon: Gauge,
    title: '速度与加速度',
    subtitle: 'Kinematics',
    desc: '对比匀速小车和加速小车，调节加速度并观察速度、位移和轨迹点的变化。',
    meta: '进入实验',
    accent: '#2563eb',
    enabled: true
  },
  {
    key: 'optics',
    to: '/physics/optics',
    icon: Lightbulb,
    title: '光学虚拟实验室',
    subtitle: 'Optics',
    desc: '探索直线传播、反射、平面镜成像、折射和色散，理解光在不同场景中的路径。',
    meta: '进入实验',
    accent: '#7c3aed',
    enabled: true
  },
  {
    key: 'freefall',
    to: null,
    icon: Orbit,
    title: '自由落体',
    subtitle: 'Gravity',
    desc: '通过高度、时间和重力加速度的关系，观察物体下落的运动规律。',
    meta: '开发中',
    accent: '#16a34a',
    enabled: false
  },
  {
    key: 'collision',
    to: null,
    icon: CircleDashed,
    title: '动量与碰撞',
    subtitle: 'Momentum',
    desc: '比较弹性碰撞和非弹性碰撞，观察质量与速度如何影响运动结果。',
    meta: '开发中',
    accent: '#f59e0b',
    enabled: false
  }
];

function PhysicsHome() {
  return (
    <DirectoryPage
      tone="physics"
      navBackTo="/"
      navBackLabel="返回首页"
      badge="物理实验室"
      title="用互动把物理看见"
      subtitle="从运动学到光学，每个实验都保留可调参数、动态反馈和关键结论，适合课堂演示，也适合学生自己反复探索。"
      primaryAction={{ to: '/physics/acceleration', label: '开始：速度与加速度' }}
      secondaryAction={{ to: '/physics/optics', label: '进入：光学实验室' }}
      cards={labs}
      about={{
        label: '学习建议',
        title: '先观察，再调参',
        text: '建议先运行默认实验，观察现象变化，再逐步调整参数。这样学生更容易把公式和真实运动联系起来。'
      }}
    />
  );
}

export default PhysicsHome;
