import React, { useState, useEffect } from 'react';
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

// ==========================================
// 凑十法模块 (Make Ten Method)
// ==========================================
const MakeTenModule = ({ iconType }) => {
    const [num1, setNum1] = useState(9); // 大数
    const [num2, setNum2] = useState(4); // 小数
    const [step, setStep] = useState(0); // 0:初始, 1:找缺口, 2:拆小数, 3:移动凑十, 4:完成
    const [narration, setNarration] = useState('我们来学习“凑十法”！先看左边有几个？');
    const [cellSize, setCellSize] = useState(window.innerWidth < 500 ? 45 : 60);

    useEffect(() => {
        const handleResize = () => {
            setCellSize(window.innerWidth < 500 ? 45 : 60);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const getIcon = () => {
        switch(iconType) {
            case 'duck': return '🦆';
            case 'star': return '⭐';
            case 'apple': default: return '🍎';
        }
    };

    const nextStep = () => {
        const gap = 10 - num1;
        
        if (step === 0) {
            setStep(1);
            setNarration(`左边有 ${num1} 个，还需要 ${gap} 个就能凑成 10！`);
        } else if (step === 1) {
            setStep(2);
            setNarration(`我们从右边借 ${gap} 个给左边。`);
        } else if (step === 2) {
            setStep(3);
            setNarration(`把 ${gap} 个移过去，凑成 10！`);
        } else if (step === 3) {
            // 动画在 useEffect 中处理
        } else if (step === 4) {
            setStep(5);
            setNarration(`10 加 ${num2 - gap} 等于 ${num1 + num2}！`);
            playPopSound();
        } else if (step === 5) {
            generateNew();
        }
    };
    
    // 动画副作用
    useEffect(() => {
        if (step === 3) {
            const gap = 10 - num1;
            const tl = gsap.timeline({
                onComplete: () => {
                    setStep(4);
                    setNarration(`现在左边是 10，右边剩 ${num2 - gap}。10 加 ${num2 - gap} 等于多少？`);
                    playPopSound();
                }
            });

            // 获取左边容器和右边容器的 DOM
            const leftGrid = document.querySelector('.maket-ten-left-grid');
            const rightGrid = document.querySelector('.maket-ten-right-grid');
            
            if (!leftGrid || !rightGrid) return;
            
            for(let i=0; i<gap; i++) {
                // 右边第 i 个 (要移动的)
                const target = document.querySelector(`.right-item-${i}`);
                if (!target) continue;
                
                // 目标：左边第 num1 + i 个位置
                // 左边网格位置
                const targetIndex = num1 + i;
                
                // 计算相对位移
                // 这种计算依赖于 DOM 结构完全一致
                const destPlaceholder = document.querySelector(`.left-slot-${targetIndex}`);
                if (destPlaceholder) {
                    const destRect = destPlaceholder.getBoundingClientRect();
                    const startRect = target.getBoundingClientRect();
                    
                    const deltaX = destRect.left - startRect.left;
                    const deltaY = destRect.top - startRect.top;
                    
                    tl.to(target, {
                        x: deltaX,
                        y: deltaY,
                        scale: 1.1,
                        duration: 0.8,
                        ease: 'power2.inOut'
                    }, i * 0.1);
                }
            }
        } else {
            // Reset transforms when not in step 3
             gsap.set('.mt-item', { clearProps: 'all' });
        }
    }, [step, num1, num2]);

    const generateNew = () => {
        const n1 = 8 + Math.floor(Math.random() * 2); // 8 or 9
        const newNum1 = 7 + Math.floor(Math.random() * 3); // 7, 8, 9
        const newNum2 = 3 + Math.floor(Math.random() * 5); // 3 to 7
        
        if (newNum1 + newNum2 <= 10) {
            generateNew();
            return;
        }
        
        setNum1(newNum1);
        setNum2(newNum2);
        setStep(0);
        setNarration(`我们来学习“凑十法”！先看左边有几个？`);
    };

    const resetToDefault = () => {
        setNum1(9);
        setNum2(4);
        setStep(0);
        setNarration('我们来学习“凑十法”！先看左边有几个？');
        // Clear any leftover animation styles
        gsap.set('.mt-item', { clearProps: 'all' });
    };

    const replay = () => {
        setStep(0);
        setNarration(`我们来学习“凑十法”！先看左边有几个？`);
        gsap.set('.mt-item', { clearProps: 'all' });
    };

    const handleNum1Change = (e) => {
        const val = Number(e.target.value);
        setNum1(val);
        // Ensure sum > 10 (num2 min)
        const minNum2 = 11 - val;
        // Ensure num2 <= num1 (num2 max is num1)
        
        let newNum2 = num2;
        if (newNum2 < minNum2) {
            newNum2 = minNum2;
        }
        if (newNum2 > val) {
            newNum2 = val;
        }
        setNum2(newNum2);
        
        setStep(0);
        setNarration(`我们来学习“凑十法”！先看左边有几个？`);
    };

    const handleNum2Change = (e) => {
        const val = Number(e.target.value);
        setNum2(val);
        setStep(0);
        setNarration(`我们来学习“凑十法”！先看左边有几个？`);
    };
    
    // Dynamic min for num2 based on num1 to ensure sum > 10
    const minNum2 = 11 - num1;
    // Dynamic max for num2 (cannot be larger than num1)
    const maxNum2 = num1;

    const renderGrid = (count, isLeft) => {
        return (
            <div className={isLeft ? 'maket-ten-left-grid' : 'maket-ten-right-grid'} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '8px',
                padding: '10px',
                background: isLeft ? 'rgba(255, 235, 238, 0.5)' : 'rgba(227, 242, 253, 0.5)',
                border: `3px solid ${isLeft ? '#FFCDD2' : '#BBDEFB'}`,
                borderRadius: '16px',
                backdropFilter: 'blur(5px)'
            }}>
                {Array.from({length: 10}).map((_, i) => {
                    const hasItem = i < count;
                    
                    const visualCount = (step >= 4 && isLeft) ? 10 : 
                                      (step >= 4 && !isLeft) ? (count - (10 - num1)) : 
                                      count;
                                      
                    const showItem = i < visualCount;
                    
                    // 幽灵位：左边缺少的位
                    const isGap = isLeft && i >= num1;
                    const highlightGap = isLeft && step >= 1 && i >= num1;

                    return (
                        <div key={i} className={`left-slot-${i}`} style={{
                            width: `${cellSize}px`, height: `${cellSize}px`,
                            border: '2px dashed rgba(0,0,0,0.1)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: highlightGap ? 'rgba(255, 235, 59, 0.3)' : 'transparent',
                            transition: 'background 0.3s'
                        }}>
                            {showItem && (
                                <div 
                                    className={`mt-item ${!isLeft ? `right-item-${i}` : ''}`}
                                    style={{
                                        fontSize: `${cellSize * 0.66}px`,
                                        // 右边 item 在 step 2 需要高亮 (将要移动的)
                                        // 要移动的是前 (10-num1) 个
                                        opacity: (!isLeft && step === 2 && i < (10-num1)) ? 0.6 : 1,
                                        transform: (!isLeft && step === 2 && i < (10-num1)) ? 'scale(1.1)' : 'none',
                                        transition: 'all 0.3s',
                                        zIndex: 10
                                    }}
                                >
                                    {isLeft ? (step >= 4 && i >= num1 ? getIcon() : getIcon()) : getIcon()} 
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const gap = 10 - num1;
    const remainder = num2 - gap;

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',
            padding: '20px', 
            minHeight: '500px'
        }}>
            {/* 顶部提示 */}
            <div style={{
                fontSize: '22px', fontWeight: 'bold', color: '#E65100', 
                marginBottom: '30px', background: '#FFF', padding: '10px 30px', 
                borderRadius: '50px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
                {narration}
            </div>

            {/* 主要演示区 */}
            <div className="make-ten-main-stage" style={{display: 'flex', gap: '60px', alignItems: 'center', marginBottom: '40px'}}>
                {/* 左边 */}
                <div className="make-ten-grid-wrapper" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                    {renderGrid(num1, true)}
                    <div style={{fontSize: '32px', fontWeight: 'bold', color: '#D32F2F'}}>{step >= 4 ? 10 : num1}</div>
                </div>

                {/* 加号 */}
                <div className="make-ten-plus" style={{fontSize: '48px', color: '#8D6E63', fontWeight: 'bold'}}>+</div>

                {/* 右边 */}
                <div className="make-ten-grid-wrapper" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                    {renderGrid(num2, false)}
                    <div style={{fontSize: '32px', fontWeight: 'bold', color: '#1976D2'}}>
                        {step >= 4 ? remainder : num2}
                    </div>
                </div>
            </div>

            {/* 算式分解演示 */}
            <div className="make-ten-equation-row" style={{
                minHeight: '220px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                fontFamily: 'Comic Sans MS', fontSize: '48px', fontWeight: 'bold', color: '#333',
                marginTop: '20px'
            }}>
                {step >= 0 && (
                    <div style={{display: 'flex', alignItems: 'flex-start', position: 'relative'}}>
                        {/* Num 1 */}
                        <div style={{width: '80px', textAlign: 'center', zIndex: 2, position: 'relative'}}>{num1}</div>
                        
                        {/* + */}
                        <div style={{width: '60px', textAlign: 'center'}}>+</div>
                        
                        {/* Num 2 (with split) */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '80px'}}>
                            <div style={{
                                zIndex: 2, 
                                border: step >= 2 ? '2px solid #555' : '2px solid transparent',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: step >= 2 ? '#FFF' : 'transparent',
                                transition: 'all 0.3s'
                            }}>{num2}</div>
                            
                            {step >= 2 && (
                                <div style={{
                                    position: 'absolute', 
                                    top: '50px', 
                                    left: '50%', 
                                    transform: 'translateX(-50%)', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center'
                                }}>
                                     {/* SVG Lines */}
                                     <svg width="100" height="40" style={{overflow: 'visible'}}>
                                         <line x1="50" y1="0" x2="25" y2="35" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                                         <line x1="50" y1="0" x2="75" y2="35" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                                     </svg>
                                     
                                     {/* Numbers */}
                                     <div style={{display: 'flex', gap: '10px', marginTop: '-5px', fontSize: '32px'}}>
                                         <div style={{
                                             color: '#D32F2F', 
                                             minWidth: '40px', 
                                             height: '40px',
                                             border: '2px solid #D32F2F',
                                             borderRadius: '50%',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             background: '#FFF',
                                             position: 'relative'
                                         }}>
                                            {gap}
                                         </div>
                                         <div style={{
                                             color: '#1976D2', 
                                             minWidth: '40px', 
                                             height: '40px',
                                             border: '2px solid #1976D2',
                                             borderRadius: '50%',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             background: '#FFF'
                                         }}>{remainder}</div>
                                     </div>
                                </div>
                            )}

                            {/* Make Ten Connection Visualization */}
                            {step >= 3 && (
                                <svg style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '200px',
                                    overflow: 'visible',
                                    pointerEvents: 'none',
                                    zIndex: 1
                                }}>
                                    <path 
                                        d="M -100,55 Q -100,130 -42,130 T 15,125" 
                                        fill="none" 
                                        stroke="#D32F2F" 
                                        strokeWidth="3" 
                                        strokeDasharray="8,4"
                                    />
                                    <circle cx="-42" cy="130" r="18" fill="#D32F2F" />
                                    <text x="-42" y="136" fill="#FFF" fontSize="18" fontWeight="bold" textAnchor="middle">10</text>
                                </svg>
                            )}
                        </div>
                        
                        {/* = Result */}
                        <div style={{width: '60px', textAlign: 'center'}}>=</div>
                        <div style={{width: '80px', textAlign: 'center', color: step === 5 ? '#E65100' : '#333'}}>
                            {step === 5 ? (num1+num2) : '?'}
                        </div>
                    </div>
                )}
            </div>

            {/* 控制按钮 */}
            <div className="make-ten-controls" style={{marginTop: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%'}}>
                
                {/* 数字选择器 */}
                <div className="make-ten-sliders" style={{
                    display: 'flex', 
                    gap: '30px', 
                    background: '#FFF', 
                    padding: '15px 25px', 
                    borderRadius: '20px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    alignItems: 'center'
                }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span style={{fontWeight: 'bold', color: '#D32F2F', fontSize: '18px'}}>左边:</span>
                        <input 
                            type="range" 
                            min="6" 
                            max="9" 
                            value={num1} 
                            onChange={handleNum1Change}
                            style={{accentColor: '#D32F2F'}}
                        />
                        <span style={{fontWeight: 'bold', minWidth: '20px'}}>{num1}</span>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span style={{fontWeight: 'bold', color: '#1976D2', fontSize: '18px'}}>右边:</span>
                        <input 
                            type="range" 
                            min={minNum2} 
                            max={maxNum2} 
                            value={num2} 
                            onChange={handleNum2Change}
                            style={{accentColor: '#1976D2'}}
                        />
                        <span style={{fontWeight: 'bold', minWidth: '20px'}}>{num2}</span>
                    </div>
                </div>

                <div className="make-ten-buttons" style={{display: 'flex', gap: '20px', flexWrap: 'nowrap', justifyContent: 'center'}}>
                    <button className="btn-main" onClick={nextStep} disabled={step === 3}>
                        {step === 0 ? '开始凑十' : 
                        step === 1 ? '找朋友 (缺几个?)' :
                        step === 2 ? '拆小数 (借给他)' :
                        step === 3 ? '凑成十 (移过去)' :
                        step === 4 ? '等于多少?' :
                        '再来一题'}
                    </button>
                    <button className="btn-main" style={{background: '#4CAF50', boxShadow: '0 4px 0 #388E3C'}} onClick={replay}>
                        🔄 重新演示
                    </button>
                    <button className="btn-main" style={{background: '#8D6E63', boxShadow: '0 4px 0 #5D4037'}} onClick={resetToDefault}>
                        🔄 重置
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Main Page Component
// ==========================================
function MathCarryAdd() {
    const [iconType, setIconType] = useState('apple');

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: 'radial-gradient(circle at 50% 0%, #f0f4ff 0%, #e6eeff 100%)',
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Navigation Bar */}
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
                padding: '10px 0'
            }}>
                <Link to="/math" style={{
                    textDecoration: 'none',
                    color: '#1a237e',
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                }}>
                    <span>←</span> 返回数学乐园
                </Link>
            </div>

            <div style={{
                width: '100%',
                padding: '40px',
                boxSizing: 'border-box'
            }}>
                {/* Header */}
                <div style={{textAlign: 'center', marginBottom: '40px'}}>
                    <h2 style={{
                        margin: '0 0 10px 0', 
                        color: '#1a237e', 
                        fontSize: '36px', 
                        fontWeight: '800',
                        letterSpacing: '-0.5px'
                    }}>
                        🔟 20以内进位加法 (凑十法)
                    </h2>
                    
                    {/* Icon Selector */}
                    <div style={{marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px'}}>
                        <span style={{color: '#5c6bc0', fontWeight: '600'}}>选择图标:</span>
                        {['apple', 'duck', 'star'].map(type => (
                            <button key={type} 
                                onClick={() => setIconType(type)}
                                style={{
                                    fontSize: '24px', 
                                    padding: '8px 16px', 
                                    border: iconType === type ? '2px solid #3f51b5' : '2px solid transparent',
                                    borderRadius: '16px', 
                                    background: iconType === type ? 'rgba(63, 81, 181, 0.1)' : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: iconType === type ? '0 4px 12px rgba(63, 81, 181, 0.2)' : 'none'
                                }}
                            >
                                {type === 'apple' ? '🍎' : (type === 'duck' ? '🦆' : '⭐')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lab-content" style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'visible'
                }}>
                    <MakeTenModule iconType={iconType} />
                </div>
            </div>

            <style>{`
                .btn-main {
                    padding: 12px 30px;
                    border-radius: 30px;
                    border: none;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    color: white;
                    background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
                    box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3);
                    transition: all 0.2s ease;
                }
                .btn-main:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(245, 124, 0, 0.4);
                }
                .btn-main:active {
                    transform: translateY(1px);
                    box-shadow: 0 2px 8px rgba(245, 124, 0, 0.3);
                }
                .btn-main:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                    background: #ccc;
                }

                @media (max-width: 768px) {
                    .make-ten-main-stage {
                        flex-direction: column !important;
                        gap: 20px !important;
                    }
                    /* Scale removed, handled by cellSize state */
                    .make-ten-equation-row {
                        transform: scale(0.85);
                        transform-origin: top center;
                        margin-top: 10px;
                        flex-wrap: wrap;
                    }
                    .make-ten-sliders {
                        flex-direction: column !important;
                        align-items: center !important;
                        width: 90% !important;
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </div>
    );
}

export default MathCarryAdd;
