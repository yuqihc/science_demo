import React, { useState, useEffect, useRef } from 'react';
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
        // 产生一个清脆的“波”声
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

const playTakeSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        // 产生一个音调下降的“嗖”声
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

const playReturnSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // 产生一个音调上升的“回弹”声
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

// ==========================================
// 1. 加法模块 (Addition)
// ==========================================
const AdditionModule = ({ iconType }) => {
    const [num1, setNum1] = useState(3);
    const [num2, setNum2] = useState(2);
    const [isMerged, setIsMerged] = useState(false);
    const [counted, setCounted] = useState(0);

    const clampInt = (value, min, max) => {
        const n = Number(value);
        if (!Number.isFinite(n)) return min;
        return Math.max(min, Math.min(max, Math.round(n)));
    };

    const applyNumbers = (nextNum1, nextNum2) => {
        const n1 = clampInt(nextNum1, 0, 9);
        const n2 = clampInt(nextNum2, 0, 9);
        setNum1(n1);
        setNum2(n2);
        setIsMerged(false);
        setCounted(0);
    };

    const generateRandom = () => {
        // Ensure sum <= 10
        const n1 = Math.floor(Math.random() * 10); // 0-9
        const n2Max = Math.min(9, 10 - n1); // keep within 0-9 and sum<=10
        const n2 = Math.floor(Math.random() * (n2Max + 1));
        applyNumbers(n1 === 0 && n2 === 0 ? 1 : n1, n2 === 0 ? 1 : n2);
    };

    const handleMerge = () => {
        if (num1 + num2 > 10) return;
        setIsMerged(true);
        setCounted(0);

        requestAnimationFrame(() => {
            gsap.fromTo(
                '.math-add-pile .math-item',
                { scale: 0.9, opacity: 0, y: 10 },
                { scale: 1, opacity: 1, y: 0, duration: 0.35, stagger: 0.02, ease: 'power2.out' }
            );
        });
    };

    const handleItemClick = (index) => {
        if (!isMerged) return;
        setCounted(index + 1);
        playPopSound(); // 播放音效

        // GSAP "Jump" animation for the clicked item
        gsap.fromTo(`.item-${index}`,
            { y: 0, scale: 1 },
            { y: -18, scale: 1.15, duration: 0.28, yoyo: true, repeat: 1, ease: "power1.out" }
        );
    };

    const getIcon = () => {
        switch (iconType) {
            case 'duck': return '🦆';
            case 'star': return '⭐';
            case 'apple': default: return '🍎';
        }
    };

    const CELL = 54;
    const ICON_SIZE = 40;
    const GRID_COLS = 3;
    const GRID_ROWS = 3;
    const GRID_GAP = 12;
    const FRAME_PADDING = 14;
    const FRAME_WIDTH = GRID_COLS * CELL + (GRID_COLS - 1) * GRID_GAP + FRAME_PADDING * 2;
    const FRAME_HEIGHT = GRID_ROWS * CELL + (GRID_ROWS - 1) * GRID_GAP + FRAME_PADDING * 2;

    const PILE_COLS = 5;
    const PILE_ROWS = 2;
    const PILE_CELL = 60;
    const PILE_ICON_SIZE = 38;
    const PILE_GAP = 10;
    const PILE_WIDTH = PILE_COLS * PILE_CELL + (PILE_COLS - 1) * PILE_GAP + FRAME_PADDING * 2;
    const PILE_HEIGHT = PILE_ROWS * PILE_CELL + (PILE_ROWS - 1) * PILE_GAP + FRAME_PADDING * 2;

    const frameBaseStyle = {
        width: `${FRAME_WIDTH}px`,
        height: `${FRAME_HEIGHT}px`,
        padding: `${FRAME_PADDING}px`,
        boxSizing: 'border-box',
        borderRadius: '22px',
        border: '3px dashed rgba(66, 165, 245, 0.4)',
        background: 'rgba(255,255,255,0.6)',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL}px)`,
        gridAutoRows: `${CELL}px`,
        gap: `${GRID_GAP}px`,
        placeContent: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    };

    const pileFrameStyle = {
        ...frameBaseStyle,
        width: `${PILE_WIDTH}px`,
        height: `${PILE_HEIGHT}px`,
        gridTemplateColumns: `repeat(${PILE_COLS}, ${PILE_CELL}px)`,
        gridAutoRows: `${PILE_CELL}px`,
        gap: `${PILE_GAP}px`
    };

    const renderItems = ({ count, startIndex, clickable, showBadges, cellSize = CELL, iconSize = ICON_SIZE, badgeSize = 24, badgeFontSize = 14 }) => (
        <>
            {Array.from({ length: count }).map((_, i) => {
                const idx = startIndex + i;
                return (
                    <div
                        key={idx}
                        className={`item-${idx} math-item`}
                        onClick={clickable ? () => handleItemClick(idx) : undefined}
                        style={{
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: `${iconSize}px`,
                            cursor: clickable ? 'pointer' : 'default',
                            userSelect: 'none'
                        }}
                    >
                        {getIcon()}
                        {showBadges && counted > idx && (
                            <span className="count-badge" style={{ width: `${badgeSize}px`, height: `${badgeSize}px`, fontSize: `${badgeFontSize}px`, top: '2px', right: '2px' }}>
                                {idx + 1}
                            </span>
                        )}
                    </div>
                );
            })}
        </>
    );

    const isOverLimit = num1 + num2 > 10;

    return (
        <div className="addition-module" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 10px',
            boxSizing: 'border-box'
        }}>
            {/* Main Equation Display */}
            <div className="addition-main-stage" style={{
                display: 'flex',
                gap: 'clamp(16px, 4vw, 30px)',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                padding: '0 10px'
            }}>
                {/* Left Operand */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    flex: '1',
                    minWidth: 'min(200px, 40vw)',
                    maxWidth: '220px'
                }}>
                    <div className="addition-grid-left" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'clamp(6px, 2vw, 10px)',
                        padding: 'clamp(10px, 3vw, 16px)',
                        background: 'linear-gradient(135deg, rgba(255, 235, 238, 0.8) 0%, rgba(255, 205, 210, 0.6) 100%)',
                        border: '3px solid #FFCDD2',
                        borderRadius: '20px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        width: '100%',
                        maxWidth: '180px',
                        boxSizing: 'border-box',
                        opacity: isMerged ? 0.35 : 1
                    }}>
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} style={{
                                aspectRatio: '1 / 1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'clamp(22px, 5vw, 32px)'
                            }}>
                                {i < num1 && getIcon()}
                            </div>
                        ))}
                    </div>
                    <div style={{
                        fontSize: 'clamp(24px, 5vw, 32px)',
                        fontWeight: 'bold',
                        color: '#D32F2F',
                        background: 'white',
                        padding: '6px 20px',
                        borderRadius: '50px',
                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
                    }}>{num1}</div>
                </div>

                {/* Plus Sign */}
                <div style={{
                    fontSize: 'clamp(32px, 7vw, 48px)',
                    color: '#4CAF50',
                    fontWeight: 'bold',
                    textShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                    opacity: isMerged ? 0.35 : 1
                }}>+</div>

                {/* Right Operand */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    flex: '1',
                    minWidth: 'min(200px, 40vw)',
                    maxWidth: '220px'
                }}>
                    <div className="addition-grid-right" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'clamp(6px, 2vw, 10px)',
                        padding: 'clamp(10px, 3vw, 16px)',
                        background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.8) 0%, rgba(187, 222, 251, 0.6) 100%)',
                        border: '3px solid #BBDEFB',
                        borderRadius: '20px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        width: '100%',
                        maxWidth: '180px',
                        boxSizing: 'border-box',
                        opacity: isMerged ? 0.35 : 1
                    }}>
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} style={{
                                aspectRatio: '1 / 1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'clamp(22px, 5vw, 32px)'
                            }}>
                                {i < num2 && getIcon()}
                            </div>
                        ))}
                    </div>
                    <div style={{
                        fontSize: 'clamp(24px, 5vw, 32px)',
                        fontWeight: 'bold',
                        color: '#1976D2',
                        background: 'white',
                        padding: '6px 20px',
                        borderRadius: '50px',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                    }}>{num2}</div>
                </div>
            </div>

            {/* Merged Result */}
            {isMerged && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '20px',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: 'clamp(32px, 7vw, 48px)',
                        color: '#4CAF50',
                        fontWeight: 'bold'
                    }}>=</div>
                    <div className="math-add-pile" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: 'clamp(6px, 2vw, 10px)',
                        padding: 'clamp(12px, 3vw, 20px)',
                        background: '#FFF8E1',
                        border: '3px solid #FFB74D',
                        borderRadius: '20px',
                        boxShadow: '0 10px 25px rgba(255, 152, 0, 0.15)',
                        width: '100%',
                        maxWidth: '360px',
                        boxSizing: 'border-box'
                    }}>
                        {Array.from({ length: num1 + num2 }).map((_, i) => (
                            <div
                                key={i}
                                className={`item-${i} math-item`}
                                onClick={() => handleItemClick(i)}
                                style={{
                                    aspectRatio: '1 / 1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 'clamp(24px, 6vw, 36px)',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                {getIcon()}
                                {counted > i && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        background: '#FFC107',
                                        color: '#FFF',
                                        borderRadius: '50%',
                                        width: 'clamp(18px, 4vw, 24px)',
                                        height: 'clamp(18px, 4vw, 24px)',
                                        fontSize: 'clamp(10px, 2.5vw, 14px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}>{i + 1}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div style={{
                        fontSize: 'clamp(14px, 3.5vw, 18px)',
                        color: '#558B2F',
                        fontWeight: '700',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.8)',
                        padding: '8px 20px',
                        borderRadius: '20px'
                    }}>
                        💡 点击图标按顺序数一数
                    </div>
                </div>
            )}

            {/* Equation Display */}
            <div className="addition-equation" style={{
                fontSize: 'clamp(28px, 7vw, 48px)',
                fontFamily: 'Comic Sans MS, cursive',
                color: '#2E7D32',
                margin: '20px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                {num1} + {num2} = {isMerged ? <span style={{ color: '#E65100', fontWeight: 'bold' }}>{num1 + num2}</span> : '?'}
            </div>

            {isOverLimit && (
                <div style={{
                    fontSize: 'clamp(14px, 3.5vw, 16px)',
                    fontWeight: 'bold',
                    color: '#D84315',
                    textAlign: 'center',
                    padding: '10px 20px',
                    background: 'rgba(255, 235, 238, 0.8)',
                    borderRadius: '12px',
                    marginBottom: '15px'
                }}>
                    ⚠️ 两个数相加超过 10，请调整到 10 以内再合并
                </div>
            )}

            {/* Number Selectors */}
            <div className="addition-number-selectors" style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '20px',
                padding: '0 10px',
                width: '100%',
                maxWidth: '500px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'white',
                    padding: '12px 20px',
                    borderRadius: '50px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    flex: '1',
                    minWidth: '180px',
                    justifyContent: 'space-between'
                }}>
                    <span style={{ fontWeight: 'bold', color: '#D32F2F', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>左边</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => num1 > 0 && applyNumbers(num1 - 1, num2)} disabled={num1 <= 0}
                            style={{
                                width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                                background: num1 > 0 ? '#D32F2F' : '#E0E0E0', color: 'white',
                                fontSize: '18px', fontWeight: 'bold', cursor: num1 > 0 ? 'pointer' : 'not-allowed'
                            }}>−</button>
                        <span style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>{num1}</span>
                        <button onClick={() => num1 < 9 && applyNumbers(num1 + 1, num2)} disabled={num1 >= 9}
                            style={{
                                width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                                background: num1 < 9 ? '#D32F2F' : '#E0E0E0', color: 'white',
                                fontSize: '18px', fontWeight: 'bold', cursor: num1 < 9 ? 'pointer' : 'not-allowed'
                            }}>+</button>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'white',
                    padding: '12px 20px',
                    borderRadius: '50px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    flex: '1',
                    minWidth: '180px',
                    justifyContent: 'space-between'
                }}>
                    <span style={{ fontWeight: 'bold', color: '#1976D2', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>右边</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => num2 > 0 && applyNumbers(num1, num2 - 1)} disabled={num2 <= 0}
                            style={{
                                width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                                background: num2 > 0 ? '#1976D2' : '#E0E0E0', color: 'white',
                                fontSize: '18px', fontWeight: 'bold', cursor: num2 > 0 ? 'pointer' : 'not-allowed'
                            }}>−</button>
                        <span style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>{num2}</span>
                        <button onClick={() => num2 < 9 && applyNumbers(num1, num2 + 1)} disabled={num2 >= 9}
                            style={{
                                width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                                background: num2 < 9 ? '#1976D2' : '#E0E0E0', color: 'white',
                                fontSize: '18px', fontWeight: 'bold', cursor: num2 < 9 ? 'pointer' : 'not-allowed'
                            }}>+</button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="addition-controls" style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '0 10px'
            }}>
                <button
                    onClick={handleMerge}
                    disabled={isMerged || isOverLimit}
                    style={{
                        padding: '14px 28px',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: 'clamp(16px, 4vw, 18px)',
                        fontWeight: 'bold',
                        cursor: (isMerged || isOverLimit) ? 'not-allowed' : 'pointer',
                        color: 'white',
                        background: (isMerged || isOverLimit) ? '#ccc' : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                        boxShadow: (isMerged || isOverLimit) ? 'none' : '0 4px 16px rgba(245, 124, 0, 0.4)',
                        transition: 'all 0.2s'
                    }}
                >🤝 合并</button>
                <button
                    onClick={generateRandom}
                    style={{
                        padding: '14px 28px',
                        borderRadius: '50px',
                        border: '2px solid #E0E0E0',
                        fontSize: 'clamp(16px, 4vw, 18px)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        color: '#666',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s'
                    }}
                >🎲 换一题</button>
            </div>
            <BottomActionBar
                className="math-add-mobile-actions"
                actions={[
                    {
                        key: 'merge',
                        label: '合并',
                        icon: '+',
                        onClick: handleMerge,
                        disabled: isMerged || isOverLimit,
                        variant: 'primary'
                    },
                    {
                        key: 'random',
                        label: '换一题',
                        icon: '↻',
                        onClick: generateRandom
                    }
                ]}
            />
        </div>
    );
};

// ==========================================
// 2. 减法模块 (Subtraction)
// ==========================================
const SubtractionModule = ({ iconType }) => {
    const [totalCount, setTotalCount] = useState(10);
    const [removedCount, setRemovedCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [ghostIndex, setGhostIndex] = useState(null);
    const [narration, setNarration] = useState('');
    const [showReturnAction, setShowReturnAction] = useState(false);
    const [counted, setCounted] = useState(0);
    const ghostTimerRef = useRef(null);
    const removeTimelineRef = useRef(null);
    const narrationTimerRef = useRef(null);
    const lockTimerRef = useRef(null);

    const SLOT_SIZE = 78;
    const SLOT_GAP = 14;
    const TRAY_COLS = 5;
    const TRAY_ROWS = 2;
    const TRAY_WIDTH = TRAY_COLS * SLOT_SIZE + (TRAY_COLS - 1) * SLOT_GAP;
    const TRAY_HEIGHT = TRAY_ROWS * SLOT_SIZE + (TRAY_ROWS - 1) * SLOT_GAP;

    const visibleRemaining = Math.max(0, totalCount - removedCount);
    // 只有在动画过程中，等式里的减数才需要 +1（表示正在减去中）
    // 动画结束后，removedCount 已经更新，此时 equationRemoved 直接使用 removedCount
    const equationRemoved = Math.min(totalCount, removedCount + (isAnimating ? 1 : 0));
    const equationRemaining = Math.max(0, totalCount - equationRemoved);

    const getIcon = () => {
        switch (iconType) {
            case 'duck': return '🦆';
            case 'star': return '⭐';
            case 'apple': default: return '🍎';
        }
    };

    const getItemName = () => {
        switch (iconType) {
            case 'duck': return '小鸭子';
            case 'star': return '小星星';
            case 'apple': default: return '红苹果';
        }
    };

    const ghostBorder = (() => {
        switch (iconType) {
            case 'duck':
                return 'rgba(33, 150, 243, 0.45)';
            case 'star':
                return 'rgba(255, 152, 0, 0.45)';
            case 'apple':
            default:
                return 'rgba(239, 83, 80, 0.55)';
        }
    })();

    const ghostBg = (() => {
        switch (iconType) {
            case 'duck':
                return 'rgba(33, 150, 243, 0.06)';
            case 'star':
                return 'rgba(255, 152, 0, 0.06)';
            case 'apple':
            default:
                return 'rgba(239, 83, 80, 0.06)';
        }
    })();

    const scheduleClearIconTransforms = () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                gsap.set('.sub-icon', { clearProps: 'transform,opacity' });
            });
        });
    };

    const clearNarrationTimer = () => {
        if (narrationTimerRef.current) {
            clearTimeout(narrationTimerRef.current);
            narrationTimerRef.current = null;
        }
    };

    const resetToTen = () => {
        clearNarrationTimer();
        if (ghostTimerRef.current) {
            clearTimeout(ghostTimerRef.current);
            ghostTimerRef.current = null;
        }
        if (lockTimerRef.current) {
            clearTimeout(lockTimerRef.current);
            lockTimerRef.current = null;
        }
        if (removeTimelineRef.current) {
            removeTimelineRef.current.kill();
            removeTimelineRef.current = null;
        }
        setTotalCount(10);
        setRemovedCount(0);
        setIsAnimating(false);
        setIsLocked(false);
        setGhostIndex(null);
        setShowReturnAction(false);
        setCounted(0);
        setNarration(`宝贝，快看！${iconType === 'apple' ? '树上' : '这里'}现在有 10 个${getItemName()}。这就是我们的“总数”。`);
        scheduleClearIconTransforms();
    };

    const applyTotal = (value) => {
        clearNarrationTimer();
        const nextTotal = Math.max(1, Math.min(10, Math.round(Number(value) || 1)));
        if (ghostTimerRef.current) {
            clearTimeout(ghostTimerRef.current);
            ghostTimerRef.current = null;
        }
        if (lockTimerRef.current) {
            clearTimeout(lockTimerRef.current);
            lockTimerRef.current = null;
        }
        if (removeTimelineRef.current) {
            removeTimelineRef.current.kill();
            removeTimelineRef.current = null;
        }
        setTotalCount(nextTotal);
        setRemovedCount(0);
        setIsAnimating(false);
        setIsLocked(false);
        setGhostIndex(null);
        setShowReturnAction(false);
        setCounted(0);
        setNarration(`宝贝，快看！${iconType === 'apple' ? '树上' : '这里'}现在有 ${nextTotal} 个${getItemName()}。这就是我们的“总数”。`);
        scheduleClearIconTransforms();
    };

    const takeOne = () => {
        if (isAnimating || isLocked) return;
        if (visibleRemaining <= 0) return;

        clearNarrationTimer();
        const leavingIndex = visibleRemaining - 1;
        setIsAnimating(true);
        setIsLocked(true);
        setGhostIndex(null);
        setShowReturnAction(false);
        setCounted(0);
        playTakeSound();

        const selector = `#sub-item-${leavingIndex}`;
        const tl = gsap.timeline({
            onComplete: () => {
                // 1. 动画结束，立即更新数值和状态
                setIsAnimating(false);
                setGhostIndex(leavingIndex);
                setShowReturnAction(true);

                setRemovedCount((prevCount) => {
                    const newCount = prevCount + 1;
                    const nextRemaining = totalCount - newCount;

                    // 2. 直接显示结果说明文字
                    setNarration(`我们来数数剩下的${getItemName()}：还有 ${nextRemaining} 个！所以 ${totalCount} - ${newCount} = ${nextRemaining}。`);

                    // 3. 动画结束立即解除锁定，让操作更连贯
                    setIsLocked(false);
                    if (lockTimerRef.current) {
                        clearTimeout(lockTimerRef.current);
                        lockTimerRef.current = null;
                    }

                    return newCount;
                });

                if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
                ghostTimerRef.current = setTimeout(() => {
                    setGhostIndex(null);
                    ghostTimerRef.current = null;
                }, 1500);
            }
        });

        removeTimelineRef.current = tl;

        tl.to(selector, { duration: 0.12, scale: 1.08, ease: 'power1.out' })
            .to(selector, { duration: 0.55, y: -90, opacity: 0, scale: 1.18, rotation: 18, ease: 'power2.in' }, '<');
    };

    const putBackOne = () => {
        if (isAnimating || isLocked) return;
        if (removedCount <= 0) return;

        clearNarrationTimer();
        if (ghostTimerRef.current) {
            clearTimeout(ghostTimerRef.current);
            ghostTimerRef.current = null;
        }
        if (lockTimerRef.current) {
            clearTimeout(lockTimerRef.current);
            lockTimerRef.current = null;
        }
        setGhostIndex(null);

        // 播放拿回来的音效
        playReturnSound();

        // 直接显示拿回来的结果文字
        const nextRemaining = totalCount - (removedCount - 1);
        if (nextRemaining === totalCount) {
            setNarration(`太棒了！所有的${getItemName()}都回来了，又是 ${totalCount} 个。`);
        } else {
            setNarration(`看，拿回来一个，现在有 ${nextRemaining} 个了。`);
        }

        const appearIndex = visibleRemaining;
        setRemovedCount((c) => Math.max(0, c - 1));
        setCounted(0);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                gsap.fromTo(
                    `#sub-item-${appearIndex}`,
                    { y: -60, opacity: 0, scale: 0.6 },
                    {
                        y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)',
                        onComplete: () => {
                            scheduleClearIconTransforms();
                        }
                    }
                );
            });
        });
    };

    const handleCountClick = (index) => {
        if (isAnimating || isLocked) return;
        if (index < 0 || index >= visibleRemaining) return;
        setCounted(index + 1);
        playPopSound(); // 播放音效
        gsap.fromTo(
            `#sub-item-${index}`,
            { y: 0, scale: 1 },
            { y: -18, scale: 1.15, duration: 0.28, yoyo: true, repeat: 1, ease: 'power1.out' }
        );
        if (index === 0) {
            setNarration(`我们来数数剩下的${getItemName()}：1，2，3...`);
        }
    };

    useEffect(() => {
        if (!narration) {
            setNarration(`宝贝，快看！${iconType === 'apple' ? '树上' : '这里'}现在有 ${totalCount} 个${getItemName()}。这就是我们的“总数”。`);
        }
        if (!isAnimating) scheduleClearIconTransforms();
    }, [totalCount, removedCount, isAnimating, iconType]);

    // 仅在组件卸载时清理所有计时器和动画，避免在状态更新时误杀正在运行的动画
    useEffect(() => {
        return () => {
            if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
            if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
            if (removeTimelineRef.current) removeTimelineRef.current.kill();
            if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
        };
    }, []);

    return (
        <div className="subtraction-module" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 10px',
            boxSizing: 'border-box'
        }}>
            {/* Narration */}
            <div className="subtraction-narration" style={{
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
                border: '2px solid rgba(255, 152, 0, 0.2)',
                lineHeight: 1.5
            }}>
                {narration}
            </div>

            {/* Item Tray */}
            <div className="subtraction-tray" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 'clamp(8px, 2vw, 14px)',
                padding: 'clamp(12px, 3vw, 20px)',
                background: 'linear-gradient(135deg, rgba(255, 243, 224, 0.9) 0%, rgba(255, 224, 178, 0.8) 100%)',
                border: '3px solid #FFB74D',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(255, 152, 0, 0.15)',
                width: '100%',
                maxWidth: '450px',
                boxSizing: 'border-box',
                marginBottom: '20px'
            }}>
                {Array.from({ length: 10 }).map((_, i) => {
                    const isActiveSlot = i < totalCount;
                    const hasIcon = isActiveSlot && i < visibleRemaining;
                    const showGhost = isActiveSlot && ghostIndex === i;

                    return (
                        <div
                            key={i}
                            style={{
                                aspectRatio: '1 / 1',
                                position: 'relative',
                                borderRadius: '16px',
                                border: isActiveSlot ? '2px dashed rgba(0,0,0,0.1)' : '2px solid transparent',
                                background: isActiveSlot ? 'rgba(255,255,255,0.5)' : 'transparent'
                            }}
                        >
                            {hasIcon && (
                                <div
                                    id={`sub-item-${i}`}
                                    className="sub-icon"
                                    onClick={() => handleCountClick(i)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'clamp(28px, 7vw, 48px)',
                                        cursor: (isAnimating || isLocked) ? 'default' : 'pointer',
                                        position: 'relative',
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                                        transition: 'transform 0.2s'
                                    }}
                                >
                                    {getIcon()}
                                    {counted > i && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-4px',
                                            right: '-4px',
                                            background: '#FFC107',
                                            color: '#FFF',
                                            borderRadius: '50%',
                                            width: 'clamp(18px, 4vw, 26px)',
                                            height: 'clamp(18px, 4vw, 26px)',
                                            fontSize: 'clamp(10px, 2.5vw, 14px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                        }}>{i + 1}</span>
                                    )}
                                </div>
                            )}

                            {showGhost && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '16px',
                                    border: `3px dashed ${ghostBorder}`,
                                    background: ghostBg
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Equation Display */}
            <div className="subtraction-equation" style={{
                fontSize: 'clamp(28px, 7vw, 48px)',
                fontFamily: 'Comic Sans MS, cursive',
                color: '#2E7D32',
                margin: '10px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontWeight: 'bold'
            }}>
                {totalCount} - {equationRemoved} = <span style={{ color: '#FF5722' }}>{equationRemaining}</span>
            </div>

            {/* Status Text */}
            <div className="subtraction-status" style={{
                fontSize: 'clamp(14px, 3.5vw, 18px)',
                fontWeight: 'bold',
                color: '#558B2F',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                {equationRemaining === 0 ? '🎉 全部拿走了！' : (equationRemoved === 0 ? '👆 点击"拿走一个"开始' : `还剩 ${equationRemaining} 个`)}
            </div>

            {/* Number Selector */}
            <div className="subtraction-total-selector" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'white',
                padding: '12px 20px',
                borderRadius: '50px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                marginBottom: '20px'
            }}>
                <span style={{ fontWeight: 'bold', color: '#4CAF50', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>总数</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => totalCount > 1 && applyTotal(totalCount - 1)} disabled={totalCount <= 1}
                        style={{
                            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                            background: totalCount > 1 ? '#4CAF50' : '#E0E0E0', color: 'white',
                            fontSize: '20px', fontWeight: 'bold', cursor: totalCount > 1 ? 'pointer' : 'not-allowed'
                        }}>−</button>
                    <span style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{totalCount}</span>
                    <button onClick={() => totalCount < 10 && applyTotal(totalCount + 1)} disabled={totalCount >= 10}
                        style={{
                            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                            background: totalCount < 10 ? '#4CAF50' : '#E0E0E0', color: 'white',
                            fontSize: '20px', fontWeight: 'bold', cursor: totalCount < 10 ? 'pointer' : 'not-allowed'
                        }}>+</button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="subtraction-controls" style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '0 10px'
            }}>
                <button
                    onClick={takeOne}
                    disabled={isAnimating || isLocked || visibleRemaining <= 0}
                    style={{
                        padding: '14px 24px',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                        fontWeight: 'bold',
                        cursor: (isAnimating || isLocked || visibleRemaining <= 0) ? 'not-allowed' : 'pointer',
                        color: 'white',
                        background: (isAnimating || isLocked || visibleRemaining <= 0)
                            ? '#ccc'
                            : 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
                        boxShadow: (isAnimating || isLocked || visibleRemaining <= 0)
                            ? 'none'
                            : '0 4px 16px rgba(255, 87, 34, 0.4)',
                        transition: 'all 0.2s'
                    }}
                >🍴 拿走一个</button>
                <button
                    onClick={putBackOne}
                    disabled={isAnimating || isLocked || removedCount <= 0 || !showReturnAction}
                    style={{
                        padding: '14px 24px',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                        fontWeight: 'bold',
                        cursor: (isAnimating || isLocked || removedCount <= 0 || !showReturnAction) ? 'not-allowed' : 'pointer',
                        color: 'white',
                        background: (isAnimating || isLocked || removedCount <= 0 || !showReturnAction)
                            ? '#ccc'
                            : 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                        boxShadow: (isAnimating || isLocked || removedCount <= 0 || !showReturnAction)
                            ? 'none'
                            : '0 4px 16px rgba(76, 175, 80, 0.4)',
                        transition: 'all 0.2s'
                    }}
                >↩️ 拿回来</button>
                <button
                    onClick={resetToTen}
                    style={{
                        padding: '14px 24px',
                        borderRadius: '50px',
                        border: '2px solid #E0E0E0',
                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        color: '#666',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s'
                    }}
                >🔄 重置</button>
            </div>
            <BottomActionBar
                className="math-add-mobile-actions"
                actions={[
                    {
                        key: 'take-one',
                        label: '拿走一个',
                        icon: '-',
                        onClick: takeOne,
                        disabled: isAnimating || isLocked || visibleRemaining <= 0,
                        variant: 'danger'
                    },
                    {
                        key: 'put-back',
                        label: '拿回来',
                        icon: '↩',
                        onClick: putBackOne,
                        disabled: isAnimating || isLocked || removedCount <= 0 || !showReturnAction,
                        variant: 'primary'
                    },
                    {
                        key: 'reset',
                        label: '重置',
                        icon: '↻',
                        onClick: resetToTen
                    }
                ]}
            />
        </div>
    );
};

