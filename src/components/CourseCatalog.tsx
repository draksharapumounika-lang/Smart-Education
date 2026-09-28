import React, { useState } from 'react';
import { Search, SlidersHorizontal, Star, Users, Clock, FlaskConical, ArrowRight } from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';
import { Course, CourseCategory, CourseLevel } from '../types';

interface CourseCatalogProps {
  onSelectCourse: (course: Course) => void;
  onOpenSimulation: (simId: string) => void;
  enrolledCourseIds: string[];
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  onSelectCourse,
  onOpenSimulation,
  enrolledCourseIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'duration'>('rating');

  const categories: CourseCategory[] = [
    'All',
    'Computer Science & AI',
    'Biomedical & Life Sciences',
    'Astrophysics & Physics',
    'Applied Mathematics',
    'Clean Energy & Engineering',
  ];

  // Filtering & Sorting
  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesLevel && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.enrolledCount - a.enrolledCount;
    return b.totalLectures - a.totalLectures;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, theorem, skill, or discipline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Level Filter & Sort Selectors */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none"
              >
                <option value="All">All Tiers</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Enrolled</option>
                <option value="duration">Curriculum Depth</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Zero-Pill: functional segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {filteredCourses.length} accredited university-grade curriculums</span>
        {searchQuery && (
          <span>Filtering by keyword "{searchQuery}"</span>
        )}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);

          return (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Course Cover Image */}
                <div
                  onClick={() => onSelectCourse(course)}
                  className="relative h-44 overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 text-[11px] text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10 font-mono">
                    {course.institution}
                  </div>

                  {course.hasSimulation && (
                    <div className="absolute top-3 right-3 text-[11px] text-sky-200 bg-sky-950/70 backdrop-blur-xs px-2 py-0.5 rounded border border-sky-400/30 flex items-center gap-1">
                      <FlaskConical className="w-3 h-3 text-sky-400" />
                      Interactive Lab
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 flex items-center justify-between">
                    <span className="font-medium text-white">{course.level}</span>
                    <span className="font-mono">{course.duration}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5">
                  <h3
                    onClick={() => onSelectCourse(course)}
                    className="font-bold text-base text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2 mb-2 leading-snug"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  {/* Clean unboxed metadata with typographic separators (anti-pill) */}
                  <div className="text-xs text-slate-500 flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {course.rating.toFixed(2)}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {course.enrolledCount.toLocaleString()} scholars
                    </span>
                    <span>·</span>
                    <span>{course.totalLectures} lectures</span>
                  </div>

                  {/* Instructor Bio snippet */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {course.instructor.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {course.instructor.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectCourse(course)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {isEnrolled ? 'Resume Syllabus' : 'View Syllabus'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {course.hasSimulation && course.simulationId && (
                  <button
                    onClick={() => onOpenSimulation(course.simulationId!)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 flex items-center gap-1"
                  >
                    <FlaskConical className="w-3 h-3" />
                    Launch Lab
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
