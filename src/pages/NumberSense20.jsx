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

        osc.type = 'triangle';
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

        osc.type = 'sawtooth';
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
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

// ==========================================
// 1. 捆小棒 (Stick Bundling) - Mobile Optimized
// ==========================================
const StickBundling = () => {
    const [count, setCount] = useState(0);

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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 10px 120px',
            boxSizing: 'border-box'
        }}>
            {/* 说明卡片 */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.9) 100%)',
                padding: 'clamp(12px, 3vw, 20px)',
                borderRadius: '16px',
                marginBottom: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: '2px solid rgba(255, 152, 0, 0.2)',
                width: '100%',
                maxWidth: '400px',
                boxSizing: 'border-box'
            }}>
                <strong style={{
                    color: '#E65100',
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    textAlign: 'center'
                }}>✨ 数的组成 ✨</strong>
                <ul style={{
                    paddingLeft: '20px',
                    margin: '0',
                    color: '#5D4037',
                    fontSize: 'clamp(12px, 3vw, 15px)',
                    lineHeight: '1.6'
                }}>
                    <li style={{ marginBottom: '4px' }}>10个"一"就是1个"十"。</li>
                    <li>十几就是由 1个十 和 几个一 组成的。</li>
                </ul>
            </div>

            {/* 当前数字显示 */}
            <div style={{
                fontSize: 'clamp(20px, 5vw, 28px)',
                fontWeight: 'bold',
                color: '#5D4037',
                background: 'rgba(255,255,255,0.9)',
                padding: 'clamp(10px, 2.5vw, 16px) clamp(20px, 5vw, 40px)',
                borderRadius: '50px',
                backdropFilter: 'blur(10px)',
                marginBottom: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                textAlign: 'center'
            }}>
                当前数字：<span style={{
                    color: '#E65100',
                    fontSize: 'clamp(32px, 8vw, 48px)',
                    fontFamily: 'Comic Sans MS, cursive',
                    margin: '0 8px'
                }}>{count}</span>
            </div>

            {/* 小棒展示区 */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 'clamp(20px, 5vw, 50px)',
                marginBottom: '20px',
                minHeight: 'clamp(180px, 40vw, 300px)',
                width: '100%',
                flexWrap: 'wrap'
            }}>
                {/* 十位（捆） */}
                <div style={{
                    display: 'flex',
                    gap: 'clamp(8px, 2vw, 15px)',
                    justifyContent: 'center'
                }}>
                    {Array.from({ length: tens }).map((_, i) => (
                        <div key={`ten-${i}`} style={{
                            width: 'clamp(40px, 10vw, 60px)',
                            height: 'clamp(100px, 25vw, 160px)',
                            border: '3px solid #795548',
                            borderRadius: '12px',
                            background: 'linear-gradient(to right, #D7CCC8, #A1887F)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            boxShadow: '3px 3px 10px rgba(0,0,0,0.2)',
                            transform: 'rotate(-2deg)'
                        }}>
                            <span style={{
                                fontSize: 'clamp(10px, 2.5vw, 14px)',
                                color: '#3E2723',
                                fontWeight: 'bold',
                                background: 'rgba(255,255,255,0.8)',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                position: 'relative',
                                zIndex: 1
                            }}>10根</span>
                            <div style={{
                                position: 'absolute',
                                width: '110%',
                                height: 'clamp(8px, 2vw, 12px)',
                                background: '#5D4037',
                                top: '35%',
                                borderRadius: '4px',
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}></div>
                            <div style={{
                                position: 'absolute',
                                width: '110%',
                                height: 'clamp(8px, 2vw, 12px)',
                                background: '#5D4037',
                                bottom: '35%',
                                borderRadius: '4px',
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}></div>
                        </div>
                    ))}
                </div>

                {/* 个位（散棒） */}
                <div style={{
                    display: 'flex',
                    gap: 'clamp(4px, 1vw, 8px)',
                    justifyContent: 'flex-start',
                    flexWrap: 'nowrap',
                    minWidth: 'clamp(100px, 25vw, 172px)'
                }}>
                    {Array.from({ length: ones }).map((_, i) => (
                        <div key={`one-${i}`} style={{
                            width: 'clamp(8px, 2vw, 12px)',
                            height: 'clamp(70px, 18vw, 110px)',
                            background: 'linear-gradient(to right, #FFE0B2, #FFB74D)',
                            border: '1px solid #F57C00',
                            borderRadius: '6px',
                            boxShadow: '2px 2px 5px rgba(0,0,0,0.15)',
                            transform: `rotate(${Math.random() * 10 - 5}deg)`
                        }}></div>
                    ))}
                </div>
            </div>

            {/* 数位说明 */}
            <div style={{
                color: '#795548',
                fontSize: 'clamp(14px, 3.5vw, 20px)',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px'
            }}>
                {tens > 0 && <span style={{
                    color: '#E65100',
                    background: '#FFF3E0',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    margin: '0 4px',
                    display: 'inline-block'
                }}>{tens} 个十</span>}
                {ones > 0 && <span style={{
                    color: '#F57C00',
                    background: '#FFF3E0',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    margin: '0 4px',
                    display: 'inline-block'
                }}>{ones} 个一</span>}
            </div>

            {/* 固定底部控制栏 */}
            <div className="bottom-controls" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                padding: '16px',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                zIndex: 1000,
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <button onClick={addStick} disabled={count >= 20} style={{
                    padding: '14px 28px',
                    borderRadius: '50px',
                    border: 'none',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontWeight: 'bold',
                    cursor: count >= 20 ? 'not-allowed' : 'pointer',
                    color: 'white',
                    background: count >= 20 ? '#ccc' : 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                    boxShadow: count >= 20 ? 'none' : '0 4px 16px rgba(76, 175, 80, 0.4)',
                    transition: 'all 0.2s',
                    flex: '1',
                    maxWidth: '180px',
                    minWidth: '120px'
                }}>+ 添加小棒</button>
                <button onClick={reset} style={{
                    padding: '14px 24px',
                    borderRadius: '50px',
                    border: '2px solid #E0E0E0',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: '#666',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s'
                }}>🔄 重置</button>
            </div>
        </div>
    );
};

