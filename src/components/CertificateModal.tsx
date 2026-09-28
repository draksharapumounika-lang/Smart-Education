import React from 'react';
import { X, Printer, ShieldCheck, Award } from 'lucide-react';
import { UserStats } from '../types';

interface CertificateModalProps {
  stats: UserStats;
  courseTitle?: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  stats,
  courseTitle = 'Keplerian Astrodynamics & Orbital Mechanics',
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Certificate Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <ShieldCheck className="w-4 h-4" />
            Verifiable Digital Credential (ID: EDU-CERT-884920)
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Diploma Style) */}
        <div className="p-8 md:p-12 text-center bg-[#fdfbf7] border-8 border-double border-[#e5dfd3] m-4 rounded-xl relative shadow-sm">
          {/* Watermark / Seal */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-indigo-700/40 p-2 flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-dashed border-indigo-600 flex items-center justify-center text-indigo-800">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
            EduSmart Global Consortium of Higher Learning
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif-display text-slate-900 mb-2">
            Certificate of Academic Excellence
          </h2>
          <p className="text-xs text-slate-500 italic mb-6">
            This credential is officially conferred to
          </p>

          <div className="text-2xl md:text-3xl font-bold text-indigo-950 font-serif-display pb-2 border-b-2 border-indigo-950/20 max-w-md mx-auto mb-4">
            {stats.scholarName}
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            in formal recognition of outstanding laboratory performance and conceptual mastery in the accredited curriculum
          </p>

          <div className="text-base md:text-lg font-bold text-slate-900 mb-6 px-4 py-2 bg-indigo-50/50 rounded-lg inline-block border border-indigo-100">
            {courseTitle}
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200 text-left">
            <div>
              <div className="font-serif italic text-sm text-slate-800 font-medium">Dr. Marcus Vance</div>
              <div className="text-[11px] text-slate-500">Academic Dean, Faculty of Sciences</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Signed: 2026-09-28</div>
            </div>

            <div className="text-right">
              <div className="font-mono text-xs font-bold text-emerald-700">VERIFIED ON-CHAIN</div>
              <div className="text-[11px] text-slate-500">Registry Token #849-B2</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Grade Honor: Summa Cum Laude</div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Accredited by the International STEM Consortium
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:text-slate-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
