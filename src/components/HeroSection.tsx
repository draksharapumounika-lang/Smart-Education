import React from 'react';
import { ArrowRight, FlaskConical, Award, Sparkles, BookOpen, Compass } from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onOpenLab: () => void;
  onOpenQuizzes: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onOpenLab,
  onOpenQuizzes,
}) => {
  return (
    <div className="relative overflow-hidden bg-white border-b border-slate-200">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-50/80 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-50/60 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Subtle editorial kicker (Clean unboxed text, no pill) */}
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Accredited Higher Education & Active STEM Sandboxes</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15] max-w-2xl font-serif-display text-balance">
              Empowering Curious Minds Through Visual Scientific Experimentation
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              EduSmart combines rigorous academic curriculums with live mathematical simulations, allosteric biophysics laboratories, and mastery diagnostics.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCourses}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm hover:shadow"
              >
                <span>Browse Curriculums</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLab}
                className="px-6 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs sm:text-sm border border-indigo-200 transition-all flex items-center gap-2"
              >
                <FlaskConical className="w-4 h-4 text-indigo-600" />
                <span>Launch Interactive Lab</span>
              </button>
            </div>

            {/* Claim-to-Proof Adjacency: Quantitative Rigor (Anti-pill unboxed figures) */}
            <div className="pt-8 border-t border-slate-100 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl font-bold font-mono text-slate-900 tabular-numbers">
                  48,500+
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Active University Scholars
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold font-mono text-indigo-600 tabular-numbers">
                  94.2%
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Laboratory Mastery Rate
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold font-mono text-slate-900 tabular-numbers">
                  340+
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Interactive STEM Simulations
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Hero Visual (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 aspect-16/11 group">
              <img
                src="/src/assets/images/hero_edusmart_campus_1790583658875.jpg"
                alt="EduSmart Smart Education Campus and Interactive Research Laboratory"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {/* Floating Contextual Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-xl border border-white/40 shadow-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Live Computational Sandboxes</div>
                    <div className="text-[11px] text-slate-500">Biophysics · Quantum · Orbital Mechanics</div>
                  </div>
                </div>

                <button
                  onClick={onOpenLab}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800 transition-colors"
                >
                  Enter Sandbox
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