// ==========================================
// 2. 计数器 (Counter) - Mobile Optimized
// ==========================================
const Counter = () => {
    const [ones, setOnes] = useState(0);
    const [tens, setTens] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const onesColRef = useRef(null);
    const tensColRef = useRef(null);

    const addOne = () => {
        if (isAnimating) return;
        playBeadSound();

        if (ones < 9) {
            setOnes(o => o + 1);
        } else {
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

    useEffect(() => {
        if (isAnimating && ones === 10 && onesColRef.current && tensColRef.current) {
            playFullTenSound();

            const startRect = onesColRef.current.getBoundingClientRect();
            const endRect = tensColRef.current.getBoundingClientRect();
            // 计算水平距离：从个位杆到十位杆
            const distLeft = endRect.left - startRect.left;
            // 计算下落距离：根据已有的十位珠子数量确定落点
            // 珠子高度约20px，间隔2px，底部偏移10px
            const beadHeight = 22; // 珠子高度 + 间距
            const dropDistance = beadHeight * (tens + 0.5); // 落到已有珠子上方

            const tl = gsap.timeline();

            tl.to(".bead-one", { duration: 0.1, scale: 1.1, yoyo: true, repeat: 3, delay: 0.2 })
                .to(".bead-one", { duration: 0.3, opacity: 0, scale: 0.5, stagger: 0.02 })
                .set(".carry-bead", { opacity: 1, x: 0, y: 0 })
                // 第一步：水平移动到十位杆上方（对齐十位杆）
                .to(".carry-bead", {
                    duration: 0.5,
                    x: distLeft,
                    ease: "power2.inOut"
                })
                // 第二步：向下落到正确位置
                .to(".carry-bead", {
                    duration: 0.4,
                    y: dropDistance,
                    ease: "bounce.out",
                    onComplete: () => {
                        setOnes(0);
                        setTens(t => t + 1);
                        setIsAnimating(false);
                        playTenDropSound();
                    }
                })
                .to(".carry-bead", { opacity: 0, duration: 0.1 });

            return () => tl.kill();
        }
    }, [isAnimating, ones, tens]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 10px 120px',
            boxSizing: 'border-box'
        }}>
            {/* 说明卡片 */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(232, 245, 233, 0.95) 0%, rgba(200, 230, 201, 0.9) 100%)',
                padding: 'clamp(12px, 3vw, 20px)',
                borderRadius: '16px',
                marginBottom: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: '2px solid rgba(76, 175, 80, 0.2)',
                width: '100%',
                maxWidth: '400px',
                boxSizing: 'border-box'
            }}>
                <strong style={{
                    color: '#E65100',
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    textAlign: 'center'
                }}>✨ 满十进一 ✨</strong>
                <ul style={{
                    paddingLeft: '20px',
                    margin: '0',
                    color: '#5D4037',
                    fontSize: 'clamp(12px, 3vw, 15px)',
                    lineHeight: '1.6'
                }}>
                    <li style={{ marginBottom: '4px' }}>个位满 <strong>10</strong> 颗，向十位进 <strong>1</strong> 颗。</li>
                    <li>从右边起：第一位是<strong>个位</strong>，第二位是<strong>十位</strong>。</li>
                </ul>
            </div>

            {/* 计数器框架 */}
            <div style={{
                display: 'flex',
                gap: 'clamp(40px, 10vw, 80px)',
                alignItems: 'flex-end',
                padding: 'clamp(20px, 5vw, 40px) clamp(30px, 8vw, 80px) clamp(15px, 4vw, 30px)',
                background: '#5D4037',
                borderRadius: '24px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.25), inset 0 2px 10px rgba(255,255,255,0.1)',
                position: 'relative',
                marginBottom: '20px'
            }}>
                {/* 十位 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div ref={tensColRef} style={{
                        position: 'relative',
                        width: 'clamp(8px, 2vw, 12px)',
                        height: 'clamp(160px, 35vw, 240px)',
                        background: '#BCAAA4',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            bottom: 10,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            alignItems: 'center'
                        }}>
                            {Array.from({ length: tens }).map((_, i) => (
                                <div key={i} className="bead-ten" style={{
                                    width: 'clamp(40px, 10vw, 60px)',
                                    height: 'clamp(16px, 4vw, 24px)',
                                    background: 'radial-gradient(circle at 30% 30%, #FF7043, #D84315)',
                                    borderRadius: '12px',
                                    marginBottom: '2px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                                }}></div>
                            ))}
                        </div>
                    </div>
                    <div style={{
                        marginTop: '12px',
                        color: '#FFF',
                        fontWeight: 'bold',
                        fontSize: 'clamp(14px, 3.5vw, 18px)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>十位</div>
                    <div style={{
                        fontSize: 'clamp(18px, 4.5vw, 24px)',
                        color: '#FFCC80',
                        fontWeight: 'bold',
                        marginTop: '4px'
                    }}>{tens}</div>
                </div>

                {/* 个位 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div ref={onesColRef} style={{
                        position: 'relative',
                        width: 'clamp(8px, 2vw, 12px)',
                        height: 'clamp(160px, 35vw, 240px)',
                        background: '#BCAAA4',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            bottom: 10,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            alignItems: 'center'
                        }}>
                            {Array.from({ length: ones }).map((_, i) => (
                                <div key={i} className="bead-one" style={{
                                    width: 'clamp(40px, 10vw, 60px)',
                                    height: 'clamp(16px, 4vw, 24px)',
                                    background: isAnimating && ones === 10 ? '#FFF176' : 'radial-gradient(circle at 30% 30%, #66BB6A, #2E7D32)',
                                    borderRadius: '12px',
                                    marginBottom: '2px',
                                    boxShadow: isAnimating && ones === 10 ? '0 0 15px #FFEE58' : '0 2px 5px rgba(0,0,0,0.3)',
                                    transition: 'all 0.3s'
                                }}></div>
                            ))}
                        </div>

                        {isAnimating && (
                            <div className="carry-bead" style={{
                                position: 'absolute',
                                bottom: '10px',  // 与珠子堆底部对齐
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 'clamp(40px, 10vw, 60px)',
                                height: 'clamp(16px, 4vw, 24px)',
                                background: 'radial-gradient(circle at 30% 30%, #FF7043, #D84315)',
                                borderRadius: '12px',
                                opacity: 0,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                zIndex: 10
                            }}></div>
                        )}
                    </div>
                    <div style={{
                        marginTop: '12px',
                        color: '#FFF',
                        fontWeight: 'bold',
                        fontSize: 'clamp(14px, 3.5vw, 18px)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>个位</div>
                    <div style={{
                        fontSize: 'clamp(18px, 4.5vw, 24px)',
                        color: '#C8E6C9',
                        fontWeight: 'bold',
                        marginTop: '4px'
                    }}>{ones}</div>
                </div>
            </div>

            {/* 数值显示 */}
            <div style={{
                fontSize: 'clamp(22px, 5.5vw, 28px)',
                fontWeight: 'bold',
                color: '#5D4037',
                fontFamily: 'Comic Sans MS, cursive',
                background: 'rgba(255,255,255,0.9)',
                padding: '12px 24px',
                borderRadius: '50px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}>
                数值：<span style={{ color: '#E65100', fontSize: 'clamp(32px, 8vw, 40px)' }}>{tens * 10 + (ones === 10 ? 0 : ones)}</span>
            </div>

            {/* 固定底部控制栏 */}
            <div className="bottom-controls" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                padding: '16px',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                zIndex: 1000,
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={addOne}
                    disabled={isAnimating || (tens >= 2 && ones >= 0)}
                    style={{
                        padding: '14px 28px',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: 'clamp(14px, 3.5vw, 18px)',
                        fontWeight: 'bold',
                        cursor: (isAnimating || (tens >= 2)) ? 'not-allowed' : 'pointer',
                        color: 'white',
                        background: (isAnimating || (tens >= 2)) ? '#ccc' : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                        boxShadow: (isAnimating || (tens >= 2)) ? 'none' : '0 4px 16px rgba(33, 150, 243, 0.4)',
                        transition: 'all 0.2s',
                        flex: '1',
                        maxWidth: '180px',
                        minWidth: '120px',
                        opacity: isAnimating ? 0.6 : 1
                    }}
                >+ 拨一颗珠子</button>
                <button onClick={reset} style={{
                    padding: '14px 24px',
                    borderRadius: '50px',
                    border: '2px solid #E0E0E0',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: '#666',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s'
                }}>🔄 重置</button>
            </div>
        </div>
    );
};

