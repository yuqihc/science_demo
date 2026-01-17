import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import 'katex/dist/katex.min.css';
// import { BlockMath } from 'react-katex'; // react-katex is not installed, we use direct katex render

// Simple wrapper for KaTeX
import katex from 'katex';

const MathFormula = ({ tex }) => {
    const containerRef = useRef();
    useEffect(() => {
        katex.render(tex, containerRef.current, {
            throwOnError: false,
            displayMode: true
        });
    }, [tex]);
    return <div ref={containerRef} />;
};

function Car({ type, style, forwardRef }) {
  return (
    <div ref={forwardRef} className={`car-container ${type}`} style={style}>
        <svg className="car-svg" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
            <g className="car-body-group">
                {/* 风速线 - animated via CSS in index.css */}
                <path className="wind-line" d="M10,10 L-10,10" />
                <path className="wind-line" d="M10,25 L-5,25" style={{animationDelay: '0.1s'}} />
                <path className="wind-line" d="M10,40 L-8,40" style={{animationDelay: '0.2s'}} />

                {/* 车身 */}
                <path className="car-body" d="M10,25 L25,10 L70,10 L85,25 L95,25 C97,25 98,27 98,30 L98,40 L5,40 L5,30 C5,27 7,25 10,25 Z" />
                {/* 车窗 */}
                <path fill="#e0f7fa" d="M30,14 L65,14 L78,25 L22,25 Z" opacity="0.6" />
                
                {/* 车轮 (前) */}
                <g className="wheel" style={{transformBox: 'fill-box', transformOrigin: '20px 40px'}}>
                    <circle cx="20" cy="40" r="8" fill="#333" />
                    <circle cx="20" cy="40" r="3" fill="#ddd" />
                    <rect x="19" y="32" width="2" height="16" fill="#ddd" />
                    <rect x="12" y="39" width="16" height="2" fill="#ddd" />
                </g>
                
                {/* 车轮 (后) */}
                <g className="wheel" style={{transformBox: 'fill-box', transformOrigin: '80px 40px'}}>
                    <circle cx="80" cy="40" r="8" fill="#333" />
                    <circle cx="80" cy="40" r="3" fill="#ddd" />
                    <rect x="79" y="32" width="2" height="16" fill="#ddd" />
                    <rect x="72" y="39" width="16" height="2" fill="#ddd" />
                </g>
            </g>
        </svg>
    </div>
  );
}

