import React, { useMemo, useState } from 'react';
import LessonShell from '../../components/LessonShell';
import BottomActionBar from '../../components/BottomActionBar';
import './ArithmeticDemos.css';

const item = '🍎';

function clampStep(value, max) {
  return Math.max(0, Math.min(max, value));
}

function TokenArea({ count, addedFrom = 99, removedFrom = 99 }) {
  return (
    <div className="demo-token-area">
      {Array.from({ length: 20 }).map((_, index) => {
        const visible = index < count;
        const isAdded = index >= addedFrom && visible;
        const isRemoved = index >= removedFrom && visible;
        return (
          <div
            key={index}
            className={`demo-token ${isAdded ? 'is-added' : ''} ${isRemoved ? 'is-removed' : ''}`}
            aria-hidden={!visible}
          >
            {visible ? item : ''}
          </div>
        );
      })}
    </div>
  );
}

function StepStrip({ steps, active }) {
  return (
    <div className="demo-step-strip">
      {steps.map((step, index) => (
        <div key={step.label} className={`demo-step ${index === active ? 'is-active' : ''}`}>
          <span>{step.label}</span>
          <strong>{step.value}</strong>
        </div>
      ))}
    </div>
  );
}

function DemoActions({ onPrev, onNext, onReset, nextLabel = '下一步', disablePrev = false, disableNext = false }) {
  return (
    <BottomActionBar
      className="arithmetic-actions"
      actions={[
        { key: 'prev', label: '上一步', icon: '←', onClick: onPrev, disabled: disablePrev },
        { key: 'next', label: nextLabel, icon: '→', onClick: onNext, disabled: disableNext, variant: 'primary' },
        { key: 'reset', label: '重置', icon: '↺', onClick: onReset }
      ]}
    />
  );
}

const mixedExamples = [
  { start: 12, add: 3, sub: 5 },
  { start: 9, add: 6, sub: 4 },
  { start: 15, add: 2, sub: 8 }
];

export function MixedOperationsDemo() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const ex = mixedExamples[exampleIndex];
  const afterAdd = ex.start + ex.add;
  const result = afterAdd - ex.sub;
  const count = step === 0 ? ex.start : step === 1 ? afterAdd : afterAdd;
  const removedFrom = step >= 2 ? result : 99;
  const steps = [
    { label: '先有', value: ex.start },
    { label: '加入', value: `+${ex.add}` },
    { label: '拿走', value: `-${ex.sub}` },
    { label: '剩下', value: step >= 3 ? result : '?' }
  ];

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      setExampleIndex((exampleIndex + 1) % mixedExamples.length);
      setStep(0);
    }
  };

  return (
    <LessonShell title="20以内加减混合" subtitle="先加入，再拿走，观察数量怎么变化" tone="green">
      <div className="arithmetic-demo arithmetic-board" style={{ '--demo-accent': '#16a34a', '--demo-soft': '#ecfdf5' }}>
        <div className="demo-panel">
          <div className="demo-expression">
            <span>{ex.start}</span>
            <span className="demo-sign">+</span>
            <span>{ex.add}</span>
            <span className="demo-sign">-</span>
            <span>{ex.sub}</span>
            <span>=</span>
            <span className="demo-result">{step >= 3 ? result : '?'}</span>
          </div>
        </div>
        <TokenArea count={count} addedFrom={step >= 1 ? ex.start : 99} removedFrom={removedFrom} />
        <StepStrip steps={steps} active={step} />
        <div className="demo-panel demo-story">
          {step === 0 && `先摆出 ${ex.start} 个。`}
          {step === 1 && `再放进来 ${ex.add} 个，现在有 ${afterAdd} 个。`}
          {step === 2 && `从 ${afterAdd} 个里拿走 ${ex.sub} 个。`}
          {step === 3 && `最后剩下 ${result} 个，所以 ${ex.start} + ${ex.add} - ${ex.sub} = ${result}。`}
        </div>
        <DemoActions
          onPrev={() => setStep(clampStep(step - 1, 3))}
          onNext={next}
          onReset={() => setStep(0)}
          nextLabel={step < 3 ? '下一步' : '换一题'}
          disablePrev={step === 0}
        />
      </div>
    </LessonShell>
  );
}

const chainExamples = [
  { start: 6, ops: [4, 3] },
  { start: 18, ops: [-5, -2] },
  { start: 7, ops: [6, -4] }
];

