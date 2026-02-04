import React from 'react';
import { Link } from 'react-router-dom';

function MathHome() {
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#e5e5f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#333',
    },
    navBar: {
      width: '100%',
      margin: '0 0 40px',
      display: 'flex',
      gap: '15px',
      padding: '40px 20px 0',
      boxSizing: 'border-box',
    },
    navBtn: {
      background: 'white',
      padding: '12px 24px',
      borderRadius: '50px',
      textDecoration: 'none',
      color: '#333',
      fontWeight: 'bold',
      fontSize: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
    },
    header: {
      textAlign: 'center',
      marginBottom: '60px',
      position: 'relative',
      zIndex: 1,
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '800',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#555',
      width: '100%',
      padding: '0 20px',
      boxSizing: 'border-box',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      width: '100%',
      margin: '0 auto',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px',
      boxSizing: 'border-box',
    },
    card: {
      padding: '35px 25px',
      textDecoration: 'none',
      color: '#333',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    iconBox: {
      width: '90px',
      height: '90px',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '42px',
      marginBottom: '24px',
      background: 'white',
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      transition: 'transform 0.4s ease',
    },
    cardTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '12px',
      color: '#2d3748',
    },
    cardDesc: {
      fontSize: '0.95rem',
      color: '#718096',
      marginBottom: '28px',
      lineHeight: '1.6',
      flexGrow: 1,
    },
    cta: {
      padding: '12px 28px',
      borderRadius: '50px',
      fontWeight: '600',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
  };

  const cards = [
    {
      to: "/math/number-sense-20",
      practiceTo: "/math/number-sense-20/practice",
      icon: "🔢",
      color: "#FF9500",
      bg: "linear-gradient(135deg, #FF9500 0%, #FFCC00 100%)",
      title: "20以内数的认识",
      desc: "学习数数、数的组成、数位和比较大小，打好数学基础。",
      cta: "开始学习"
    },
    {
      to: "/math/add-subtract",
      practiceTo: "/math/add-subtract/practice",
      icon: "➕",
      color: "#4CAF50",
      bg: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
      title: "10以内的加减法",
      desc: "通过有趣的互动，理解加法是合并，减法是去掉。",
      cta: "开始练习"
    },
    {
      to: "/math/carry-add",
      icon: "🔟",
      color: "#E91E63",
      bg: "linear-gradient(135deg, #E91E63 0%, #FF4081 100%)",
      title: "20以内进位加法",
      desc: "掌握“凑十法”，让进位加法变得简单又有趣！",
      cta: "挑战一下"
    },
    {
      to: "/math/subtract-break-ten",
      icon: "➖",
      color: "#9C27B0",
      bg: "linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)",
      title: "20以内退位减法",
      desc: "通过'破十法'轻松掌握退位减法，让数学更有趣！",
      cta: "开始学习"
    },
    {
      to: "/math/solid-shapes",
      icon: "🧊",
      color: "#2196F3",
      bg: "linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)",
      title: "认识立体图形",
      desc: "探索正方体、长方体、圆柱和球体，培养空间想象力。",
      cta: "探索空间"
    },
    {
      to: "/math/equation-solver",
      icon: "⚖️",
      color: "#8B5CF6",
      bg: "linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%)",
      title: "解方程演示",
      desc: "通过动画理解移项和抵消，轻松掌握解方程的奥秘！",
      cta: "开始探索"
    },
    {
      to: "/math/place-value-2d",
      icon: "🎨",
      color: "#8B5CF6",
      bg: "linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%)",
      title: "数字分解 (2D新版)",
      desc: "全新的2D互动演示，更清晰地展示位值概念。",
      cta: "体验新版"
    }
  ];

  return (
    <div style={styles.container}>
      <style>
        {`
          body {
            margin: 0;
            padding: 0 !important;
            display: block !important;
            background-color: #e5e5f7 !important;
          }
          #root {
            width: 100%;
          }
          .nav-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          }
          .math-card {
            cursor: pointer;
          }
          .math-card:hover {
            transform: translateY(-12px) scale(1.02);
            z-index: 10;
          }
          .math-card:hover .icon-box {
            transform: scale(1.1) rotate(6deg);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
          }
          .cta-btn {
            background: #f7fafc;
            color: #4a5568;
            box-shadow: inset 0 0 0 1px #e2e8f0;
          }
          .cta-btn:hover {
            color: white; /* Will be overridden inline */
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: translateY(-2px);
          }
        `}
      </style>

      {/* Navigation */}
      <div style={styles.navBar}>
        <Link to="/" className="nav-btn" style={styles.navBtn}>
          <span style={{ fontSize: '18px' }}>🏠</span> 首页
        </Link>
        <Link to="/" className="nav-btn" style={styles.navBtn}>
          <span style={{ fontSize: '18px' }}>←</span> 返回
        </Link>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📐 数学乐园</h1>
        <div style={styles.subtitle}>
          ✨ 开启你的奇妙数学之旅，探索数字与图形的奥秘！
        </div>
      </div>

      {/* Dashboard Grid */}
      <div style={styles.grid}>
        {cards.map((card, index) => (
          <div
            key={index}
            className="math-card"
            style={styles.card}
          >
            {/* Clickable Area for Demo */}
            <Link 
              to={card.to} 
              style={{textDecoration: 'none', color: 'inherit', display:'flex', flexDirection:'column', alignItems:'center', width: '100%', flexGrow: 1}}
            >
              <div
                className="icon-box"
                style={{
                  ...styles.iconBox,
                  color: card.color
                }}
              >
                {card.icon}
              </div>

              <div style={styles.cardTitle}>{card.title}</div>
              <div style={styles.cardDesc}>{card.desc}</div>
            </Link>

            {/* Actions Area */}
            <div style={{display: 'flex', gap: '10px', marginTop: 'auto', width: '100%', justifyContent: 'center'}}>
              <Link
                to={card.to}
                className="cta-btn"
                style={styles.cta}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = card.bg;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                   e.currentTarget.style.background = '#f7fafc';
                   e.currentTarget.style.color = '#4a5568';
                }}
              >
                演示 <span>📺</span>
              </Link>
              
              {card.practiceTo && (
                <Link
                  to={card.practiceTo}
                  className="cta-btn"
                  style={styles.cta}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = card.bg;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f7fafc';
                    e.currentTarget.style.color = '#4a5568';
                  }}
                >
                  练习 <span>✏️</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MathHome;
