import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Info, Zap, Activity } from 'lucide-react';

interface SimulationPreset {
  name: string;
  pH: number;
  pCO2: number;
  temperature: number;
  bpg: number;
  description: string;
  stageName: string;
}

const PRESETS: Record<string, SimulationPreset> = {
  resting: {
    name: 'Resting Normal',
    pH: 7.40,
    pCO2: 40,
    temperature: 37.0,
    bpg: 5.0,
    stageName: 'Stage 1: Homeostatic Baseline',
    description: 'Arterial blood at rest. Normal physiological pH and gas partial pressures maintain standard hemoglobin affinity.',
  },
  exercise: {
    name: 'Heavy Muscle Exercise',
    pH: 7.15,
    pCO2: 60,
    temperature: 39.5,
    bpg: 6.5,
    stageName: 'Stage 2: Active Tissue Acidosis',
    description: 'Vigorous metabolic workload creates lactic acid and carbon dioxide. Rightward curve shift unloads O2 directly into working myocytes.',
  },
  alkalosis: {
    name: 'Hyperventilation / Alkalosis',
    pH: 7.65,
    pCO2: 24,
    temperature: 36.5,
    bpg: 4.2,
    stageName: 'Stage 3: Respiratory Alkalosis',
    description: 'Rapid blowing off of CO2 elevates pH. Leftward curve shift locks oxygen onto hemoglobin, impairing peripheral release.',
  },
  altitude: {
    name: 'High Altitude Hypoxia',
    pH: 7.48,
    pCO2: 30,
    temperature: 36.8,
    bpg: 7.8,
    stageName: 'Stage 4: Erythrocyte Compensation',
    description: 'Lower ambient atmospheric PO2 prompts elevated 2,3-BPG synthesis over 48 hours to restore tissue delivery.',
  },
};

