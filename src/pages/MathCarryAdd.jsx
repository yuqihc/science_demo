import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import BottomActionBar from '../components/BottomActionBar';

// 音效工具函数
const playPopSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

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

// 步骤进度指示器组件
const StepIndicator = ({ currentStep, totalSteps }) => {
    const steps = ['开始', '找缺口', '拆小数', '凑成十', '计算', '完成'];

    return (
        <div className="carry-step-indicator" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            padding: '0 10px'
        }}>
            {steps.map((label, i) => (
                <div key={i} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <div className="carry-step-dot" style={{
                        width: currentStep === i ? '32px' : '24px',
                        height: currentStep === i ? '32px' : '24px',
                        borderRadius: '50%',
                        background: i <= currentStep
                            ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                            : '#E0E0E0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: currentStep === i ? '16px' : '12px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s',
                        boxShadow: currentStep === i ? '0 4px 12px rgba(255, 152, 0, 0.4)' : 'none'
                    }}>
                        {i + 1}
                    </div>
                    <span className="carry-step-label" style={{
                        fontSize: '10px',
                        color: i <= currentStep ? '#FF9800' : '#999',
                        fontWeight: i === currentStep ? 'bold' : 'normal',
                        whiteSpace: 'nowrap'
                    }}>{label}</span>
                </div>
            ))}
        </div>
    );
};

// 数字选择器组件
const NumberSelector = ({ label, value, min, max, onChange, color }) => {
    return (
        <div className="carry-number-selector" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'white',
            padding: '12px 20px',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            minWidth: '200px',
            justifyContent: 'space-between'
        }}>
            <span style={{
                fontWeight: 'bold',
                color: color,
                fontSize: '16px',
                minWidth: '50px'
            }}>{label}</span>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <button
                    onClick={() => value > min && onChange(value - 1)}
                    disabled={value <= min}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: value > min ? color : '#E0E0E0',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        cursor: value > min ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: value > min ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                    }}
                >−</button>
                <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                    minWidth: '30px',
                    textAlign: 'center'
                }}>{value}</span>
                <button
                    onClick={() => value < max && onChange(value + 1)}
                    disabled={value >= max}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: value < max ? color : '#E0E0E0',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        cursor: value < max ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: value < max ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                    }}
                >+</button>
            </div>
        </div>
    );
};

