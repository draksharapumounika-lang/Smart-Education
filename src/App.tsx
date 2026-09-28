import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CourseCatalog } from './components/CourseCatalog';
import { SimulationLab } from './components/SimulationLab';
import { SmartQuizEngine } from './components/SmartQuizEngine';
import { StudyHubPlanner } from './components/StudyHubPlanner';
import { FlashcardsDeck } from './components/FlashcardsDeck';
import { StudentDashboard } from './components/StudentDashboard';
import { CourseDetailModal } from './components/CourseDetailModal';
import { CertificateModal } from './components/CertificateModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { Footer } from './components/Footer';

import { INITIAL_USER_STATS } from './data/quizzesData';
import { Course, UserStats } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [certificateCourseTitle, setCertificateCourseTitle] = useState<string | undefined>(undefined);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [activeSimulationId, setActiveSimulationId] = useState<string>('sim-bohr-effect');
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);

  // Enroll handler
  const handleEnrollCourse = (courseId: string) => {
    setUserStats((prev) => {
      if (prev.enrolledCourseIds.includes(courseId)) return prev;
      return {
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
      };
    });
  };

  // Launch simulation from anywhere
  const handleOpenSimulation = (simId: string) => {
    setActiveSimulationId(simId);
    setCurrentTab('labs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open certificate modal
  const handleOpenCertificate = (courseTitle?: string) => {
    setCertificateCourseTitle(courseTitle);
    setShowCertificateModal(true);
  };

  // Switch to quiz
  const handleOpenQuiz = (quizId: string) => {
    setCurrentTab('quizzes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setShowSearchModal(true)}
        scholarName={userStats.scholarName}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Render Hero Section when on Explore Courses tab */}
        {currentTab === 'courses' && (
          <HeroSection
            onExploreCourses={() => {
              const catalogEl = document.getElementById('curriculum-catalog');
              catalogEl?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenLab={() => handleOpenSimulation('sim-bohr-effect')}
            onOpenQuizzes={() => setCurrentTab('quizzes')}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {/* Tab 1: Course Catalog */}
          {currentTab === 'courses' && (
            <div id="curriculum-catalog" className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-serif-display text-slate-900">
                    Comprehensive Academic Curriculums
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Peer-reviewed higher education syllabus units featuring integrated laboratory sandboxes and capstone evaluations.
                  </p>
                </div>
              </div>

              <CourseCatalog
                onSelectCourse={(course) => setSelectedCourse(course)}
                onOpenSimulation={handleOpenSimulation}
                enrolledCourseIds={userStats.enrolledCourseIds}
              />
            </div>
          )}

          {/* Tab 2: Interactive Simulation Lab */}
          {currentTab === 'labs' && (
            <SimulationLab initialSimulationId={activeSimulationId} />
          )}

          {/* Tab 3: Smart Diagnostic Quizzes */}
          {currentTab === 'quizzes' && (
            <SmartQuizEngine />
          )}

          {/* Tab 4: Spaced Repetition Flashcards */}
          {currentTab === 'flashcards' && (
            <FlashcardsDeck />
          )}

          {/* Tab 5: Study Hub & Focus Planner */}
          {currentTab === 'studyhub' && (
            <StudyHubPlanner />
          )}

          {/* Tab 6: Scholar Dashboard & Credentials */}
          {currentTab === 'dashboard' && (
            <StudentDashboard
              stats={userStats}
              onOpenCourse={(course) => setSelectedCourse(course)}
              onOpenCertificate={handleOpenCertificate}
              onOpenSimulation={handleOpenSimulation}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          isEnrolled={userStats.enrolledCourseIds.includes(selectedCourse.id)}
          onEnroll={handleEnrollCourse}
          onOpenSimulation={handleOpenSimulation}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {showCertificateModal && (
        <CertificateModal
          stats={userStats}
          courseTitle={certificateCourseTitle}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      <QuickSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectCourse={(c) => setSelectedCourse(c)}
        onOpenSimulation={handleOpenSimulation}
        onOpenQuiz={handleOpenQuiz}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