// ==========================================
// 3. 数的组成 (Number Bonds Redesign)
// ==========================================
const BONDS_STAGE_WIDTH = 600;
const BONDS_STAGE_HEIGHT = 400;

const NumberBondsModule = () => {
    const containerRef = useRef(null);
    const [balls, setBalls] = useState([]);
    const [narration, setNarration] = useState('拖动下方的小球到圆圈里试试看！');
    const [exhaustiveTarget, setExhaustiveTarget] = useState(6);
    const [exhaustiveIndex, setExhaustiveIndex] = useState(0);
    const [history, setHistory] = useState([]); // 记录已展示的组合

    const CIRCLE_RADIUS = 75;
    const BALL_RADIUS = 14;

    // 定义圆圈位置 (相对于容器中心)
    const POSITIONS = {
        WHOLE: { x: 0, y: -160, color: '#FFD54F', label: '整体' }, // 金色
        PART1: { x: -160, y: 80, color: '#A5D6A7', label: '部分' }, // 淡绿色
        PART2: { x: 160, y: 80, color: '#A5D6A7', label: '部分' }
    };

    // 初始化 10 个小球
    useEffect(() => {
        const initialBalls = Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            x: -220 + i * 48, // 初始排列在底部
            y: 200,
            targetX: -220 + i * 48,
            targetY: 200,
            color: `hsl(${i * 36}, 70%, 60%)`,
            container: 'BOTTOM' // BOTTOM, WHOLE, PART1, PART2
        }));
        setBalls(initialBalls);
    }, []);

    // 计算每个容器中的球数
    const counts = {
        // 大圈圈只显示两个小圈圈的和，不包含自己内部的球（虽然设计上不应该有球在 WHOLE 里了，但逻辑保持纯粹）
        WHOLE: balls.filter(b => b.container === 'PART1').length + balls.filter(b => b.container === 'PART2').length,
        PART1: balls.filter(b => b.container === 'PART1').length,
        PART2: balls.filter(b => b.container === 'PART2').length
    };

    // 随机获取圆圈内的位置
    const getRandomPosInCircle = (containerType) => {
        const pos = POSITIONS[containerType];
        // 确保小球避开圆心数字区域 (中心 35px 范围)
        const minRadius = 38;
        const maxRadius = CIRCLE_RADIUS - BALL_RADIUS - 4;

        const angle = Math.random() * Math.PI * 2;
        const dist = minRadius + Math.random() * (maxRadius - minRadius);

        return {
            x: pos.x + Math.cos(angle) * dist,
            y: pos.y + Math.sin(angle) * dist
        };
    };

    // 处理拖动结束
    const handleDragEnd = (id, clientX, clientY) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const scaleX = rect.width / BONDS_STAGE_WIDTH || 1;
        const scaleY = rect.height / BONDS_STAGE_HEIGHT || 1;
        const mouseX = (clientX - rect.left) / scaleX - BONDS_STAGE_WIDTH / 2;
        const mouseY = (clientY - rect.top) / scaleY - BONDS_STAGE_HEIGHT / 2;

        let targetContainer = 'BOTTOM';

        // 碰撞检测
        for (const [key, pos] of Object.entries(POSITIONS)) {
            // 禁止拖动到大圈圈 (WHOLE)
            if (key === 'WHOLE') continue;

            const dist = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
            if (dist < CIRCLE_RADIUS) {
                targetContainer = key;
                break;
            }
        }

        updateBallPosition(id, targetContainer, mouseX, mouseY);
    };

    const updateBallPosition = (id, targetContainer, currentX, currentY) => {
        setBalls(prev => {
            const newBalls = prev.map(ball => {
                if (ball.id !== id) return ball;

                let finalPos;
                if (targetContainer === 'BOTTOM') {
                    finalPos = { x: -220 + ball.id * 48, y: 200 };
                } else {
                    finalPos = getRandomPosInCircle(targetContainer);
                }

                return {
                    ...ball,
                    container: targetContainer,
                    targetX: finalPos.x,
                    targetY: finalPos.y
                };
            });

            // 更新叙述文字
            const p1 = newBalls.filter(b => b.container === 'PART1').length;
            const p2 = newBalls.filter(b => b.container === 'PART2').length;

            if (p1 > 0 || p2 > 0) {
                setNarration(`${p1} 和 ${p2} 合起来是 ${p1 + p2}。`);
            } else {
                setNarration('拖动下方的小球到圆圈里试试看！');
            }

            return newBalls;
        });
    };

    // 穷举模式
    const nextExhaustive = () => {
        const combos = [];
        // 从 0 开始循环，包含 0 和 target 的情况
        for (let i = 0; i <= exhaustiveTarget; i++) {
            combos.push([i, exhaustiveTarget - i]);
        }

        const currentIndex = exhaustiveIndex % combos.length;
        const [p1, p2] = combos[currentIndex];

        // 更新历史记录，避免重复添加
        setHistory(prev => {
            const exists = prev.some(item => item[0] === p1 && item[1] === p2);
            if (!exists) {
                // 保持顺序添加
                return [...prev, [p1, p2]].sort((a, b) => a[0] - b[0]);
            }
            return prev;
        });

        setBalls(prev => {
            // 先将所有球重置到底部位置，但只针对需要参与穷举的球
            const pool = prev.map(ball => ({ ...ball, container: 'BOTTOM', targetX: -220 + ball.id * 48, targetY: 200 }));

            let used = 0;
            // 分配 p1 个到 PART1
            for (let i = 0; i < p1; i++) {
                const pos = getRandomPosInCircle('PART1');
                pool[used] = { ...pool[used], container: 'PART1', targetX: pos.x, targetY: pos.y };
                used++;
            }
            // 分配 p2 个到 PART2
            for (let i = 0; i < p2; i++) {
                const pos = getRandomPosInCircle('PART2');
                pool[used] = { ...pool[used], container: 'PART2', targetX: pos.x, targetY: pos.y };
                used++;
            }

            setNarration(`${exhaustiveTarget} 可以分成 ${p1} 和 ${p2}。`);
            return pool;
        });

        setExhaustiveIndex(prev => prev + 1);
    };

    // 重置功能
    const resetModule = () => {
        setBalls(prev => prev.map(ball => ({
            ...ball,
            container: 'BOTTOM',
            targetX: -220 + ball.id * 48,
            targetY: 200
        })));
        setNarration('拖动下方的小球到圆圈里试试看！');
        setExhaustiveTarget(6); // 重置目标数字为 6
        setExhaustiveIndex(0);
        setHistory([]); // 清空历史记录
    };

    return (
        <div className="lab-stage bonds-wrapper" style={{
            display: 'flex',
            flexDirection: 'row', // Default row, overridden by CSS
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: 'transparent',
            borderRadius: '30px',
            padding: '20px',
            minHeight: '650px',
            userSelect: 'none',
            gap: '40px', // 增加间距
            boxSizing: 'border-box'
        }}>
            {/* 左侧主要操作区 */}
            <div className="bonds-left-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* 顶部叙述 */}
                <div className="bonds-narration" style={{
                    background: 'rgba(255,255,255,0.8)',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#2E7D32',
                    marginBottom: '30px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                    textAlign: 'center',
                    minWidth: 'min(400px, 90%)',
                    boxSizing: 'border-box',
                    backdropFilter: 'blur(10px)'
                }}>
                    {narration}
                </div>

                {/* 分支图容器 - Scale Wrapper for Mobile */}
                <div className="bonds-stage-scale-wrapper" style={{
                    width: `${BONDS_STAGE_WIDTH}px`,
                    height: `${BONDS_STAGE_HEIGHT}px`,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div ref={containerRef} className="bonds-stage-canvas" style={{
                        position: 'relative',
                        width: `${BONDS_STAGE_WIDTH}px`,
                        height: `${BONDS_STAGE_HEIGHT}px`,
                        marginTop: '20px'
                    }}>
                        {/* 连接线 (SVG) */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                            <line
                                x1={BONDS_STAGE_WIDTH / 2 + POSITIONS.WHOLE.x}
                                y1={BONDS_STAGE_HEIGHT / 2 + POSITIONS.WHOLE.y}
                                x2={BONDS_STAGE_WIDTH / 2 + POSITIONS.PART1.x}
                                y2={BONDS_STAGE_HEIGHT / 2 + POSITIONS.PART1.y}
                                stroke="#8D6E63"
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.6"
                            />
                            <line
                                x1={BONDS_STAGE_WIDTH / 2 + POSITIONS.WHOLE.x}
                                y1={BONDS_STAGE_HEIGHT / 2 + POSITIONS.WHOLE.y}
                                x2={BONDS_STAGE_WIDTH / 2 + POSITIONS.PART2.x}
                                y2={BONDS_STAGE_HEIGHT / 2 + POSITIONS.PART2.y}
                                stroke="#8D6E63"
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.6"
                            />
                        </svg>

                        {/* 三个大圆圈 - 背景层 */}
                        {Object.entries(POSITIONS).map(([key, pos]) => (
                            <div key={key} style={{
                                position: 'absolute',
                                left: `calc(50% + ${pos.x}px)`,
                                top: `calc(50% + ${pos.y}px)`,
                                width: `${CIRCLE_RADIUS * 2}px`,
                                height: `${CIRCLE_RADIUS * 2}px`,
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                                background: pos.color,
                                border: '6px solid rgba(255,255,255,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1), inset 0 5px 15px rgba(0,0,0,0.05)',
                                zIndex: 1 // 圆圈背景在最底层
                            }}>
                            </div>
                        ))}

                        {/* 小球 - 中间层 (zIndex: 10) */}
                        {balls.map((ball) => (
                            <Ball
                                key={ball.id}
                                ball={ball}
                                onDragEnd={(x, y) => handleDragEnd(ball.id, x, y)}
                            />
                        ))}

                        {/* 数字 - 最顶层 */}
                        {Object.entries(POSITIONS).map(([key, pos]) => (
                            <div key={`num-${key}`} style={{
                                position: 'absolute',
                                left: `calc(50% + ${pos.x}px)`,
                                top: `calc(50% + ${pos.y}px)`,
                                width: `${CIRCLE_RADIUS * 2}px`,
                                height: `${CIRCLE_RADIUS * 2}px`,
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none', // 确保不阻挡小球拖拽
                                zIndex: 20 // 数字在最上层
                            }}>
                                <div style={{
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    fontFamily: 'Comic Sans MS',
                                    textShadow: '0 2px 4px rgba(255,255,255,0.8)',
                                }}>
                                    {counts[key]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 控制按钮 */}
                <div style={{
                    display: 'flex',
                    gap: 'clamp(10px, 2vw, 20px)',
                    marginTop: '30px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '0 10px'
                }}>
                    <button
                        onClick={nextExhaustive}
                        style={{
                            padding: 'clamp(10px, 2.5vw, 14px) clamp(16px, 4vw, 28px)',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: 'white',
                            background: 'linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)',
                            boxShadow: '0 4px 16px rgba(126, 87, 194, 0.4)',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >🔢 展示 {exhaustiveTarget} 的组成</button>
                    <button
                        onClick={resetModule}
                        style={{
                            padding: 'clamp(10px, 2.5vw, 14px) clamp(16px, 4vw, 28px)',
                            borderRadius: '50px',
                            border: '2px solid #E0E0E0',
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: '#666',
                            background: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s'
                        }}
                    >🔄 重置</button>
                </div>
                
                {/* Number Selector */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'white',
                    padding: '12px 20px',
                    borderRadius: '50px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    marginTop: '16px'
                }}>
                    <span style={{ fontWeight: 'bold', color: '#7E57C2', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>目标数</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => exhaustiveTarget > 2 && (setExhaustiveTarget(exhaustiveTarget - 1), setExhaustiveIndex(0), setHistory([]))} disabled={exhaustiveTarget <= 2}
                            style={{
                                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                                background: exhaustiveTarget > 2 ? '#7E57C2' : '#E0E0E0', color: 'white',
                                fontSize: '20px', fontWeight: 'bold', cursor: exhaustiveTarget > 2 ? 'pointer' : 'not-allowed'
                            }}>−</button>
                        <span style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{exhaustiveTarget}</span>
                        <button onClick={() => exhaustiveTarget < 10 && (setExhaustiveTarget(exhaustiveTarget + 1), setExhaustiveIndex(0), setHistory([]))} disabled={exhaustiveTarget >= 10}
                            style={{
                                width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                                background: exhaustiveTarget < 10 ? '#7E57C2' : '#E0E0E0', color: 'white',
                                fontSize: '20px', fontWeight: 'bold', cursor: exhaustiveTarget < 10 ? 'pointer' : 'not-allowed'
                            }}>+</button>
                    </div>
                </div>
            </div>

            {/* 右侧历史记录列表 */}
            <div style={{
                width: '380px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '24px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                minHeight: '500px', // 改为最小高度
                height: 'fit-content', // 高度自适应内容
                marginTop: '0',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{
                    fontWeight: 'bold',
                    color: '#1565C0',
                    textAlign: 'center',
                    marginBottom: '10px',
                    fontSize: '20px',
                    borderBottom: '2px solid rgba(21, 101, 192, 0.1)',
                    paddingBottom: '15px'
                }}>
                    {exhaustiveTarget} 的组成 <span style={{ fontSize: '14px', opacity: 0.8, background: '#E3F2FD', padding: '2px 10px', borderRadius: '10px', marginLeft: '10px' }}>({history.length}/{exhaustiveTarget + 1})</span>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(6, auto)',
                    gridAutoFlow: 'column',
                    gap: '12px',
                    paddingRight: '5px'
                }}>
                    {history.length === 0 && (
                        <div style={{ fontSize: '16px', color: '#999', textAlign: 'center', marginTop: '40px', lineHeight: '1.6' }}>
                            点击“展示所有组成”<br />查看算式列表
                        </div>
                    )}
                    {history.map((combo, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#FFF',
                            padding: '12px 20px',
                            borderRadius: '16px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#555',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                            transition: 'transform 0.2s'
                        }}>
                            <span style={{ color: '#4CAF50', minWidth: '25px', textAlign: 'center' }}>{combo[0]}</span>
                            <span style={{ color: '#CFD8DC' }}>+</span>
                            <span style={{ color: '#4CAF50', minWidth: '25px', textAlign: 'center' }}>{combo[1]}</span>
                            <span style={{ color: '#CFD8DC' }}>=</span>
                            <span style={{ color: '#FF9800', minWidth: '25px', textAlign: 'center' }}>{exhaustiveTarget}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 小球组件 (处理拖拽和动画)
const Ball = ({ ball, onDragEnd }) => {
    const ballRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // 使用 GSAP 处理位置动画
    useEffect(() => {
        if (!isDragging) {
            gsap.to(ballRef.current, {
                x: ball.targetX,
                y: ball.targetY,
                duration: 0.6,
                ease: 'elastic.out(1, 0.6)'
            });
        }
    }, [ball.targetX, ball.targetY, isDragging]);

    const handlePointerDown = (e) => {
        setIsDragging(true);
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const rect = e.target.parentElement.getBoundingClientRect();
        const scaleX = rect.width / BONDS_STAGE_WIDTH || 1;
        const scaleY = rect.height / BONDS_STAGE_HEIGHT || 1;
        const x = (e.clientX - rect.left) / scaleX - BONDS_STAGE_WIDTH / 2;
        const y = (e.clientY - rect.top) / scaleY - BONDS_STAGE_HEIGHT / 2;
        gsap.set(ballRef.current, { x, y });
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
        onDragEnd(e.clientX, e.clientY);
    };

    return (
        <div
            ref={ballRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '28px',
                height: '28px',
                marginLeft: '-14px',
                marginTop: '-14px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${ball.color}, #000)`,
                boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.3)',
                cursor: 'grab',
                zIndex: isDragging ? 100 : 10,
                touchAction: 'none',
                transform: isDragging ? 'scale(1.2)' : 'scale(1)',
                transition: 'box-shadow 0.2s, transform 0.2s'
            }}
        />
    );
};

// ==========================================
// Main Component
// ==========================================
function MathAddSubtract() {
    const [activeTab, setActiveTab] = useState('add');
    const [iconType, setIconType] = useState('apple');

    return (
        <div className="math-add-subtract-page" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #DCEDC8 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            paddingBottom: '20px'
        }}>
            {/* Navigation */}
            <div className="math-add-nav" style={{
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
                    color: '#2E7D32',
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
            <div className="math-add-page-header" style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '0 20px'
            }}>
                <h1 style={{
                    margin: '0 0 16px 0',
                    color: '#2E7D32',
                    fontSize: 'clamp(24px, 6vw, 36px)',
                    fontWeight: '800',
                    letterSpacing: '-0.5px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    ➕ 10以内的加减法 ➖
                </h1>

                {/* Icon Selector */}
                <div className="math-add-icon-row" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <span style={{
                        color: '#558B2F',
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
                                border: iconType === type ? '3px solid #4CAF50' : '3px solid transparent',
                                borderRadius: '16px',
                                background: iconType === type
                                    ? 'rgba(76, 175, 80, 0.15)'
                                    : 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: iconType === type
                                    ? '0 4px 16px rgba(76, 175, 80, 0.3)'
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

            {/* Main Content Area */}
            <div className="math-add-content-wrap" style={{ width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
                {/* Tabs */}
                <div className="lab-tabs">
                    <button className={`lab-tab ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>➕ 加法 (合起来)</button>
                    <button className={`lab-tab ${activeTab === 'subtract' ? 'active' : ''}`} onClick={() => setActiveTab('subtract')}>➖ 减法 (去掉)</button>
                    <button className={`lab-tab ${activeTab === 'bonds' ? 'active' : ''}`} onClick={() => setActiveTab('bonds')}>🌳 数的组成</button>
                </div>

                {/* Content Area */}
                <div className="lab-content">
                    {activeTab === 'add' && <AdditionModule iconType={iconType} />}
                    {activeTab === 'subtract' && <SubtractionModule iconType={iconType} />}
                    {activeTab === 'bonds' && <NumberBondsModule />}
                </div>
            </div>

            <style>{`
                body {
                    margin: 0;
                    padding: 0 !important;
                    display: block !important;
                    background-color: #F1F8E9 !important;
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
                    color: #558B2F;
                    font-size: 18px;
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
                    background: #4CAF50;
                    color: white;
                    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
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
                    min-height: 560px;
                    display: flex;
                }
                .lab-controls {
                    padding: 14px;
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .btn-main {
                    padding: 12px 35px;
                    border-radius: 50px;
                    border: none;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    color: white;
                    background: #FF9800;
                    box-shadow: 0 10px 20px rgba(255, 152, 0, 0.3);
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    margin: 5px;
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
                
                .count-badge {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: #FFEB3B;
                    color: #E65100;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    border: 2px solid #FFF;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .math-item {
                    position: relative;
                    width: 60px; 
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .slider-controls label {
                    font-weight: bold;
                    color: #558B2F;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .math-add-mobile-actions,
                .math-add-mobile-actions-spacer {
                    display: none;
                }

                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .math-add-subtract-page {
                        padding-bottom: calc(92px + env(safe-area-inset-bottom)) !important;
                    }
                    .math-add-nav {
                        padding: 12px 14px 8px !important;
                    }
                    .math-add-page-header {
                        margin-bottom: 12px !important;
                        padding: 0 14px !important;
                    }
                    .math-add-page-header h1 {
                        margin-bottom: 10px !important;
                        font-size: 24px !important;
                        letter-spacing: 0 !important;
                    }
                    .math-add-icon-row {
                        gap: 8px !important;
                    }
                    .math-add-icon-row > span {
                        width: 100%;
                        font-size: 13px !important;
                    }
                    .math-add-icon-row button {
                        min-width: 44px !important;
                        min-height: 44px !important;
                        padding: 4px 10px !important;
                        border-radius: 12px !important;
                        font-size: 24px !important;
                    }
                    .math-add-content-wrap {
                        padding: 0 10px !important;
                    }
                    .lab-tabs {
                        position: sticky;
                        top: 0;
                        z-index: 20;
                        flex-direction: row;
                        justify-content: flex-start;
                        gap: 8px;
                        margin: 0 -10px 10px;
                        padding: 8px 10px;
                        overflow-x: auto;
                        background: rgba(232, 245, 233, 0.92);
                        backdrop-filter: blur(10px);
                        scrollbar-width: none;
                    }
                    .lab-tabs::-webkit-scrollbar {
                        display: none;
                    }
                    .lab-tab {
                        text-align: center;
                        flex: 0 0 auto;
                        padding: 9px 14px;
                        font-size: 14px;
                        border-radius: 12px;
                        white-space: nowrap;
                    }
                    .lab-content {
                        min-height: auto;
                        padding: 8px 0 0;
                    }
                    .addition-module,
                    .subtraction-module {
                        padding: 0 !important;
                    }
                    .addition-main-stage {
                        flex-wrap: nowrap !important;
                        gap: 8px !important;
                        margin-bottom: 8px !important;
                        padding: 0 !important;
                    }
                    .addition-main-stage > div {
                        min-width: 0 !important;
                        gap: 6px !important;
                    }
                    .addition-grid-left,
                    .addition-grid-right {
                        max-width: 132px !important;
                        padding: 8px !important;
                        gap: 5px !important;
                        border-radius: 14px !important;
                    }
                    .addition-grid-left > div,
                    .addition-grid-right > div {
                        font-size: 23px !important;
                    }
                    .math-add-pile {
                        max-width: 320px !important;
                        padding: 14px !important;
                        gap: 8px !important;
                        border-radius: 14px !important;
                    }
                    .math-add-pile .math-item {
                        width: 44px !important;
                        height: 44px !important;
                        justify-self: center;
                        align-self: center;
                        font-size: 27px !important;
                    }
                    .addition-equation {
                        margin: 8px 0 !important;
                        font-size: 31px !important;
                    }
                    .addition-number-selectors {
                        gap: 8px !important;
                        margin-bottom: 8px !important;
                        padding: 0 !important;
                    }
                    .addition-number-selectors > div {
                        min-width: 0 !important;
                        flex: 1 1 calc(50% - 8px) !important;
                        padding: 10px 12px !important;
                        border-radius: 14px !important;
                    }
                    .addition-controls,
                    .subtraction-controls {
                        display: none !important;
                    }
                    .subtraction-narration {
                        max-width: 100% !important;
                        padding: 10px 14px !important;
                        margin-bottom: 10px !important;
                        border-radius: 14px !important;
                        font-size: 15px !important;
                        line-height: 1.35 !important;
                    }
                    .subtraction-tray {
                        max-width: 330px !important;
                        gap: 6px !important;
                        padding: 10px !important;
                        margin-bottom: 8px !important;
                        border-radius: 14px !important;
                    }
                    .subtraction-tray .sub-icon {
                        font-size: 30px !important;
                    }
                    .subtraction-equation {
                        margin: 4px 0 !important;
                        font-size: 34px !important;
                    }
                    .subtraction-status {
                        margin-bottom: 10px !important;
                        font-size: 14px !important;
                    }
                    .subtraction-total-selector {
                        padding: 10px 14px !important;
                        margin-bottom: 10px !important;
                        border-radius: 14px !important;
                    }
                    .math-add-mobile-actions,
                    .math-add-mobile-actions-spacer {
                        display: block;
                    }
                    
                    /* Bonds Module - uses scale due to absolute positioning */
                    .bonds-wrapper {
                        flex-direction: column !important;
                        align-items: center !important;
                        padding: 10px !important;
                        gap: 15px !important;
                        min-height: auto !important;
                    }
                    .bonds-left-panel {
                        width: 100% !important;
                    }
                    .bonds-stage-scale-wrapper {
                        transform: scale(0.58);
                        transform-origin: top center;
                        margin-bottom: -150px !important;
                        width: 600px !important;
                        height: 420px !important;
                        flex: 0 0 600px !important;
                        overflow: visible !important;
                    }
                    .bonds-narration {
                        font-size: 16px !important;
                        padding: 10px 20px !important;
                        margin-bottom: 15px !important;
                    }
                }
                
                /* Extra small devices */
                @media (max-width: 480px) {
                    .lab-tab {
                        font-size: 14px;
                        padding: 12px 16px;
                    }
                    .bonds-stage-scale-wrapper {
                        transform: scale(0.5);
                        margin-bottom: -170px !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default MathAddSubtract;
