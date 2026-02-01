import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

// Sound effects utilities
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

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

const playSuccessSound = () => {
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

// Generate valid breaking-ten subtraction problems
const generateProblem = () => {
    const minuend = Math.floor(Math.random() * 9) + 11; // 11-19
    const ones = minuend % 10;
    const subtrahend = Math.floor(Math.random() * (9 - ones)) + ones + 1; // Ensure ones digit < subtrahend
    return { minuend, subtrahend };
};

function SubtractBreakTen() {
    const [problem, setProblem] = useState({ minuend: 13, subtrahend: 9 });
    const [currentStep, setCurrentStep] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    const { minuend, subtrahend } = problem;
    const ones = minuend % 10;
    const tens = Math.floor(minuend / 10);

    // Breaking ten calculation
    const step3Result = 10 - subtrahend; // 10 - subtrahend
    const finalResult = step3Result + ones; // result + remaining ones

    const stepRefs = useRef([]);

    // Auto-play logic
    useEffect(() => {
        if (isAutoPlay && currentStep < 4) {
            const timer = setTimeout(() => {
                nextStep();
            }, 2500);
            return () => clearTimeout(timer);
        } else if (isAutoPlay && currentStep === 4) {
            setIsAutoPlay(false);
        }
    }, [isAutoPlay, currentStep]);

    // Animate step transitions
    useEffect(() => {
        if (stepRefs.current[currentStep]) {
            gsap.fromTo(
                stepRefs.current[currentStep],
                { scale: 0.95, opacity: 0.8 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
        }

        if (currentStep > 0) {
            playStepSound();
        }

        if (currentStep === 4) {
            playSuccessSound();
        }
    }, [currentStep]);

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const reset = () => {
        setCurrentStep(0);
        setIsAutoPlay(false);
    };

    const newProblem = () => {
        setProblem(generateProblem());
        setCurrentStep(0);
        setIsAutoPlay(false);
    };

    const toggleAutoPlay = () => {
        if (currentStep === 4) {
            setCurrentStep(0);
        }
        setIsAutoPlay(!isAutoPlay);
    };

    const steps = [
        {
            title: "题目",
            description: `计算 ${minuend} - ${subtrahend} = ?`,
            color: "#2196F3"
        },
        {
            title: "步骤1：观察",
            description: `个位的 ${ones} 不够减 ${subtrahend}`,
            color: "#FF9800"
        },
        {
            title: "步骤2：拆分",
            description: `把 ${minuend} 分成 10 和 ${ones}`,
            color: "#9C27B0"
        },
        {
            title: "步骤3：计算减法",
            description: `先用 10 减去 ${subtrahend}，得到 ${step3Result}`,
            color: "#E91E63"
        },
        {
            title: "步骤4：合并余数",
            description: `把算出的 ${step3Result} 和剩下的 ${ones} 加起来，得到 ${finalResult}`,
            color: "#4CAF50"
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            paddingBottom: '40px'
        }}>
            {/* Navigation */}
            <div style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
                <Link to="/math" style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255,255,255,0.3)'
                }}>
                    <span style={{ fontSize: '18px' }}>←</span> 返回数学乐园
                </Link>
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px' }}>
                <h1 style={{
                    margin: '0 0 10px 0',
                    color: 'white',
                    fontSize: 'clamp(28px, 6vw, 42px)',
                    fontWeight: '800',
                    textShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    letterSpacing: '-0.5px'
                }}>➖ 20以内的退位减法</h1>
                <p style={{
                    color: 'rgba(255,255,255,0.95)',
                    margin: 0,
                    fontWeight: '600',
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>✨ 破十法演示 ✨</p>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 20px',
                boxSizing: 'border-box'
            }}>
                {/* Problem Display */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: 'clamp(20px, 4vw, 40px)',
                    marginBottom: '30px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.5)'
                }}>
                    <div style={{
                        fontSize: 'clamp(36px, 8vw, 56px)',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#2d3748',
                        fontFamily: 'Comic Sans MS, cursive',
                        marginBottom: '20px'
                    }}>
                        {minuend} - {subtrahend} =
                        <span style={{
                            color: currentStep === 4 ? '#4CAF50' : '#999',
                            marginLeft: '15px',
                            transition: 'all 0.3s'
                        }}>
                            {currentStep === 4 ? finalResult : '?'}
                        </span>
                    </div>

                    {/* Visual Number Blocks */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        gap: '20px',
                        marginTop: '30px',
                        flexWrap: 'wrap',
                        minHeight: '140px'
                    }}>
                        {/* Tens Block */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: currentStep >= 2 ? 1 : 0.3,
                            transition: 'all 0.5s',
                            transform: currentStep >= 2 ? 'scale(1)' : 'scale(0.9)'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: currentStep === 3 ? 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)' : 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '42px',
                                fontWeight: 'bold',
                                color: 'white',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                transition: 'all 0.5s',
                                border: '3px solid rgba(255,255,255,0.5)'
                            }}>10</div>
                            <div style={{
                                marginTop: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#666'
                            }}>十位</div>
                        </div>

                        {/* Ones Block */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: currentStep >= 2 ? 1 : 0.3,
                            transition: 'all 0.5s',
                            transform: currentStep >= 2 ? 'scale(1)' : 'scale(0.9)'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: currentStep === 4 ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' : 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '42px',
                                fontWeight: 'bold',
                                color: 'white',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                transition: 'all 0.5s',
                                border: '3px solid rgba(255,255,255,0.5)'
                            }}>{ones}</div>
                            <div style={{
                                marginTop: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#666'
                            }}>个位</div>
                        </div>
                    </div>
                </div>

                {/* Step Display */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: 'clamp(20px, 4vw, 30px)',
                    marginBottom: '30px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    minHeight: '180px'
                }}>
                    <div ref={el => stepRefs.current[currentStep] = el}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: steps[currentStep].color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                boxShadow: `0 4px 15px ${steps[currentStep].color}40`,
                                flexShrink: 0
                            }}>
                                {currentStep === 0 ? '?' : currentStep}
                            </div>
                            <h2 style={{
                                margin: 0,
                                color: steps[currentStep].color,
                                fontSize: 'clamp(20px, 5vw, 28px)',
                                fontWeight: '700'
                            }}>{steps[currentStep].title}</h2>
                        </div>

                        <p style={{
                            fontSize: 'clamp(16px, 4vw, 20px)',
                            color: '#4a5568',
                            lineHeight: '1.6',
                            margin: '0 0 20px 0',
                            fontWeight: '500'
                        }}>{steps[currentStep].description}</p>

                        {/* Visual Formula for Each Step */}
                        {currentStep === 2 && (
                            <div style={{
                                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                                padding: '20px',
                                borderRadius: '16px',
                                fontSize: 'clamp(18px, 4vw, 24px)',
                                fontWeight: 'bold',
                                color: '#7b1fa2',
                                textAlign: 'center',
                                fontFamily: 'Comic Sans MS, cursive'
                            }}>
                                {minuend} = 10 + {ones}
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div style={{
                                background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
                                padding: '20px',
                                borderRadius: '16px',
                                fontSize: 'clamp(18px, 4vw, 24px)',
                                fontWeight: 'bold',
                                color: '#c2185b',
                                textAlign: 'center',
                                fontFamily: 'Comic Sans MS, cursive'
                            }}>
                                10 - {subtrahend} = {step3Result}
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div style={{
                                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                                padding: '20px',
                                borderRadius: '16px',
                                fontSize: 'clamp(18px, 4vw, 24px)',
                                fontWeight: 'bold',
                                color: '#2e7d32',
                                textAlign: 'center',
                                fontFamily: 'Comic Sans MS, cursive'
                            }}>
                                {step3Result} + {ones} = {finalResult} ✨
                            </div>
                        )}
                    </div>

                    {/* Progress Dots */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginTop: '25px'
                    }}>
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} style={{
                                width: i === currentStep ? '30px' : '12px',
                                height: '12px',
                                borderRadius: '6px',
                                background: i <= currentStep ? steps[i].color : '#ddd',
                                transition: 'all 0.3s',
                                boxShadow: i === currentStep ? `0 2px 8px ${steps[i].color}60` : 'none'
                            }} />
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: '20px'
                }}>
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        style={{
                            padding: '14px 28px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                            background: currentStep === 0 ? '#ccc' : 'rgba(255,255,255,0.95)',
                            color: currentStep === 0 ? '#999' : '#667eea',
                            boxShadow: currentStep === 0 ? 'none' : '0 4px 15px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s',
                            minWidth: '120px'
                        }}
                    >← 上一步</button>

                    <button
                        onClick={nextStep}
                        disabled={currentStep === 4}
                        style={{
                            padding: '14px 28px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: currentStep === 4 ? 'not-allowed' : 'pointer',
                            background: currentStep === 4 ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            boxShadow: currentStep === 4 ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                            transition: 'all 0.2s',
                            minWidth: '120px'
                        }}
                    >下一步 →</button>

                    <button
                        onClick={toggleAutoPlay}
                        style={{
                            padding: '14px 28px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            background: isAutoPlay ? 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)' : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s',
                            minWidth: '120px'
                        }}
                    >{isAutoPlay ? '⏸ 暂停' : '▶ 自动播放'}</button>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={reset}
                        style={{
                            padding: '14px 28px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.95)',
                            color: '#666',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s',
                            minWidth: '120px'
                        }}
                    >🔄 重新开始</button>

                    <button
                        onClick={newProblem}
                        style={{
                            padding: '14px 28px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
                            transition: 'all 0.2s',
                            minWidth: '120px'
                        }}
                    >🎲 换一题</button>
                </div>
            </div>

            {/* Global Styles */}
            <style>{`
                body {
                    margin: 0;
                    padding: 0 !important;
                    display: block !important;
                }
                #root {
                    width: 100%;
                }
                button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2) !important;
                }
                button:active:not(:disabled) {
                    transform: translateY(0);
                }
                
                @media (max-width: 640px) {
                    button {
                        min-width: 100px !important;
                        padding: 12px 20px !important;
                        font-size: 14px !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default SubtractBreakTen;
