import React from 'react';
import { Link } from 'react-router-dom';

function PhysicsHome() {
  const fullBleed = { width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' };

  const labs = [
    {
      key: 'acceleration',
      to: '/physics/acceleration',
      icon: '🏎️',
      title: '速度与加速度',
      subtitle: 'Kinematics',
      desc: '从匀速到匀加速，直观理解速度变化与 a 的意义。',
      meta: '进入实验',
      accent: '#007AFF',
      enabled: true
    },
    {
      key: 'optics',
      to: '/physics/optics',
      icon: '🌈',
      title: '光学折射',
      subtitle: 'Optics',
      desc: '观察反射、折射与色散，理解光在介质中的传播路径。',
      meta: '进入实验',
      accent: '#5856D6',
      enabled: true
    },
    {
      key: 'freefall',
      to: null,
      icon: '🍎',
      title: '自由落体',
      subtitle: 'Gravity',
      desc: '探索重力加速度 g 与运动规律的关系。',
      meta: '开发中…',
      accent: '#34C759',
      enabled: false
    },
    {
      key: 'collision',
      to: null,
      icon: '🎱',
      title: '动量与碰撞',
      subtitle: 'Momentum',
      desc: '弹性碰撞与非弹性碰撞的模拟演示与对比。',
      meta: '开发中…',
      accent: '#FF9500',
      enabled: false
    }
  ];

  return (
    <div className="physics-pro" style={fullBleed}>
      <style>{`
        .physics-pro{
          min-height: 100vh;
          padding: 70px 20px 90px;
          box-sizing: border-box;
          background:
            radial-gradient(1100px 620px at 20% 5%, rgba(0, 122, 255, 0.22), rgba(0,0,0,0) 55%),
            radial-gradient(900px 560px at 85% 20%, rgba(88, 86, 214, 0.18), rgba(0,0,0,0) 58%),
            linear-gradient(180deg, #F7F8FA 0%, #F3F4F7 100%);
          position: relative;
          overflow: hidden;
        }
        .physics-pro::before{
          content:'';
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 25% 12%, rgba(255,255,255,0.78), rgba(255,255,255,0) 55%),
            radial-gradient(circle at 75% 18%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%);
          pointer-events:none;
        }
        .physics-container{
          position: relative;
          max-width: 1120px;
          margin: 0 auto;
        }
        .physics-nav{
          display:flex;
          align-items:center;
          gap: 10px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .physics-pill{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          height: 42px;
          padding: 0 16px;
          border-radius: 14px;
          text-decoration:none;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.78);
          color: rgba(11, 11, 15, 0.9);
          box-shadow: 0 10px 26px rgba(0,0,0,0.06);
          backdrop-filter: blur(12px);
          transition: transform .2s ease, box-shadow .2s ease;
          user-select:none;
        }
        .physics-pill:hover{
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.10);
        }
        .physics-pill.primary{
          border: 1px solid rgba(0,0,0,0);
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.95) 0%, rgba(88, 86, 214, 0.95) 100%);
          color: #fff;
          box-shadow: 0 18px 40px rgba(0, 122, 255, 0.24);
        }
        .physics-hero{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap: 26px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .physics-badge{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.82);
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          color: rgba(29, 29, 31, 0.75);
          font-size: 13px;
          font-weight: 800;
          width: fit-content;
        }
        .physics-title{
          margin: 14px 0 10px;
          font-size: 46px;
          line-height: 1.06;
          letter-spacing: -0.8px;
          color: #0B0B0F;
        }
        .physics-subtitle{
          max-width: 680px;
          margin: 0;
          font-size: 18px;
          line-height: 1.7;
          color: rgba(29, 29, 31, 0.65);
        }
        .physics-quick{
          display:flex;
          gap: 12px;
          align-items:center;
          justify-content:flex-start;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .physics-grid{
          display:grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 28px;
        }
        .physics-card{
          --accent: #007AFF;
          position: relative;
          border-radius: 26px;
          padding: 24px;
          text-decoration: none;
          color: inherit;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(255,255,255,0.65);
          box-shadow: 0 18px 50px rgba(0,0,0,0.06);
          backdrop-filter: blur(12px);
          overflow: hidden;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          min-height: 210px;
          display:flex;
          flex-direction: column;
          gap: 10px;
        }
        .physics-card::before{
          content:'';
          position:absolute;
          inset:-1px;
          background:
            radial-gradient(520px 220px at 20% 0%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 62%),
            radial-gradient(520px 280px at 80% 10%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 64%);
          pointer-events:none;
          opacity: .92;
        }
        .physics-card:hover{
          transform: translateY(-6px);
          box-shadow: 0 26px 70px rgba(0,0,0,0.10);
          border-color: rgba(0,0,0,0.06);
        }
        .physics-card.disabled{
          opacity: .62;
          cursor: not-allowed;
          pointer-events: none;
          transform: none;
        }
        .physics-card-top{
          position: relative;
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 12px;
        }
        .physics-icon{
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size: 28px;
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 16px 34px rgba(0,0,0,0.08);
        }
        .physics-kicker{
          position: relative;
          display:inline-flex;
          align-items:center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(0,0,0,0.05);
          color: rgba(29, 29, 31, 0.65);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.2px;
        }
        .physics-card-title{
          position: relative;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.4px;
          margin-top: 8px;
          color: rgba(11, 11, 15, 0.92);
          display:flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .physics-card-title small{
          font-size: 14px;
          font-weight: 800;
          color: rgba(29, 29, 31, 0.55);
        }
        .physics-card-desc{
          position: relative;
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(29, 29, 31, 0.65);
          max-width: 540px;
        }
        .physics-card-meta{
          position: relative;
          margin-top: auto;
          font-size: 13px;
          font-weight: 900;
          color: color-mix(in srgb, var(--accent) 75%, rgba(29, 29, 31, 0.35));
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 12px;
        }
        .physics-arrow{
          width: 38px;
          height: 38px;
          border-radius: 14px;
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          display:flex;
          align-items:center;
          justify-content:center;
          color: rgba(11, 11, 15, 0.75);
          transition: transform .25s ease, background .25s ease;
        }
        .physics-card:hover .physics-arrow{
          transform: translateX(2px);
          background: rgba(0,0,0,0.06);
        }
        @media (max-width: 840px){
          .physics-title{ font-size: 38px; }
          .physics-grid{ grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="physics-container">
        <div className="physics-nav">
          <Link to="/" className="physics-pill">
            <span style={{ fontSize: 16 }}>🏠</span> 首页
          </Link>
          <Link to="/" className="physics-pill">
            <span style={{ fontSize: 16 }}>←</span> 返回
          </Link>
        </div>

        <div className="physics-hero">
          <div>
            <div className="physics-badge">
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#007AFF', boxShadow: '0 0 0 6px rgba(0, 122, 255, 0.16)' }} />
              物理实验室
            </div>
            <h1 className="physics-title">用互动把物理“看见”</h1>
            <p className="physics-subtitle">通过可视化实验，探索力学与光学的核心规律：从公式到直觉，一步到位。</p>
            <div className="physics-quick">
              <Link to="/physics/acceleration" className="physics-pill primary">
                开始：速度与加速度 <span style={{ opacity: 0.9 }}>→</span>
              </Link>
              <Link to="/physics/optics" className="physics-pill">
                进入：光学折射 <span style={{ opacity: 0.85 }}>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="physics-grid">
          {labs.map((l) => {
            const Card = l.to ? Link : 'div';
            const cardProps = l.to ? { to: l.to } : {};
            return (
              <Card
                key={l.key}
                {...cardProps}
                className={`physics-card ${l.enabled ? '' : 'disabled'}`}
                style={{ ['--accent']: l.accent }}
              >
                <div className="physics-card-top">
                  <div className="physics-icon">{l.icon}</div>
                  <div className="physics-kicker">{l.enabled ? '可用' : '敬请期待'}</div>
                </div>
                <div className="physics-card-title">
                  {l.title} <small>{l.subtitle}</small>
                </div>
                <p className="physics-card-desc">{l.desc}</p>
                <div className="physics-card-meta">
                  <span>{l.meta}</span>
                  <span className="physics-arrow">→</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PhysicsHome;
