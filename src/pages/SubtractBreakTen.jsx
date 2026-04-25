import React, { useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import BottomActionBar from '../components/BottomActionBar';
import LessonShell from '../components/LessonShell';

const playStepSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.error('Audio play failed', e);
  }
};

const generateProblem = () => {
  const minuend = Math.floor(Math.random() * 9) + 11;
  const ones = minuend % 10;
  const subtrahend = Math.floor(Math.random() * (9 - ones)) + ones + 1;
  return { minuend, subtrahend };
};

function SubtractBreakTen() {
  const [problem, setProblem] = useState({ minuend: 13, subtrahend: 9 });
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const { minuend, subtrahend } = problem;
  const ones = minuend % 10;
  const tenMinus = 10 - subtrahend;
  const answer = tenMinus + ones;

  const steps = useMemo(() => [
    {
      title: '题目',
      description: `计算 ${minuend} - ${subtrahend}。先观察个位是否够减。`,
      formula: `${minuend} - ${subtrahend} = ?`,
      color: '#2563eb'
    },
    {
      title: '第 1 步：观察个位',
      description: `个位上的 ${ones} 不够减 ${subtrahend}，所以需要把十位拆开。`,
      formula: `${ones} < ${subtrahend}`,
      color: '#f97316'
    },
    {
      title: '第 2 步：拆成 10 和个位',
      description: `把 ${minuend} 看成 10 和 ${ones}，先用 10 来减。`,
      formula: `${minuend} = 10 + ${ones}`,
      color: '#7c3aed'
    },
    {
      title: '第 3 步：先算 10 减',
      description: `先算 10 - ${subtrahend}，得到 ${tenMinus}。`,
      formula: `10 - ${subtrahend} = ${tenMinus}`,
      color: '#db2777'
    },
    {
      title: '第 4 步：合并剩下的个位',
      description: `再把 ${tenMinus} 和原来的 ${ones} 合起来，得到 ${answer}。`,
      formula: `${tenMinus} + ${ones} = ${answer}`,
      color: '#16a34a'
    }
  ], [answer, minuend, ones, subtrahend, tenMinus]);

  useEffect(() => {
    if (!isAutoPlay) return undefined;
    if (currentStep >= steps.length - 1) {
      setIsAutoPlay(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentStep((step) => step + 1);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [currentStep, isAutoPlay, steps.length]);

  useEffect(() => {
    if (currentStep > 0) playStepSound();
    gsap.fromTo(
      '.break-ten-step-card',
      { y: 8, opacity: 0.75 },
      { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out' }
    );
  }, [currentStep]);

  const nextStep = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((step) => Math.max(step - 1, 0));
  const reset = () => {
    setCurrentStep(0);
    setIsAutoPlay(false);
  };
  const newProblem = () => {
    setProblem(generateProblem());
    setCurrentStep(0);
    setIsAutoPlay(false);
  };

  const step = steps[currentStep];

  return (
    <LessonShell
      backTo="/math"
      backLabel="返回数学乐园"
      title="20 以内退位减法"
      subtitle="破十法演示"
      tone="purple"
    >
      <div className="lesson-card" style={{ padding: 'clamp(20px, 5vw, 36px)', marginBottom: 22 }}>
        <div
          style={{
            fontSize: 'clamp(38px, 10vw, 60px)',
            fontWeight: 900,
            textAlign: 'center',
            color: '#1f2937',
            marginBottom: 24
          }}
        >
          {minuend} - {subtrahend} ={' '}
          <span style={{ color: currentStep === steps.length - 1 ? '#16a34a' : '#9ca3af' }}>
            {currentStep === steps.length - 1 ? answer : '?'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 150px))',
            justifyContent: 'center',
            gap: 18
          }}
        >
          <NumberBlock label="十位" value="10" active={currentStep >= 2} color={currentStep >= 3 ? '#db2777' : '#f59e0b'} />
          <NumberBlock label="个位" value={ones} active={currentStep >= 2} color={currentStep === 4 ? '#16a34a' : '#38bdf8'} />
        </div>
      </div>

      <div className="lesson-card break-ten-step-card" style={{ padding: 'clamp(20px, 5vw, 30px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 8,
              display: 'grid',
              placeItems: 'center',
              background: step.color,
              color: '#fff',
              fontSize: 24,
              fontWeight: 900,
              flex: '0 0 auto'
            }}
          >
            {currentStep === 0 ? '?' : currentStep}
          </div>
          <h2 style={{ margin: 0, color: step.color, fontSize: 'clamp(22px, 5vw, 30px)' }}>{step.title}</h2>
        </div>

        <p style={{ margin: '0 0 18px', color: '#475569', fontSize: 'clamp(16px, 4vw, 20px)', lineHeight: 1.7 }}>
          {step.description}
        </p>

        <div
          style={{
            padding: '18px 20px',
            borderRadius: 8,
            background: '#f8fafc',
            color: step.color,
            textAlign: 'center',
            fontSize: 'clamp(22px, 6vw, 32px)',
            fontWeight: 900
          }}
        >
          {step.formula}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22 }}>
          {steps.map((item, index) => (
            <span
              key={item.title}
              style={{
                width: index === currentStep ? 32 : 12,
                height: 12,
                borderRadius: 999,
                background: index <= currentStep ? item.color : '#d1d5db',
                transition: 'all 160ms ease'
              }}
            />
          ))}
        </div>
      </div>

      <BottomActionBar
        actions={[
          { key: 'prev', label: '上一步', icon: '←', onClick: prevStep, disabled: currentStep === 0 },
          { key: 'next', label: '下一步', icon: '→', onClick: nextStep, disabled: currentStep === steps.length - 1, variant: 'purple' },
          {
            key: 'auto',
            label: isAutoPlay ? '暂停' : '自动播放',
            icon: isAutoPlay ? 'Ⅱ' : '▶',
            onClick: () => setIsAutoPlay((value) => !value),
            variant: isAutoPlay ? 'danger' : 'success'
          },
          { key: 'reset', label: '重置', icon: '↺', onClick: reset },
          { key: 'new', label: '换一题', icon: '🎲', onClick: newProblem, variant: 'warning' }
        ]}
      />
    </LessonShell>
  );
}

function NumberBlock({ label, value, active, color }) {
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 10, opacity: active ? 1 : 0.42, transition: 'opacity 180ms ease' }}>
      <div
        style={{
          width: 'min(34vw, 120px)',
          aspectRatio: '1 / 1',
          borderRadius: 8,
          display: 'grid',
          placeItems: 'center',
          background: color,
          color: '#fff',
          fontSize: 'clamp(34px, 9vw, 48px)',
          fontWeight: 900,
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.14)'
        }}
      >
        {value}
      </div>
      <span style={{ color: '#64748b', fontSize: 15, fontWeight: 800 }}>{label}</span>
    </div>
  );
}

export default SubtractBreakTen;
