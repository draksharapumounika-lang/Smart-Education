import React, { useState } from 'react';
import { RotateCw, CheckCircle2, ChevronLeft, ChevronRight, Shuffle, BookmarkCheck } from 'lucide-react';
import { FLASHCARDS_DATA } from '../data/quizzesData';
import { Flashcard } from '../types';

export const FlashcardsDeck: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS_DATA);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const topics = ['All', ...Array.from(new Set(cards.map((c) => c.topic)))];

  const filteredCards = selectedTopic === 'All'
    ? cards
    : cards.filter((c) => c.topic === selectedTopic);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[safeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (safeIndex < filteredCards.length - 1) {
      setCurrentIndex(safeIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const toggleMastered = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mastered: !c.mastered } : c))
    );
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const masteredCount = filteredCards.filter((c) => c.mastered).length;
  const progressPercent = filteredCards.length > 0 ? Math.round((masteredCount / filteredCards.length) * 100) : 0;

  if (!currentCard) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
        No flashcards found for this topic.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Active Recall & Spaced Repetition
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Formulas, Theorems & Biochemical Key Concepts
          </h3>
        </div>

        {/* Topic Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg text-xs font-medium">
          {topics.map((top) => (
            <button
              key={top}
              onClick={() => {
                setSelectedTopic(top);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                selectedTopic === top
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {top}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* Progress & Deck Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <span>Card {safeIndex + 1} of {filteredCards.length}</span>
            <span>·</span>
            <span className="font-semibold text-slate-700">{currentCard.topic}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-emerald-600 font-semibold">
              {masteredCount}/{filteredCards.length} Mastered ({progressPercent}%)
            </span>
            <button
              onClick={handleShuffle}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Shuffle
            </button>
          </div>
        </div>

        {/* 3D Flip Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer min-h-[260px] rounded-2xl border-2 border-indigo-100 bg-gradient-to-b from-white to-slate-50 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
        >
          {/* Card Top Indicator */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">
              {isFlipped ? 'SOLUTION & EXPLANATION' : 'INQUIRY / PROMPT'}
            </span>
            <span className="text-xs text-indigo-500 flex items-center gap-1 group-hover:underline">
              <RotateCw className="w-3.5 h-3.5" />
              Click to Flip
            </span>
          </div>

          {/* Card Body */}
          <div className="my-auto py-6">
            {!isFlipped ? (
              <h4 className="text-lg md:text-xl font-bold text-slate-900 text-center leading-relaxed">
                {currentCard.prompt}
              </h4>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
                  {currentCard.answer}
                </p>
                {currentCard.formula && (
                  <div className="inline-block px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg font-mono text-xs md:text-sm text-indigo-900 font-semibold">
                    {currentCard.formula}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Footer Status */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-400 italic">
              {isFlipped ? 'Press space or click to view prompt' : 'Press space or click to reveal answer'}
            </span>

            {currentCard.mastered && (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Mastered
              </span>
            )}
          </div>
        </div>

        {/* Navigation & Mastery Controls */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1 text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={() => toggleMastered(currentCard.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentCard.mastered
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            {currentCard.mastered ? 'Marked as Mastered' : 'Mark as Mastered'}
          </button>

          <button
            onClick={handleNext}
            className="p-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1 text-xs font-semibold transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