// ==========================================
// 3. 比较大小 (Comparison) - Mobile Optimized
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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 10px 120px',
            boxSizing: 'border-box'
        }}>
            {/* 说明卡片 */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(232, 245, 233, 0.95) 0%, rgba(200, 230, 201, 0.9) 100%)',
                padding: 'clamp(12px, 3vw, 20px)',
                borderRadius: '16px',
                marginBottom: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: '2px solid #81C784',
                width: '100%',
                maxWidth: '400px',
                boxSizing: 'border-box'
            }}>
                <strong style={{
                    color: '#388E3C',
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    textAlign: 'center'
                }}>✨ 开口歌 ✨</strong>
                <ul style={{
                    paddingLeft: '20px',
                    margin: '0',
                    color: '#2E7D32',
                    fontSize: 'clamp(12px, 3vw, 15px)',
                    lineHeight: '1.6'
                }}>
                    <li style={{ marginBottom: '4px' }}>嘴巴大大朝大数，尖尖嘴巴对小数。</li>
                    <li>两数相等画等号。</li>
                </ul>
            </div>

            {/* 比较主区域 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(16px, 4vw, 40px)',
                fontSize: 'clamp(36px, 10vw, 60px)',
                fontWeight: 'bold',
                color: '#5D4037',
                fontFamily: 'Comic Sans MS, cursive',
                marginBottom: '20px',
                flexWrap: 'nowrap'
            }}>
                <div style={{
                    width: 'clamp(70px, 18vw, 120px)',
                    height: 'clamp(70px, 18vw, 120px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FFF8E1',
                    borderRadius: '50%',
                    border: 'clamp(3px, 1vw, 6px) solid #FFC107',
                    boxShadow: '0 6px 16px rgba(255, 193, 7, 0.3)',
                    fontSize: 'clamp(28px, 8vw, 60px)'
                }}>{num1}</div>

                <div style={{
                    width: 'clamp(80px, 20vw, 160px)',
                    height: 'clamp(80px, 20vw, 160px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {symbol === '=' ? (
                        <div style={{
                            fontSize: 'clamp(50px, 14vw, 100px)',
                            color: '#FFD700',
                            textShadow: '3px 3px 0 rgba(0,0,0,0.1)'
                        }}>=</div>
                    ) : (
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 100"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                                filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.1))',
                                maxWidth: 'clamp(60px, 15vw, 120px)',
                                maxHeight: 'clamp(60px, 15vw, 120px)'
                            }}
                        >
                            <path d="M10,30 Q40,10 90,10 L80,50 L90,90 Q40,90 10,70 Q5,50 10,30 Z" fill="#4CAF50" stroke="#2E7D32" strokeWidth="3" />
                            <path d="M20,35 L25,45 L30,35 M40,35 L45,45 L50,35 M60,35 L65,45 L70,35" stroke="#fff" strokeWidth="2" fill="none" />
                            <path d="M20,65 L25,55 L30,65 M40,65 L45,55 L50,65 M60,65 L65,55 L70,65" stroke="#fff" strokeWidth="2" fill="none" />
                            <circle cx="30" cy="25" r="5" fill="#fff" />
                            <circle cx="30" cy="25" r="2" fill="#000" />
                        </svg>
                    )}
                </div>

                <div style={{
                    width: 'clamp(70px, 18vw, 120px)',
                    height: 'clamp(70px, 18vw, 120px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FFF8E1',
                    borderRadius: '50%',
                    border: 'clamp(3px, 1vw, 6px) solid #FFC107',
                    boxShadow: '0 6px 16px rgba(255, 193, 7, 0.3)',
                    fontSize: 'clamp(28px, 8vw, 60px)'
                }}>{num2}</div>
            </div>

            {/* 结果显示 */}
            <div style={{
                fontSize: 'clamp(24px, 7vw, 36px)',
                color: '#E65100',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.9)',
                padding: 'clamp(12px, 3vw, 20px) clamp(24px, 6vw, 40px)',
                borderRadius: '50px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}>
                {num1} {symbol} {num2}
            </div>

            {/* 固定底部控制栏 */}
            <div className="bottom-controls" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                padding: '16px',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                zIndex: 1000,
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <button onClick={generateRandom} style={{
                    padding: '14px 32px',
                    borderRadius: '50px',
                    border: 'none',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: 'white',
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                    boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
                    transition: 'all 0.2s',
                    flex: '1',
                    maxWidth: '200px',
                    minWidth: '140px'
                }}>🎲 随机出题</button>
            </div>
        </div>
    );
};