export const BohrEffectSimulation: React.FC = () => {
  const [pH, setPH] = useState<number>(7.40);
  const [pCO2, setPCO2] = useState<number>(40);
  const [temperature, setTemperature] = useState<number>(37.0);
  const [bpg, setBpg] = useState<number>(5.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [selectedPreset, setSelectedPreset] = useState<string>('resting');
  const [tissuePO2, setTissuePO2] = useState<number>(30); // mmHg in peripheral capillaries

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; bound: boolean; id: number }>>([]);

  // Calculate P50 shift based on physiology
  // Standard P50 = 26.6 mmHg at pH 7.40, pCO2 40, 37C, BPG 5.0
  const deltaPH = pH - 7.40;
  const deltaPCO2 = pCO2 - 40;
  const deltaTemp = temperature - 37.0;
  const deltaBPG = bpg - 5.0;

  // Empirical Bohr shift formula
  const calculatedP50 = Math.max(12, Math.min(55, 
    26.6 * Math.pow(10, (-0.48 * deltaPH) + (0.0013 * deltaPCO2) + (0.024 * deltaTemp) + (0.03 * deltaBPG))
  ));

  // Hill Equation saturation function: S(pO2) = (pO2^n) / (P50^n + pO2^n) * 100
  const hillN = 2.8;
  const getSaturation = (pO2: number, p50Val: number) => {
    const num = Math.pow(pO2, hillN);
    const denom = Math.pow(p50Val, hillN) + num;
    return (num / denom) * 100;
  };

  const arterialSaturation = getSaturation(100, calculatedP50); // Lung PO2 = 100 mmHg
  const venousSaturation = getSaturation(tissuePO2, calculatedP50); // Capillary PO2
  const o2DeliveredPercent = Math.max(0, arterialSaturation - venousSaturation);

  // Determine affinity state status text
  const affinityShift = calculatedP50 > 28 ? 'Right-Shifted (Enhanced Delivery)' : calculatedP50 < 25 ? 'Left-Shifted (High Storage Affinity)' : 'Nominal Equilibrium';
  const affinityBadgeColor = calculatedP50 > 28 ? 'text-amber-600 bg-amber-50 border-amber-200' : calculatedP50 < 25 ? 'text-sky-600 bg-sky-50 border-sky-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  const applyPreset = (key: string) => {
    setSelectedPreset(key);
    const p = PRESETS[key];
    setPH(p.pH);
    setPCO2(p.pCO2);
    setTemperature(p.temperature);
    setBpg(p.bpg);
  };

  const resetToStandard = () => {
    applyPreset('resting');
  };

  // Initialize and animate particle capillary simulation
  useEffect(() => {
    // Generate initial O2 molecules
    if (particlesRef.current.length === 0) {
      const parts = [];
      for (let i = 0; i < 48; i++) {
        parts.push({
          x: Math.random() * 400,
          y: 20 + Math.random() * 120,
          vx: 0.8 + Math.random() * 0.8,
          bound: Math.random() < (venousSaturation / 100),
          id: i,
        });
      }
      particlesRef.current = parts;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw Capillary Vessel Wall
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Top Endothelial Wall
      ctx.fillStyle = '#fecdd3';
      ctx.fillRect(0, 0, w, 18);
      ctx.fillStyle = '#fda4af';
      for (let x = 10; x < w; x += 40) {
        ctx.beginPath();
        ctx.arc(x, 9, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bottom Endothelial Wall
      ctx.fillStyle = '#fecdd3';
      ctx.fillRect(0, h - 18, w, 18);
      ctx.fillStyle = '#fda4af';
      for (let x = 25; x < w; x += 40) {
        ctx.beginPath();
        ctx.arc(x, h - 9, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Capillary lumen blood plasma background
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.12)'); // Arterial input
      grad.addColorStop(1, 'rgba(59, 130, 246, 0.12)'); // Venous output
      ctx.fillStyle = grad;
      ctx.fillRect(0, 18, w, h - 36);

      // Draw flowing Red Blood Cells (RBCs)
      const rbcCount = 4;
      for (let i = 0; i < rbcCount; i++) {
        const t = (time * 0.04 * speed + i * (w / rbcCount)) % (w + 80) - 40;
        const cy = h / 2 + Math.sin(time * 0.002 + i) * 16;
        
        ctx.save();
        ctx.translate(t, cy);
        
        // RBC biconcave disc
        ctx.fillStyle = calculatedP50 > 28 ? '#dc2626' : '#b91c1c';
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 18, 0.08, 0, Math.PI * 2);
        ctx.fill();

        // RBC dimple
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 8, 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Hemoglobin binding site indicators (4 subunits)
        const subSat = venousSaturation / 100;
        const sites = [
          { x: -10, y: -4 },
          { x: 10, y: -4 },
          { x: -8, y: 5 },
          { x: 8, y: 5 },
        ];
        sites.forEach((site, sIdx) => {
          ctx.beginPath();
          ctx.arc(site.x, site.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = sIdx / 4 < subSat ? '#38bdf8' : '#64748b'; // Cyan for bound O2, slate for empty
          ctx.fill();
        });

        ctx.restore();
      }

      // Update and draw oxygen particles
      if (isPlaying) {
        particlesRef.current.forEach((p) => {
          p.x += p.vx * speed * 45 * dt;
          if (p.x > w + 20) {
            p.x = -10;
            p.y = 25 + Math.random() * (h - 50);
          }
          // Dissociation probability based on current P50
          const progressAlongCapillary = Math.max(0, Math.min(1, p.x / w));
          const localPO2 = 100 - progressAlongCapillary * (100 - tissuePO2);
          const localSat = getSaturation(localPO2, calculatedP50);
          p.bound = Math.random() * 100 < localSat;
        });
      }

      // Render Oxygen molecules (O2)
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.bound ? 2.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.bound ? 'rgba(56, 189, 248, 0.85)' : '#0284c7';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = p.bound ? 2 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Overlay Flow Direction Markers
      ctx.fillStyle = '#475569';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('Arterial Inflow (pO₂ ≈ 100 mmHg)', 12, 34);
      ctx.fillText(`Venous Effluent (pO₂ ≈ ${tissuePO2} mmHg)`, w - 195, 34);

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed, calculatedP50, tissuePO2, venousSaturation]);

  // SVG Dissociation Curve generation
  const curvePoints: string[] = [];
  const normalPoints: string[] = [];
  const graphWidth = 320;
  const graphHeight = 160;

  for (let po2 = 0; po2 <= 100; po2 += 2) {
    const x = (po2 / 100) * graphWidth;
    const currentSat = getSaturation(po2, calculatedP50);
    const standardSat = getSaturation(po2, 26.6);

    const y = graphHeight - (currentSat / 100) * graphHeight;
    const standardY = graphHeight - (standardSat / 100) * graphHeight;

    curvePoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    normalPoints.push(`${x.toFixed(1)},${standardY.toFixed(1)}`);
  }

  const p50X = (calculatedP50 / 100) * graphWidth;
  const p50Y = graphHeight - 0.5 * graphHeight;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Simulation Stage Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Interactive Biophysics Laboratory
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            The Bohr Effect: Allosteric Oxygen Affinity & Capillary Gas Exchange
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time mathematical model of hemoglobin quaternary transitions governed by pH, CO₂, temperature, and 2,3-BPG.
          </p>
        </div>

        {/* Guided Stage Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg text-xs font-medium">
          {Object.entries(PRESETS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                selectedPreset === key
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Zone Sandbox Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Interactive Visual Stage (7 cols) */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-6">
          {/* Microvascular Stage Canvas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                Live Microvascular Capillary Bed (Erythrocyte Flow & O₂ Dissociation)
              </span>
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${affinityBadgeColor}`}>
                {affinityShift}
              </span>
            </div>
            
            <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-900 shadow-inner">
              <canvas
                ref={canvasRef}
                width={560}
                height={160}
                className="w-full h-40 block"
              />
              <div className="absolute bottom-2 left-3 text-[11px] text-slate-600 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-sky-400"></span>
                <span>Cyan: Oxygen (O₂) bound to heme</span>
                <span className="inline-block w-2 h-2 rounded-full bg-slate-400 ml-2"></span>
                <span>Grey: Deoxy-heme (T-State)</span>
              </div>
            </div>
          </div>

          {/* Mathematical Dissociation Curve Chart */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Oxygen-Hemoglobin Dissociation Curve (Hill Equation)
                </h4>
                <div className="text-[11px] text-slate-500 font-mono">
                  S(pO₂) = [pO₂]^2.8 / (P₅₀^2.8 + [pO₂]^2.8)
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-500">Active P₅₀</div>
                <div className="text-sm font-bold font-mono text-indigo-600 tabular-numbers">
                  {calculatedP50.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">mmHg</span>
                </div>
              </div>
            </div>

            {/* SVG Graph */}
            <div className="relative h-44 w-full">
              <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1={graphHeight * 0.25} x2={graphWidth} y2={graphHeight * 0.25} stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="0" y1={graphHeight * 0.50} x2={graphWidth} y2={graphHeight * 0.50} stroke="#cbd5e1" strokeDasharray="4,4" />
                <line x1="0" y1={graphHeight * 0.75} x2={graphWidth} y2={graphHeight * 0.75} stroke="#e2e8f0" strokeDasharray="3,3" />
                
                {/* Vertical marker for P50 = 50% saturation line */}
                <line x1="0" y1={graphHeight * 0.5} x2={graphWidth} y2={graphHeight * 0.5} stroke="#94a3b8" strokeWidth="0.8" />
                
                {/* Normal Baseline Curve (Reference) */}
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                  points={normalPoints.join(' ')}
                />

                {/* Active Dynamic Curve */}
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  points={curvePoints.join(' ')}
                />

                {/* Current P50 marker dot and line */}
                <line x1={p50X} y1={graphHeight} x2={p50X} y2={p50Y} stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx={p50X} cy={p50Y} r="4.5" fill="#dc2626" />
              </svg>

              {/* Chart Coordinate Annotations */}
              <div className="absolute top-1 left-2 text-[10px] text-slate-400 font-mono">100% Sat</div>
              <div className="absolute top-[45%] left-2 text-[10px] text-slate-500 font-mono font-medium">50% Sat (P₅₀)</div>
              <div className="absolute bottom-0 right-2 text-[10px] text-slate-400 font-mono">pO₂ = 100 mmHg</div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 justify-end">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400"></span>
                Standard Baseline (P₅₀ = 26.6)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-600"></span>
                Current Condition Curve
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Active P₅₀ Point
              </span>
            </div>
          </div>

          {/* Real-time Physiological Readout Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[11px] text-slate-500 font-medium">Arterial Saturation</div>
              <div className="text-lg font-bold font-mono text-slate-900 tabular-numbers">
                {arterialSaturation.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500">at pO₂ 100 mmHg (Lungs)</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[11px] text-slate-500 font-medium">Venous Saturation</div>
              <div className="text-lg font-bold font-mono text-slate-900 tabular-numbers">
                {venousSaturation.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500">at pO₂ {tissuePO2} mmHg (Tissue)</div>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg">
              <div className="text-[11px] text-indigo-700 font-medium">O₂ Delivered to Tissues</div>
              <div className="text-lg font-bold font-mono text-indigo-900 tabular-numbers">
                +{o2DeliveredPercent.toFixed(1)}%
              </div>
              <div className="text-[10px] text-indigo-600">Net release yield</div>
            </div>
          </div>
        </div>

        {/* Right Parameter Deck & Interactive Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6 bg-slate-50/30">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
                Physiological Parameter Sliders
              </h4>
              <button
                onClick={resetToStandard}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Baseline
              </button>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-4">
              {/* pH Level */}
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-xs">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    Blood pH Level
                    <span className="text-[11px] text-slate-400 font-normal">(Proton Concentration)</span>
                  </label>
                  <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                    pH < 7.35 ? 'bg-red-50 text-red-700' : pH > 7.45 ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {pH.toFixed(2)} {pH < 7.35 ? '(Acidosis)' : pH > 7.45 ? '(Alkalosis)' : '(Nominal)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="6.90"
                  max="7.80"
                  step="0.01"
                  value={pH}
                  onChange={(e) => setPH(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>6.90 (Acidic)</span>
                  <span>7.40</span>
                  <span>7.80 (Alkaline)</span>
                </div>
              </div>

              {/* pCO2 */}
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-xs">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    Carbon Dioxide Partial Pressure (pCO₂)
                  </label>
                  <span className="font-mono font-bold text-xs text-indigo-700">
                    {pCO2} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="80"
                  step="1"
                  value={pCO2}
                  onChange={(e) => setPCO2(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>18 mmHg (Hypocapnia)</span>
                  <span>40</span>
                  <span>80 mmHg (Hypercapnia)</span>
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-xs">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    Body Core Temperature
                  </label>
                  <span className="font-mono font-bold text-xs text-indigo-700">
                    {temperature.toFixed(1)} °C
                  </span>
                </div>
                <input
                  type="range"
                  min="34.0"
                  max="42.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>34.0 °C (Hypothermia)</span>
                  <span>37.0 °C</span>
                  <span>42.0 °C (Pyrexia)</span>
                </div>
              </div>

              {/* 2,3-BPG Concentration */}
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-xs">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-semibold text-slate-800">
                    2,3-BPG Effector Concentration
                  </label>
                  <span className="font-mono font-bold text-xs text-indigo-700">
                    {bpg.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">mmol/L</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="9.0"
                  step="0.1"
                  value={bpg}
                  onChange={(e) => setBpg(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>2.0 mmol/L (Stored blood)</span>
                  <span>5.0</span>
                  <span>9.0 (High altitude)</span>
                </div>
              </div>

              {/* Peripheral Tissue Capillary PO2 */}
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-xs">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-semibold text-slate-800">
                    Peripheral Tissue Target pO₂
                  </label>
                  <span className="font-mono font-bold text-xs text-indigo-700">
                    {tissuePO2} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="1"
                  value={tissuePO2}
                  onChange={(e) => setTissuePO2(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>15 mmHg (Strenuous exercise)</span>
                  <span>40 (Rest)</span>
                  <span>60 (Well-oxygenated)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step Controls & Playback */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isPlaying
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pause Simulation' : 'Resume Flow'}
                </button>

                <button
                  onClick={() => setSpeed(speed === 1 ? 2 : 1)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  {speed}x Velocity
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Active Hemoglobin Mode
              </div>
            </div>

            {/* Contextual Concept Callout */}
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-indigo-900">Biochemical Mechanism: </span>
                {PRESETS[selectedPreset]?.description || 'Adjust parameters to view real-time shifts in hemoglobin allosteric equilibrium.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
