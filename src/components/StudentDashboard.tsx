import React, { useState } from 'react';
import { Award, BookOpen, Clock, Flame, GraduationCap, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { Course, UserStats } from '../types';
import { COURSES_DATA } from '../data/coursesData';

interface StudentDashboardProps {
  stats: UserStats;
  onOpenCourse: (course: Course) => void;
  onOpenCertificate: (courseTitle?: string) => void;
  onOpenSimulation: (simId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  stats,
  onOpenCourse,
  onOpenCertificate,
  onOpenSimulation,
}) => {
  const [scholarName, setScholarName] = useState(stats.scholarName);
  const [isEditingName, setIsEditingName] = useState(false);

  const enrolledCourses = COURSES_DATA.filter((c) =>
    stats.enrolledCourseIds.includes(c.id)
  );

  return (
    <div className="space-y-8">
      {/* Scholar Profile Hero Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold font-serif-display shadow-md">
              {scholarName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    className="text-lg font-bold text-slate-900 border-b border-indigo-500 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <h2
                    onClick={() => setIsEditingName(true)}
                    className="text-xl md:text-2xl font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors"
                    title="Click to edit name"
                  >
                    {scholarName}
                  </h2>
                )}
                <span className="text-xs text-slate-400 font-mono">({stats.studentId})</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {stats.degreeTrack}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenCertificate()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              View Earned Credentials
            </button>
          </div>
        </div>

        {/* Quantitative Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Study Streak
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-numbers">
              {stats.studyStreakDays} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <div className="text-[10px] text-emerald-600 mt-1">● Active continuity</div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              Hours Logged
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-numbers">
              {stats.hoursLearned} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Across laboratory modules</div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              Completed Labs
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-numbers">
              {stats.completedLabs} <span className="text-xs font-normal text-slate-400">labs</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">100% verified simulation runs</div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
              Cumulative GPA
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-numbers">
              {stats.gpa.toFixed(2)}
            </div>
            <div className="text-[10px] text-emerald-600 mt-1">Summa Cum Laude standing</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses & Real-Time Progress */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Active Enrolled Curriculums
            </h3>
            <p className="text-xs text-slate-500">
              Track course modules, submit laboratory exercises, and unlock certification benchmarks.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {enrolledCourses.length} Registered Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course, idx) => {
            const isCompleted = stats.completedCourseIds.includes(course.id);
            const progress = isCompleted ? 100 : idx === 0 ? 65 : 35;

            return (
              <div
                key={course.id}
                className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between bg-white"
              >
                <div>
                  <div className="relative h-36 overflow-hidden bg-slate-900">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                    <div className="absolute bottom-2 left-3 right-3 text-xs text-white font-medium truncate">
                      {course.institution}
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-sm text-slate-900 line-clamp-2 mb-2">
                      {course.title}
                    </h4>

                    {/* Clean unboxed metadata */}
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                      <span>{course.category}</span>
                      <span>·</span>
                      <span>{course.level}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Syllabus Progress</span>
                        <span className="font-mono font-bold text-slate-900">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                  {isCompleted ? (
                    <button
                      onClick={() => onOpenCertificate(course.title)}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certificate Ready
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenCourse(course)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      Resume Learning <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {course.hasSimulation && course.simulationId && (
                    <button
                      onClick={() => onOpenSimulation(course.simulationId!)}
                      className="text-sky-600 hover:text-sky-800 font-medium"
                    >
                      Open Lab
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
