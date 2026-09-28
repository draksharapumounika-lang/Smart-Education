import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Check, Trash2, Calendar, Clock, BookOpen, Calculator } from 'lucide-react';
import { INITIAL_STUDY_TASKS } from '../data/quizzesData';
import { StudyTask } from '../types';

export const StudyHubPlanner: React.FC = () => {
  // Pomodoro State
  const [sessionType, setSessionType] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeSound, setActiveSound] = useState<'none' | 'whitenoise' | 'binaural'>('none');

  // Web Audio Context reference for ambient focus sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Task List State
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_STUDY_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskCourse, setNewTaskCourse] = useState<string>('Molecular Biophysics');
  const [newTaskHours, setNewTaskHours] = useState<number>(1.5);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);

  // GPA Calculator State
  const [gpaCourses, setGpaCourses] = useState([
    { name: 'Quantum Information Systems', credits: 4, grade: 4.0 },
    { name: 'Molecular Biophysics Lab', credits: 3, grade: 3.7 },
    { name: 'Orbital Astrodynamics', credits: 4, grade: 4.0 },
    { name: 'Numerical Analysis & PDE', credits: 3, grade: 3.3 },
  ]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      // Switch cycle
      if (sessionType === 'focus') {
        setSessionType('shortBreak');
        setTimeLeft(5 * 60);
      } else {
        setSessionType('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, sessionType]);

  const selectSessionMode = (type: 'focus' | 'shortBreak' | 'longBreak') => {
    setSessionType(type);
    setIsTimerRunning(false);
    if (type === 'focus') setTimeLeft(25 * 60);
    else if (type === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const toggleSound = (sound: 'none' | 'whitenoise' | 'binaural') => {
    if (activeSound === sound) {
      stopAudio();
      setActiveSound('none');
      setSoundEnabled(false);
      return;
    }

    stopAudio();
    setActiveSound(sound);
    setSoundEnabled(true);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (sound === 'whitenoise') {
        // Generate Pink/Brownish subtle noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.1;
          b2 = 0.85 * b2 + white * 0.15;
          data[i] = (b0 + b1 + b2) * 0.08;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        const gain = ctx.createGain();
        gain.gain.value = 0.12;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        noiseNodeRef.current = noise;
      } else if (sound === 'binaural') {
        // Gentle 432 Hz grounding tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(216, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        noiseNodeRef.current = osc;
      }
    } catch (e) {
      console.warn('AudioContext unavailable');
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const formatMinutesSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      course: newTaskCourse,
      dueDate: 'This Week',
      priority: 'Medium',
      estimatedHours: newTaskHours,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  // Calculate predicted GPA
  const totalCredits = gpaCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalPoints = gpaCourses.reduce((sum, c) => sum + c.credits * c.grade, 0);
  const calculatedGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '4.00';

  return (
    <div className="space-y-8">
      {/* Top Banner: Pomodoro & Ambient Focus */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Timer (6 cols) */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Intelligent Study Rhythm
              </span>

              {/* Mode Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => selectSessionMode('focus')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    sessionType === 'focus' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  Focus (25m)
                </button>
                <button
                  onClick={() => selectSessionMode('shortBreak')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    sessionType === 'shortBreak' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  Short Break (5m)
                </button>
                <button
                  onClick={() => selectSessionMode('longBreak')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    sessionType === 'longBreak' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                  }`}
                >
                  Long Break (15m)
                </button>
              </div>
            </div>

            {/* Timer Display */}
            <div className="my-6 text-center">
              <div className="text-5xl md:text-6xl font-bold font-mono text-slate-900 tracking-tight tabular-numbers">
                {formatMinutesSeconds(timeLeft)}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {sessionType === 'focus' ? 'Uninterrupted deep comprehension block' : 'Brain recovery interval'}
              </p>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors ${
                isTimerRunning
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'Pause Session' : 'Start Focus Clock'}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                selectSessionMode(sessionType);
              }}
              className="px-3.5 py-2.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Right Ambient Soundscapes & Focus Tools (6 cols) */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-slate-50/40">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              Synthesized Acoustic Study Soundscape
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Real-time Web Audio noise masking to isolate attention and eliminate acoustic distractions.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => toggleSound('whitenoise')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  activeSound === 'whitenoise'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="font-semibold text-xs mb-0.5">Atmospheric Pink Noise</div>
                <div className="text-[11px] text-slate-500">Low-frequency brownian filter</div>
              </button>

              <button
                onClick={() => toggleSound('binaural')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  activeSound === 'binaural'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="font-semibold text-xs mb-0.5">432 Hz Alpha Harmonic</div>
                <div className="text-[11px] text-slate-500">Subtle meditative sine oscillation</div>
              </button>
            </div>

            {soundEnabled && (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active acoustic focus stream playing
                </span>
                <button
                  onClick={() => toggleSound(activeSound)}
                  className="text-xs text-emerald-900 font-semibold underline hover:text-emerald-950"
                >
                  Mute
                </button>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 mt-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              Today's Recommended Focus: <strong className="text-slate-900">Module 2 Problem Sets</strong>
            </span>
            <span className="font-mono text-indigo-600 font-semibold">2.5 hrs remaining</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Assignment Tasks & GPA Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Assignment Task Tracker (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Active Academic Assignments & Lab Deliverables
              </h3>
              <p className="text-xs text-slate-500">
                Track deliverables, lab milestones, and reading problem sets across enrolled tracks.
              </p>
            </div>

            <button
              onClick={() => setShowAddTaskModal(!showAddTaskModal)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>

          {/* Quick Add Form Drawer */}
          {showAddTaskModal && (
            <form onSubmit={handleAddNewTask} className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-800">Create Academic Task</div>
              <div>
                <input
                  type="text"
                  placeholder="Task title (e.g. Derive Keplerian semi-minor axis equation)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <select
                  value={newTaskCourse}
                  onChange={(e) => setNewTaskCourse(e.target.value)}
                  className="p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Molecular Biophysics">Molecular Biophysics</option>
                  <option value="Quantum Computing Principles">Quantum Computing</option>
                  <option value="Astrophysics Dynamics">Astrophysics Dynamics</option>
                </select>

                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="12"
                  value={newTaskHours}
                  onChange={(e) => setNewTaskHours(parseFloat(e.target.value))}
                  placeholder="Estimated Hours"
                  className="p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Task
                </button>
              </div>
            </form>
          )}

          {/* Task Items */}
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed ? 'bg-slate-50/60 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-indigo-600'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <div className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{task.course}</span>
                      <span>·</span>
                      <span>Due {task.dueDate}</span>
                      <span>·</span>
                      <span className="font-mono">{task.estimatedHours} hrs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      task.priority === 'High'
                        ? 'text-rose-700 bg-rose-50 border-rose-200'
                        : task.priority === 'Medium'
                        ? 'text-amber-700 bg-amber-50 border-amber-200'
                        : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPA & Credit Predictor (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                Weighted GPA & Credit Matrix
              </h3>
              <span className="text-xs font-bold font-mono text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded border border-indigo-200 tabular-numbers">
                Projected: {calculatedGPA} / 4.00
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Adjust forecasted grades to see the impact on your academic honor standing.
            </p>

            <div className="space-y-3">
              {gpaCourses.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 truncate">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.credits} Credit Units</div>
                  </div>

                  <select
                    value={c.grade}
                    onChange={(e) => {
                      const newGrade = parseFloat(e.target.value);
                      const updated = [...gpaCourses];
                      updated[i].grade = newGrade;
                      setGpaCourses(updated);
                    }}
                    className="p-1.5 rounded-md border border-slate-300 bg-white font-mono font-semibold text-slate-900 text-xs"
                  >
                    <option value={4.0}>A (4.0)</option>
                    <option value={3.7}>A- (3.7)</option>
                    <option value={3.3}>B+ (3.3)</option>
                    <option value={3.0}>B (3.0)</option>
                    <option value={2.7}>B- (2.7)</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs text-indigo-900 flex items-center justify-between">
            <span>Dean's Honors Threshold: <strong>3.85 GPA</strong></span>
            <span className="font-semibold font-mono text-emerald-600">
              {parseFloat(calculatedGPA) >= 3.85 ? 'Eligible' : 'Near Target'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
