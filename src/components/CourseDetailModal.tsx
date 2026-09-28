import React from 'react';
import { X, CheckCircle2, PlayCircle, FlaskConical, Clock, BookOpen, User, GraduationCap } from 'lucide-react';
import { Course } from '../types';

interface CourseDetailModalProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
  onOpenSimulation: (simId: string) => void;
  onClose: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isEnrolled,
  onEnroll,
  onOpenSimulation,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header Cover */}
        <div className="relative h-48 md:h-56 w-full overflow-hidden bg-slate-900">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="text-xs text-sky-400 font-medium mb-1 flex items-center gap-2">
              <span>{course.institution}</span>
              <span>·</span>
              <span>{course.category}</span>
              <span>·</span>
              <span>{course.level}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-300 shadow-xs"
              />
              <div>
                <div className="font-semibold text-xs text-slate-900">{course.instructor.name}</div>
                <div className="text-[11px] text-slate-500">{course.instructor.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {course.hasSimulation && course.simulationId && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSimulation(course.simulationId!);
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5 transition-colors"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  Launch Interactive Lab
                </button>
              )}

              <button
                onClick={() => onEnroll(course.id)}
                className={`px-5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 ${
                  isEnrolled
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                {isEnrolled ? 'Enrolled (Resume Course)' : 'Enroll in Curriculum'}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Academic Abstract & Overview
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Prerequisites & Competencies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-bold text-slate-800 mb-2">Recommended Prerequisites</div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {course.prerequisites.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-bold text-slate-800 mb-2">Validated Competencies</div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {course.skills.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Syllabus Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Curriculum Modules & Laboratory Schedule
            </h4>
            <div className="space-y-3">
              {course.syllabus.map((mod) => (
                <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{mod.title}</span>
                    <span className="text-slate-500 font-mono">{mod.duration}</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {mod.lectures.map((lec) => (
                      <div key={lec.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50 text-xs">
                        <div className="flex items-center gap-2.5">
                          {lec.type === 'lab' ? (
                            <FlaskConical className="w-4 h-4 text-sky-600" />
                          ) : lec.type === 'quiz' ? (
                            <BookOpen className="w-4 h-4 text-amber-600" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-slate-800">{lec.title}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px]">{lec.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {course.totalLectures} modules · Accredited university-level credentialing
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-600 hover:text-slate-900 font-medium"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
