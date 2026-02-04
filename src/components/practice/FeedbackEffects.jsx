import React, { useEffect, useRef } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const FeedbackEffects = ({ show, isCorrect, onNext, explanation }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (show) {
      if (isCorrect) {
        // Success Animation
        gsap.fromTo(containerRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
      } else {
        // Error Shake
        gsap.fromTo(containerRef.current,
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
        );
      }
    }
  }, [show, isCorrect]);

  if (!show) return null;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-x-0 bottom-0 p-6 ${
        isCorrect ? 'bg-green-50 border-t-4 border-green-500' : 'bg-red-50 border-t-4 border-red-500'
      } rounded-b-3xl`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
          isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {isCorrect ? <Check className="w-7 h-7" /> : <X className="w-7 h-7" />}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${
            isCorrect ? 'text-green-800' : 'text-red-800'
          }`}>
            {isCorrect ? '回答正确！' : '再试一次'}
          </h3>
          <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'} text-sm mb-4`}>
            {isCorrect ? '太棒了！继续保持！' : (explanation || '别灰心，仔细想一想')}
          </p>
          
          <button 
            onClick={onNext}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white transition-transform active:scale-95 ${
              isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isCorrect ? '下一题' : '继续挑战'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackEffects;
