import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

// 音效工具函数
const playBeadSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        // 短促的“滴”声
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

const playFullTenSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        
        // 上行琶音 (C Major: C E G C)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const now = ctx.currentTime;
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            osc.connect(gain);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.15);
        });
        
        // 结尾渐隐
        gain.gain.setValueAtTime(0.2, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

const playTenDropSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle'; // Richer sound than sine
        // Lower pitch for "tens" bead (heavier)
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

const playRotateSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth'; // More "mechanical" or "zippy" sound
        // Swoosh effect
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

const playEqualSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        // Gentle "Ding"
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.1); // Sustain slightly
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

// ==========================================
// 1. 捆小棒 (Stick Bundling)
// ==========================================
const StickBundling = () => {
    const [count, setCount] = useState(0);
    
    // 限制在 0 - 20
    const addStick = () => {
        if (count < 20) {
            const nextCount = count + 1;
            setCount(nextCount);
            if (nextCount % 10 === 0) {
                playFullTenSound();
            } else {
                playBeadSound();
            }
        }
    };
    const reset = () => setCount(0);

    const tens = Math.floor(count / 10);
    const ones = count % 10;

    return (
        <div className="lab-stage" style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div className="stick-container" style={{display: 'flex', alignItems: 'flex-end', height: '300px', gap: '50px', marginBottom: '40px'}}>
                {/* Tens Place (Bundles) */}
                <div style={{display: 'flex', gap: '15px'}}>
                    {Array.from({length: tens}).map((_, i) => (
                        <div key={`ten-${i}`} className="stick-bundle" style={{
                            width: '60px', height: '160px', border: '3px solid #795548', borderRadius: '12px',
                            background: 'linear-gradient(to right, #D7CCC8, #A1887F)', 
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            position: 'relative', boxShadow: '5px 5px 15px rgba(0,0,0,0.2)',
                            transform: 'rotate(-2deg)'
                        }}>
                            <span style={{fontSize: '14px', color: '#3E2723', fontWeight: 'bold', background: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: '10px', marginTop: '-20px', marginBottom: '20px', position: 'relative', zIndex: 1}}>10根</span>
                            <div style={{position: 'absolute', width: '110%', height: '12px', background: '#5D4037', top: '35%', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', left: '50%', transform: 'translateX(-50%)', zIndex: 0, pointerEvents: 'none'}}></div>
                            <div style={{position: 'absolute', width: '110%', height: '12px', background: '#5D4037', bottom: '35%', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', left: '50%', transform: 'translateX(-50%)', zIndex: 0, pointerEvents: 'none'}}></div>
                        </div>
                    ))}
                </div>

                {/* Ones Place (Loose Sticks) */}
                <div style={{display: 'flex', gap: '8px', width: '172px', flexWrap: 'nowrap', justifyContent: 'flex-start'}}>
                    {Array.from({length: ones}).map((_, i) => (
                        <div key={`one-${i}`} className="stick-single" style={{
                            width: '12px', height: '110px', 
                            background: 'linear-gradient(to right, #FFE0B2, #FFB74D)', 
                            border: '1px solid #F57C00', borderRadius: '6px',
                            boxShadow: '2px 2px 5px rgba(0,0,0,0.15)',
                            transform: `rotate(${Math.random() * 10 - 5}deg)`
                        }}></div>
                    ))}
                </div>
            </div>

            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '30px'}}>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: '#5D4037', background: 'rgba(255,255,255,0.6)', padding: '10px 30px', borderRadius: '50px', backdropFilter: 'blur(5px)'}}>
                    当前数字：<span style={{color: '#E65100', fontSize: '48px', fontFamily: 'Comic Sans MS, cursive', margin: '0 10px'}}>{count}</span>
                </div>

                <div className="lab-controls" style={{padding: 0, margin: 0}}>
                    <button className="btn-main" onClick={addStick} disabled={count >= 20} style={{background: '#4CAF50', boxShadow: '0 4px 10px rgba(76, 175, 80, 0.4)'}}>+ 添加小棒</button>
                    <button className="btn-main btn-secondary" onClick={reset}>重置</button>
                </div>
            </div>

            <div style={{color: '#795548', fontSize: '20px', marginBottom: '40px', fontWeight: 'bold', textAlign: 'center'}}>
                {tens > 0 && <span style={{color: '#E65100', background: '#FFF3E0', padding: '5px 15px', borderRadius: '20px', margin: '0 5px'}}>{tens} 个十 </span>}
                {ones > 0 && <span style={{color: '#F57C00', background: '#FFF3E0', padding: '5px 15px', borderRadius: '20px', margin: '0 5px'}}>{ones} 个一</span>}
            </div>
            
            {/* Explanation */}
            <div className="stick-explanation" style={{position: 'absolute', top: 30, right: 30, width: 260, color: '#5D4037', fontSize: '15px', lineHeight: '1.6', pointerEvents: 'none'}}>
                <strong style={{color: '#E65100', display: 'block', marginBottom: 10, fontSize: '18px'}}>✨ 数的组成 ✨</strong>
                <ul style={{paddingLeft: 20, margin: '5px 0'}}>
                    <li style={{marginBottom: '5px'}}>10个“一”就是1个“十”。</li>
                    <li>十几就是由 1个十 和 几个一 组成的。</li>
                </ul>
            </div>
        </div>
    );
};

