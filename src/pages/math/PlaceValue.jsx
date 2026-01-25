import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';

const PlaceValue = () => {
  const [number, setNumber] = useState(35);
  const [tens, setTens] = useState(3);
  const [ones, setOnes] = useState(5);
  
  const tensRef = useRef([]);
  const onesRef = useRef([]);
  const audioCtxRef = useRef(null);

  // Initialize Audio
  const initAudio = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtxRef.current = new AudioContext();
        }
      } catch (e) {
        console.error("Audio Context init failed", e);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSound = (type) => {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'slide') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(500, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update tens/ones when number changes
  useEffect(() => {
    const t = Math.floor(number / 10);
    const o = number % 10;
    setTens(t);
    setOnes(o);
    playSound('slide');
  }, [number]);

  // Animate blocks when counts change
  useEffect(() => {
    if (tensRef.current.length > 0) {
        gsap.fromTo(tensRef.current.filter(el => el), 
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.7)" }
        );
    }
  }, [tens]);

  useEffect(() => {
    if (onesRef.current.length > 0) {
        gsap.fromTo(onesRef.current.filter(el => el), 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.7)" }
        );
    }
  }, [ones]);

  const handleSliderChange = (e) => {
    initAudio();
    setNumber(parseInt(e.target.value));
  };

  const handleBlockClick = (type, index) => {
    initAudio();
    playSound('pop');
    
    // Animate the clicked block
    const el = type === 'ten' ? tensRef.current[index] : onesRef.current[index];
    if (el) {
        gsap.to(el, {
            scale: 1.2,
            y: -10,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center relative overflow-hidden">
      {/* Header */}
      <div className="w-full bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/math" className="flex items-center text-slate-500 font-bold hover:text-slate-700 no-underline transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </Link>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 m-0">
            数字分解 (10-99)
          </h1>
          <button onClick={() => setNumber(10)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors" title="重置">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 py-6 flex flex-col gap-6 pb-20">
        
        {/* Instruction */}
        <div className="text-center">
            <p className="text-lg text-slate-600 mb-2">选一个数字，看看它能分成几个十和几个一吧！</p>
        </div>

        {/* Controls & Display */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-slate-100 flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-4 w-full max-w-md">
                <span className="text-slate-400 font-bold text-lg">10</span>
                <input 
                    type="range" 
                    min="10" 
                    max="99" 
                    value={number} 
                    onChange={handleSliderChange}
                    className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 transition-all"
                />
                <span className="text-slate-400 font-bold text-lg">99</span>
            </div>
            
            <div className="flex items-baseline gap-4">
                <div className="text-6xl font-black text-slate-800">{number}</div>
                <div className="text-3xl text-slate-400 font-bold">=</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-indigo-600">{tens}</span>
                    <span className="text-xl text-slate-500">个</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-bold">10</span>
                </div>
                <div className="text-3xl text-slate-400 font-bold">+</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-amber-500">{ones}</span>
                    <span className="text-xl text-slate-500">个</span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg font-bold">1</span>
                </div>
            </div>
        </div>

        {/* Visual Decomposition Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full flex-1">
            
            {/* Tens Area */}
            <div className="bg-indigo-50/50 rounded-3xl p-6 border-2 border-dashed border-indigo-200 min-h-[300px] flex flex-col relative">
                <div className="absolute top-4 left-6 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <h3 className="text-indigo-900 font-bold text-lg">十位 (Tens)</h3>
                </div>
                
                <div className="flex-1 flex flex-wrap content-start gap-4 mt-10 p-2 justify-center">
                    {Array.from({ length: tens }).map((_, i) => (
                        <div 
                            key={`ten-${i}`}
                            ref={el => tensRef.current[i] = el}
                            onClick={() => handleBlockClick('ten', i)}
                            className="flex flex-col gap-[2px] cursor-pointer hover:brightness-110 transition-all active:scale-95"
                            title="这是一个10"
                        >
                            {/* Represents a rod of 10 */}
                            {Array.from({ length: 10 }).map((_, j) => (
                                <div key={j} className="w-8 h-8 bg-indigo-500 rounded-sm shadow-sm border border-indigo-400/30"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Ones Area */}
            <div className="bg-amber-50/50 rounded-3xl p-6 border-2 border-dashed border-amber-200 min-h-[300px] flex flex-col relative">
                <div className="absolute top-4 left-6 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <h3 className="text-amber-900 font-bold text-lg">个位 (Ones)</h3>
                </div>
                
                <div className="flex-1 flex flex-wrap content-start gap-4 mt-10 p-2 justify-center">
                    {Array.from({ length: ones }).map((_, i) => (
                        <div 
                            key={`one-${i}`}
                            ref={el => onesRef.current[i] = el}
                            onClick={() => handleBlockClick('one', i)}
                            className="w-8 h-8 bg-amber-500 rounded-md shadow-sm border border-amber-400/30 cursor-pointer hover:brightness-110 transition-all active:scale-95"
                            title="这是一个1"
                        ></div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceValue;
