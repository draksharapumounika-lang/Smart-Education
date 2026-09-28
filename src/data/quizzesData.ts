import { Quiz, Flashcard, StudyTask, UserStats } from '../types';

export const QUIZZES_DATA: Quiz[] = [
  {
    id: 'quiz-bohr-effect',
    title: 'Biophysical Gas Exchange & Hemoglobin Regulation',
    discipline: 'Biomedical & Life Sciences',
    estimatedTime: '8 mins',
    questions: [
      {
        id: 'q-b1',
        question: 'Under vigorous physical exercise, which of the following physiological shifts triggers the Bohr effect in capillary beds?',
        options: [
          'Decreased pH (acidosis) and increased pCO2, shifting the O2 dissociation curve to the right.',
          'Increased pH (alkalosis) and decreased pCO2, shifting the O2 dissociation curve to the left.',
          'Decreased temperature and lowered 2,3-BPG concentration, locking hemoglobin into the R-state.',
          'Increased arterial PO2 causing complete denaturation of alpha-globin subunits.'
        ],
        correctIndex: 0,
        explanation: 'Active tissues generate lactic acid and CO2, driving protons that bind histidine residues in hemoglobin. This stabilizes the low-affinity T (tense) state, shifting the oxygen-hemoglobin dissociation curve to the right and unloading O2 into starving tissues.',
        hint: 'Think about what hardworking muscles produce: lactic acid and carbon dioxide.',
        conceptTag: 'Bohr Effect & Allostery',
      },
      {
        id: 'q-b2',
        question: 'What is the value of P50 for human maternal hemoglobin under normal physiological conditions (pH 7.4, 37°C)?',
        options: [
          'Approximately 12 - 15 mmHg',
          'Approximately 26.6 mmHg',
          'Approximately 50.0 mmHg',
          'Approximately 98.5 mmHg'
        ],
        correctIndex: 1,
        explanation: 'Standard P50 (the partial pressure of O2 at which hemoglobin is 50% saturated) is approximately 26.6 to 27 mmHg. Fetal hemoglobin (HbF) has a lower P50 (~19 mmHg), giving it higher affinity to extract oxygen from maternal blood.',
        hint: 'P50 is the partial pressure at 50% saturation; standard adult reference is mid-20s.',
        conceptTag: 'P50 Reference Values',
      },
      {
        id: 'q-b3',
        question: 'How does 2,3-Bisphosphoglycerate (2,3-BPG) interact with the hemoglobin tetramer?',
        options: [
          'It covalently binds to the iron atom inside the protoporphyrin IX ring.',
          'It binds within the central positively charged cavity of deoxygenated hemoglobin, stabilizing the T-state.',
          'It activates carbonic anhydrase to catalyze bicarbonate formation directly.',
          'It breaks the disulfide bonds between beta chains to accelerate oxygen uptake.'
        ],
        correctIndex: 1,
        explanation: '2,3-BPG is an allosteric effector that nests precisely in the central pocket of deoxyhemoglobin (T-state) between the two beta chains, cross-linking positively charged amino acid side chains and decreasing oxygen affinity.',
        hint: 'Look for the central cavity in deoxygenated quaternary structure.',
        conceptTag: 'Allosteric Regulation',
      }
    ]
  },
  {
    id: 'quiz-quantum-fundamentals',
    title: 'Quantum Mechanics & Superposition Logic',
    discipline: 'Computer Science & AI',
    estimatedTime: '10 mins',
    questions: [
      {
        id: 'q-q1',
        question: 'Applying a Hadamard gate (H) to a standard computational basis state |0⟩ produces which pure quantum state?',
        options: [
          '|1⟩',
          '(|0⟩ + |1⟩) / √2',
          '(|0⟩ - |1⟩) / √2',
          'i |0⟩'
        ],
        correctIndex: 1,
        explanation: 'The Hadamard transformation creates an equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2 (known as state |+⟩) on the equator of the Bloch sphere.',
        hint: 'Hadamard maps basis states to symmetric superposition.',
        conceptTag: 'Single Qubit Gates',
      },
      {
        id: 'q-q2',
        question: 'What is the fundamental consequence of the No-Cloning Theorem in quantum information theory?',
        options: [
          'Quantum states can be copied instantaneously across space without entanglement.',
          'It is impossible to create an identical copy of an arbitrary unknown quantum state.',
          'Entangled pairs must always decay into classical bits within 1 microsecond.',
          'Quantum computers can never simulate Shor algorithm factoring.'
        ],
        correctIndex: 1,
        explanation: 'Formally proven by Wootters, Zurek, and Dieks in 1982: unitary time-evolution cannot duplicate an arbitrary unknown state |ψ⟩ without measuring and collapsing it.',
        hint: 'Arbitrary quantum states cannot be duplicated non-destructively.',
        conceptTag: 'Quantum Information Limits',
      },
      {
        id: 'q-q3',
        question: 'Which quantum gate operates as a conditional reversible NOT controlled by another qubit?',
        options: [
          'Pauli-Z Gate',
          'CNOT (Controlled-NOT / CX Gate)',
          'Phase Shift Gate (S)',
          'Toffoli Gate'
        ],
        correctIndex: 1,
        explanation: 'The CNOT gate flips the target qubit if and only if the control qubit is in state |1⟩, forming the primary building block for generating maximally entangled Bell states.',
        hint: 'A two-qubit gate with one control and one target.',
        conceptTag: 'Entanglement Synthesis',
      }
    ]
  },
  {
    id: 'quiz-orbital-physics',
    title: 'Keplerian Orbits & Celestial Dynamics',
    discipline: 'Astrophysics & Physics',
    estimatedTime: '7 mins',
    questions: [
      {
        id: 'q-o1',
        question: 'According to Kepler\'s Second Law (Law of Equal Areas), at which point in an elliptical orbit does a planet travel at its highest orbital velocity?',
        options: [
          'Aphelion (furthest point from the sun)',
          'Perihelion (closest point to the sun)',
          'Semi-minor axis midpoint',
          'At the second empty focal point'
        ],
        correctIndex: 1,
        explanation: 'To sweep out equal areas in equal intervals of time, conservation of angular momentum requires the velocity to peak at perihelion (minimum radius r) where gravitational potential energy is converted to kinetic energy.',
        hint: 'Closest distance to the gravitational center yields maximum kinetic speed.',
        conceptTag: 'Keplerian Mechanics',
      },
      {
        id: 'q-o2',
        question: 'What orbital maneuver provides the most fuel-efficient two-impulse transfer between two coplanar circular orbits?',
        options: [
          'Bi-elliptic transfer',
          'Hohmann transfer orbit',
          'Direct hyperbolic insertion',
          'Continuous low-thrust spiral'
        ],
        correctIndex: 1,
        explanation: 'The Hohmann transfer orbit is an elliptical trajectory tangent to both the initial and target circular orbits, requiring two delta-v burns at opposite apsides.',
        hint: 'Named after Walter Hohmann in 1925.',
        conceptTag: 'Orbital Transfers',
      }
    ]
  }
];

