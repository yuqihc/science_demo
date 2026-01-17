import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

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
        switch(iconType) {
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
            {Array.from({length: count}).map((_, i) => {
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
                            <span className="count-badge" style={{width: `${badgeSize}px`, height: `${badgeSize}px`, fontSize: `${badgeFontSize}px`, top: '2px', right: '2px'}}>
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
        <div className="lab-stage" style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0}}>
            <div style={{width: '100%', maxWidth: '1400px', padding: '8px 12px', boxSizing: 'border-box'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'}}>
                    <div className="addition-equation-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', width: '100%', overflowX: 'auto', padding: '10px 0'}}>
                        <div style={{...frameBaseStyle, borderColor: 'rgba(255, 112, 67, 0.6)', opacity: isMerged ? 0.35 : 1}}>
                            {renderItems({ count: num1, startIndex: 0, clickable: false, showBadges: false })}
                        </div>

                        <div style={{fontSize: '56px', lineHeight: 1, color: '#4CAF50', flex: '0 0 auto', opacity: isMerged ? 0.35 : 1, textShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>+</div>

                        <div style={{...frameBaseStyle, borderColor: 'rgba(66, 165, 245, 0.6)', opacity: isMerged ? 0.35 : 1}}>
                            {renderItems({ count: num2, startIndex: num1, clickable: false, showBadges: false })}
                        </div>
                    </div>

                    {isMerged && (
                        <>
                            <div className="addition-equation-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', width: '100%', overflowX: 'auto', padding: '6px 0'}}>
                                <div style={{fontSize: '56px', lineHeight: 1, color: '#4CAF50', flex: '0 0 auto', textShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>=</div>
                                <div className="math-add-pile" style={{...pileFrameStyle, borderStyle: 'solid', borderColor: '#FFB74D', background: '#FFF8E1', boxShadow: '0 10px 25px rgba(255, 152, 0, 0.15)'}}>
                                    {renderItems({ count: num1, startIndex: 0, clickable: true, showBadges: true, cellSize: PILE_CELL, iconSize: PILE_ICON_SIZE, badgeSize: 22, badgeFontSize: 13 })}
                                    {renderItems({ count: num2, startIndex: num1, clickable: true, showBadges: true, cellSize: PILE_CELL, iconSize: PILE_ICON_SIZE, badgeSize: 22, badgeFontSize: 13 })}
                                </div>
                            </div>
                            <div style={{fontSize: '18px', color: '#558B2F', opacity: 0.85, fontWeight: 700, textAlign: 'center', background: 'rgba(255,255,255,0.6)', padding: '5px 20px', borderRadius: '20px'}}>
                                提示：点击结果框里的图标，按顺序数一数
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div style={{fontSize: '48px', fontFamily: 'Comic Sans MS', color: '#2E7D32', margin: '20px 0', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                {num1} + {num2} = {isMerged ? <span style={{color: '#E65100', fontWeight: 'bold'}}>{num1 + num2}</span> : '?'}
            </div>

            {isOverLimit && (
                <div style={{fontSize: '16px', fontWeight: 800, color: '#D84315', textAlign: 'center'}}>
                    提示：两个数相加超过 10，请调整到 10 以内再合并
                </div>
            )}

            <div className="lab-controls" style={{flexWrap: 'nowrap'}}>
                <button className="btn-main" onClick={handleMerge} disabled={isMerged || isOverLimit} style={isOverLimit ? {opacity: 0.5, cursor: 'not-allowed'} : undefined}>🤝 合并</button>
                <button className="btn-main btn-secondary" onClick={generateRandom}>🎲 换一题</button>
            </div>
            
            <div className="slider-controls" style={{marginTop: '10px', display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '20px'}}>
                <label>左边: <input type="range" min="0" max="9" value={num1} onChange={e => applyNumbers(e.target.value, num2)} style={{accentColor: '#FF7043'}} /></label>
                <label>右边: <input type="range" min="0" max="9" value={num2} onChange={e => applyNumbers(num1, e.target.value)} style={{accentColor: '#42A5F5'}} /></label>
            </div>
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
        switch(iconType) {
            case 'duck': return '🦆';
            case 'star': return '⭐';
            case 'apple': default: return '🍎';
        }
    };

    const getItemName = () => {
        switch(iconType) {
            case 'duck': return '小鸭子';
            case 'star': return '小星星';
            case 'apple': default: return '红苹果';
        }
    };

    const ghostBorder = (() => {
        switch(iconType) {
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
        switch(iconType) {
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
        <div className="lab-stage" style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0}}>
            <div style={{width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '10px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{
                    padding: '20px 30px', 
                    fontSize: '20px', 
                    fontWeight: 900, 
                    color: '#2E7D32', 
                    lineHeight: 1.6, 
                    marginBottom: '20px', 
                    height: '100px', 
                    width: '100%', 
                    maxWidth: '800px', 
                    boxSizing: 'border-box', 
                    overflow: 'hidden', 
                    whiteSpace: 'normal', 
                    overflowWrap: 'anywhere', 
                    wordBreak: 'break-word', 
                    display: '-webkit-box', 
                    WebkitBoxOrient: 'vertical', 
                    WebkitLineClamp: 3,
                    textAlign: 'center'
                }}>
                    {narration}
                </div>

                <div style={{display: 'flex', justifyContent: 'center', width: '100%', overflowX: 'auto', padding: '10px 0'}}>
                    <div className="subtraction-tray-scale-wrapper">
                        <div style={{width: `${TRAY_WIDTH}px`, height: `${TRAY_HEIGHT}px`, position: 'relative', flexShrink: 0}}>
                            <div style={{
                                width: `${TRAY_WIDTH}px`,
                                height: `${TRAY_HEIGHT}px`,
                                display: 'grid',
                                gridTemplateColumns: `repeat(${TRAY_COLS}, ${SLOT_SIZE}px)`,
                                gridTemplateRows: `repeat(${TRAY_ROWS}, ${SLOT_SIZE}px)`,
                                gap: `${SLOT_GAP}px`,
                                alignContent: 'start',
                                justifyContent: 'start'
                            }}>
                                {Array.from({length: 10}).map((_, i) => {
                                    const isActiveSlot = i < totalCount;
                                    const hasIcon = isActiveSlot && i < visibleRemaining;
                                    const showGhost = isActiveSlot && ghostIndex === i;

                                    return (
                                        <div key={i} style={{width: SLOT_SIZE, height: SLOT_SIZE, position: 'relative'}}>
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: '20px',
                                                border: isActiveSlot ? '3px solid rgba(0,0,0,0.06)' : '3px solid transparent',
                                                background: isActiveSlot ? 'rgba(0,0,0,0.03)' : 'transparent'
                                            }} />

                                            {hasIcon && (
                                                <div
                                                    id={`sub-item-${i}`}
                                                    className="sub-icon"
                                                    onClick={() => handleCountClick(i)}
                                                    style={{
                                                        width: `${SLOT_SIZE}px`,
                                                        height: `${SLOT_SIZE}px`,
                                                        borderRadius: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '56px',
                                                        userSelect: 'none',
                                                        background: 'transparent',
                                                        filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.15))',
                                                        cursor: (isAnimating || isLocked) ? 'default' : 'pointer',
                                                        position: 'relative',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                >
                                                    {getIcon()}
                                                    {counted > i && (
                                                        <span className="count-badge" style={{
                                                            width: '28px', height: '28px', fontSize: '16px', top: '-5px', right: '-5px',
                                                            background: '#FFC107', color: '#FFF', borderRadius: '50%',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                        }}>
                                                            {i + 1}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {showGhost && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        borderRadius: '20px',
                                                        border: `3px dashed ${ghostBorder}`,
                                                        background: ghostBg
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{marginTop: '25px', fontSize: '56px', fontFamily: 'Comic Sans MS', color: '#2E7D32', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    {totalCount} - {equationRemoved} = <span style={{color: '#FF5722'}}>{equationRemaining}</span>
                </div>

                <div style={{marginTop: '10px', fontSize: '20px', fontWeight: 900, color: '#558B2F'}}>
                    {equationRemaining === 0 ? '全部拿走了' : (equationRemoved === 0 ? '点击“拿走一个”开始' : `剩几个？还剩 ${equationRemaining} 个`)}
                </div>

                <div className="lab-controls" style={{justifyContent: 'flex-start', paddingLeft: 0, paddingRight: 0, marginTop: '20px', flexWrap: 'nowrap'}}>
                    <button className="btn-main" onClick={takeOne} disabled={isAnimating || isLocked || visibleRemaining <= 0} style={{background: '#FF5722', boxShadow: '0 4px 10px rgba(255, 87, 34, 0.4)'}}>
                        🍴 拿走一个
                    </button>
                    <button className="btn-main" onClick={putBackOne} disabled={isAnimating || isLocked || removedCount <= 0 || !showReturnAction} style={{background: '#4CAF50', boxShadow: '0 4px 10px rgba(76, 175, 80, 0.4)', opacity: (isAnimating || isLocked || removedCount <= 0 || !showReturnAction) ? 0.5 : 1}}>
                        ↩️ 拿回来一个
                    </button>
                    <button className="btn-main btn-secondary" onClick={resetToTen}>
                        🔄 重置
                    </button>
                </div>

                <div className="slider-controls" style={{marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center', background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '20px'}}>
                    <label>总数: {totalCount} <input type="range" min="1" max="10" value={totalCount} onChange={e => applyTotal(e.target.value)} style={{accentColor: '#4CAF50'}} /></label>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. 数的组成 (Number Bonds Redesign)
// ==========================================
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
        const mouseX = clientX - rect.left - rect.width / 2;
        const mouseY = clientY - rect.top - rect.height / 2;

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
            for(let i=0; i<p1; i++) {
                const pos = getRandomPosInCircle('PART1');
                pool[used] = { ...pool[used], container: 'PART1', targetX: pos.x, targetY: pos.y };
                used++;
            }
            // 分配 p2 个到 PART2
            for(let i=0; i<p2; i++) {
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
                    width: '600px',
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div ref={containerRef} style={{
                        position: 'relative',
                        width: '600px',
                        height: '400px',
                        marginTop: '20px'
                    }}>
                    {/* 连接线 (SVG) */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                        <line x1="300" y1="40" x2="140" y2="280" stroke="#8D6E63" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
                        <line x1="300" y1="40" x2="460" y2="280" stroke="#8D6E63" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
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
                <div className="bonds-controls" style={{
                    display: 'flex',
                    gap: '20px',
                    marginTop: '50px',
                    flexWrap: 'nowrap',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                <button className="btn-main" onClick={nextExhaustive} style={{ background: '#7E57C2', boxShadow: '0 4px 10px rgba(126, 87, 194, 0.4)' }}>
                    🔢 展示 {exhaustiveTarget} 的所有组成
                </button>
                <button className="btn-main btn-secondary" onClick={resetModule}>
                    🔄 重置
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px', background: 'white', padding: '5px 20px', borderRadius: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontWeight: 'bold', color: '#1565C0', fontSize: '16px' }}>目标:</span>
                    <input 
                        type="range" min="2" max="10" 
                        value={exhaustiveTarget} 
                        onChange={(e) => {
                            setExhaustiveTarget(Number(e.target.value));
                            setExhaustiveIndex(0);
                            setHistory([]); // 目标改变时清空历史
                        }} 
                        style={{accentColor: '#1565C0'}}
                    />
                    <span style={{ fontWeight: 'bold', color: '#1565C0', width: '25px', fontSize: '18px' }}>{exhaustiveTarget}</span>
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
                    {exhaustiveTarget} 的组成 <span style={{fontSize: '14px', opacity: 0.8, background: '#E3F2FD', padding: '2px 10px', borderRadius: '10px', marginLeft: '10px'}}>({history.length}/{exhaustiveTarget + 1})</span>
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
                            点击“展示所有组成”<br/>查看算式列表
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
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
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
    const fullBleed = { width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F1F8E9',
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
                    <h1 style={{margin: '0 0 10px 0', color: '#2E7D32', fontSize: '36px', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                        ➕ 10以内的加减法 ➖
                    </h1>
                    
                    {/* Icon Selector */}
                    <div style={{marginTop: '20px', display: 'inline-flex', background: 'rgba(255,255,255,0.6)', padding: '5px', borderRadius: '50px', backdropFilter: 'blur(5px)'}}>
                        {['apple', 'duck', 'star'].map(type => (
                            <button key={type} 
                                onClick={() => setIconType(type)}
                                style={{
                                    fontSize: '24px', 
                                    padding: '5px 15px', 
                                    margin: '0', 
                                    border: 'none',
                                    borderRadius: '40px', 
                                    background: iconType === type ? '#FFF' : 'transparent',
                                    boxShadow: iconType === type ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: iconType === type ? 1 : 0.6,
                                    transform: iconType === type ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                {type === 'apple' ? '🍎' : (type === 'duck' ? '🦆' : '⭐')}
                            </button>
                        ))}
                    </div>
                </div>

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
                    .bonds-wrapper {
                        flex-direction: column !important;
                        align-items: center !important;
                        padding: 10px !important;
                        gap: 20px !important;
                    }
                    .bonds-left-panel {
                        width: 100% !important;
                    }
                    .bonds-stage-scale-wrapper {
                        transform: scale(0.55);
                        transform-origin: top center;
                        margin-bottom: -160px !important; /* Compensate for scaling */
                    }
                    .bonds-controls {
                        flex-direction: column;
                        align-items: center;
                    }
                    /* Adjust Addition Module Layout */
                    .addition-equation-row {
                        flex-wrap: nowrap !important;
                        transform: scale(0.65);
                        transform-origin: top center;
                        width: 154% !important;
                        margin-bottom: -60px !important;
                    }
                    
                    /* Adjust Subtraction Module Tray */
                    .subtraction-tray-scale-wrapper {
                        transform: scale(0.85);
                        transform-origin: center top;
                    }
                }
            `}</style>
        </div>
    );
}

export default MathAddSubtract;