function Acceleration() {
  const [accel, setAccel] = useState(0.05);
  const [velAccel, setVelAccel] = useState(0);
  const [velConst] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [breadcrumbsConst, setBreadcrumbsConst] = useState([]);
  const [breadcrumbsAccel, setBreadcrumbsAccel] = useState([]);
  
  // Refs for GSAP animation
  const carConstRef = useRef(null);
  const carAccelRef = useRef(null);
  const tweenConst = useRef(null);
  const tweenAccel = useRef(null);
  const intervalRef = useRef(null);

  // 速度显示比例：1单位速度 ≈ 30 km/h
  const SPEED_SCALE = 30;

  const resetRace = () => {
    setIsRunning(false);
    
    // Clear interval
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    // Kill GSAP animations
    if (tweenConst.current) tweenConst.current.kill();
    if (tweenAccel.current) tweenAccel.current.kill();
    
    // Reset positions using GSAP
    gsap.set(carConstRef.current, { x: 0 });
    gsap.set(carAccelRef.current, { x: 0 });
    
    setVelAccel(0);
    setBreadcrumbsConst([]);
    setBreadcrumbsAccel([]);
  };

  const startRace = () => {
    // Reset state and animations immediately
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (tweenConst.current) tweenConst.current.kill();
    if (tweenAccel.current) tweenAccel.current.kill();
    
    gsap.set(carConstRef.current, { x: 0 });
    gsap.set(carAccelRef.current, { x: 0 });
    
    setVelAccel(0);
    setBreadcrumbsConst([]);
    setBreadcrumbsAccel([]);
    setIsRunning(true);
    
    const trackWidth = 840; 
    
    // 1. Constant Velocity Car Animation
    // Time = Distance / Speed
    const durationConst = trackWidth / (velConst * 60); // approx seconds conversion
    
    tweenConst.current = gsap.to(carConstRef.current, {
        x: trackWidth,
        duration: durationConst,
        ease: "none",
        onUpdate: function() {
            // Drop breadcrumbs logic based on progress or time could go here
            // But simpler to just use a timer or check position
            const x = this.targets()[0]._gsap.x; // Get current x
            // We can update state less frequently if needed, or just use a separate interval
        },
        onComplete: () => {
             // Race finished logic if needed
        }
    });

    // 2. Accelerated Car Animation
    // x = 1/2 * a * t^2  => t = sqrt(2x/a)
    // We want to animate 'x' from 0 to trackWidth
    // However, GSAP standard tweens work by duration.
    // If we want physically accurate acceleration, we can use a custom ease or simply
    // use a generic object to simulate the physics frame-by-frame (like before) but using GSAP ticker
    // OR, calculate the total duration and use an ease that represents acceleration (Quad.easeIn).
    // Quad.easeIn is exactly a parabolic curve (t^2), which matches x = 1/2 at^2!
    
    // Calculate total time needed to reach end: t = sqrt(2 * dist / a)
    // Note: 'accel' in our previous code was per-frame (1/60s). 
    // Real accel a_real = accel * 60 * 60 (pixels/s^2) roughly.
    // Let's stick to the previous "feeling" where accel=0.05 was decent.
    // Previous loop: pos += vel; vel += accel; 
    // This is Euler integration.
    // Let's use GSAP's physics props or just stick to the duration calculation that matches the previous speed.
    // Previous: frame 1: v=0.05, x=0.05. frame 100: v=5, x=...
    
    // Let's assume we want to reach the end.
    // Time to reach 840px with a=0.05 (per frame)
    // x = 0.5 * a * t_frames^2
    // 840 = 0.5 * 0.05 * t^2
    // 33600 = t^2 => t = 183 frames => ~3 seconds.
    const frames = Math.sqrt(2 * trackWidth / accel);
    const durationAccel = frames / 60;

    tweenAccel.current = gsap.to(carAccelRef.current, {
        x: trackWidth,
        duration: durationAccel,
        ease: "power2.in", // power2.in is t^2 (Quadratic) ease, perfect for constant acceleration
        onUpdate: function() {
            // Calculate current velocity for display
            // v = a * t
            const progress = this.progress();
            const currentFrames = progress * frames;
            const currentVel = accel * currentFrames;
            setVelAccel(currentVel);
            
            // Drop breadcrumbs logic
            // We can check if we passed a threshold
            // For optimized React, maybe we shouldn't setState every frame for breadcrumbs
        },
        onComplete: () => setIsRunning(false)
    });

    // Separate breadcrumb dropper using GSAP ticker or simple interval
    // to avoid coupling strictly with the tween update
    intervalRef.current = setInterval(() => {
        // Stop if both stopped
        const constActive = tweenConst.current?.isActive();
        const accelActive = tweenAccel.current?.isActive();
        
        if (!constActive && !accelActive) {
            clearInterval(intervalRef.current);
            return;
        }
        
        // Get current positions directly from DOM/GSAP cache to avoid React state lag
        const xConst = gsap.getProperty(carConstRef.current, "x");
        const xAccel = gsap.getProperty(carAccelRef.current, "x");
        
        if (xConst < trackWidth) {
            setBreadcrumbsConst(prev => [...prev, xConst]);
        }
        if (xAccel < trackWidth) {
            setBreadcrumbsAccel(prev => [...prev, xAccel]);
        }
    }, 500); // Drop every 500ms
  };

  useEffect(() => {
    return () => {
        if (tweenConst.current) tweenConst.current.kill();
        if (tweenAccel.current) tweenAccel.current.kill();
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <div className="nav-bar">
        <Link to="/" className="nav-btn">
            <span style={{fontSize: '18px'}}>🏠</span>
        </Link>
        <Link to="/physics" className="nav-btn">
            <span style={{fontSize: '18px'}}>←</span> 返回物理目录
        </Link>
      </div>

      <h2>速度 vs 加速度</h2>

      <div className="main-container">
          {/* 匀速小车 */}
          <div className="track-section">
              <div className="track-label">
                  <span>🔵 匀速运动 (a = 0)</span>
                  <span className="speed-display">{Math.round(velConst * SPEED_SCALE)} km/h</span>
              </div>
              <div className="track">
                  {breadcrumbsConst.map((pos, i) => (
                      <div key={i} className="breadcrumb" style={{left: `${pos + 30}px`}}></div>
                  ))}
                  <Car type="car-blue" isRunning={isRunning} forwardRef={carConstRef} style={{left: '10px'}} />
              </div>
          </div>

          {/* 加速小车 */}
          <div className="track-section">
              <div className="track-label">
                  <span>🔴 加速运动 (a {'>'} 0)</span>
                  <span className="speed-display">{Math.round(velAccel * SPEED_SCALE)} km/h</span>
              </div>
              <div className="track">
                  {breadcrumbsAccel.map((pos, i) => (
                      <div key={i} className="breadcrumb" style={{left: `${pos + 30}px`}}></div>
                  ))}
                  <Car type="car-red" isRunning={isRunning} forwardRef={carAccelRef} style={{left: '10px'}} />
              </div>
          </div>

          {/* 控制面板 */}
          <div className="control-panel">
              <div className="panel-header">
                  <span className="panel-title">加速度设置</span>
                  <span className="accel-value">{accel.toFixed(2)}</span>
              </div>
              
              <div className="slider-wrapper">
                  <button className="btn-icon" onClick={() => setAccel(Math.max(0.01, parseFloat((accel - 0.01).toFixed(2))))}>-</button>
                  <input 
                    type="range" 
                    min="0.01" 
                    max="0.20" 
                    step="0.01" 
                    value={accel} 
                    onChange={(e) => setAccel(parseFloat(e.target.value))}
                  />
                  <button className="btn-icon" onClick={() => setAccel(Math.min(0.20, parseFloat((accel + 0.01).toFixed(2))))}>+</button>
              </div>

              <div className="action-buttons">
                  <button className="btn-main btn-primary" onClick={startRace}>开始演示</button>
                  <button className="btn-main btn-secondary" onClick={resetRace}>重置</button>
              </div>
          </div>
      </div>

      {/* 观察与思考 */}
      <div className="info-grid">
          <div className="info-card">
              <div className="info-title">
                  <div className="dot" style={{background: 'var(--accent-blue)'}}></div>
                  观察匀速运动
              </div>
              <div className="info-text">
                  “你看，蓝色的小车每秒钟走的距离都是一样的，就像你在人行道上匀速散步。”
              </div>
              <div className="highlight-box">
                  <strong>核心：</strong> 它的速度没变，所以它的加速度是 0。
              </div>
          </div>

          <div className="info-card">
              <div className="info-title">
                  <div className="dot" style={{background: 'var(--accent-red)'}}></div>
                  观察加速运动
              </div>
              <div className="info-text">
                  “红色小车刚开始很慢，但它每一秒都比前一秒跑得更快！”
              </div>
              <div className="highlight-box">
                  <strong>核心：</strong> 这种“速度增加”的过程，就叫加速度。
              </div>
          </div>

          {/* 生活中的类比 */}
          <div className="info-card full-width">
              <div className="info-title">
                  <div className="dot" style={{background: '#FF9500'}}></div>
                  🌟 生活中的类比
              </div>
              <ul className="analogy-list" style={{paddingLeft: '20px', lineHeight: '1.8'}}>
                  <li><strong>加速度为正：</strong> 爸爸踩油门，车子猛地冲出去，后背感受到推力。</li>
                  <li><strong>加速度为负（减速）：</strong> 爸爸踩刹车，车子慢慢停下来。</li>
                  <li><strong>零加速度：</strong> 开启自动巡航，车速表上的数字一直不动。</li>
              </ul>
          </div>
      </div>

      {/* 加速度公式 */}
      <div className="main-container">
          <div className="info-title">📐 加速度公式</div>
          <div style={{textAlign: 'center', padding: '20px 0'}}>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px'}}>
                  {/* 公式 1: 定义公式 */}
                  <div style={{background: '#F5F5F7', padding: '20px', borderRadius: '20px'}}>
                      <div style={{fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px'}}>定义公式</div>
                      <div style={{fontSize: '20px'}}>
                          <MathFormula tex="a = \frac{\Delta v}{\Delta t} = \frac{v_f - v_i}{t}" />
                      </div>
                  </div>

                  {/* 公式 2: 牛顿第二定律 */}
                  <div style={{background: '#F5F5F7', padding: '20px', borderRadius: '20px'}}>
                      <div style={{fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px'}}>牛顿第二定律</div>
                      <div style={{fontSize: '20px'}}>
                          <MathFormula tex="F = m \cdot a" />
                      </div>
                  </div>

                  {/* 公式 3: 位移公式 */}
                  <div style={{background: '#F5F5F7', padding: '20px', borderRadius: '20px'}}>
                      <div style={{fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px'}}>位移公式</div>
                      <div style={{fontSize: '20px'}}>
                          <MathFormula tex="x = v_0t + \frac{1}{2}at^2" />
                      </div>
                  </div>
              </div>

              <div className="highlight-box" style={{textAlign: 'left'}}>
                  <p style={{margin: '0 0 10px 0'}}><strong>核心公式解释：</strong></p>
                  <div style={{fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8'}}>
                      <div style={{marginBottom: '15px'}}>
                          <strong>1. 定义公式 (a = Δv/Δt)：</strong> <br/>
                          加速度是速度变化的快慢。就像你跑步时，每一秒钟比上一秒钟快了多少。
                      </div>
                      <div style={{marginBottom: '15px'}}>
                          <strong>2. 牛顿第二定律 (F = ma)：</strong> <br/>
                          这是最著名的物理公式之一！它告诉我们：
                          <ul style={{margin: '5px 0 0 20px', color: 'var(--text-primary)'}}>
                              <li>想要产生加速度 <strong>(a)</strong>，必须要有力 <strong>(F)</strong> 的推动。</li>
                              <li>物体越重 <strong>(m)</strong>，想要让它加速就越难（需要更大的力）。</li>
                          </ul>
                      </div>
                      <div>
                          <strong>3. 位移公式 (x = v₀t + ½at²)：</strong> <br/>
                          如果你知道小车出发时的速度 <strong>(v₀)</strong>，跑了多久 <strong>(t)</strong>，以及加速度 <strong>(a)</strong>，你就能算出它跑了多远 <strong>(x)</strong>。
                          <ul style={{margin: '5px 0 0 20px', color: 'var(--text-primary)'}}>
                              <li><strong>v₀t</strong>：如果不加速，匀速跑的距离。</li>
                              <li><strong>½at²</strong>：因为加速而多跑出来的距离。</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

export default Acceleration;
