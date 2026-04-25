import React from 'react';

const MultipleChoice = ({ 
  options, 
  onAnswer, 
  disabled 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !disabled && onAnswer(option.value)}
          disabled={disabled}
          className={`
            p-6 rounded-2xl border-2 text-lg font-medium transition-all duration-200
            hover:border-blue-400 hover:bg-blue-50 hover:shadow-md
            active:scale-98 text-slate-700 bg-white border-slate-100
            disabled:opacity-50 disabled:cursor-not-allowed
            flex flex-col items-center justify-center gap-3 min-h-[120px]
          `}
        >
          {option.image && (
            <img src={option.image} alt="" className="w-16 h-16 object-contain" />
          )}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MultipleChoice;