export function ChainOperationsDemo() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const ex = chainExamples[exampleIndex];
  const values = useMemo(() => {
    const list = [ex.start];
    ex.ops.forEach((op) => list.push(list[list.length - 1] + op));
    return list;
  }, [ex]);
  const current = values[step];
  const result = values[values.length - 1];

  const next = () => {
    if (step < ex.ops.length) setStep(step + 1);
    else {
      setExampleIndex((exampleIndex + 1) % chainExamples.length);
      setStep(0);
    }
  };

  return (
    <LessonShell title="20以内连加连减" subtitle="每次只算一步，把中间结果看清楚" tone="orange">
      <div className="arithmetic-demo arithmetic-board" style={{ '--demo-accent': '#f97316', '--demo-soft': '#fff7ed' }}>
        <div className="demo-panel">
          <div className="demo-expression">
            <span>{ex.start}</span>
            {ex.ops.map((op, index) => (
              <React.Fragment key={index}>
                <span className="demo-sign">{op > 0 ? '+' : '-'}</span>
                <span>{Math.abs(op)}</span>
              </React.Fragment>
            ))}
            <span>=</span>
            <span className="demo-result">{step === ex.ops.length ? result : '?'}</span>
          </div>
        </div>
        <div className="demo-panel">
          <div className="number-line">
            {Array.from({ length: 21 }).map((_, index) => (
              <div key={index} className={`number-line-cell ${index === current ? 'is-current' : ''}`}>
                {index}
              </div>
            ))}
          </div>
        </div>
        <TokenArea count={current} />
        <StepStrip
          active={step}
          steps={values.map((value, index) => ({
            label: index === 0 ? '开始' : `第 ${index} 步`,
            value
          }))}
        />
        <div className="demo-panel demo-story">
          {step === 0 ? `先记住起点 ${ex.start}。` : `第 ${step} 步算出中间结果 ${current}。`}
        </div>
        <DemoActions
          onPrev={() => setStep(clampStep(step - 1, ex.ops.length))}
          onNext={next}
          onReset={() => setStep(0)}
          nextLabel={step < ex.ops.length ? '下一步' : '换一题'}
          disablePrev={step === 0}
        />
      </div>
    </LessonShell>
  );
}

const friendTargets = [4, 6, 7, 8, 9];