// ==========================================
// Main Component - Mobile Optimized
// ==========================================
function NumberSense20() {
    const [activeTab, setActiveTab] = useState('stick');

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            paddingBottom: '20px'
        }}>
            {/* Navigation */}
            <div style={{
                width: '100%',
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <Link to="/math" style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    color: '#5D4037',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255,255,255,0.5)'
                }}>
                    <span style={{ fontSize: '18px' }}>←</span> 返回数学乐园
                </Link>
            </div>

            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                padding: '0 20px'
            }}>
                <h1 style={{
                    margin: '0 0 10px 0',
                    color: '#E65100',
                    fontSize: 'clamp(24px, 7vw, 36px)',
                    fontWeight: '800',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>🔢 20以内数的认识</h1>
                <p style={{
                    color: '#F57C00',
                    margin: 0,
                    fontWeight: '600',
                    fontSize: 'clamp(14px, 3.5vw, 18px)'
                }}>✨ 快乐学习，天天向上！ ✨</p>
            </div>

            {/* Tabs - Mobile Optimized */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(8px, 2vw, 15px)',
                marginBottom: '24px',
                padding: '0 12px',
                flexWrap: 'wrap'
            }}>
                {[
                    { id: 'stick', label: '🥢 捆小棒', shortLabel: '🥢 小棒' },
                    { id: 'counter', label: '🧮 计数器', shortLabel: '🧮 计数器' },
                    { id: 'compare', label: '🐊 比大小', shortLabel: '🐊 比大小' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: 'clamp(10px, 2.5vw, 14px) clamp(16px, 4vw, 28px)',
                            background: activeTab === tab.id
                                ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                                : 'rgba(255, 255, 255, 0.8)',
                            border: 'none',
                            borderRadius: '50px',
                            color: activeTab === tab.id ? 'white' : '#8D6E63',
                            fontSize: 'clamp(13px, 3.2vw, 16px)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: activeTab === tab.id
                                ? '0 6px 20px rgba(255, 152, 0, 0.4)'
                                : '0 4px 10px rgba(0,0,0,0.05)',
                            backdropFilter: 'blur(5px)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {window.innerWidth < 400 ? tab.shortLabel : tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{
                width: '100%',
                padding: '0 10px',
                boxSizing: 'border-box'
            }}>
                {activeTab === 'stick' && <StickBundling />}
                {activeTab === 'counter' && <Counter />}
                {activeTab === 'compare' && <NumberComparison />}
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
                
                button:hover:not(:disabled) {
                    transform: translateY(-2px);
                }
                button:active:not(:disabled) {
                    transform: translateY(0);
                }

                @media (min-width: 769px) {
                    .bottom-controls {
                        position: relative !important;
                        box-shadow: none !important;
                        border-top: none !important;
                        background: transparent !important;
                        padding: 24px 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default NumberSense20;
