import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Award, Sparkles } from 'lucide-react';
import { QUIZZES_DATA } from '../data/quizzesData';
import { Quiz, QuizQuestion } from '../types';

export const SmartQuizEngine: React.FC = () => {
  const [activeQuizId, setActiveQuizId] = useState<string>('quiz-bohr-effect');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const activeQuiz: Quiz = QUIZZES_DATA.find((q) => q.id === activeQuizId) || QUIZZES_DATA[0];
  const question: QuizQuestion = activeQuiz.questions[currentQuestionIndex];
  const totalQuestions = activeQuiz.questions.length;

  const currentSelectedOption = selectedAnswers[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: idx,
    }));
  };

  const handleCheckAnswer = () => {
    if (currentSelectedOption === undefined) return;
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      // Calculate score and fire confetti if high score
      let correct = 0;
      activeQuiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) correct++;
      });
      setQuizFinished(true);

      if (correct / totalQuestions >= 0.7) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#38bdf8', '#10b981', '#f59e0b'],
          });
        } catch (e) {
          // ignore if canvas blocked
        }
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setQuizFinished(false);
  };

  const switchQuiz = (id: string) => {
    setActiveQuizId(id);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setQuizFinished(false);
  };

  // Calculate score
  let correctCount = 0;
  activeQuiz.questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) correctCount++;
  });
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Quiz Header & Selector */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Smart Assessment & Diagnostic Engine
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {activeQuiz.title}
          </h3>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span>{activeQuiz.discipline}</span>
            <span>·</span>
            <span>{activeQuiz.questions.length} Diagnostic Inquiries</span>
            <span>·</span>
            <span>Estimated {activeQuiz.estimatedTime}</span>
          </div>
        </div>

        {/* Tab switch between quizzes */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg text-xs font-medium">
          {QUIZZES_DATA.map((q) => (
            <button
              key={q.id}
              onClick={() => switchQuiz(q.id)}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                activeQuizId === q.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {q.id.replace('quiz-', '').replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {!quizFinished ? (
        <div className="p-6 max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="font-mono text-indigo-600 font-medium">
                Concept: {question.conceptTag}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h4 className="text-base md:text-lg font-semibold text-slate-900 leading-relaxed">
              {question.question}
            </h4>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((opt, idx) => {
              const isSelected = currentSelectedOption === idx;
              const isCorrect = idx === question.correctIndex;

              let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';
              if (isSelected && !isAnswerSubmitted) {
                optionStyle = 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-600';
              } else if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-50/70 text-rose-950';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50/40 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-semibold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate Feedback Explanation Box */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-xl border mb-6 text-xs leading-relaxed transition-all ${
                currentSelectedOption === question.correctIndex
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/60 border-amber-200 text-amber-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                {currentSelectedOption === question.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct Analysis
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-600" /> Conceptual Clarification
                  </>
                )}
              </div>
              <p>{question.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              {!isAnswerSubmitted && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-100 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  {showHint ? 'Hide Scientific Hint' : 'Need a Conceptual Hint?'}
                </button>
              )}
              {showHint && !isAnswerSubmitted && (
                <div className="text-xs text-slate-600 italic mt-1.5 max-w-md bg-slate-50 p-2.5 rounded border border-slate-200">
                  💡 {question.hint}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={currentSelectedOption === undefined}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    currentSelectedOption !== undefined
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {currentQuestionIndex + 1 < totalQuestions ? (
                    <>
                      Proceed to Question {currentQuestionIndex + 2}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    'Review Final Results'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="p-8 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Award className="w-8 h-8" />
          </div>

          <h4 className="text-xl font-bold text-slate-900 mb-1">
            Diagnostic Assessment Complete
          </h4>
          <p className="text-xs text-slate-500 mb-6">
            Evaluation recorded for {activeQuiz.title}. Your answers substantiate subject mastery.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs text-slate-500 font-medium">Final Score</div>
              <div className="text-2xl font-bold font-mono text-indigo-600 tabular-numbers">
                {scorePercent}%
              </div>
              <div className="text-[11px] text-slate-400">
                {correctCount} / {totalQuestions} correct
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs text-slate-500 font-medium">Mastery Status</div>
              <div className="text-base font-bold text-slate-800 mt-1">
                {scorePercent >= 80 ? 'Proficient' : scorePercent >= 60 ? 'Developing' : 'Review Required'}
              </div>
              <div className="text-[11px] text-slate-400">Accredited diagnostic standard</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Assessment
            </button>

            <button
              onClick={() => switchQuiz(activeQuizId === 'quiz-bohr-effect' ? 'quiz-quantum-fundamentals' : 'quiz-bohr-effect')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Next Recommended Diagnostic
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