export function MakeTenFriendsDemo() {
  const [targetIndex, setTargetIndex] = useState(2);
  const [selected, setSelected] = useState(null);
  const target = friendTargets[targetIndex];
  const answer = 10 - target;
  const isCorrect = selected === answer;

  const next = () => {
    setTargetIndex((targetIndex + 1) % friendTargets.length);
    setSelected(null);
  };

  return (
    <LessonShell title="找朋友凑十" subtitle="看到一个数，马上找到和它一起凑成 10 的朋友" tone="purple">
      <div className="arithmetic-demo arithmetic-board" style={{ '--demo-accent': '#7c3aed', '--demo-soft': '#f5f3ff' }}>
        <div className="demo-panel">
          <div className="demo-expression">
            <span>{target}</span>
            <span className="demo-sign">+</span>
            <span className="demo-result">{selected ?? '?'}</span>
            <span>=</span>
            <span>10</span>
          </div>
        </div>
        <div className="demo-panel">
          <div className="choice-grid">
            {Array.from({ length: 11 }).map((_, value) => (
              <button
                key={value}
                type="button"
                className={`choice-button ${selected === value ? 'is-selected' : ''} ${value === answer ? 'is-pair' : ''} ${isCorrect && value === answer ? 'is-correct' : ''}`}
                onClick={() => setSelected(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="demo-panel demo-story">
          {selected == null && `给 ${target} 找朋友，谁和它合起来是 10？`}
          {selected != null && !isCorrect && `${target} + ${selected} 还不是 10，再试一次。`}
          {isCorrect && `对了，${target} 和 ${answer} 是凑十朋友。拆十时也会用到它们。`}
        </div>
        <div className="demo-panel">
          <StepStrip
            active={isCorrect ? 2 : selected == null ? 0 : 1}
            steps={[
              { label: '看到', value: target },
              { label: '想到差几', value: answer },
              { label: '凑成', value: 10 }
            ]}
          />
        </div>
        <DemoActions
          onPrev={() => setSelected(null)}
          onNext={next}
          onReset={() => setSelected(null)}
          nextLabel="换一题"
          disablePrev={selected == null}
        />
      </div>
    </LessonShell>
  );
}

const storyExamples = [
  { text: '树上有 8 个苹果，又飞来 5 个苹果。现在一共有多少个？', a: 8, op: '+', b: 5 },
  { text: '篮子里有 14 个苹果，小朋友拿走 6 个。篮子里还剩多少个？', a: 14, op: '-', b: 6 },
  { text: '桌上有 9 个苹果，妈妈又放上 4 个。现在有多少个？', a: 9, op: '+', b: 4 }
];

export function WordProblemDemo() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const ex = storyExamples[exampleIndex];
  const result = ex.op === '+' ? ex.a + ex.b : ex.a - ex.b;
  const next = () => {
    if (step < 2) setStep(step + 1);
    else {
      setExampleIndex((exampleIndex + 1) % storyExamples.length);
      setStep(0);
    }
  };

  return (
    <LessonShell title="简单应用题" subtitle="先读故事，再把故事变成算式" tone="blue">
      <div className="arithmetic-demo arithmetic-board" style={{ '--demo-accent': '#0ea5e9', '--demo-soft': '#f0f9ff' }}>
        <div className="demo-panel demo-story">{ex.text}</div>
        <div className="story-scene">
          <div className="story-basket">
            {Array.from({ length: Math.min(ex.a, 20) }).map((_, index) => <span key={index} className="demo-token">{item}</span>)}
          </div>
          <div className="story-operator">{ex.op}</div>
          <div className="story-basket">
            {Array.from({ length: Math.min(ex.b, 20) }).map((_, index) => <span key={index} className="demo-token">{item}</span>)}
          </div>
        </div>
        <div className="demo-panel">
          <div className="demo-expression">
            <span>{step >= 1 ? ex.a : '?'}</span>
            <span className="demo-sign">{step >= 1 ? ex.op : '?'}</span>
            <span>{step >= 1 ? ex.b : '?'}</span>
            <span>=</span>
            <span className="demo-result">{step >= 2 ? result : '?'}</span>
          </div>
        </div>
        <StepStrip
          active={step}
          steps={[
            { label: '读题', value: '故事' },
            { label: '列式', value: step >= 1 ? `${ex.a}${ex.op}${ex.b}` : '?' },
            { label: '作答', value: step >= 2 ? result : '?' }
          ]}
        />
        <DemoActions
          onPrev={() => setStep(clampStep(step - 1, 2))}
          onNext={next}
          onReset={() => setStep(0)}
          nextLabel={step < 2 ? '下一步' : '换一题'}
          disablePrev={step === 0}
        />
      </div>
    </LessonShell>
  );
}

const verticalExamples = [
  { top: 13, bottom: 5, op: '+', carry: 0 },
  { top: 8, bottom: 7, op: '+', carry: 1 },
  { top: 16, bottom: 4, op: '-', carry: 0 }
];

function splitNumber(n) {
  return { tens: Math.floor(n / 10), ones: n % 10 };
}

export function VerticalArithmeticDemo() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const ex = verticalExamples[exampleIndex];
  const result = ex.op === '+' ? ex.top + ex.bottom : ex.top - ex.bottom;
  const top = splitNumber(ex.top);
  const bottom = splitNumber(ex.bottom);
  const res = splitNumber(result);
  const showCarry = ex.carry && step >= 2;

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      setExampleIndex((exampleIndex + 1) % verticalExamples.length);
      setStep(0);
    }
  };

  return (
    <LessonShell title="竖式加减法入门" subtitle="个位对个位，十位对十位，从个位开始算" tone="purple">
      <div className="arithmetic-demo arithmetic-board" style={{ '--demo-accent': '#db2777', '--demo-soft': '#fdf2f8' }}>
        <div className="vertical-layout">
          <div className="vertical-sheet">
            <div className="vertical-grid">
              <div />
              <div className="label">十位</div>
              <div className="label">个位</div>
              <div />
              <div className="carry-mark">{showCarry ? '1' : ''}</div>
              <div />
              <div />
              <div>{top.tens || ''}</div>
              <div>{top.ones}</div>
              <div className="op">{ex.op}</div>
              <div>{bottom.tens || ''}</div>
              <div>{bottom.ones}</div>
              <div className="vertical-line" />
              <div />
              <div>{step >= 3 ? (res.tens || '') : ''}</div>
              <div>{step >= 1 ? res.ones : ''}</div>
            </div>
          </div>
          <div className="demo-panel demo-note">
            {step === 0 && `先把 ${ex.top} 和 ${ex.bottom} 按个位、十位对齐。`}
            {step === 1 && `先算个位，得到个位上的 ${res.ones}。`}
            {step === 2 && (ex.carry ? '个位满十，向十位进 1。' : '这一步没有进位或退位，继续看十位。')}
            {step === 3 && `最后结果是 ${result}。`}
          </div>
        </div>
        <StepStrip
          active={step}
          steps={[
            { label: '对齐', value: '位值' },
            { label: '个位', value: step >= 1 ? res.ones : '?' },
            { label: '进退位', value: ex.carry ? '+1' : '无' },
            { label: '结果', value: step >= 3 ? result : '?' }
          ]}
        />
        <DemoActions
          onPrev={() => setStep(clampStep(step - 1, 3))}
          onNext={next}
          onReset={() => setStep(0)}
          nextLabel={step < 3 ? '下一步' : '换一题'}
          disablePrev={step === 0}
        />
      </div>
    </LessonShell>
  );
}