export const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'fc-1',
    topic: 'Biophysics',
    prompt: 'What equation models the sigmoidal oxygen-binding curve of hemoglobin?',
    answer: 'The Hill Equation: θ = [L]^n / (Kd + [L]^n), where n is the Hill coefficient (≈ 2.8 for adult hemoglobin, indicating strong positive cooperativity).',
    formula: 'θ = [pO₂]^n / (P₅₀^n + [pO₂]^n)',
    mastered: false,
  },
  {
    id: 'fc-2',
    topic: 'Quantum Physics',
    prompt: 'How is a general single-qubit pure state represented on the Bloch Sphere?',
    answer: '|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, where θ represents polar angle (0 ≤ θ ≤ π) and φ is the azimuthal phase (0 ≤ φ < 2π).',
    formula: '|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩',
    mastered: true,
  },
  {
    id: 'fc-3',
    topic: 'Astrophysics',
    prompt: 'State Kepler\'s Third Law relating orbital period (T) and semi-major axis (a).',
    answer: 'The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit.',
    formula: 'T² = (4π² / G(M₁ + M₂)) · a³',
    mastered: false,
  },
  {
    id: 'fc-4',
    topic: 'Machine Learning',
    prompt: 'What is the mathematical formulation of the Softmax activation function?',
    answer: 'Softmax converts a vector of K real numbers into a probability distribution over K possible outcomes, ensuring all outputs sum to 1.0.',
    formula: 'σ(z)ᵢ = e^(zᵢ) / ∑ⱼ e^(zⱼ)',
    mastered: true,
  },
  {
    id: 'fc-5',
    topic: 'Thermodynamics',
    prompt: 'What is the maximum theoretical efficiency (Carnot efficiency) of a heat engine?',
    answer: 'η_max = 1 - (T_cold / T_hot), where temperatures are strictly expressed in absolute Kelvin units.',
    formula: 'η = 1 - (T_C / T_H)',
    mastered: false,
  },
  {
    id: 'fc-6',
    topic: 'Quantum Physics',
    prompt: 'State the Bell state |Φ+⟩ expression in computational basis.',
    answer: 'One of four maximally entangled two-qubit states generated by applying H to qubit 0 then CNOT(0, 1).',
    formula: '|Φ⁺⟩ = (|00⟩ + |11⟩) / √2',
    mastered: false,
  },
];

export const INITIAL_STUDY_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Complete Lab Simulation: Blood pH & Gas Saturation Analysis',
    course: 'Molecular Biophysics',
    dueDate: 'Tomorrow, 11:59 PM',
    priority: 'High',
    estimatedHours: 1.5,
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Review Problem Set 4: Bell Inequalities & Quantum Teleportation',
    course: 'Quantum Computing Principles',
    dueDate: 'Thursday, 5:00 PM',
    priority: 'High',
    estimatedHours: 2.5,
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Calculate Hohmann Delta-V Transfer for Mars Insertion Window',
    course: 'Astrophysics Dynamics',
    dueDate: 'Friday, 12:00 PM',
    priority: 'Medium',
    estimatedHours: 1.0,
    completed: true,
  },
  {
    id: 'task-4',
    title: 'Review 15 Spaced-Repetition Flashcards on Allosteric Kinetics',
    course: 'Molecular Biophysics',
    dueDate: 'Today, 8:00 PM',
    priority: 'Low',
    estimatedHours: 0.5,
    completed: false,
  }
];

export const INITIAL_USER_STATS: UserStats = {
  scholarName: 'Alexandria Vance',
  degreeTrack: 'Computational Biophysics & Space Systems',
  studentId: 'EDU-94821',
  studyStreakDays: 14,
  hoursLearned: 68.5,
  completedLabs: 12,
  gpa: 3.92,
  enrolledCourseIds: ['course-quantum-01', 'course-bio-01', 'course-astro-01'],
  completedCourseIds: ['course-astro-01'],
  quizScores: {
    'quiz-bohr-effect': 100,
    'quiz-quantum-fundamentals': 85,
  }
};