// 凑十法模块
const MakeTenModule = ({ iconType }) => {
    const [num1, setNum1] = useState(9);
    const [num2, setNum2] = useState(4);
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const getIcon = () => {
        switch (iconType) {
            case 'duck': return '🦆';
            case 'star': return '⭐';
            case 'apple': default: return '🍎';
        }
    };

    const gap = 10 - num1;
    const remainder = num2 - gap;

    const stepMessages = [
        `我们来学习"凑十法"！`,
        `左边有 ${num1} 个，还差 ${gap} 个凑成 10`,
        `从右边借 ${gap} 个给左边`,
        `把 ${gap} 个移过去，凑成 10！`,
        `现在左边是 10，右边剩 ${remainder}`,
        `10 + ${remainder} = ${num1 + num2} ✨`
    ];

    const nextStep = () => {
        if (step < 5) {
            if (step === 2) {
                // 触发动画
                animateMove();
            } else if (step === 5) {
                playSuccessSound();
            } else {
                playPopSound();
            }
            setStep(step + 1);
        } else {
            generateNew();
        }
    };

    const animateMove = () => {
        setIsAnimating(true);
        const tl = gsap.timeline({
            onComplete: () => {
                setIsAnimating(false);
                setStep(4); // 动画完成后自动进入下一步
                playPopSound();
            }
        });

        for (let i = 0; i < gap; i++) {
            const target = document.querySelector(`.right-item-${i}`);
            if (!target) continue;

            const destPlaceholder = document.querySelector(`.left-slot-${num1 + i}`);
            if (destPlaceholder) {
                const destRect = destPlaceholder.getBoundingClientRect();
                const startRect = target.getBoundingClientRect();

                const deltaX = destRect.left - startRect.left;
                const deltaY = destRect.top - startRect.top;

                tl.to(target, {
                    x: deltaX,
                    y: deltaY,
                    scale: 1.2,
                    duration: 0.8,
                    ease: 'power2.inOut'
                }, i * 0.1);
            }
        }
    };

    useEffect(() => {
        gsap.set('.mt-item', { clearProps: 'all' });
    }, [num1, num2, step]);

    const generateNew = () => {
        const newNum1 = 7 + Math.floor(Math.random() * 3);
        const newNum2 = 3 + Math.floor(Math.random() * 5);

        if (newNum1 + newNum2 <= 10) {
            generateNew();
            return;
        }

        setNum1(newNum1);
        setNum2(newNum2);
        setStep(0);
    };

    const reset = () => {
        setNum1(9);
        setNum2(4);
        setStep(0);
        gsap.set('.mt-item', { clearProps: 'all' });
    };

    const minNum2 = 11 - num1;
    const maxNum2 = num1;

    const renderGrid = (count, isLeft) => {
        return (
            <div className={isLeft ? 'maket-ten-left-grid' : 'maket-ten-right-grid'} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: 'clamp(4px, 1.5vw, 10px)',
                padding: 'clamp(10px, 3vw, 16px)',
                background: isLeft
                    ? 'linear-gradient(135deg, rgba(255, 235, 238, 0.8) 0%, rgba(255, 205, 210, 0.6) 100%)'
                    : 'linear-gradient(135deg, rgba(227, 242, 253, 0.8) 0%, rgba(187, 222, 251, 0.6) 100%)',
                border: `3px solid ${isLeft ? '#FFCDD2' : '#BBDEFB'}`,
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto',
                boxSizing: 'border-box'
            }}>
                {Array.from({ length: 10 }).map((_, i) => {
                    const visualCount = (step >= 4 && isLeft) ? 10 :
                        (step >= 4 && !isLeft) ? remainder :
                            count;

                    const showItem = i < visualCount;
                    const highlightGap = isLeft && step >= 1 && i >= num1;

                    return (
                        <div key={i} className={`left-slot-${i}`} style={{
                            aspectRatio: '1 / 1',
                            width: '100%',
                            border: '2px dashed rgba(0,0,0,0.15)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: highlightGap ? 'rgba(255, 235, 59, 0.4)' : 'transparent',
                            transition: 'all 0.3s',
                            position: 'relative',
                            boxSizing: 'border-box'
                        }}>
                            {showItem && (
                                <div
                                    className={`mt-item ${!isLeft ? `right-item-${i}` : ''}`}
                                    style={{
                                        fontSize: 'clamp(20px, 5vw, 36px)',
                                        opacity: (!isLeft && step === 2 && i < gap) ? 0.6 : 1,
                                        transform: (!isLeft && step === 2 && i < gap) ? 'scale(1.15)' : 'none',
                                        transition: 'all 0.3s',
                                        zIndex: 10,
                                        filter: (!isLeft && step === 2 && i < gap) ? 'drop-shadow(0 0 8px rgba(255, 152, 0, 0.6))' : 'none'
                                    }}
                                >
                                    {getIcon()}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="make-ten-module" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 0 100px 0',
            minHeight: '500px'
        }}>
            {/* 步骤进度 */}
            <StepIndicator currentStep={step} totalSteps={6} />

            {/* 提示消息 */}
            <div className="make-ten-message" style={{
                fontSize: 'clamp(16px, 4vw, 20px)',
                fontWeight: 'bold',
                color: '#E65100',
                marginBottom: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '16px 28px',
                borderRadius: '50px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                textAlign: 'center',
                maxWidth: '90%',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 152, 0, 0.2)'
            }}>
                {stepMessages[step]}
            </div>

            {/* 主要演示区 */}
            <div className="make-ten-main-stage" style={{
                display: 'flex',
                gap: 'clamp(20px, 5vw, 60px)',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                padding: '0 10px'
            }}>
                {/* 左边 */}
                <div className="make-ten-side-panel" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '1',
                    minWidth: '280px',
                    maxWidth: '320px'
                }}>
                    {renderGrid(num1, true)}
                    <div className="make-ten-number-badge" style={{
                        fontSize: 'clamp(28px, 6vw, 36px)',
                        fontWeight: 'bold',
                        color: '#D32F2F',
                        background: 'white',
                        padding: '8px 24px',
                        borderRadius: '50px',
                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                        minWidth: '80px',
                        textAlign: 'center'
                    }}>
                        {step >= 4 ? 10 : num1}
                    </div>
                </div>

                {/* 加号 */}
                <div className="make-ten-plus" style={{
                    fontSize: 'clamp(36px, 8vw, 56px)',
                    color: '#FF9800',
                    fontWeight: 'bold',
                    textShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
                }}>+</div>

                {/* 右边 */}
                <div className="make-ten-side-panel" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '1',
                    minWidth: '280px',
                    maxWidth: '320px'
                }}>
                    {renderGrid(num2, false)}
                    <div className="make-ten-number-badge" style={{
                        fontSize: 'clamp(28px, 6vw, 36px)',
                        fontWeight: 'bold',
                        color: '#1976D2',
                        background: 'white',
                        padding: '8px 24px',
                        borderRadius: '50px',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                        minWidth: '80px',
                        textAlign: 'center'
                    }}>
                        {step >= 4 ? remainder : num2}
                    </div>
                </div>
            </div>

            {/* 算式显示 */}
            {step >= 2 && (
                <div className="make-ten-formula" style={{
                    fontSize: 'clamp(20px, 5vw, 32px)',
                    fontWeight: 'bold',
                    color: '#333',
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '20px 30px',
                    borderRadius: '20px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    marginBottom: '20px',
                    fontFamily: 'Comic Sans MS, cursive',
                    textAlign: 'center',
                    maxWidth: '90%'
                }}>
                    {step >= 2 && (
                        <div style={{ marginBottom: '10px', color: '#9C27B0' }}>
                            {num2} = <span style={{ color: '#D32F2F' }}>{gap}</span> + <span style={{ color: '#1976D2' }}>{remainder}</span>
                        </div>
                    )}
                    {step >= 4 && (
                        <div style={{ color: '#4CAF50' }}>
                            10 + {remainder} = {step === 5 ? num1 + num2 : '?'}
                        </div>
                    )}
                </div>
            )}

            {/* 数字选择器 */}
            <div className="make-ten-number-selectors" style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '20px',
                padding: '0 10px',
                width: '100%',
                maxWidth: '600px'
            }}>
                <NumberSelector
                    label="左边"
                    value={num1}
                    min={6}
                    max={9}
                    onChange={(val) => {
                        setNum1(val);
                        const newMinNum2 = 11 - val;
                        if (num2 < newMinNum2) setNum2(newMinNum2);
                        if (num2 > val) setNum2(val);
                        setStep(0);
                    }}
                    color="#D32F2F"
                />
                <NumberSelector
                    label="右边"
                    value={num2}
                    min={minNum2}
                    max={maxNum2}
                    onChange={(val) => {
                        setNum2(val);
                        setStep(0);
                    }}
                    color="#1976D2"
                />
            </div>

            {/* 固定底部控制栏 */}
            <BottomActionBar
                className="make-ten-controls"
                actions={[
                    {
                        key: 'next',
                        label: step < 5 ? '下一步' : '换一题',
                        icon: step < 5 ? '→' : '🎲',
                        onClick: nextStep,
                        disabled: isAnimating,
                        variant: 'primary'
                    },
                    {
                        key: 'reset',
                        label: '重置',
                        icon: '↺',
                        onClick: reset
                    }
                ]}
            />
            {false && (
            <div style={{
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
                    onClick={nextStep}
                    disabled={isAnimating}
                    style={{
                        padding: '14px 32px',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: 'clamp(16px, 4vw, 18px)',
                        fontWeight: 'bold',
                        cursor: isAnimating ? 'not-allowed' : 'pointer',
                        color: 'white',
                        background: isAnimating
                            ? '#ccc'
                            : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                        boxShadow: isAnimating ? 'none' : '0 4px 16px rgba(245, 124, 0, 0.4)',
                        transition: 'all 0.2s',
                        minWidth: '140px',
                        flex: '1',
                        maxWidth: '200px'
                    }}
                >
                    {step < 5 ? '下一步 →' : '换一题 🎲'}
                </button>
                <button
                    onClick={reset}
                    style={{
                        padding: '14px 28px',
                        borderRadius: '50px',
                        fontSize: 'clamp(16px, 4vw, 18px)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        color: '#666',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                        border: '2px solid #E0E0E0'
                    }}
                >
                    🔄 重置
                </button>
            </div>
            )}
        </div>
    );
};

