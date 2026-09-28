import React, { useState } from 'react';
import { Search, Menu, X, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  scholarName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  scholarName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'courses', label: 'Explore Courses' },
    { id: 'labs', label: 'Interactive Labs' },
    { id: 'quizzes', label: 'Smart Quizzes' },
    { id: 'flashcards', label: 'Flashcard Vault' },
    { id: 'studyhub', label: 'Study Hub' },
    { id: 'dashboard', label: 'Scholar Portal' },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('courses');
          }}
          className="text-xl font-bold tracking-tight text-slate-900 font-serif-display select-none"
        >
          EduSmart
        </a>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Search curriculum (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search topics...</span>
            <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-400">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => handleTabClick('dashboard')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-xs ${
              currentTab === 'dashboard'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{scholarName.split(' ')[0]}'s Portal</span>
            <span className="md:hidden">Portal</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg mb-3"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search curriculums & simulations...</span>
          </button>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleTabClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === link.id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