// ==========================================
// 2. 计数器 (Counter)
// ==========================================
const Counter = () => {
    const [ones, setOnes] = useState(0);
    const [tens, setTens] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Refs for animation elements
    const onesColRef = useRef(null);
    const tensColRef = useRef(null);
    
    const addOne = () => {
        if (isAnimating) return;

        playBeadSound(); // 拨珠音效

        if (ones < 9) {
            // Normal add
            setOnes(o => o + 1);
        } else {
            // Full 10! Start animation sequence
            if (tens < 2) {
                setIsAnimating(true);
                setOnes(10);
            }
        }
    };
    
    const reset = () => {
        setOnes(0);
        setTens(0);
        setIsAnimating(false);
    };

    return (
        <div className="lab-stage counter-stage" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '80px'}}>
            {/* Left Side: Counter Visualization */}
            <div className="counter-main" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div className="counter-frame" style={{
                    display: 'flex', gap: '80px', alignItems: 'flex-end', padding: '40px 80px 30px', 
                    background: '#5D4037', borderRadius: '24px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.1)',
                    position: 'relative'
                }}>
                    {/* Tens Column */}
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div ref={tensColRef} style={{position: 'relative', width: '12px', height: '240px', background: '#BCAAA4', borderRadius: '6px 6px 0 0', boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.3)'}}>
                            {/* Beads */}
                            <div style={{position: 'absolute', bottom: 10, width: '100%', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center'}}>
                                {Array.from({length: tens}).map((_, i) => (
                                    <div key={i} className="bead-ten" style={{
                                        width: '60px', height: '24px', 
                                        background: 'radial-gradient(circle at 30% 30%, #FF7043, #D84315)', 
                                        borderRadius: '12px', marginBottom: '2px', 
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                                    }}></div>
                                ))}
                            </div>
                        </div>
                        <div style={{marginTop: '15px', color: '#FFF', fontWeight: 'bold', fontSize: '18px', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>十位</div>
                        <div style={{fontSize: '24px', color: '#FFCC80', fontWeight: 'bold', marginTop: '5px'}}>{tens}</div>
                    </div>

                    {/* Ones Column */}
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div ref={onesColRef} style={{position: 'relative', width: '12px', height: '240px', background: '#BCAAA4', borderRadius: '6px 6px 0 0', boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.3)'}}>
                            {/* Beads */}
                            <div style={{position: 'absolute', bottom: 10, width: '100%', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center'}}>
                                {Array.from({length: ones}).map((_, i) => (
                                    <div key={i} className="bead-one" style={{
                                        width: '60px', height: '24px', 
                                        background: isAnimating && ones === 10 ? '#FFF176' : 'radial-gradient(circle at 30% 30%, #66BB6A, #2E7D32)', 
                                        borderRadius: '12px', marginBottom: '2px', 
                                        boxShadow: isAnimating && ones === 10 ? '0 0 15px #FFEE58' : '0 2px 5px rgba(0,0,0,0.3)',
                                        transition: 'all 0.3s'
                                    }}></div>
                                ))}
                            </div>
                            
                            {/* Carry Animation Ghost Bead */}
                            {isAnimating && (
                                <div className="carry-bead" style={{
                                    position: 'absolute', bottom: '230px', left: '-24px',
                                    width: '60px', height: '24px', 
                                    background: 'radial-gradient(circle at 30% 30%, #FF7043, #D84315)', 
                                    borderRadius: '12px',
                                    opacity: 0,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                }}></div>
                            )}
                        </div>
                        <div style={{marginTop: '15px', color: '#FFF', fontWeight: 'bold', fontSize: '18px', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>个位</div>
                        <div style={{fontSize: '24px', color: '#C8E6C9', fontWeight: 'bold', marginTop: '5px'}}>{ones}</div>
                    </div>
                </div>
                
                {/* Animation Logic with useEffect */}
                {useEffect(() => {
                    if (isAnimating && ones === 10 && onesColRef.current && tensColRef.current) {
                        // Animation Sequence
                        
                        // Play sound
                        playFullTenSound();

                        // Calculate dynamic distance
                        const startRect = onesColRef.current.getBoundingClientRect();
                        const endRect = tensColRef.current.getBoundingClientRect();
                        const distLeft = endRect.left - startRect.left - 24; // Extra offset to center bead
                        const dropDist = 230 - (tens * 26 + 10); // Adjust for margin and bottom offset

                        // 2. Animate "carry"
                        const tl = gsap.timeline();
                        
                        // Wait a bit for user to see the 10 beads
                        tl.to(".bead-one", { duration: 0.1, scale: 1.1, yoyo: true, repeat: 3, delay: 0.2 }) // Pulse
                          .to(".bead-one", { duration: 0.3, opacity: 0, scale: 0.5, stagger: 0.02 }) // Disappear
                          // Move a ghost bead from ones top to tens top
                          .set(".carry-bead", { opacity: 1, x: 0, y: 0 })
                          .to(".carry-bead", { 
                              duration: 0.6, 
                              x: distLeft,
                              y: 0,
                              ease: "power2.inOut"
                           })
                          .to(".carry-bead", {
                              duration: 0.4,
                              y: dropDist,
                              ease: "bounce.out",
                              onComplete: () => {
                                  setOnes(0);
                                  setTens(t => t + 1);
                                  setIsAnimating(false);
                                  playTenDropSound(); // Play landing sound
                              }
                          })
                          .to(".carry-bead", { opacity: 0, duration: 0.1 });
                          
                        return () => tl.kill();
                    }
                }, [isAnimating, ones, tens])}

                <div style={{fontSize: '28px', fontWeight: 'bold', color: '#5D4037', marginTop: '30px', fontFamily: 'Comic Sans MS, cursive'}}>
                    数值：<span style={{color: '#E65100', fontSize: '40px'}}>{tens * 10 + (ones === 10 ? 0 : ones)}</span>
                </div>

                <div className="lab-controls" style={{marginTop: '20px'}}>
                    <button className="btn-main" onClick={addOne} disabled={isAnimating || (tens >= 2 && ones >= 0)} style={{background: '#2196F3', boxShadow: '0 4px 10px rgba(33, 150, 243, 0.4)', opacity: isAnimating ? 0.6 : 1}}>+ 拨一颗珠子</button>
                    <button className="btn-main btn-secondary" onClick={reset}>重置</button>
                </div>
            </div>

             {/* Right Side: Explanation */}
             <div className="counter-explanation" style={{
                 width: '320px', color: '#5D4037', fontSize: '15px', lineHeight: '1.6'
             }}>
                <strong style={{color: '#E65100', display: 'block', marginBottom: 15, fontSize: '18px'}}>✨ 满十进一 ✨</strong>
                <ul style={{paddingLeft: 20, margin: '0'}}>
                    <li style={{marginBottom: '10px'}}>个位满 <strong>10</strong> 颗，向十位进 <strong>1</strong> 颗。</li>
                    <li>从右边起：第一位是<strong>个位</strong>，第二位是<strong>十位</strong>。</li>
                </ul>
            </div>
        </div>
    );
};

// ==========================================
// 3. 比较大小 (Comparison)
// ==========================================
const NumberComparison = () => {
    const [num1, setNum1] = useState(5);
    const [num2, setNum2] = useState(8);
    
    const generateRandom = () => {
        setNum1(Math.floor(Math.random() * 20) + 1);
        setNum2(Math.floor(Math.random() * 20) + 1);
    };

    let symbol = '=';
    let rotation = 0;
    if (num1 > num2) {
        symbol = '>';
        rotation = 180; 
    } else if (num1 < num2) {
        symbol = '<';
        rotation = 0;
    } else {
        symbol = '=';
    }

    useEffect(() => {
        if (symbol !== '=') {
            playRotateSound();
        } else {
            playEqualSound();
        }
    }, [symbol]);

    return (
        <div className="lab-stage comparison-stage" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '80px', flexWrap: 'wrap'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div className="comparison-main" style={{display: 'flex', alignItems: 'center', gap: '60px', fontSize: '60px', fontWeight: 'bold', color: '#5D4037', fontFamily: 'Comic Sans MS, cursive'}}>
                    <div style={{
                        width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#FFF8E1', borderRadius: '50%', border: '6px solid #FFC107', 
                        boxShadow: '0 10px 20px rgba(255, 193, 7, 0.3)'
                    }}>{num1}</div>
                    
                    <div style={{width: '160px', height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {symbol === '=' ? (
                            <div style={{fontSize: '100px', color: '#FFD700', textShadow: '4px 4px 0 rgba(0,0,0,0.1)'}}>=</div>
                        ) : (
                            <svg width="120" height="120" viewBox="0 0 100 100" style={{transform: `rotate(${rotation}deg)`, transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))'}}>
                                <path d="M10,30 Q40,10 90,10 L80,50 L90,90 Q40,90 10,70 Q5,50 10,30 Z" fill="#4CAF50" stroke="#2E7D32" strokeWidth="3" />
                                <path d="M20,35 L25,45 L30,35 M40,35 L45,45 L50,35 M60,35 L65,45 L70,35" stroke="#fff" strokeWidth="2" fill="none" />
                                <path d="M20,65 L25,55 L30,65 M40,65 L45,55 L50,65 M60,65 L65,55 L70,65" stroke="#fff" strokeWidth="2" fill="none" />
                                <circle cx="30" cy="25" r="5" fill="#fff" />
                                <circle cx="30" cy="25" r="2" fill="#000" />
                            </svg>
                        )}
                    </div>
                    
                    <div style={{
                        width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#FFF8E1', borderRadius: '50%', border: '6px solid #FFC107', 
                        boxShadow: '0 10px 20px rgba(255, 193, 7, 0.3)'
                    }}>{num2}</div>
                </div>
                
                <div style={{marginTop: '40px', fontSize: '36px', color: '#E65100', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    {num1} {symbol} {num2}
                </div>
                
                <div className="lab-controls" style={{marginTop: '50px', flexWrap: 'wrap', alignItems: 'center'}}>
                    <button className="btn-main" onClick={generateRandom} style={{background: '#2196F3', boxShadow: '0 4px 10px rgba(33, 150, 243, 0.4)'}}>🎲 随机出题</button>
                    <div className="comparison-explanation" style={{width: 280, background: 'rgba(232, 245, 233, 0.9)', padding: 20, borderRadius: 20, border: '2px solid #81C784', color: '#2E7D32', fontSize: '15px', lineHeight: '1.6', pointerEvents: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', backdropFilter: 'blur(10px)'}}>
                        <strong style={{color: '#388E3C', display: 'block', marginBottom: 10, fontSize: '18px'}}>✨ 开口歌 ✨</strong>
                        <ul style={{paddingLeft: 20, margin: '5px 0'}}>
                            <li>嘴巴大大朝大数，尖尖嘴巴对小数。</li>
                            <li>两数相等画等号。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Main Component
// ==========================================
function NumberSense20() {
    const [activeTab, setActiveTab] = useState('stick');
    const fullBleed = { width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FFF3E0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            paddingBottom: '40px'
        }}>
            <div className="nav-bar" style={{ width: '100%', margin: '0', padding: '40px 20px 0', display: 'flex', gap: '15px', boxSizing: 'border-box' }}>
                <Link to="/math" className="nav-btn">
                    <span style={{fontSize: '18px'}}>←</span> 返回数学乐园
                </Link>
            </div>

            <div style={{ width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
                {/* Header */}
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <h1 style={{
                        margin: '0 0 10px 0', 
                        color: '#E65100', 
                        fontSize: '36px', 
                        fontWeight: '800',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>🔢 20以内数的认识</h1>
                    <p style={{color: '#F57C00', margin: 0, fontWeight: '500', fontSize: '18px'}}>✨ 快乐学习，天天向上！ ✨</p>
                </div>

                {/* Tabs */}
                <div className="lab-tabs">
                    <button className={`lab-tab ${activeTab === 'stick' ? 'active' : ''}`} onClick={() => setActiveTab('stick')}>🥢 捆小棒 (数的组成)</button>
                    <button className={`lab-tab ${activeTab === 'counter' ? 'active' : ''}`} onClick={() => setActiveTab('counter')}>🧮 计数器 (数位)</button>
                    <button className={`lab-tab ${activeTab === 'compare' ? 'active' : ''}`} onClick={() => setActiveTab('compare')}>🐊 比较大小</button>
                </div>

                {/* Content Area */}
                <div className="lab-content">
                    {activeTab === 'stick' && <StickBundling />}
                    {activeTab === 'counter' && <Counter />}
                    {activeTab === 'compare' && <NumberComparison />}
                </div>
            </div>

            <style>{`
                body {
                    margin: 0;
                    padding: 0 !important;
                    display: block !important;
                    background-color: #FFF3E0 !important;
                }
                #root {
                    width: 100%;
                }
                .nav-btn {
                    background: white;
                    padding: 10px 20px;
                    border-radius: 50px;
                    text-decoration: none;
                    color: #5D4037;
                    font-weight: bold;
                    font-size: 15px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }
                .nav-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
                }

                .lab-tabs {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .lab-tab {
                    padding: 12px 25px;
                    background: rgba(255, 255, 255, 0.6);
                    border: 2px solid transparent;
                    border-radius: 50px;
                    color: #8D6E63;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    backdrop-filter: blur(5px);
                }
                .lab-tab:hover {
                    background: rgba(255, 255, 255, 0.9);
                    transform: translateY(-2px);
                }
                .lab-tab.active {
                    background: #FF9800;
                    color: white;
                    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
                }

                .lab-content {
                    background: transparent;
                    border-radius: 0;
                    min-height: 600px;
                    padding: 20px 0;
                    box-shadow: none;
                    backdrop-filter: none;
                    border: none;
                    position: relative;
                    width: 100%;
                }

                .lab-stage {
                    position: relative;
                    width: 100%;
                    min-height: 500px;
                    display: flex;
                }
                .lab-controls {
                    padding: 20px;
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                }
                
                .btn-main {
                    padding: 12px 35px;
                    border-radius: 50px;
                    border: none;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    color: white;
                    background: #FF9800;
                    box-shadow: 0 10px 20px rgba(255, 152, 0, 0.3);
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .btn-main:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 15px 30px rgba(255, 152, 0, 0.4);
                }
                .btn-main:active {
                    transform: translateY(1px);
                    box-shadow: 0 5px 10px rgba(255, 152, 0, 0.2);
                }
                .btn-main:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .btn-secondary {
                    background: white;
                    color: #5D4037;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .btn-secondary:hover {
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }

                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .lab-tabs {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 10px;
                    }
                    .lab-content {
                        padding: 20px;
                    }
                    /* Stick Bundling */
                    .stick-container {
                        height: auto !important;
                        margin-bottom: 30px !important;
                        transform: scale(0.9);
                    }
                    .stick-explanation {
                        position: relative !important;
                        top: auto !important;
                        right: auto !important;
                        width: 100% !important;
                        max-width: none !important;
                        margin-top: 30px !important;
                        box-sizing: border-box !important;
                    }

                    /* Counter */
                    .counter-stage {
                        flex-direction: column !important;
                        gap: 30px !important;
                        padding-top: 10px !important;
                    }
                    .counter-frame {
                        gap: 40px !important;
                        padding: 30px 40px !important;
                        transform: scale(0.9);
                        width: 100%;
                        box-sizing: border-box;
                    }
                    .counter-explanation {
                        width: 100% !important;
                        box-sizing: border-box !important;
                    }

                    /* Comparison */
                    .comparison-stage {
                        flex-direction: column !important;
                        gap: 30px !important;
                        padding-right: 0 !important;
                    }
                    .comparison-main {
                        gap: 20px !important;
                        transform: scale(0.8);
                        flex-wrap: nowrap !important;
                        width: 100% !important;
                        justify-content: center;
                    }
                    .comparison-explanation {
                        position: relative !important;
                        top: auto !important;
                        right: auto !important;
                        bottom: auto !important;
                        left: auto !important;
                        width: 100% !important;
                        max-width: none !important;
                        margin-top: 30px !important;
                        box-sizing: border-box !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default NumberSense20;
