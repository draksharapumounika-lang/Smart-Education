import React, { useState } from 'react';
import { BohrEffectSimulation } from './simulations/BohrEffectSimulation';
import { OrbitalMechanicsSimulation } from './simulations/OrbitalMechanicsSimulation';
import { NeuralBoundarySimulation } from './simulations/NeuralBoundarySimulation';
import { Activity, Compass, Brain, Layers } from 'lucide-react';

interface SimulationLabProps {
  initialSimulationId?: string;
}

export const SimulationLab: React.FC<SimulationLabProps> = ({ initialSimulationId }) => {
  const [activeSim, setActiveSim] = useState<string>(() => {
    if (initialSimulationId === 'sim-orbital-mechanics') return 'orbital';
    if (initialSimulationId === 'sim-neural-boundary') return 'neural';
    return 'bohr';
  });

  return (
    <div className="space-y-6">
      {/* Simulation Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Interactive STEM Laboratory Sandboxes
          </h2>
          <p className="text-xs text-slate-500">
            Experiment with mathematical parameters and observe immediate real-time physiological & physical simulations.
          </p>
        </div>

        {/* Tab Switcher (Segmented buttons - Allowed by Frontend Design Constitution) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveSim('bohr')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSim === 'bohr'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            Biophysics: Bohr Effect
          </button>

          <button
            onClick={() => setActiveSim('orbital')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSim === 'orbital'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-sky-500" />
            Astrophysics: Keplerian Orbits
          </button>

          <button
            onClick={() => setActiveSim('neural')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSim === 'neural'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-500" />
            Applied AI: Neural Manifolds
          </button>
        </div>
      </div>

      {/* Render Active Simulation Component */}
      {activeSim === 'bohr' && <BohrEffectSimulation />}
      {activeSim === 'orbital' && <OrbitalMechanicsSimulation />}
      {activeSim === 'neural' && <NeuralBoundarySimulation />}
    </div>
  );
};
