import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Link } from 'react-router-dom';

const EquationSolver = () => {
  const [step, setStep] = useState(0); // 0: Start, 1: Focus, 2: Moved, 3: Cancelled/Done
  const [leftCount, setLeftCount] = useState(7);
  const [totalCount, setTotalCount] = useState(14);
  const [isAnimating, setIsAnimating] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Force re-mount of stage elements
  const [equationType, setEquationType] = useState('unknown_plus_a'); // 'unknown_plus_a' | 'a_plus_unknown' | 'total_minus_unknown'

  const containerRef = useRef(null);
  const leftBallsRef = useRef([]);
  const rightBallsRef = useRef([]);
  const formulaStep1Ref = useRef(null);
  const formulaStep2Ref = useRef(null);
  const formulaStep3Ref = useRef(null);
  const instructionRef = useRef(null);

  // Sound Effects Helper using Web Audio API
  const playSound = (type) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const now = ctx.currentTime;
        
        if (type === 'pop') {
            // High frequency pop for focus
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'whoosh') {
            // Slide for movement
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(400, now + 0.3);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'zap') {
            // Drop for collision/cancellation
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'success') {
            // Major chord arpeggio
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, i) => {
                const oscN = ctx.createOscillator();
                const gainN = ctx.createGain();
                oscN.connect(gainN);
                gainN.connect(ctx.destination);
                
                oscN.type = 'sine';
                oscN.frequency.value = freq;
                
                const start = now + (i * 0.1);
                gainN.gain.setValueAtTime(0, start);
                gainN.gain.linearRampToValueAtTime(0.1, start + 0.05);
                gainN.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
                
                oscN.start(start);
                oscN.stop(start + 0.5);
            });
        }
    } catch (e) {
        console.error("Audio playback failed", e);
    }
  };

  // Helper to reset scene completely
  const resetScene = () => {
      gsap.globalTimeline.clear();
      setIsAnimating(false);
      setStep(0);
      setResetKey(prev => prev + 1);
  };

  // Validate inputs: total must be >= left
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string for typing experience
    if (value === '') {
        if (name === 'left') setLeftCount('');
        else setTotalCount('');
        return;
    }
    
    const val = parseInt(value, 10);
    if (isNaN(val) || val < 0) return;

    // Auto-adjust to maintain valid state
    if (name === 'left') {
        setLeftCount(val);
        // Don't force total update immediately while typing, just ensure logic consistency when running
        if (val > totalCount && totalCount !== '') setTotalCount(val);
    } else {
        setTotalCount(val);
        if (val < leftCount && leftCount !== '') setLeftCount(val);
    }
    
    // Always reset scene on config change
    resetScene();
  };

  // Render Formula Steps
  useEffect(() => {
    // Ensure numbers are valid for KaTeX
    const safeLeft = leftCount === '' ? 0 : leftCount;
    const safeTotal = totalCount === '' ? 0 : totalCount;

    // Colors: Sky Blue (#0EA5E9), Coral (#FF7F50)
    // Old: Green (#10B981), Red (#EF4444)
    const colorAdd = '#0EA5E9'; // Sky-500
    const colorSub = '#FF7F50'; // Coral

    // Step 1: Initial Equation
    if (formulaStep1Ref.current) {
        let formula = '';
        if (equationType === 'unknown_plus_a') {
            formula = `? \\; {\\color{${colorAdd}}+ \\; ${safeLeft}} = ${safeTotal}`;
        } else if (equationType === 'a_plus_unknown') {
            formula = `{\\color{${colorAdd}}${safeLeft} \\; +} \\; ? = ${safeTotal}`;
        } else if (equationType === 'total_minus_unknown') {
            formula = `${safeTotal} \\; - \\; ? = {\\color{${colorAdd}}${safeLeft}}`;
        }
            
        katex.render(formula, formulaStep1Ref.current, {
            throwOnError: false,
            displayMode: true
        });
    }

    // Step 2: Transposition
    if (formulaStep2Ref.current && step >= 2) {
        let formula = '';
        if (equationType === 'total_minus_unknown') {
            // 12 - 6 = ?
            formula = `${safeTotal} \\; {\\color{${colorSub}}- \\; ${safeLeft}} = ?`;
        } else {
            // ? = 12 - 6
            formula = `? = ${safeTotal} \\; {\\color{${colorSub}}- \\; ${safeLeft}}`;
        }
        
        katex.render(formula, formulaStep2Ref.current, {
            throwOnError: false,
            displayMode: true
        });
    }

    // Step 3: Result
    if (formulaStep3Ref.current && step >= 3) {
        let formula = '';
        if (equationType === 'total_minus_unknown') {
            // 6 = ?
            formula = `${safeTotal - safeLeft} = ?`;
        } else {
            // ? = 6
            formula = `? = ${safeTotal - safeLeft}`;
        }

        katex.render(formula, formulaStep3Ref.current, {
            throwOnError: false,
            displayMode: true
        });
    }
  }, [step, leftCount, totalCount, equationType]);

  // Animation Steps
  const runFocusAnimation = () => {
    if (leftCount === '' || totalCount === '') return;

    playSound('pop');
    setIsAnimating(true);
    
    let ballsToFocus = [];
    if (equationType === 'total_minus_unknown') {
        ballsToFocus = rightBallsRef.current.slice(0, leftCount);
    } else {
        ballsToFocus = leftBallsRef.current.slice(0, leftCount);
    }
    
    const tl = gsap.timeline({
        onComplete: () => {
            setIsAnimating(false);
            setStep(1);
        }
    });

    // Flash instruction
    tl.fromTo(instructionRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5 }
    );
    // Flash items
    tl.to(ballsToFocus, {
      opacity: 0.5,
      duration: 0.2,
      yoyo: true,
      repeat: 3
    });
  };

  const runTranspositionAnimation = () => {
    setIsAnimating(true);
    
    let sourceBalls = [];
    let targetBalls = [];
    
    if (equationType === 'total_minus_unknown') {
        // Move Right (Part) to Left (Total)
        sourceBalls = rightBallsRef.current.slice(0, leftCount);
        targetBalls = leftBallsRef.current.slice(0, totalCount);
    } else {
        // Move Left (Part) to Right (Total)
        sourceBalls = leftBallsRef.current.slice(0, leftCount);
        targetBalls = rightBallsRef.current.slice(0, totalCount);
    }
    
    const tl = gsap.timeline({
        onStart: () => playSound('whoosh'),
        onComplete: () => {
            setIsAnimating(false);
            setStep(2);
        }
    });

    // Get Container Rect for Relative Calculation
    const containerRect = containerRef.current.getBoundingClientRect();

    sourceBalls.forEach((ball, i) => {
        if (!ball) return;
        
        // Target is from the end, going backwards
        const targetIndex = totalCount - 1 - i;
        const targetBall = targetBalls[targetIndex];
        
        if (!targetBall) return;

        const ballRect = ball.getBoundingClientRect();
        const targetRect = targetBall.getBoundingClientRect();
        
        // Relative Coordinates
        const startLeft = ballRect.left - containerRect.left;
        const startTop = ballRect.top - containerRect.top;
        const targetLeft = targetRect.left - containerRect.left;
        
        // Offset Overlay Strategy:
        // Instead of floating 40px above (which causes overlap on multiline),
        // we overlay on the top-right corner of the target ball.
        // Target ball size is roughly 32px-40px.
        // We offset by x: +10, y: -10 to show it's "attached" but distinct.
        const targetTop = (targetRect.top - containerRect.top) - 15; 
        const targetLeftAdjusted = targetLeft + 15;

        // 1. Switch to Absolute Position (Relative to Container)
        gsap.set(ball, {
            position: 'absolute',
            left: startLeft,
            top: startTop,
            width: ballRect.width,
            height: ballRect.height,
            margin: 0,
            zIndex: 50
        });

        // 2. Animate to OFFSET OVERLAY position with ARC
        const apexY = Math.min(startTop, targetTop) - 80; 

        tl.to(ball, {
            keyframes: {
                "0%": { left: startLeft, top: startTop },
                "50%": { left: (startLeft + targetLeftAdjusted) / 2, top: apexY, ease: "power1.out" },
                "100%": { left: targetLeftAdjusted, top: targetTop, ease: "power1.in" }
            },
            backgroundColor: '#FF7F50', // Coral
            duration: 1.2,
            rotate: 360,
        }, "move");
        
        // Show minus sign
        tl.add(() => {
             ball.textContent = "-";
             ball.style.display = "flex";
             ball.style.alignItems = "center";
             ball.style.justifyContent = "center";
             ball.style.color = "white";
             ball.style.fontWeight = "bold";
             ball.style.fontSize = "16px";
        }, "move+=0.6");
    });
  };

  const runCancellationAnimation = () => {
    setIsAnimating(true);
    
    let sourceBalls = [];
    let targetBalls = [];

    if (equationType === 'total_minus_unknown') {
        sourceBalls = rightBallsRef.current.slice(0, leftCount);
        targetBalls = leftBallsRef.current.slice(0, totalCount);
    } else {
        sourceBalls = leftBallsRef.current.slice(0, leftCount);
        targetBalls = rightBallsRef.current.slice(0, totalCount);
    }

    const tl = gsap.timeline({
        onStart: () => playSound('zap'),
        onComplete: () => {
            playSound('success');
            setIsAnimating(false);
            setStep(3);
        }
    });

    const containerRect = containerRef.current.getBoundingClientRect();

    sourceBalls.forEach((ball, i) => {
        const targetIndex = totalCount - 1 - i;
        const targetBall = targetBalls[targetIndex];
        
        if (!targetBall) return;

        const targetRect = targetBall.getBoundingClientRect();
        // Cancellation: drop to exact center of target ball
        const targetTop = targetRect.top - containerRect.top;
        const targetLeft = targetRect.left - containerRect.left;

        // 1. Drop to collision
        tl.to(ball, {
            top: targetTop, 
            left: targetLeft, // Ensure it centers perfectly
            duration: 0.4,
            ease: "bounce.out"
        }, "drop+=" + (i * 0.1));
        
        // 2. Shake and Disappear
        const shakeTimeline = gsap.timeline();
        shakeTimeline.to(targetBall, {
            x: "+=5",
            yoyo: true,
            repeat: 5,
            duration: 0.05
        });

        tl.add(shakeTimeline, ">");
        
        tl.to([ball, targetBall], {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power1.out"
        }, ">");
    });
  };

  const handleNextStep = () => {
      if (isAnimating) return;
      if (step === 0) runFocusAnimation();
      else if (step === 1) runTranspositionAnimation();
      else if (step === 2) runCancellationAnimation();
  };

  const reset = () => {
     gsap.globalTimeline.clear();
     window.location.reload();
  };

  const getButtonText = () => {
      if (isAnimating) return '演示中...';
      if (step === 0) return '开始演示';
      if (step === 1) return '下一步：移项';
      if (step === 2) return '下一步：抵消';
      return '演示结束';
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col items-center relative w-full overflow-x-hidden"
         style={{ 
             fontFamily: '"Inter", sans-serif', 
             background: 'linear-gradient(to bottom, #F0F9FF, #E0F2FE)',
         }}>
      
      {/* Header */}
      <div className="w-full bg-white shadow-sm flex justify-center sticky top-0 z-40">
          <div className="w-full max-w-4xl px-4 py-3 flex items-center justify-between">
             <div className="flex items-center">
                <Link to="/math" className="text-slate-500 font-bold mr-4 hover:text-slate-700 no-underline">← 返回</Link>
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600 m-0">
                    解方程演示
                </h1>
             </div>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-4xl p-4 flex flex-col gap-6">
        
        {/* Formula Card */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-sm flex flex-col items-center min-h-[160px] justify-center">
            {/* Step 0: Input */}
            {step === 0 && (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 font-bold font-serif text-3xl sm:text-4xl md:text-5xl">
                        {equationType === 'unknown_plus_a' && (
                            <>
                                <span>?</span>
                                <span className="text-sky-500 mx-1">+</span>
                                <input 
                                    name="left" type="number" value={leftCount} onChange={handleConfigChange} placeholder="?"
                                    className="w-16 sm:w-20 text-center border-b-4 border-sky-500 bg-transparent text-sky-500 outline-none font-bold"
                                />
                                <span className="mx-1">=</span>
                                <input 
                                    name="total" type="number" value={totalCount} onChange={handleConfigChange} placeholder="?"
                                    className="w-16 sm:w-20 text-center border-b-4 border-slate-700 bg-transparent text-slate-700 outline-none font-bold"
                                />
                            </>
                        )}
                        {equationType === 'a_plus_unknown' && (
                            <>
                                <input 
                                    name="left" type="number" value={leftCount} onChange={handleConfigChange} placeholder="?"
                                    className="w-16 sm:w-20 text-center border-b-4 border-sky-500 bg-transparent text-sky-500 outline-none font-bold"
                                />
                                <span className="text-sky-500 mx-1">+</span>
                                <span>?</span>
                                <span className="mx-1">=</span>
                                <input 
                                    name="total" type="number" value={totalCount} onChange={handleConfigChange} placeholder="?"
                                    className="w-16 sm:w-20 text-center border-b-4 border-slate-700 bg-transparent text-slate-700 outline-none font-bold"
                                />
                            </>
                        )}
                        {equationType === 'total_minus_unknown' && (
                            <>
                                <input 
                                    name="total" type="number" value={totalCount} onChange={handleConfigChange} placeholder="?"
                                    className="w-16 sm:w-20 text-center border-b-4 border-slate-700 bg-transparent text-slate-700 outline-none font-bold"
                                />
                                <span className="text-coral-500 mx-1" style={{ color: '#FF7F50' }}>-</span>
                                <span>?</span>
                                <span className="mx-1">=</span>
                                <input 
                                    name="left" type="number" value={leftCount} onChange={handleConfigChange} placeholder="?"
                                    className="w-16 sm:w-20 text-center border-b-4 border-sky-500 bg-transparent text-sky-500 outline-none font-bold"
                                />
                            </>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => {
                            if (equationType === 'unknown_plus_a') setEquationType('a_plus_unknown');
                            else if (equationType === 'a_plus_unknown') setEquationType('total_minus_unknown');
                            else setEquationType('unknown_plus_a');
                        }}
                        className="text-sm text-slate-500 bg-slate-100 border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2 touch-manipulation active:scale-95"
                    >
                        <span>⇄</span> 
                        {equationType === 'unknown_plus_a' && "当前: ? + 数 = 总数"}
                        {equationType === 'a_plus_unknown' && "当前: 数 + ? = 总数"}
                        {equationType === 'total_minus_unknown' && "当前: 总数 - ? = 数"}
                    </button>
                </div>
            )}

            {/* Formula Display Steps */}
            <div ref={formulaStep1Ref} className={`text-2xl sm:text-3xl transition-all duration-500 ${step === 0 ? 'hidden' : 'block'}`}></div>
            <div ref={formulaStep2Ref} className={`text-2xl sm:text-3xl transition-all duration-500 overflow-hidden ${step >= 2 ? 'opacity-100 max-h-20 mt-2' : 'opacity-0 max-h-0'}`}></div>
            <div ref={formulaStep3Ref} className={`text-2xl sm:text-3xl transition-all duration-500 overflow-hidden ${step >= 3 ? 'opacity-100 max-h-20 mt-2' : 'opacity-0 max-h-0'}`}></div>

            <div ref={instructionRef} className={`text-slate-500 mt-4 text-base sm:text-lg transition-opacity duration-300 ${step === 0 ? 'opacity-0' : 'opacity-100'}`}>
                {step === 1 && (
                    equationType === 'total_minus_unknown' 
                    ? `观察右边的 +${leftCount}...` 
                    : `观察左边的 +${leftCount}...`
                )}
                {step === 2 && (
                    equationType === 'total_minus_unknown'
                    ? `把 +${leftCount} 移到左边，它变成了 -${leftCount}！`
                    : `把 +${leftCount} 移到右边，它变成了 -${leftCount}！`
                )}
                {step === 3 && `正负抵消：+${leftCount} 和 -${leftCount} 相互消失了...`}
                {step === 4 && `解题完成！? = ${totalCount - leftCount}`}
            </div>
        </div>

        {/* Stage Area (Responsive: Stack on mobile, Row on Desktop) */}
        <div key={resetKey} ref={containerRef} className="bg-white rounded-3xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative min-h-[300px]">
            
            {/* Left Side */}
            <div className="flex-1 w-full md:w-auto flex flex-col items-center p-4 border-2 border-dashed border-slate-200 rounded-2xl min-h-[150px] md:min-h-[300px]">
                {equationType === 'total_minus_unknown' ? (
                    <div className="flex flex-wrap gap-2 justify-center w-full">
                        {Array.from({ length: totalCount }).map((_, i) => (
                            <div 
                                key={i}
                                ref={el => leftBallsRef.current[i] = el}
                                className="bg-sky-500 rounded-full shadow-sm z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                                style={{ backgroundColor: '#0EA5E9' }}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-col items-center gap-4 w-full">
                         {/* Flex ordering based on equation type */}
                        <div className={`flex flex-wrap gap-2 justify-center w-full ${equationType === 'a_plus_unknown' ? 'order-1' : 'order-2'}`}>
                            {Array.from({ length: leftCount }).map((_, i) => (
                                <div 
                                    key={i}
                                    ref={el => leftBallsRef.current[i] = el}
                                    className="bg-sky-500 rounded-full shadow-sm z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                                    style={{ backgroundColor: '#0EA5E9' }}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <div className={`bg-violet-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg
                                        w-16 h-16 sm:w-20 sm:h-20 shrink-0 ${equationType === 'a_plus_unknown' ? 'order-2' : 'order-1'}`}>
                            {step >= 3 ? (totalCount - leftCount) : '?'}
                        </div>
                    </div>
                )}
            </div>

            {/* Equals Sign */}
            <div className="text-3xl text-slate-300 font-bold rotate-90 md:rotate-0 my-2 md:my-0 shrink-0">
                =
            </div>

            {/* Right Side */}
            <div id="right-side-container" className="flex-1 w-full md:w-auto flex flex-col items-center p-4 border-2 border-dashed border-slate-200 rounded-2xl min-h-[150px] md:min-h-[300px]">
                 {equationType === 'total_minus_unknown' ? (
                     <div className="flex flex-col items-center gap-4 w-full">
                        <div className="flex flex-wrap gap-2 justify-center w-full">
                            {Array.from({ length: leftCount }).map((_, i) => (
                                <div 
                                    key={i}
                                    ref={el => rightBallsRef.current[i] = el}
                                    className="bg-sky-500 rounded-full shadow-sm z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                                    style={{ backgroundColor: '#0EA5E9' }}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <div className="bg-violet-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                            {step >= 3 ? (totalCount - leftCount) : '?'}
                        </div>
                     </div>
                 ) : (
                    <div className="flex flex-wrap gap-2 justify-center w-full">
                        {Array.from({ length: totalCount }).map((_, i) => (
                            <div 
                                key={i}
                                ref={el => rightBallsRef.current[i] = el}
                                className="bg-sky-500 rounded-full shadow-sm z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                                style={{ backgroundColor: '#0EA5E9' }}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                 )}
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
            <button 
                onClick={handleNextStep}
                disabled={isAnimating || step >= 3}
                className={`
                    px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all touch-manipulation active:scale-95
                    ${(isAnimating || step >= 3) 
                        ? 'bg-slate-200 text-slate-400 cursor-default shadow-none' 
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-blue-500/30'}
                `}
                style={{ minHeight: '48px' }}
            >
                {getButtonText()}
            </button>

            <div className="flex gap-4 justify-center">
                <button 
                    onClick={resetScene}
                    disabled={isAnimating}
                    className="px-6 py-4 rounded-full font-bold bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50 transition-all touch-manipulation active:scale-95"
                    style={{ minHeight: '48px', opacity: isAnimating ? 0.5 : 1 }}
                >
                    再次演示
                </button>

                <button 
                    onClick={reset}
                    className="px-6 py-4 rounded-full font-bold bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50 transition-all touch-manipulation active:scale-95"
                    style={{ minHeight: '48px' }}
                >
                    重置
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default EquationSolver;
