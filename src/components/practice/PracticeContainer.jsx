import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, ArrowRight, RefreshCw, Home } from 'lucide-react';
import gsap from 'gsap';
import FeedbackEffects from './FeedbackEffects';

const PracticeContainer = ({ 
  title, 
  generateQuestions, // Replaces static 'questions' prop
  backPath = '/math',
  themeColor = 'blue'
}) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [streak, setStreak] = useState(0);

  // State to hold the current list of questions
  const [activeQuestions, setActiveQuestions] = useState([]);
  
  // Initialize questions on load
  useEffect(() => {
    setActiveQuestions(generateQuestions()); // Generate initial set
  }, [generateQuestions]);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  // Fix progress calculation to reach 100% when finished
  const progress = isCompleted ? 100 : ((currentQuestionIndex) / activeQuestions.length) * 100;

  // Colors based on theme
  const colors = {
    blue: { bg: 'bg-blue-50', primary: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', primary: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
    purple: { bg: 'bg-purple-50', primary: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
    orange: { bg: 'bg-orange-50', primary: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
  }[themeColor] || colors.blue;

  const handleAnswer = (answer) => {
    if (showFeedback) return; // Prevent double submission
    
    setSelectedAnswer(answer);
    const correct = JSON.stringify(answer) === JSON.stringify(currentQuestion.correctAnswer);
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      // Simple scoring: 100 points total, distributed per question
      const pointsPerQuestion = Math.ceil(100 / activeQuestions.length);
      setScore(s => s + pointsPerQuestion);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const restartSame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsCompleted(false);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setStreak(0);
  };

  const restartNew = () => {
    // Generate NEW questions
    const newQuestions = generateQuestions();
    setActiveQuestions(newQuestions);
    
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsCompleted(false);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setStreak(0);
  };

  if (isCompleted || !currentQuestion) {
    return (
      <div className={`min-h-screen ${colors.bg} flex flex-col items-center justify-center p-4`}>
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center space-y-6 animate-fade-in-up">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800">练习完成！</h2>
          
          <div className="space-y-2">
            <p className="text-slate-500">本次得分</p>
            <div className="text-5xl font-black text-yellow-500">
              {/* Cap score at 100 to avoid rounding weirdness like 101 */}
              {Math.min(score, 100)} 
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center pt-6">
             <button 
              onClick={restartSame}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 rounded-full font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              再练一次 (原题)
            </button>
            <button 
              onClick={restartNew}
              className={`flex items-center justify-center gap-2 px-6 py-3 ${colors.primary} text-white rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-${themeColor}-200`}
            >
              <Star className="w-5 h-5" />
              重新出题 (新题)
            </button>
            <button 
              onClick={() => navigate(backPath)}
              className="flex items-center justify-center gap-2 px-6 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              返回课程
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.bg} flex flex-col`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(backPath)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 px-4">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>进度 {currentQuestionIndex + 1}/{activeQuestions.length}</span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{score}</span>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colors.primary} transition-all duration-500 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 flex flex-col justify-center">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 min-h-[400px] flex flex-col relative overflow-hidden">
          {/* Question Render Logic would be injected here or passed as children */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center leading-relaxed">
              {currentQuestion.text}
            </h2>
             
            {/* Render different question types */}
            {/* This is a placeholder, actual implementation will use sub-components */}
            {currentQuestion && React.cloneElement(currentQuestion.component, { 
              key: currentQuestion.id, // IMPORTANT: Force re-mount on question change to clear internal state like inputs
              onAnswer: handleAnswer,
              disabled: showFeedback 
            })}
          </div>

          {/* Feedback Overlay */}
          <FeedbackEffects 
            show={showFeedback} 
            isCorrect={isCorrect} 
            onNext={nextQuestion}
            explanation={currentQuestion.explanation}
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeContainer;