// 主页面组件
function MathCarryAdd() {
    const [iconType, setIconType] = useState('apple');

    return (
        <div className="carry-add-page" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            paddingBottom: '20px'
        }}>
            {/* Navigation */}
            <div className="carry-add-nav" style={{
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
                    color: '#1a237e',
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
            <div className="carry-add-header" style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '0 20px'
            }}>
                <h1 style={{
                    margin: '0 0 16px 0',
                    color: '#1a237e',
                    fontSize: 'clamp(24px, 6vw, 36px)',
                    fontWeight: '800',
                    letterSpacing: '-0.5px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    🔟 20以内进位加法
                </h1>
                <p className="carry-add-subtitle" style={{
                    color: '#5c6bc0',
                    margin: '0 0 20px 0',
                    fontSize: 'clamp(14px, 3.5vw, 18px)',
                    fontWeight: '600'
                }}>
                    ✨ 凑十法演示 ✨
                </p>

                {/* Icon Selector */}
                <div className="carry-add-icon-row" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <span style={{
                        color: '#5c6bc0',
                        fontWeight: '600',
                        fontSize: 'clamp(14px, 3.5vw, 16px)'
                    }}>选择图标:</span>
                    {['apple', 'duck', 'star'].map(type => (
                        <button
                            key={type}
                            onClick={() => setIconType(type)}
                            style={{
                                fontSize: 'clamp(24px, 6vw, 32px)',
                                padding: '8px 16px',
                                border: iconType === type ? '3px solid #3f51b5' : '3px solid transparent',
                                borderRadius: '16px',
                                background: iconType === type
                                    ? 'rgba(63, 81, 181, 0.15)'
                                    : 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: iconType === type
                                    ? '0 4px 16px rgba(63, 81, 181, 0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.05)',
                                minWidth: '56px',
                                minHeight: '56px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {type === 'apple' ? '🍎' : (type === 'duck' ? '🦆' : '⭐')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <MakeTenModule iconType={iconType} />

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
                }
                button:active:not(:disabled) {
                    transform: translateY(0);
                }

                @media (max-width: 900px) {
                    .carry-add-page {
                        padding-bottom: calc(92px + env(safe-area-inset-bottom)) !important;
                    }
                    .carry-add-nav {
                        padding: 12px 14px 8px !important;
                    }
                    .carry-add-header {
                        margin-bottom: 12px !important;
                        padding: 0 14px !important;
                    }
                    .carry-add-header h1 {
                        margin-bottom: 8px !important;
                        font-size: 24px !important;
                        letter-spacing: 0 !important;
                    }
                    .carry-add-subtitle {
                        margin-bottom: 10px !important;
                        font-size: 14px !important;
                    }
                    .carry-add-icon-row {
                        gap: 8px !important;
                    }
                    .carry-add-icon-row > span {
                        width: 100%;
                        font-size: 13px !important;
                    }
                    .carry-add-icon-row button {
                        min-width: 44px !important;
                        min-height: 44px !important;
                        padding: 4px 10px !important;
                        border-radius: 12px !important;
                        font-size: 24px !important;
                    }
                    .make-ten-module {
                        padding: 0 0 88px !important;
                        min-height: auto !important;
                    }
                    .carry-step-indicator {
                        gap: 5px !important;
                        margin-bottom: 10px !important;
                        padding: 0 8px !important;
                    }
                    .carry-step-dot {
                        width: 24px !important;
                        height: 24px !important;
                        font-size: 12px !important;
                    }
                    .carry-step-label {
                        font-size: 9px !important;
                    }
                    .make-ten-message {
                        max-width: calc(100% - 24px) !important;
                        margin-bottom: 12px !important;
                        padding: 10px 16px !important;
                        border-radius: 14px !important;
                        font-size: 15px !important;
                        line-height: 1.35 !important;
                    }
                    .make-ten-main-stage {
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        align-items: flex-start !important;
                        gap: 6px !important;
                        margin-bottom: 12px !important;
                        padding: 0 8px !important;
                        box-sizing: border-box !important;
                        max-width: 100vw !important;
                        overflow: hidden !important;
                    }
                    .make-ten-side-panel {
                        min-width: 0 !important;
                        max-width: none !important;
                        flex: 1 1 0 !important;
                        gap: 8px !important;
                    }
                    .maket-ten-left-grid,
                    .maket-ten-right-grid {
                        width: calc((100vw - 56px) / 2) !important;
                        max-width: 168px !important;
                        min-width: 0 !important;
                        padding: 9px !important;
                        gap: 4px !important;
                        border-radius: 14px !important;
                        border-width: 2px !important;
                    }
                    .maket-ten-left-grid > div,
                    .maket-ten-right-grid > div {
                        border-width: 1px !important;
                        min-width: 0 !important;
                        overflow: visible !important;
                    }
                    .mt-item {
                        font-size: 20px !important;
                        line-height: 1 !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        max-width: 100% !important;
                    }
                    .make-ten-plus {
                        flex: 0 0 18px !important;
                        font-size: 28px !important;
                        margin-top: 44px !important;
                    }
                    .make-ten-number-badge {
                        min-width: 54px !important;
                        padding: 6px 14px !important;
                        font-size: 24px !important;
                    }
                    .make-ten-formula {
                        margin-bottom: 12px !important;
                        padding: 12px 16px !important;
                        border-radius: 14px !important;
                        font-size: 24px !important;
                    }
                    .make-ten-number-selectors {
                        gap: 8px !important;
                        margin-bottom: 8px !important;
                        padding: 0 10px !important;
                    }
                    .carry-number-selector {
                        min-width: 0 !important;
                        flex: 1 1 calc(50% - 8px) !important;
                        padding: 10px 12px !important;
                        border-radius: 14px !important;
                        gap: 8px !important;
                    }
                    .carry-number-selector > span {
                        min-width: 32px !important;
                        font-size: 13px !important;
                    }
                    .carry-number-selector button {
                        width: 32px !important;
                        height: 32px !important;
                    }
                    .carry-number-selector div {
                        gap: 8px !important;
                    }
                }
                
                @media (min-width: 901px) {
                    .make-ten-controls {
                        position: relative !important;
                        box-shadow: none !important;
                        border-top: none !important;
                        background: transparent !important;
                        padding: 20px 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default MathCarryAdd;
