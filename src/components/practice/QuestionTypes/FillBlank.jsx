import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const FillBlank = ({ 
  prefix = '', 
  suffix = '', 
  correctAnswer, 
  onAnswer, 
  disabled,
  placeholder = '?'
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value || disabled) return;
    onAnswer(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-[200px] gap-8">
      <div className="flex items-center gap-4 text-3xl md:text-5xl font-bold text-slate-700 flex-wrap justify-center">
        {prefix && <span>{prefix}</span>}
        
        <input
          type="text" // numeric input might be better, but text is more flexible
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-24 h-24 md:w-32 md:h-32 text-center rounded-2xl border-4 
            focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all
            ${disabled 
              ? 'bg-slate-100 border-slate-200 text-slate-400' 
              : 'bg-white border-blue-400 text-blue-600 shadow-inner'
            }
          `}
          autoFocus
        />
        
        {suffix && <span>{suffix}</span>}
      </div>

      <button
        type="submit"
        disabled={!value || disabled}
        className={`
          flex items-center gap-2 px-8 py-3 rounded-full text-xl font-bold bg-blue-500 text-white
          hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-blue-200
          disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        `}
      >
        提交答案 <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
};

export default FillBlank;
