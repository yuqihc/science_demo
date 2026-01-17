import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const fullBleed = { width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' };

  const subjects = [
    {
      key: 'physics',
      to: '/physics',
      icon: '⚛️',
      title: '物理',
      subtitle: 'Physics',
      desc: '探索力、运动、能量和物质的本质。',
      meta: '点击进入目录',
      accent: '#007AFF',
      enabled: true
    },
    {
      key: 'math',
      to: '/math',
      icon: '📐',
      title: '数学',
      subtitle: 'Math',
      desc: '从几何图形到微积分，可视化的数学之美。',
      meta: '点击进入目录',
      accent: '#FF9500',
      enabled: true
    },
    {
      key: 'chemistry',
      to: null,
      icon: '🧪',
      title: '化学',
      subtitle: 'Chemistry',
      desc: '分子结构、化学反应与元素周期表的互动展示。',
      meta: '建设中…',
      accent: '#FF3B30',
      enabled: false
    },
    {
      key: 'biology',
      to: null,
      icon: '🧬',
      title: '生物',
      subtitle: 'Biology',
      desc: '生命的奥秘，细胞、遗传与生态系统。',
      meta: '规划中…',
      accent: '#34C759',
      enabled: false
    }
  ];

  return (
    <div className="home-pro-max" style={fullBleed}>
      <style>{`
        .home-pro-max {
          min-height: 100vh;
          padding: 70px 20px 90px;
          box-sizing: border-box;
          background:
            radial-gradient(1200px 600px at 15% 5%, rgba(0, 122, 255, 0.18), rgba(0,0,0,0) 55%),
            radial-gradient(900px 500px at 85% 10%, rgba(255, 149, 0, 0.16), rgba(0,0,0,0) 55%),
            radial-gradient(1000px 700px at 50% 90%, rgba(52, 199, 89, 0.10), rgba(0,0,0,0) 60%),
            linear-gradient(180deg, #F7F8FA 0%, #F3F4F7 100%);
          position: relative;
          overflow: hidden;
        }
        .home-pro-max::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 25% 15%, rgba(255,255,255,0.75), rgba(255,255,255,0) 55%),
            radial-gradient(circle at 75% 20%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%);
          pointer-events: none;
        }
        .home-container {
          position: relative;
          max-width: 1120px;
          margin: 0 auto;
        }
        .home-hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }
        .home-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.8);
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          color: rgba(29, 29, 31, 0.75);
          font-size: 13px;
          font-weight: 600;
          width: fit-content;
        }
        .home-title {
          margin: 14px 0 10px;
          font-size: 54px;
          line-height: 1.05;
          letter-spacing: -1px;
          color: #0B0B0F;
        }
        .home-subtitle {
          max-width: 640px;
          margin: 0;
          font-size: 18px;
          line-height: 1.7;
          color: rgba(29, 29, 31, 0.65);
        }
        .home-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-top: 18px;
        }
        .home-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 44px;
          padding: 0 18px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          user-select: none;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.78);
          color: rgba(11, 11, 15, 0.9);
          box-shadow: 0 10px 26px rgba(0,0,0,0.06);
          backdrop-filter: blur(12px);
        }
        .home-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.10);
        }
        .home-pill.primary {
          border: 1px solid rgba(0,0,0,0);
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.95) 0%, rgba(88, 86, 214, 0.95) 100%);
          color: white;
          box-shadow: 0 18px 40px rgba(0, 122, 255, 0.25);
        }
        .home-pill.primary:hover {
          box-shadow: 0 22px 46px rgba(0, 122, 255, 0.30);
        }
        .home-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 34px;
        }
        .home-card {
          --accent: #007AFF;
          position: relative;
          border-radius: 26px;
          padding: 26px;
          text-decoration: none;
          color: inherit;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(255,255,255,0.65);
          box-shadow: 0 18px 50px rgba(0,0,0,0.06);
          backdrop-filter: blur(12px);
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          min-height: 210px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .home-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          background:
            radial-gradient(500px 200px at 20% 0%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 60%),
            radial-gradient(500px 260px at 80% 10%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 62%);
          pointer-events: none;
          opacity: 0.9;
        }
        .home-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 26px 70px rgba(0,0,0,0.10);
          border-color: rgba(0,0,0,0.06);
        }
        .home-card.disabled {
          opacity: 0.65;
          cursor: not-allowed;
          pointer-events: none;
          transform: none;
          box-shadow: 0 18px 50px rgba(0,0,0,0.06);
        }
        .home-card-top {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .home-icon {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 16px 34px rgba(0,0,0,0.08);
        }
        .home-kicker {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(0,0,0,0.05);
          color: rgba(29, 29, 31, 0.65);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }
        .home-card-title {
          position: relative;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.4px;
          margin-top: 8px;
          color: rgba(11, 11, 15, 0.92);
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .home-card-title small {
          font-size: 14px;
          font-weight: 800;
          color: rgba(29, 29, 31, 0.55);
        }
        .home-card-desc {
          position: relative;
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(29, 29, 31, 0.65);
          max-width: 520px;
        }
        .home-card-meta {
          position: relative;
          margin-top: auto;
          font-size: 13px;
          font-weight: 800;
          color: color-mix(in srgb, var(--accent) 75%, rgba(29, 29, 31, 0.35));
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .home-arrow {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(11, 11, 15, 0.75);
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .home-card:hover .home-arrow {
          transform: translateX(2px);
          background: rgba(0,0,0,0.06);
        }
        .home-about {
          margin-top: 26px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 28px;
          padding: 26px;
          box-shadow: 0 18px 50px rgba(0,0,0,0.06);
          backdrop-filter: blur(12px);
        }
        .home-about-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .home-about-title h3 {
          margin: 0;
          font-size: 16px;
          letter-spacing: 0.6px;
          color: rgba(29, 29, 31, 0.55);
          text-transform: uppercase;
          font-weight: 900;
        }
        .home-about p {
          margin: 0;
          font-size: 16px;
          line-height: 1.85;
          color: rgba(29, 29, 31, 0.72);
          max-width: 760px;
        }
        @media (max-width: 840px) {
          .home-title { font-size: 40px; }
          .home-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="home-container">
        <div className="home-hero">
          <div>
            <div className="home-badge">
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#34C759', boxShadow: '0 0 0 6px rgba(52, 199, 89, 0.15)' }} />
              交互式科学学习平台
            </div>
            <h1 className="home-title">科学原理可视化</h1>
            <p className="home-subtitle">
              探索数学、物理和化学的奥秘。用直观的互动动画，把抽象概念变成可触摸的理解。
            </p>

            <div className="home-actions">
              <Link to="/math" className="home-pill primary">
                进入数学乐园 <span style={{ opacity: 0.9 }}>→</span>
              </Link>
              <Link to="/physics" className="home-pill">
                浏览物理目录 <span style={{ opacity: 0.8 }}>→</span>
              </Link>
            </div>
          </div>

          <div style={{ minWidth: 260, maxWidth: 340, width: '100%' }}>
            <div className="home-about" style={{ marginTop: 0 }}>
              <div className="home-about-title">
                <h3>今日推荐</h3>
                <div className="home-kicker" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  适合入门
                </div>
              </div>
              <p>
                从“20以内数的认识”开始：捆小棒、数位、比较大小，快速建立数感。
              </p>
              <div style={{ marginTop: 16 }}>
                <Link to="/math/number-sense-20" className="home-pill" style={{ width: '100%', justifyContent: 'space-between' }}>
                  开始学习 <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="home-grid">
          {subjects.map((s) => {
            const Card = s.to ? Link : 'div';
            const cardProps = s.to ? { to: s.to } : {};
            return (
              <Card
                key={s.key}
                {...cardProps}
                className={`home-card ${s.enabled ? '' : 'disabled'}`}
                style={{ ['--accent']: s.accent }}
              >
                <div className="home-card-top">
                  <div className="home-icon">{s.icon}</div>
                  <div className="home-kicker">{s.enabled ? '可用' : '敬请期待'}</div>
                </div>
                <div className="home-card-title">
                  {s.title} <small>{s.subtitle}</small>
                </div>
                <p className="home-card-desc">{s.desc}</p>
                <div className="home-card-meta">
                  <span>{s.meta}</span>
                  <span className="home-arrow">→</span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="home-about">
          <div className="home-about-title">
            <h3>关于本项目</h3>
            <div className="home-kicker" style={{ ['--accent']: '#007AFF' }}>React + Vite</div>
          </div>
          <p>
            这是一个旨在通过可视化技术降低科学学习门槛的开源项目。每个模块都尽量做到“看得见、点得动、学得会”，让学习更轻松、更有成就感。
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
