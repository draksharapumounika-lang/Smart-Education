import React, { useState } from 'react';
import { Mail, Check, ShieldCheck, Globe, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xl font-bold tracking-tight text-white font-serif-display">
              EduSmart
            </span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier open-access smart education portal combining accredited university-level curricula with interactive visual STEM simulation laboratories and active-recall diagnostics.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ISO 21001 Educational Standard
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" />
                Global Higher Learning Consortium
              </span>
            </div>
          </div>

          {/* Academic Disciplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Quantum Information & Computing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Biomedical & Cellular Biophysics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Astrodynamics & Relativity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Neural Architectures & Optimization</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Thermodynamic Energy Systems</a></li>
            </ul>
          </div>

          {/* Interactive Laboratories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Laboratory Sandboxes
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">The Bohr Effect Chamber</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Keplerian Orbit Dynamics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Neural Decision Boundary Visualizer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Spaced Repetition Flashcard Engine</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Weighted GPA & Credit Calculator</a></li>
            </ul>
          </div>

          {/* Research Bulletins Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Academic Bulletins
            </h4>
            <p className="text-xs text-slate-400">
              Receive weekly updates on new interactive simulation releases and university course partnerships.
            </p>

            {subscribed ? (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Subscribed to weekly academic dispatch.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="scholar@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Join Scholar Network
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quiet Bottom Copyright & Accreditations (anti-slop clean) */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EduSmart Higher Education Platform. All scientific models peer-reviewed.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Governance</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Academic Integrity Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Accreditation Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
