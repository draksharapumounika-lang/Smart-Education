import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, FlaskConical, HelpCircle, ArrowRight } from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';
import { QUIZZES_DATA } from '../data/quizzesData';
import { Course } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (course: Course) => void;
  onOpenSimulation: (simId: string) => void;
  onOpenQuiz: (quizId: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  onOpenSimulation,
  onOpenQuiz,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCourses = query.trim()
    ? COURSES_DATA.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      )
    : COURSES_DATA.slice(0, 3);

  const filteredQuizzes = query.trim()
    ? QUIZZES_DATA.filter((q) =>
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.discipline.toLowerCase().includes(query.toLowerCase())
      )
    : QUIZZES_DATA;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search all courses, simulations, theorems, formulas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-6">
          {/* Courses */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Curriculums & Degree Modules
            </div>
            <div className="space-y-1.5">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCourse(c);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {c.category} · {c.level}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-1">No courses matching query</div>
              )}
            </div>
          </div>

          {/* Simulations */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Interactive Laboratories
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  onOpenSimulation('sim-bohr-effect');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <FlaskConical className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-rose-600">
                      The Bohr Effect & Hemoglobin Allostery Simulator
                    </div>
                    <div className="text-[11px] text-slate-500">Biomedical Biophysics</div>
                  </div>
                </div>
                <span className="text-[11px] text-sky-600 font-medium">Launch</span>
              </button>

              <button
                onClick={() => {
                  onOpenSimulation('sim-orbital-mechanics');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <FlaskConical className="w-4 h-4 text-sky-500 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-600">
                      Keplerian Planetary Dynamics & Multi-Body Orbits
                    </div>
                    <div className="text-[11px] text-slate-500">Astrophysics Mechanics</div>
                  </div>
                </div>
                <span className="text-[11px] text-sky-600 font-medium">Launch</span>
              </button>
            </div>
          </div>

          {/* Quizzes */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Diagnostic Mastery Quizzes
            </div>
            <div className="space-y-1.5">
              {filteredQuizzes.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    onOpenQuiz(q.id);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-amber-600">
                        {q.title}
                      </div>
                      <div className="text-[11px] text-slate-500">{q.discipline} · {q.questions.length} questions</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{q.estimatedTime}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded font-mono">ESC</kbd> to exit</span>
          <span>EduSmart Knowledge Network</span>
        </div>
      </div>
    </div>
  );
};
