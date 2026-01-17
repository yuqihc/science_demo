import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

// ==========================================
// 1. 光的直线传播 (含光源分类 & 光速对比)
// ==========================================
const PinholeModule = () => {
    const [mode, setMode] = useState('pinhole'); // 'pinhole' | 'shadow' | 'speed'
    
    // --- Pinhole State ---
    const [objectY, setObjectY] = useState(70);
    const [holeY, setHoleY] = useState(150);
    const [screenX, setScreenX] = useState(600); // Centered default
    
    // --- Shadow State ---
    const [lightX, setLightX] = useState(150);
    const [blockX, setBlockX] = useState(350);
    
    // --- Speed State ---
    const [speedRace, setSpeedRace] = useState(false);
    const lightRunner = useRef(null);
    const soundRunner = useRef(null);
    
    // Pinhole Calculations
    // Shifted slightly left to balance the scene
    const objectX = 100; // Was 150
    const holeX = 300;   // Was 350
    // Flame Tip (Top of Object)
    const objTopY = 150 - objectY - 10; // -10 for flame height
    // Candle Base (Bottom of Object)
    const objBottomY = 150; 
    
    const slopeTop = (150 - objTopY) / (holeX - objectX); 
    const slopeBottom = (150 - objBottomY) / (holeX - objectX);
    const imgTopY = 150 + slopeBottom * (screenX - holeX); 
    const imgBottomY = 150 + slopeTop * (screenX - holeX);

    // Speed Animation
    useEffect(() => {
        if (speedRace && mode === 'speed') {
            const tl = gsap.timeline({ onComplete: () => setSpeedRace(false) });
            
            // Light: Instant (0.1s)
            tl.fromTo(lightRunner.current, { x: 0 }, { x: 600, duration: 0.1, ease: "none" });
            
            // Sound: Slow (3s)
            // Note: In reality light is 880,000x faster, but for visual demo:
            gsap.fromTo(soundRunner.current, { x: 0 }, { x: 600, duration: 3, ease: "none" });
        }
    }, [speedRace, mode]);

    return (
        <div className="lab-stage">
            {/* Sub-navigation for Module 1 */}
            <div style={{display: 'flex', gap: '10px', padding: '10px', background: '#222', justifyContent: 'center'}}>
                <button className={`lab-tab ${mode==='pinhole'?'active':''}`} onClick={() => setMode('pinhole')} style={{padding:'5px 15px', fontSize:'12px'}}>🕯️ 小孔成像</button>
                <button className={`lab-tab ${mode==='shadow'?'active':''}`} onClick={() => setMode('shadow')} style={{padding:'5px 15px', fontSize:'12px'}}>🌑 影子的形成</button>
                <button className={`lab-tab ${mode==='speed'?'active':''}`} onClick={() => setMode('speed')} style={{padding:'5px 15px', fontSize:'12px'}}>⚡ 光速 vs 声速</button>
            </div>

            <div style={{position: 'relative'}}>
            <div style={{position: 'absolute', bottom: 20, left: 20, width: 250, background: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 8, border: '1px solid #444', color: '#ddd', fontSize: '13px', lineHeight: '1.5', zIndex: 10, pointerEvents: 'none'}}>
                {mode === 'pinhole' && (
                    <>
                        <strong style={{color: '#fff', display: 'block', marginBottom: 5}}>为什么像是倒立的？</strong>
                        因为光沿直线传播！
                        <ul style={{paddingLeft: 15, margin: '5px 0'}}>
                            <li>火焰顶部的光线，穿过小孔后，只能射到光屏的<strong>下方</strong>。</li>
                            <li>火焰底部的光线，穿过小孔后，只能射到光屏的<strong>上方</strong>。</li>
                        </ul>
                        所以像就“颠倒”过来了。
                    </>
                )}
                {mode === 'shadow' && (
                    <>
                        <strong style={{color: '#fff', display: 'block', marginBottom: 5}}>影子是怎么形成的？</strong>
                        光线遇到不透明物体时，无法穿过，就在物体背面形成了黑暗区域（影子）。
                        <br/><br/>
                        <strong>规律：</strong>
                        <br/>
                        光源越靠近物体，光线的张角越大，形成的影子就越<strong>大</strong>。
                    </>
                )}
                {mode === 'speed' && (
                    <>
                        <strong style={{color: '#fff', display: 'block', marginBottom: 5}}>为什么先见闪电？</strong>
                        <div style={{display: 'flex', justifyContent: 'space-between', margin: '5px 0'}}>
                            <span>光速:</span> <span>~300,000,000 m/s</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>声速:</span> <span>~340 m/s</span>
                        </div>
                        <br/>
                        光速是声速的 88万倍！对于几公里的距离，光几乎是瞬移，而声音需要跑好几秒。
                    </>
                )}
            </div>

            <svg width="100%" height="600" className="lab-svg" viewBox="0 0 850 400" preserveAspectRatio="xMidYMid meet">
                {/* === Mode 1: Pinhole Imaging === */}
                {mode === 'pinhole' && (
                    <>
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="var(--accent-orange)" />
                            </marker>
                        </defs>
                        <line x1="0" y1="150" x2="800" y2="150" stroke="#333" strokeDasharray="5,5" />
                        
                        {/* Object (Candle) */}
                        <g transform={`translate(${objectX}, 150)`}>
                            {/* Candle body extends UP from y=150 */}
                            <rect x="-5" y={-objectY} width="10" height={objectY} fill="#e74c3c" />
                            {/* Flame sits on top */}
                            <path d="M0,-10 Q5,-20 0,-30 Q-5,-20 0,-10" transform={`translate(0, ${-objectY})`} fill="#f1c40f">
                                <animate attributeName="d" values="M0,-10 Q5,-20 0,-30 Q-5,-20 0,-10; M0,-10 Q6,-22 0,-32 Q-6,-22 0,-10; M0,-10 Q5,-20 0,-30 Q-5,-20 0,-10" dur="0.5s" repeatCount="indefinite" />
                            </path>
                            <text x="-20" y={-objectY - 40} fill="#f1c40f" fontSize="14">光源</text>
                        </g>

                        {/* Barrier */}
                        <g transform={`translate(${holeX}, 0)`}>
                            <rect x="-5" y="0" width="10" height="140" fill="#444" />
                            <rect x="-5" y="160" width="10" height="240" fill="#444" />
                            <circle cx="0" cy="150" r="4" fill="#000" stroke="#666" />
                        </g>

                        {/* Rays */}
                        <line x1={objectX} y1={objTopY} x2={screenX} y2={imgBottomY} stroke="var(--accent-orange)" strokeWidth="1" opacity="0.8" />
                        <line x1={objectX} y1={objBottomY} x2={screenX} y2={imgTopY} stroke="var(--accent-orange)" strokeWidth="1" opacity="0.8" />

                        {/* Screen */}
                        <g transform={`translate(${screenX}, 150)`}>
                            <line x1="0" y1="-180" x2="0" y2="180" stroke="#fff" strokeWidth="4" />
                            <text x="10" y="-190" fill="#fff" fontSize="14">光屏</text>
                            {/* Inverted Image */}
                            <g opacity="0.9">
                                {/* Candle Body: Top is now at imgBottomY (which corresponds to objTopY inverted), 
                                    but wait, imgTopY corresponds to objBottomY (Base).
                                    imgBottomY corresponds to objTopY (Flame).
                                    
                                    So image base is at imgTopY (y=150, since slopeBottom=0).
                                    Image flame is at imgBottomY.
                                    
                                    Wait, my previous calculation:
                                    const objBottomY = 150; 
                                    slopeBottom = (150 - 150) / ... = 0.
                                    imgTopY = 150 + 0 = 150.
                                    
                                    So the image base is correctly at y=150.
                                    The image flame tip is at imgBottomY.
                                 */}
                                
                                {/* Candle Body (Red) */}
                                {/* Total Image Height = imgBottomY - 150 */}
                                {/* Flame Height ~ 20px */}
                                <rect 
                                    x="-5" 
                                    y="0" 
                                    width="10" 
                                    height={(imgBottomY - 150) - 20} 
                                    fill="#e74c3c" 
                                />
                                
                                {/* Flame (Yellow) - Inverted */}
                                {/* Flame tip is at imgBottomY */}
                                <path 
                                    d="M0,0 Q5,-10 0,-20 Q-5,-10 0,0" 
                                    transform={`translate(0, ${imgBottomY - 150}) scale(1, -1)`} 
                                    fill="#f1c40f" 
                                    opacity="0.8" 
                                />
                            </g>
                        </g>
                    </>
                )}

                {/* === Mode 2: Shadow Formation === */}
                {mode === 'shadow' && (
                    <>
                         {/* Light Source (Bulb) */}
                         <g transform={`translate(${lightX}, 200)`} style={{cursor: 'ew-resize'}}>
                             <circle cx="0" cy="0" r="15" fill="#f1c40f" filter="url(#glow)" />
                             <text x="-20" y="-30" fill="#f1c40f">点光源</text>
                             {/* Rays fan out */}
                             {[-30, -15, 0, 15, 30].map((deg, i) => {
                                 const rad = deg * Math.PI / 180;
                                 return <line key={i} x1="0" y1="0" x2={Math.cos(rad)*600} y2={Math.sin(rad)*600} stroke="#f1c40f" strokeWidth="2" opacity="0.3" />
                             })}
                         </g>

                         {/* Blocker (Ball) */}
                         <g transform={`translate(${blockX}, 200)`}>
                             <circle cx="0" cy="0" r="40" fill="#e74c3c" />
                             <text x="-20" y="-50" fill="#e74c3c">不透明物体</text>
                         </g>

                         {/* Shadow Calculation */}
                         {/* Simple similar triangles for shadow edges */}
                         {/* Top Edge: (blockX, 200-40) to (lightX, 200) */}
                         {/* Slope m = -40 / (blockX - lightX) */}
                         {/* At x=750: y = 200 + m * (750 - lightX) */}
                         {(() => {
                             const screenXPos = 750; // Shifted right for better spacing
                             const r = 40;
                             const dx = blockX - lightX;
                             const dy = r; // from center
                             const slope = dy / dx;
                             const yOffset = slope * (screenXPos - lightX); // Offset from center 200
                             
                             return (
                                 <>
                                    {/* Shadow Ray Top */}
                                    <line x1={lightX} y1={200} x2={screenXPos} y2={200 - yOffset} stroke="#f1c40f" strokeDasharray="5,5" opacity="0.5" />
                                    {/* Shadow Ray Bottom */}
                                    <line x1={lightX} y1={200} x2={screenXPos} y2={200 + yOffset} stroke="#f1c40f" strokeDasharray="5,5" opacity="0.5" />
                                    
                                    {/* Screen */}
                                    <line x1={screenXPos} y1="50" x2={screenXPos} y2="350" stroke="#fff" strokeWidth="4" />
                                    {/* Shadow Area */}
                                    <rect x={screenXPos+2} y={200 - yOffset} width="10" height={yOffset*2} fill="#000" />
                                    <text x={screenXPos+20} y="200" fill="#888">本影区</text>
                                 </>
                             )
                         })()}
                    </>
                )}

                {/* === Mode 3: Light Speed vs Sound Speed === */}
                {mode === 'speed' && (
                    <g transform="translate(100, 100)">
                        <text x="0" y="-50" fill="#fff" fontSize="24">雷雨天：为什么先看到闪电后听到雷声？</text>
                        
                        {/* Track 1: Light */}
                        <text x="-80" y="50" fill="#f1c40f" fontWeight="bold">光 (闪电)</text>
                        <line x1="0" y1="50" x2="600" y2="50" stroke="#333" strokeWidth="2" />
                        <circle ref={lightRunner} cx="0" cy="50" r="10" fill="#f1c40f" />
                        <text x="620" y="50" fill="#f1c40f">c ≈ 3×10⁸ m/s</text>

                        {/* Track 2: Sound */}
                        <text x="-80" y="150" fill="#3498db" fontWeight="bold">声 (雷声)</text>
                        <line x1="0" y1="150" x2="600" y2="150" stroke="#333" strokeWidth="2" />
                        <circle ref={soundRunner} cx="0" cy="150" r="10" fill="#3498db" />
                        <text x="620" y="150" fill="#3498db">v ≈ 340 m/s</text>

                        {/* Cloud Icon */}
                        <text x="-30" y="100" fontSize="40">⛈️</text>
                        {/* Ear Icon */}
                        <text x="600" y="100" fontSize="40">👂</text>
                    </g>
                )}
            </svg>
            </div>
            
            <div className="lab-controls">
                {mode === 'pinhole' && (
                    <>
                        <div className="control-group">
                            <label>蜡烛高度</label>
                            <input type="range" min="30" max="100" value={objectY} onChange={e => setObjectY(Number(e.target.value))} />
                        </div>
                        <div className="control-group">
                            <label>光屏距离</label>
                            <input type="range" min="400" max="750" value={screenX} onChange={e => setScreenX(Number(e.target.value))} />
                        </div>
                    </>
                )}
                {mode === 'shadow' && (
                    <>
                        <div className="control-group">
                            <label>光源位置 (左右移动)</label>
                            <input type="range" min="50" max="250" value={lightX} onChange={e => setLightX(Number(e.target.value))} />
                        </div>
                        <div className="control-group">
                            <label>物体位置 (左右移动)</label>
                            <input type="range" min="280" max="500" value={blockX} onChange={e => setBlockX(Number(e.target.value))} />
                        </div>
                        <div className="info-text" style={{width: '100%', textAlign: 'center', marginTop: '10px'}}>
                            观察：光源越靠近物体，影子越大（因为张角变大了）。
                        </div>
                    </>
                )}
                {mode === 'speed' && (
                    <div style={{width: '100%', textAlign: 'center'}}>
                         <button className="btn-main" onClick={() => setSpeedRace(true)} disabled={speedRace}>
                             {speedRace ? '演示中...' : '⚡ 开始对比 (模拟)'}
                         </button>
                         <p style={{color: '#888', marginTop: '15px'}}>
                             注意：真实光速比声速快约 88万倍！这里为了能看清，把光速大大“放慢”了。
                         </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 2. 光的反射 (镜面 vs 漫反射)
// ==========================================
const ReflectionModule = () => {
    const [angle, setAngle] = useState(45);
    const [roughness, setRoughness] = useState(0); // 0 = Specular, 1 = Diffuse
    
    // Calculate incident ray
    // Origin at (400, 300) -> Shifted to (300, 300) to center better
    const centerX = 300;
    const centerY = 300;
    const length = 200;
    
    const rad = (angle * Math.PI) / 180;
    const srcX = centerX - Math.sin(rad) * length;
    const srcY = centerY - Math.cos(rad) * length;
    
    // Specular reflection ray
    const refX = centerX + Math.sin(rad) * length;
    const refY = centerY - Math.cos(rad) * length;
    
    // Generate diffuse rays (randomized based on roughness)
    const diffuseRays = [];
    if (roughness > 0) {
        for (let i = 0; i < 10; i++) {
            const dev = (Math.random() - 0.5) * 120 * roughness; 
            const dRad = ((angle + dev) * Math.PI) / 180;
            if (dRad > 0 && dRad < Math.PI) {
                 diffuseRays.push({
                     x: centerX + Math.sin(dRad) * length * (0.5 + Math.random()*0.5),
                     y: centerY - Math.cos(dRad) * length * (0.5 + Math.random()*0.5)
                 });
            }
        }
    }

    return (
        <div className="lab-stage">
            <div style={{position: 'relative'}}>
            {/* Scientific Explanation Box */}
            <div style={{position: 'absolute', bottom: 20, left: 20, width: 250, background: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 8, border: '1px solid #444', color: '#ddd', fontSize: '13px', lineHeight: '1.5', zIndex: 10, pointerEvents: 'none'}}>
                <strong style={{color: '#fff', display: 'block', marginBottom: 5}}>反射定律</strong>
                <ul style={{paddingLeft: 15, margin: '5px 0'}}>
                    <li><strong>三线共面：</strong> 入射光线、反射光线和法线都在同一个平面内。</li>
                    <li><strong>两线分居：</strong> 入射光线和反射光线分居法线两侧。</li>
                    <li><strong>两角相等：</strong> 反射角 = 入射角 ({angle}°)。</li>
                </ul>
                <div style={{marginTop: 10, paddingTop: 10, borderTop: '1px dashed #555'}}>
                    <strong>漫反射：</strong>
                    <br/>
                    当表面粗糙时，平行的入射光线被反射向四面八方，但每条光线依然遵守反射定律。
                </div>
            </div>

            <svg width="100%" height="600" className="lab-svg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                {/* Surface - Centered around 300 */}
                <rect x="0" y={centerY} width="600" height="20" fill="#555" />
                {/* Roughness visualization */}
                {roughness > 0 && (
                    <path d={`M0,${centerY} ` + Array.from({length:60}).map((_,i) => `L${i*10},${centerY+(Math.random()-0.5)*10*roughness}`).join(' ')} stroke="#888" fill="none" />
                )}
                
                {/* Normal Line */}
                <line x1={centerX} y1={centerY} x2={centerX} y2="100" stroke="#666" strokeDasharray="5,5" />
                
                {/* Incident Ray */}
                <line x1={srcX} y1={srcY} x2={centerX} y2={centerY} stroke="var(--accent-red)" strokeWidth="3" />
                <circle cx={srcX} cy={srcY} r="6" fill="var(--accent-red)" />
                
                {/* Specular Ray */}
                <line x1={centerX} y1={centerY} x2={refX} y2={refY} stroke="var(--accent-red)" strokeWidth="3" opacity={1 - roughness} />
                
                {/* Diffuse Rays */}
                {diffuseRays.map((pt, i) => (
                    <line key={i} x1={centerX} y1={centerY} x2={pt.x} y2={pt.y} stroke="var(--accent-red)" strokeWidth="1" opacity={0.6} />
                ))}

                {/* Angle Texts */}
                <text x={centerX - 40} y={centerY - 50} fill="#fff" fontSize="14">{angle}°</text>
                <text x={centerX + 20} y={centerY - 50} fill="#fff" fontSize="14" opacity={1-roughness}>{angle}°</text>
            </svg>
            </div>
            
            <div className="lab-controls">
                <div className="control-group">
                    <label>入射角度 ({angle}°)</label>
                    <input type="range" min="10" max="80" value={angle} onChange={e => setAngle(Number(e.target.value))} />
                </div>
                <div className="control-group">
                    <label>表面粗糙度 (镜面 &rarr; 漫反射)</label>
                    <input type="range" min="0" max="1" step="0.1" value={roughness} onChange={e => setRoughness(Number(e.target.value))} />
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. 平面镜成像 (对称性)
// ==========================================
const MirrorModule = () => {
    const [objX, setObjX] = useState(150); // Shifted default left
    const [objY, setObjY] = useState(200);
    
    // Mirror position shifted left from 400 to 300
    const mirrorX = 300;
    const imgX = mirrorX + (mirrorX - objX); // Symmetric X

    return (
        <div className="lab-stage">
            <div style={{position: 'relative'}}>
            {/* Scientific Explanation Box */}
            <div style={{position: 'absolute', bottom: 20, left: 20, width: 250, background: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 8, border: '1px solid #444', color: '#ddd', fontSize: '13px', lineHeight: '1.5', zIndex: 10, pointerEvents: 'none'}}>
                <strong style={{color: '#fff', display: 'block', marginBottom: 5}}>平面镜成像特点</strong>
                <ul style={{paddingLeft: 15, margin: '5px 0'}}>
                    <li><strong>等大：</strong> 像和物大小相等。</li>
                    <li><strong>等距：</strong> 像和物到镜面的距离相等 ($d = d'$)。</li>
                    <li><strong>垂直：</strong> 像和物的连线与镜面垂直。</li>
                    <li><strong>虚像：</strong> 像是光线的反向延长线形成的，不能呈现在光屏上。</li>
                </ul>
            </div>

            <svg width="100%" height="600" className="lab-svg" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid meet">
                 {/* Mirror */}
                 <line x1={mirrorX} y1="50" x2={mirrorX} y2="350" stroke="#aaf" strokeWidth="6" />
                 {/* Mirror backside dashes */}
                 {Array.from({length: 20}).map((_,i) => (
                     <line key={i} x1={mirrorX} y1={60+i*15} x2={mirrorX+10} y2={70+i*15} stroke="#666" strokeWidth="2" />
                 ))}

                 {/* Connecting Lines (Perpendicular) */}
                 <line x1={objX} y1={objY} x2={imgX} y2={objY} stroke="#444" strokeDasharray="5,5" />
                 
                 {/* Object 'F' */}
                 <g transform={`translate(${objX}, ${objY})`}>
                     <text x="-15" y="10" fontSize="60" fill="var(--accent-blue)" fontWeight="bold" style={{cursor: 'move'}}>F</text>
                     <circle cx="0" cy="0" r="4" fill="var(--accent-blue)" />
                     <text x="-20" y="40" fill="#888" fontSize="12">物</text>
                 </g>

                 {/* Image 'F' (Flipped) */}
                 <g transform={`translate(${imgX}, ${objY}) scale(-1, 1)`}>
                     <text x="-15" y="10" fontSize="60" fill="var(--accent-blue)" fontWeight="bold" opacity="0.5">F</text>
                 </g>
                 <circle cx={imgX} cy={objY} r="4" fill="#666" />
                 <text x={imgX-10} y={objY+40} fill="#888" fontSize="12">像</text>

                 {/* Distance Labels */}
                 <text x={(objX+mirrorX)/2 - 20} y={objY-10} fill="#888" fontSize="12">d = {mirrorX - objX}</text>
                 <text x={(imgX+mirrorX)/2 - 20} y={objY-10} fill="#888" fontSize="12">d' = {imgX - mirrorX}</text>
                 
                 {/* Right Angle Symbol */}
                 <path d={`M${mirrorX-10},${objY} L${mirrorX-10},${objY-10} L${mirrorX},${objY-10}`} fill="none" stroke="#666" />
            </svg>
            </div>
            
            <div className="lab-controls">
                <div className="control-group">
                    <label>物体水平位置</label>
                    <input type="range" min="50" max={mirrorX-50} value={objX} onChange={e => setObjX(Number(e.target.value))} />
                </div>
                <div className="control-group">
                    <label>物体垂直位置</label>
                    <input type="range" min="100" max="300" value={objY} onChange={e => setObjY(Number(e.target.value))} />
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 4. 光的折射 (斯涅尔定律)
// ==========================================
const RefractionModule = () => {
    const [incidentAngle, setIncidentAngle] = useState(45);
    const [n1, setN1] = useState(1.0); // Air
    const [n2, setN2] = useState(1.33); // Water
    
    // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
    // theta2 = asin( (n1/n2) * sin(theta1) )
    const rad1 = (incidentAngle * Math.PI) / 180;
    const sin2 = (n1 / n2) * Math.sin(rad1);
    
    let rad2 = 0;
    let isTotalReflection = false;
    let criticalAngle = null;

    // Calculate critical angle if n1 > n2 (dense to rare)
    if (n1 > n2) {
        criticalAngle = Math.asin(n2 / n1) * 180 / Math.PI;
    }
    
    if (Math.abs(sin2) > 1) {
        isTotalReflection = true;
        rad2 = Math.PI - rad1; // Reflection instead (theta_reflection = theta_incident)
    } else {
        rad2 = Math.asin(sin2);
    }
    
    const angle2 = (rad2 * 180 / Math.PI).toFixed(1);
    
    // Coordinates
    const center = { x: 400, y: 200 };
    const len = 180;
    
    // Incident Ray (Upper half)
    const srcX = center.x - Math.sin(rad1) * len;
    const srcY = center.y - Math.cos(rad1) * len;
    
    // Refracted/Reflected Ray
    let outX, outY;
    
    // Always calculate reflection ray (Partial reflection always exists in reality, but we simplify for teaching)
    // However, to make the "pop" effect clear, let's visualize the transition.
    
    // Critical Angle Visualization:
    // If n1 > n2, we are approaching TIR.
    // Let's add a visual cue for the critical angle boundary if it exists.
    
    if (isTotalReflection) {
        // Reflects back to top-right (Total Internal Reflection)
        // Reflection angle = Incident angle
        outX = center.x + Math.sin(rad1) * len;
        outY = center.y - Math.cos(rad1) * len;
    } else {
        // Refracts to bottom-right
        outX = center.x + Math.sin(rad2) * len;
        outY = center.y + Math.cos(rad2) * len;
    }

    // Determine Medium Names
    const getMediumName = (n) => {
        if (n === 1.0) return "空气 (光疏)";
        if (n === 1.33) return "水 (中等)";
        if (n === 1.5) return "玻璃 (光密)";
        if (n === 2.42) return "钻石 (极密)";
        return `介质(n=${n})`;
    };

    return (
        <div className="lab-stage">
            {/* Expanded ViewBox to show right-side labels */}
            <svg width="100%" height="600" className="lab-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <marker id="arrow-ray" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-green)" />
                    </marker>
                </defs>

                {/* Medium Backgrounds */}
                <rect x="0" y="0" width="800" height="200" fill={n1 === 1 ? '#1a1a1a' : (n1 === 2.42 ? '#2a3a4a' : '#222')} opacity={0.2 + (n1-1)*0.2} />
                <rect x="0" y="200" width="800" height="200" fill={n2 === 1 ? '#1a1a1a' : (n2 === 2.42 ? '#2a3a4a' : '#222')} opacity={0.2 + (n2-1)*0.2} />
                
                {/* Interface */}
                <line x1="50" y1="200" x2="750" y2="200" stroke="#fff" strokeWidth="2" opacity="0.8" />
                <text x="740" y="220" fill="#fff" fontSize="12" textAnchor="end">界面 (Interface)</text>

                {/* Normal */}
                <line x1="400" y1="50" x2="400" y2="350" stroke="#666" strokeDasharray="5,5" />
                <text x="405" y="60" fill="#666" fontSize="12">法线</text>
                
                {/* Angle Arcs */}
                {/* Incident Angle Arc */}
                <path d={`M400,160 A40,40 0 0,0 ${center.x - Math.sin(rad1)*40},${center.y - Math.cos(rad1)*40}`} fill="none" stroke="var(--accent-green)" opacity="0.5" />
                <text x="380" y="150" fill="var(--accent-green)" fontSize="12">i</text>

                {/* Refracted/Reflected Angle Arc */}
                {!isTotalReflection && (
                    <>
                        <path d={`M400,240 A40,40 0 0,1 ${center.x + Math.sin(rad2)*40},${center.y + Math.cos(rad2)*40}`} fill="none" stroke="var(--accent-orange)" opacity="0.5" />
                        <text x="410" y="250" fill="var(--accent-orange)" fontSize="12">r</text>
                    </>
                )}

                {/* Critical Angle Indicator (Dashed Red Line) */}
                {criticalAngle && !isTotalReflection && (
                    <g opacity="0.4">
                         <line 
                            x1={center.x} 
                            y1={center.y} 
                            x2={center.x - Math.sin(criticalAngle * Math.PI / 180) * len} 
                            y2={center.y - Math.cos(criticalAngle * Math.PI / 180) * len} 
                            stroke="#ff5555" 
                            strokeDasharray="4,4" 
                            strokeWidth="2"
                         />
                         <text x={center.x - Math.sin(criticalAngle * Math.PI / 180) * (len+10)} y={center.y - Math.cos(criticalAngle * Math.PI / 180) * (len+10)} fill="#ff5555" fontSize="10">临界角</text>
                    </g>
                )}

                {/* Rays */}
                <line x1={srcX} y1={srcY} x2="400" y2="200" stroke="var(--accent-green)" strokeWidth="4" markerEnd="url(#arrow-ray)" />
                
                {/* Reflected Ray (Always present but faint if not TIR, strong if TIR) */}
                {/* For teaching simplicity: 
                    - Normal mode: Show Refraction (Strong) + Reflection (Faint)
                    - TIR mode: Show Reflection (Strong) ONLY
                */}
                
                {/* 1. The Refracted Ray (Disappears on TIR) */}
                <line 
                    x1="400" y1="200" 
                    x2={isTotalReflection ? 400 : outX} 
                    y2={isTotalReflection ? 200 : outY} 
                    stroke="var(--accent-orange)" 
                    strokeWidth={isTotalReflection ? 0 : 4} 
                    markerEnd={isTotalReflection ? "" : "url(#arrow-ray)"}
                    style={{transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'}} // Pop effect
                />

                {/* 2. The Reflected Ray (Faint usually, Strong on TIR) */}
                <line 
                    x1="400" y1="200" 
                    x2={center.x + Math.sin(rad1) * len} 
                    y2={center.y - Math.cos(rad1) * len} 
                    stroke={isTotalReflection ? "var(--accent-green)" : "rgba(255, 255, 255, 0.3)"} 
                    strokeWidth={isTotalReflection ? 4 : 2} 
                    markerEnd={isTotalReflection ? "url(#arrow-ray)" : ""}
                    style={{transition: 'all 0.2s'}}
                />
                
                {/* Labels */}
                <text x="20" y="180" fill="#aaa" fontSize="14">介质 1: {getMediumName(n1)} (n={n1})</text>
                <text x="20" y="230" fill="#aaa" fontSize="14">介质 2: {getMediumName(n2)} (n={n2})</text>
                
                {/* Dynamic Data Box */}
                <g transform="translate(550, 50)">
                    <rect width="200" height="240" rx="10" fill="rgba(0,0,0,0.6)" stroke="#444" />
                    <text x="20" y="30" fill="#fff" fontWeight="bold">实时数据</text>
                    <text x="20" y="60" fill="var(--accent-green)">入射角 i: {incidentAngle}°</text>
                    <text x="20" y="85" fill={isTotalReflection ? "var(--accent-green)" : "var(--accent-orange)"}>
                        {isTotalReflection ? `反射角 r: ${incidentAngle}°` : `折射角 r: ${angle2}°`}
                    </text>
                    {criticalAngle ? (
                        <>
                            <text x="20" y="110" fill="#ff5555" fontSize="12">临界角 C: {criticalAngle.toFixed(1)}°</text>
                            <text x="20" y="135" fill="#aaa" fontSize="10">💡 入射角 {'>'} {criticalAngle.toFixed(1)}° 将触发全反射</text>
                        </>
                    ) : (
                        <text x="20" y="110" fill="#888" fontSize="10">光疏 → 光密：无全反射</text>
                    )}
                    
                    {/* Science Explanation inside the box */}
                    <line x1="10" y1="150" x2="190" y2="150" stroke="#555" strokeDasharray="4,4" />
                    <foreignObject x="10" y="160" width="180" height="80">
                        <div style={{color: '#ddd', fontSize: '11px', lineHeight: '1.4', xmlns: "http://www.w3.org/1999/xhtml"}}>
                            <strong>斯涅尔定律：</strong><br/>
                            $n_1 \sin i = n_2 \sin r$<br/>
                            光从光疏介质进入光密介质，折射光线<strong>偏向</strong>法线。
                        </div>
                    </foreignObject>
                </g>

                {isTotalReflection && (
                    <text x="360" y="100" fill="#ff5555" fontSize="16" fontWeight="bold" style={{textShadow: '0 0 10px red'}}>⚠️ 全反射发生!</text>
                )}
            </svg>
            
            <div className="lab-controls">
                <div className="control-group" style={{flex: 2}}>
                    <label>入射角度调节 (0° - 85°)</label>
                    <input type="range" min="0" max="85" value={incidentAngle} onChange={e => setIncidentAngle(Number(e.target.value))} />
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666'}}>
                        <span>垂直入射</span>
                        <span>掠射</span>
                    </div>
                </div>
                <div className="control-group">
                    <label>上层介质 (介质1)</label>
                    <select value={n1} onChange={e => setN1(Number(e.target.value))}>
                        <option value="1.0">空气 (n=1.0)</option>
                        <option value="1.33">水 (n=1.33)</option>
                        <option value="1.5">玻璃 (n=1.5)</option>
                        <option value="2.42">钻石 (n=2.42)</option>
                    </select>
                </div>
                <div className="control-group">
                    <label>下层介质 (介质2)</label>
                    <select value={n2} onChange={e => setN2(Number(e.target.value))}>
                        <option value="1.0">空气 (n=1.0)</option>
                        <option value="1.33">水 (n=1.33)</option>
                        <option value="1.5">玻璃 (n=1.5)</option>
                        <option value="2.42">钻石 (n=2.42)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 5. 光的色散 (三棱镜动画)
// ==========================================
const DispersionModule = () => {
    // Shift everything left by 100px
    const offsetX = -100;

    // Prism vertices
    const p1 = {x: 400 + offsetX, y: 100};
    const p2 = {x: 300 + offsetX, y: 300};
    const p3 = {x: 500 + offsetX, y: 300};
    
    const whiteSrc = {x: 150 + offsetX, y: 220};
    const entryPt = {x: 330 + offsetX, y: 240}; // Point on left face
    
    // Animation State
    const [isPlaying, setIsPlaying] = useState(false);
    const beamRef = useRef(null);
    const spectrumRef = useRef(null);
    const tlRef = useRef(null);

    // Wavelength colors
    const colors = [
        {c: '#ff0000', label: '红'},
        {c: '#ffa500', label: '橙'},
        {c: '#ffff00', label: '黄'},
        {c: '#008000', label: '绿'},
        {c: '#0000ff', label: '蓝'},
        {c: '#4b0082', label: '靛'},
        {c: '#ee82ee', label: '紫'},
    ];

    // Initialize animation timeline (paused)
    useEffect(() => {
        const tl = gsap.timeline({
            paused: true,
            onComplete: () => setIsPlaying(false) 
        });
        tlRef.current = tl;
        
        // 1. White beam shoots to prism
        // Reset beam state
        tl.set(beamRef.current, { opacity: 1, attr: { x2: whiteSrc.x, y2: whiteSrc.y } });
        
        tl.to(beamRef.current, 
            { attr: { x2: entryPt.x, y2: entryPt.y }, duration: 1, ease: "power1.out" }
        );

        // 2. Spectrum expands out
        tl.to(spectrumRef.current, { opacity: 1, duration: 0.1 }); // Show spectrum container
        
        // Animate each ray growing
        colors.forEach((col, i) => {
            const rayId = `#ray-${i}`;
            const rayOuterId = `#ray-outer-${i}`;
            
            // Inside path
            tl.fromTo(rayId,
                { attr: { x2: entryPt.x, y2: entryPt.y } },
                { attr: { x2: 450 + offsetX, y2: 230 + (i - 3) * 5 }, duration: 0.5, ease: "none" },
                "<" // Start together
            );
            
            // Outside path
            // Shortened the end X coordinate from 750 to 650 to fit in viewbox
            tl.fromTo(rayOuterId,
                { attr: { x2: 450 + offsetX, y2: 230 + (i - 3) * 5 } },
                { attr: { x2: 650 + offsetX, y2: 150 + i * 40 }, duration: 1, ease: "power2.out" },
                ">" // Start after inside is done
            );
        });

        // 3. Labels appear
        tl.to(".color-label", { opacity: 1, duration: 0.5, stagger: 0.05 }, "-=0.5");

        // 4. Stay there! No fade out.
        // Animation ends here.

        return () => tl.kill();
    }, []);

    const playAnimation = () => {
        if (tlRef.current) {
            setIsPlaying(true);
            tlRef.current.restart();
        }
    };

    return (
        <div className="lab-stage">
            {/* Scientific Explanation Box */}
            <div style={{position: 'absolute', top: 20, left: 20, width: 250, background: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 8, border: '1px solid #444', color: '#ddd', fontSize: '13px', lineHeight: '1.5', zIndex: 10, pointerEvents: 'none'}}>
                <strong style={{color: '#fff', display: 'block', marginBottom: 5}}>为什么会有彩虹？</strong>
                <ul style={{paddingLeft: 15, margin: '5px 0'}}>
                    <li><strong>折射率不同：</strong> 玻璃对不同颜色的光折射率不同。</li>
                    <li><strong>紫光偏折大：</strong> 紫光频率高，在玻璃中速度最慢，折射率最大。</li>
                    <li><strong>红光偏折小：</strong> 红光频率低，在玻璃中速度最快，折射率最小。</li>
                </ul>
                所以白光一进三棱镜，就被“拆”开了。
            </div>

            {/* Increased SVG width and adjusted viewBox to ensure everything is visible */}
            <svg width="100%" height="600" className="lab-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Prism */}
                <path d={`M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} Z`} fill="rgba(255,255,255,0.1)" stroke="#fff" strokeWidth="2" />
                
                {/* White Light Beam (Animated) */}
                <line ref={beamRef} x1={whiteSrc.x} y1={whiteSrc.y} x2={whiteSrc.x} y2={whiteSrc.y} stroke="#fff" strokeWidth="6" filter="url(#glow)" strokeLinecap="round" opacity="0" />
                
                {/* Spectrum Rays (Animated) */}
                <g ref={spectrumRef} opacity="0">
                    {colors.map((col, i) => {
                        const innerEnd = { x: 450 + offsetX, y: 230 + (i - 3) * 5 };
                        const outerEndY = 150 + i * 40;
                        // Adjusted end X for rays to be shorter
                        const outerEndX = 650 + offsetX;
                        
                        return (
                            <g key={i}>
                                {/* Inside Ray */}
                                <line id={`ray-${i}`} x1={entryPt.x} y1={entryPt.y} x2={entryPt.x} y2={entryPt.y} stroke={col.c} strokeWidth="3" opacity="0.8" filter="url(#glow)" />
                                {/* Outside Ray */}
                                <line id={`ray-outer-${i}`} x1={innerEnd.x} y1={innerEnd.y} x2={innerEnd.x} y2={innerEnd.y} stroke={col.c} strokeWidth="3" filter="url(#glow)" />
                                {/* Color Label - moved closer to end of ray */}
                                <text className="color-label" x={outerEndX + 15} y={outerEndY + 5} fill={col.c} fontSize="14" fontWeight="bold" opacity="0" style={{textShadow: '0 0 5px currentColor'}}>
                                    {col.label}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
            
            <div className="lab-controls">
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '20px'}}>
                    <div className="info-text" style={{textAlign: 'center'}}>
                        牛顿发现白光是由七种色光混合而成的。不同颜色的光在玻璃中的折射率不同（红光最小，紫光最大），通过三棱镜后就分开了。
                    </div>
                    <button 
                        onClick={playAnimation}
                        disabled={isPlaying}
                        style={{
                            padding: '12px 30px',
                            fontSize: '16px',
                            background: isPlaying ? '#333' : 'var(--accent-blue)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: isPlaying ? 'not-allowed' : 'pointer',
                            opacity: isPlaying ? 0.6 : 1,
                            transition: 'all 0.2s',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                    >
                        {isPlaying ? '🌈 演示进行中...' : '▶️ 发射白光'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Main Lab Container
// ==========================================
function OpticsLab() {
    const [activeTab, setActiveTab] = useState('pinhole');
    const fullBleed = { width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' };

    return (
        <>
            <div className="nav-bar" style={{ ...fullBleed, maxWidth: 'none', paddingLeft: 20, paddingRight: 20, boxSizing: 'border-box' }}>
                <Link to="/physics" className="nav-btn">
                    <span style={{fontSize: '18px'}}>←</span> 返回物理目录
                </Link>
            </div>

            <div style={{ ...fullBleed, maxWidth: 'none', padding: 0, overflow: 'hidden', borderRadius: 0, boxShadow: 'none', background: '#000' }}>
                {/* Header */}
                <div style={{background: '#1c1c1e', padding: '30px', textAlign: 'center', borderBottom: '1px solid #333'}}>
                    <h2 style={{margin: '0 0 10px 0', color: '#fff', fontSize: '28px'}}>🔭 光学虚拟实验室</h2>
                    <p style={{color: '#888', margin: 0}}>选择下方的实验模块开始探索</p>
                </div>

                {/* Tabs */}
                <div className="lab-tabs">
                    <button className={`lab-tab ${activeTab === 'pinhole' ? 'active' : ''}`} onClick={() => setActiveTab('pinhole')}>🟢 直线传播</button>
                    <button className={`lab-tab ${activeTab === 'reflection' ? 'active' : ''}`} onClick={() => setActiveTab('reflection')}>🔵 光的反射</button>
                    <button className={`lab-tab ${activeTab === 'mirror' ? 'active' : ''}`} onClick={() => setActiveTab('mirror')}>🟡 平面镜成像</button>
                    <button className={`lab-tab ${activeTab === 'refraction' ? 'active' : ''}`} onClick={() => setActiveTab('refraction')}>🔴 光的折射</button>
                    <button className={`lab-tab ${activeTab === 'dispersion' ? 'active' : ''}`} onClick={() => setActiveTab('dispersion')}>🌈 光的色散</button>
                </div>

                {/* Content Area */}
                <div className="lab-content" style={{background: '#000', minHeight: '600px'}}>
                    {activeTab === 'pinhole' && <PinholeModule />}
                    {activeTab === 'reflection' && <ReflectionModule />}
                    {activeTab === 'mirror' && <MirrorModule />}
                    {activeTab === 'refraction' && <RefractionModule />}
                    {activeTab === 'dispersion' && <DispersionModule />}
                </div>
            </div>

            <style>{`
                .lab-tabs {
                    display: flex;
                    background: #2c2c2e;
                    overflow-x: auto;
                }
                .lab-tab {
                    flex: 1;
                    padding: 15px 20px;
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                    border-bottom: 3px solid transparent;
                }
                .lab-tab:hover {
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                }
                .lab-tab.active {
                    color: #fff;
                    background: rgba(255,255,255,0.1);
                    border-bottom-color: var(--accent-blue);
                }
                .lab-stage {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .lab-svg {
                    background: #111;
                    cursor: crosshair;
                }
                .lab-controls {
                    padding: 20px;
                    background: #1c1c1e;
                    border-top: 1px solid #333;
                    display: flex;
                    gap: 30px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    min-width: 200px;
                }
                .control-group label {
                    color: #aaa;
                    font-size: 13px;
                }
                .control-group input[type=range] {
                    width: 100%;
                }
                .control-group select {
                    padding: 8px;
                    border-radius: 8px;
                    background: #333;
                    color: #fff;
                    border: 1px solid #555;
                }
            `}</style>
        </>
    );
}

export default OpticsLab;
