import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Link } from 'react-router-dom';

const EquationSolver = () => {
  const [step, setStep] = useState(0); // 0: Start, 1: Focus, 2: Moved, 3: Cancelled/Done
  const [leftCount, setLeftCount] = useState(6);
  const [totalCount, setTotalCount] = useState(12);
  const [showConfig, setShowConfig] = useState(false);
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

    // Step 1: Initial Equation
    if (formulaStep1Ref.current) {
        let formula = '';
        if (equationType === 'unknown_plus_a') {
            formula = `? \\; {\\color{#10B981}+ \\; ${safeLeft}} = ${safeTotal}`;
        } else if (equationType === 'a_plus_unknown') {
            formula = `{\\color{#10B981}${safeLeft} \\; +} \\; ? = ${safeTotal}`;
        } else if (equationType === 'total_minus_unknown') {
            // 12 - ? = 6
            // We use safeTotal for the "Whole" (12) and safeLeft for the "Part" (6)
            // Wait, users inputs: leftCount is usually the "Part". totalCount is "Whole".
            // In 12 - ? = 6, 12 is Whole, 6 is Part.
            // So logic holds: totalCount - ? = leftCount
            formula = `${safeTotal} \\; - \\; ? = {\\color{#10B981}${safeLeft}}`;
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
            formula = `${safeTotal} \\; {\\color{#EF4444}- \\; ${safeLeft}} = ?`;
        } else {
            // ? = 12 - 6
            formula = `? = ${safeTotal} \\; {\\color{#EF4444}- \\; ${safeLeft}}`;
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
    // Ensure inputs are valid numbers before starting
    if (leftCount === '' || totalCount === '') return;

    setIsAnimating(true);
    
    // Determine which balls to focus on
    // In addition modes: Focus on Left Balls (Part)
    // In subtraction mode: Focus on Right Balls (Part)
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
    
    // Mapping: Source 0 -> Target Last (totalCount - 1)
    //          Source 1 -> Target Second Last (totalCount - 2)
    // This ensures we fill from the end backwards
    
    const tl = gsap.timeline({
        onComplete: () => {
            setIsAnimating(false);
            setStep(2);
        }
    });

    sourceBalls.forEach((ball, i) => {
        if (!ball) return;
        
        // Target is from the end, going backwards
        const targetIndex = totalCount - 1 - i;
        const targetBall = targetBalls[targetIndex];
        
        if (!targetBall) return;

        const ballRect = ball.getBoundingClientRect();
        const targetRect = targetBall.getBoundingClientRect();
        
        // 1. Switch to Fixed Position to escape layout constraints
        // We set initial position to where it currently is visually
        gsap.set(ball, {
            position: 'fixed',
            left: ballRect.left,
            top: ballRect.top,
            width: ballRect.width,
            height: ballRect.height,
            margin: 0,
            zIndex: 50
        });

        // 2. Animate to EXACTLY ABOVE the target
        // We use absolute coordinates now
        const targetX = targetRect.left;
        const targetY = targetRect.top - 40; // Hover 40px above

        tl.to(ball, {
            left: targetX,
            top: targetY,
            x: 0, // Reset any previous transforms
            y: 0,
            backgroundColor: '#EF4444', // Red-500
            duration: 1.5,
            ease: "power2.inOut",
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
        }, "move+=0.7");
    });
  };

  const runCancellationAnimation = () => {
    setIsAnimating(true);
    
    let sourceBalls = [];
    let targetBalls = [];

    if (equationType === 'total_minus_unknown') {
        // Source is Right (moved to Left), Target is Left
        sourceBalls = rightBallsRef.current.slice(0, leftCount);
        targetBalls = leftBallsRef.current.slice(0, totalCount);
    } else {
        // Source is Left (moved to Right), Target is Right
        sourceBalls = leftBallsRef.current.slice(0, leftCount);
        targetBalls = rightBallsRef.current.slice(0, totalCount);
    }

    const tl = gsap.timeline({
        onComplete: () => {
            setIsAnimating(false);
            setStep(3);
        }
    });

    sourceBalls.forEach((ball, i) => {
        // Find the same target we used before
        const targetIndex = totalCount - 1 - i;
        const targetBall = targetBalls[targetIndex];
        
        if (!targetBall) return;

        const targetRect = targetBall.getBoundingClientRect();

        // 1. Drop to collision
        tl.to(ball, {
            top: targetRect.top, // Hit the target exactly
            duration: 0.4,
            ease: "bounce.out"
        }, "drop+=" + (i * 0.1));
        
        // 2. Shake and Disappear (Simultaneous)
        const shakeTimeline = gsap.timeline();
        
        // Shake target ball (Green)
        shakeTimeline.to(targetBall, {
            x: "+=5",
            yoyo: true,
            repeat: 5,
            duration: 0.05
        });

        // Shrink both
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
    <div className="min-h-screen font-sans text-slate-800 flex flex-col items-center relative"
         style={{ 
             fontFamily: '"Inter", sans-serif', 
             background: 'linear-gradient(to bottom, #F0F9FF, #E0F2FE)', // Sky blue gradient
             minHeight: '100vh', 
             display: 'flex', 
             flexDirection: 'column',
             overflowY: 'auto',
             overflowX: 'hidden'
         }}>
      
      {/* Header / Nav */}
      <div style={{ width: '100%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '600px', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/math" style={{ textDecoration: 'none', color: '#64748B', fontWeight: 'bold', marginRight: '15px' }}>← 返回</Link>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', background: 'linear-gradient(to right, #7C3AED, #DB2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                    解方程演示
                </h1>
             </div>
          </div>
      </div>

      {/* Formula Area */}
      <div style={{ marginTop: '10px', marginBottom: '5px', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
        
        {/* Step 0: Input Mode */}
        {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'KaTeX_Main, "Times New Roman", serif', marginBottom: '5px' }}>
                    
                    {equationType === 'unknown_plus_a' && (
                        <>
                            <span>?</span>
                            <span style={{ color: '#10B981', margin: '0 5px' }}>+</span>
                            <input 
                                name="left"
                                type="number"
                                value={leftCount}
                                onChange={handleConfigChange}
                                placeholder="?"
                                style={{ 
                                    width: '80px', fontSize: '2.5rem', textAlign: 'center', 
                                    border: 'none', borderBottom: '3px solid #10B981',
                                    background: 'transparent', color: '#10B981', outline: 'none', fontWeight: 'bold'
                                }}
                            />
                            <span style={{ margin: '0 5px' }}>=</span>
                            <input 
                                name="total"
                                type="number"
                                value={totalCount}
                                onChange={handleConfigChange}
                                placeholder="?"
                                style={{ 
                                    width: '80px', fontSize: '2.5rem', textAlign: 'center', 
                                    border: 'none', borderBottom: '3px solid #334155',
                                    background: 'transparent', color: '#334155', outline: 'none', fontWeight: 'bold'
                                }}
                            />
                        </>
                    )}

                    {equationType === 'a_plus_unknown' && (
                        <>
                            <input 
                                name="left"
                                type="number"
                                value={leftCount}
                                onChange={handleConfigChange}
                                placeholder="?"
                                style={{ 
                                    width: '80px', fontSize: '2.5rem', textAlign: 'center', 
                                    border: 'none', borderBottom: '3px solid #10B981',
                                    background: 'transparent', color: '#10B981', outline: 'none', fontWeight: 'bold'
                                }}
                            />
                            <span style={{ color: '#10B981', margin: '0 5px' }}>+</span>
                            <span>?</span>
                            <span style={{ margin: '0 5px' }}>=</span>
                            <input 
                                name="total"
                                type="number"
                                value={totalCount}
                                onChange={handleConfigChange}
                                placeholder="?"
                                style={{ 
                                    width: '80px', fontSize: '2.5rem', textAlign: 'center', 
                                    border: 'none', borderBottom: '3px solid #334155',
                                    background: 'transparent', color: '#334155', outline: 'none', fontWeight: 'bold'
                                }}
                            />
                        </>
                    )}

                    {equationType === 'total_minus_unknown' && (
                        <>
                            <input 
                                name="total"
                                type="number"
                                value={totalCount}
                                onChange={handleConfigChange}
                                placeholder="?"
                                style={{ 
                                    width: '80px', fontSize: '2.5rem', textAlign: 'center', 
                                    border: 'none', borderBottom: '3px solid #334155',
                                    background: 'transparent', color: '#334155', outline: 'none', fontWeight: 'bold'
                                }}
                            />
                            <span style={{ color: '#EF4444', margin: '0 5px' }}>-</span>
                            <span>?</span>
                            <span style={{ margin: '0 5px' }}>=</span>
                            <input 
                                name="left"
                                type="number"
                                value={leftCount}
                                onChange={handleConfigChange}
                                placeholder="?"
                                style={{ 
                                    width: '80px', fontSize: '2.5rem', textAlign: 'center', 
                                    border: 'none', borderBottom: '3px solid #10B981',
                                    background: 'transparent', color: '#10B981', outline: 'none', fontWeight: 'bold'
                                }}
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
                    style={{
                        fontSize: '0.85rem',
                        color: '#64748B',
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s',
                        marginBottom: '10px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#E2E8F0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
                >
                    <span style={{ fontSize: '1rem' }}>⇄</span> 
                    {equationType === 'unknown_plus_a' && "当前: ? + 数 = 总数"}
                    {equationType === 'a_plus_unknown' && "当前: 数 + ? = 总数"}
                    {equationType === 'total_minus_unknown' && "当前: 总数 - ? = 数"}
                </button>
            </div>
        )}

        {/* Step > 0: Display Mode */}
        <div ref={formulaStep1Ref} style={{ fontSize: '2rem', display: step === 0 ? 'none' : 'block', lineHeight: '1.2' }}></div>
        
        {/* Step 2 Formula */}
        <div ref={formulaStep2Ref} style={{ 
            fontSize: '2rem', 
            height: step >= 2 ? 'auto' : 0, 
            opacity: step >= 2 ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.5s',
            lineHeight: '1.2'
        }}></div>

        {/* Step 3 Formula */}
        <div ref={formulaStep3Ref} style={{ 
            fontSize: '2rem', 
            height: step >= 3 ? 'auto' : 0, 
            opacity: step >= 3 ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.5s',
            lineHeight: '1.2'
        }}></div>

        <div ref={instructionRef} style={{ opacity: step === 0 ? 0 : 1, color: '#64748B', marginTop: '5px', fontSize: '1rem', transition: 'opacity 0.3s' }}>
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

      {/* Stage */}
      <div key={resetKey} ref={containerRef} style={{ flex: 1, width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '20px' }}>
        
        {/* Left Side Container */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px', border: '2px dashed #E2E8F0', borderRadius: '20px', marginRight: '10px', minHeight: '300px' }}>
            
            {equationType === 'total_minus_unknown' ? (
                // Mode: 12 - ? = 6. Left side has TOTAL (12) balls.
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', width: '100%' }}>
                    {Array.from({ length: totalCount }).map((_, i) => (
                        <div 
                            key={i}
                            ref={el => leftBallsRef.current[i] = el}
                            style={{
                                width: '32px', height: '32px',
                                background: '#10B981', // Green-500
                                borderRadius: '50%',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                zIndex: 10
                            }}
                        />
                    ))}
                </div>
            ) : (
                // Mode: Addition. Left side has BOX and PART (6) balls.
                <>
                    {/* The ? Box */}
                    <div style={{ 
                        order: equationType === 'a_plus_unknown' ? 2 : 1,
                        width: '80px', height: '80px', 
                        background: '#8B5CF6', // Purple-500
                        borderRadius: '16px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '2rem', fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)'
                    }}>
                        ?
                    </div>

                    {/* The Green Balls (Part) */}
                    <div style={{ 
                        order: equationType === 'a_plus_unknown' ? 1 : 2,
                        display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', width: '100%' 
                    }}>
                        {Array.from({ length: leftCount }).map((_, i) => (
                            <div 
                                key={i}
                                ref={el => leftBallsRef.current[i] = el}
                                style={{
                                    width: '32px', height: '32px',
                                    background: '#10B981', // Green-500
                                    borderRadius: '50%',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    zIndex: 10
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* Equals */}
        <div style={{ fontSize: '2rem', color: '#CBD5E1', fontWeight: 'bold', margin: '0 5px' }}>
            =
        </div>

        {/* Right Side Container */}
        <div id="right-side-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px', border: '2px dashed #E2E8F0', borderRadius: '20px', marginLeft: '10px', minHeight: '300px' }}>
             
             {equationType === 'total_minus_unknown' ? (
                 // Mode: 12 - ? = 6. Right side has PART (6) balls and BOX.
                 <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', width: '100%' }}>
                        {Array.from({ length: leftCount }).map((_, i) => (
                            <div 
                                key={i}
                                ref={el => rightBallsRef.current[i] = el}
                                style={{
                                    width: '32px', height: '32px',
                                    background: '#10B981', // Green-500
                                    borderRadius: '50%',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    zIndex: 10
                                }}
                            />
                        ))}
                    </div>

                    {/* The ? Box */}
                    <div style={{ 
                        width: '80px', height: '80px', 
                        background: '#8B5CF6', // Purple-500
                        borderRadius: '16px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '2rem', fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)'
                    }}>
                        ?
                    </div>
                 </>
             ) : (
                 // Mode: Addition. Right side has TOTAL (12) balls.
                 <>
                    {/* Spacer to align with X visually roughly */}
                    <div style={{ width: '80px', height: '80px', visibility: 'hidden' }}></div>

                    {/* The Green Balls (Total) */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', width: '100%' }}>
                        {Array.from({ length: totalCount }).map((_, i) => (
                            <div 
                                key={i}
                                ref={el => rightBallsRef.current[i] = el}
                                style={{
                                    width: '32px', height: '32px',
                                    background: '#10B981', // Green-500
                                    borderRadius: '50%',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        ))}
                    </div>
                 </>
             )}
        </div>

      </div>

      {/* Controls */}
      <div style={{ width: '100%', background: 'white', boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
          <div style={{ width: '100%', maxWidth: '600px', padding: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button 
                onClick={handleNextStep}
                disabled={isAnimating || step >= 3}
                style={{
                    background: (isAnimating || step >= 3) ? '#E2E8F0' : '#3B82F6', // Blue-500
                    color: (isAnimating || step >= 3) ? '#94A3B8' : 'white',
                    padding: '16px 40px',
                    borderRadius: '50px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: (isAnimating || step >= 3) ? 'default' : 'pointer',
                    transition: 'transform 0.1s',
                    boxShadow: (isAnimating || step >= 3) ? 'none' : '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                }}
            >
                {getButtonText()}
            </button>

            <button 
                onClick={resetScene}
                disabled={isAnimating}
                style={{
                    background: 'white',
                    border: '2px solid #E2E8F0',
                    color: '#64748B',
                    padding: '16px 30px',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: isAnimating ? 'default' : 'pointer',
                    opacity: isAnimating ? 0.5 : 1
                }}
            >
                再次演示
            </button>

            <button 
                onClick={reset}
                style={{
                    background: 'white',
                    border: '2px solid #E2E8F0',
                    color: '#64748B',
                    padding: '16px 30px',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                重置
            </button>
          </div>
      </div>
    </div>
  );
};

export default EquationSolver;
