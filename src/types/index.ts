export type CourseCategory = 
  | 'All'
  | 'Computer Science & AI'
  | 'Biomedical & Life Sciences'
  | 'Astrophysics & Physics'
  | 'Applied Mathematics'
  | 'Clean Energy & Engineering';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lectures: {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'lab' | 'reading' | 'quiz';
    completed?: boolean;
  }[];
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  institution: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  duration: string;
  totalLectures: number;
  rating: number;
  ratingCount: number;
  enrolledCount: number;
  description: string;
  coverImage: string;
  prerequisites: string[];
  skills: string[];
  syllabus: CourseModule[];
  hasSimulation: boolean;
  simulationId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  conceptTag: string;
}

export interface Quiz {
  id: string;
  title: string;
  discipline: string;
  estimatedTime: string;
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  topic: string;
  prompt: string;
  answer: string;
  formula?: string;
  mastered: boolean;
}

export interface StudyTask {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  completed: boolean;
}

export interface UserStats {
  scholarName: string;
  degreeTrack: string;
  studentId: string;
  studyStreakDays: number;
  hoursLearned: number;
  completedLabs: number;
  gpa: number;
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  quizScores: Record<string, number>;
}
