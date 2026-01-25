import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Info } from 'lucide-react';
import gsap from 'gsap';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const PlaceValue2D = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState(35);
  const [activeBlock, setActiveBlock] = useState(null);
  const containerRef = useRef(null);
  
  // Calculate tens and ones
  const tens = Math.floor(number / 10);
  const ones = number % 10;

  // Audio context for sound effects
  const audioCtxRef = useRef(null);

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playPopSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Tens
      gsap.fromTo('.ten-block', 
        { y: -50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.05, 
          ease: 'back.out(1.7)',
          overwrite: 'auto'
        }
      );

      // Animate Ones
      gsap.fromTo('.one-block', 
        { scale: 0, rotation: -180 },
        { 
          scale: 1, 
          rotation: 0, 
          duration: 0.4, 
          stagger: 0.05, 
          ease: 'back.out(1.7)',
          overwrite: 'auto'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [tens, ones]);

  // Click handler for blocks
  const handleBlockClick = (type, index) => {
    setActiveBlock({ type, index });
    playPopSound();
    
    // Highlight animation
    const targetClass = type === 'ten' ? `.ten-block-${index}` : `.one-block-${index}`;
    gsap.to(targetClass, {
      scale: 1.2,
      yoyo: true,
      repeat: 3,
      duration: 0.1,
      onComplete: () => gsap.to(targetClass, { scale: 1 })
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" ref={containerRef}>
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <button 
          onClick={() => navigate('/math')}
          className="p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">数字分解 (2D)</h1>
        <button 
          onClick={() => setActiveBlock(null)}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <Info className="w-6 h-6" />
        </button>
      </div>

      {/* Formula Area */}
      <div className="p-6 text-center bg-white mb-2 shadow-sm">
        <div className="text-2xl md:text-3xl font-bold text-slate-800 flex justify-center items-center flex-wrap gap-2">
          <InlineMath math={`${number} = `} />
          <span className="text-blue-600"><InlineMath math={`${tens}`} /></span>
          <span className="text-slate-500 text-lg">个十</span>
          <InlineMath math="+" />
          <span className="text-pink-500"><InlineMath math={`${ones}`} /></span>
          <span className="text-slate-500 text-lg">个一</span>
        </div>
        {activeBlock && (
          <div className="mt-2 text-sm font-medium text-slate-600 animate-bounce">
            {activeBlock.type === 'ten' 
              ? `这是第 ${activeBlock.index + 1} 个十` 
              : `这是第 ${activeBlock.index + 1} 个一`}
          </div>
        )}
      </div>

      {/* Visualization Area */}
      <div className="flex-1 overflow-y-auto p-4 flex gap-4 items-start justify-center content-start">
        
        {/* Tens Area */}
        <div className="flex-1 bg-blue-50/50 rounded-2xl p-4 min-h-[300px] border-2 border-dashed border-blue-200 relative">
          <div className="absolute top-2 left-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Tens (十位)</div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {Array.from({ length: tens }).map((_, i) => (
              <div 
                key={`ten-${i}`}
                className={`ten-block ten-block-${i} w-8 h-40 bg-blue-500 rounded-lg shadow-md cursor-pointer hover:bg-blue-400 transition-colors flex flex-col gap-[2px] p-[2px] border border-blue-600`}
                onClick={() => handleBlockClick('ten', i)}
              >
                {/* Visual division into 10 units */}
                {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="flex-1 w-full bg-blue-300/30 rounded-sm"></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Ones Area */}
        <div className="flex-1 bg-pink-50/50 rounded-2xl p-4 min-h-[300px] border-2 border-dashed border-pink-200 relative">
          <div className="absolute top-2 left-4 text-xs font-bold text-pink-300 uppercase tracking-wider">Ones (个位)</div>
          <div className="grid grid-cols-5 gap-2 mt-6 w-fit mx-auto">
            {Array.from({ length: ones }).map((_, i) => (
              <div 
                key={`one-${i}`}
                className={`one-block one-block-${i} w-8 h-8 bg-pink-500 rounded-lg shadow-md cursor-pointer hover:bg-pink-400 transition-colors border border-pink-600`}
                onClick={() => handleBlockClick('one', i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Control Area */}
      <div className="bg-white p-6 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-3xl z-20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 font-medium">数值调节</span>
            <span className="text-2xl font-bold text-slate-800">{number}</span>
          </div>
          
          <input 
            type="range" 
            min="10" 
            max="99" 
            value={number} 
            onChange={(e) => {
              setNumber(parseInt(e.target.value));
              setActiveBlock(null);
              playPopSound();
            }}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 active:accent-indigo-500 touch-none"
          />
          
          <div className="flex justify-center">
            <button 
              onClick={() => {
                setNumber(35);
                setActiveBlock(null);
                playPopSound();
                gsap.fromTo('.ten-block, .one-block', { scale: 0.8, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.3 });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              <span>重置演示</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceValue2D;
