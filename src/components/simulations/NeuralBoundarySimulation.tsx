import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Brain, Layers } from 'lucide-react';

export const NeuralBoundarySimulation: React.FC = () => {
  const [learningRate, setLearningRate] = useState<number>(0.05);
  const [hiddenNeurons, setHiddenNeurons] = useState<number>(4);
  const [activationFn, setActivationFn] = useState<'relu' | 'tanh' | 'sigmoid'>('tanh');
  const [datasetType, setDatasetType] = useState<'circles' | 'xor' | 'spiral'>('xor');
  const [epoch, setEpoch] = useState<number>(0);
  const [loss, setLoss] = useState<number>(0.68);
  const [isTraining, setIsTraining] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate synthetic classification points
  const pointsRef = useRef<Array<{ x: number; y: number; label: number }>>([]);

  const generateData = (type: 'circles' | 'xor' | 'spiral') => {
    const pts = [];
    const count = 60;
    if (type === 'xor') {
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 2;
        const y = (Math.random() - 0.5) * 2;
        const label = (x * y > 0) ? 1 : 0;
        pts.push({ x, y, label });
      }
    } else if (type === 'circles') {
      for (let i = 0; i < count; i++) {
        const r = Math.random();
        const theta = Math.random() * Math.PI * 2;
        if (r < 0.5) {
          pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 1 });
        } else {
          pts.push({ x: (0.6 + r * 0.4) * Math.cos(theta), y: (0.6 + r * 0.4) * Math.sin(theta), label: 0 });
        }
      }
    } else {
      // Spiral
      for (let i = 0; i < count; i++) {
        const t = (i / count) * 4;
        const x1 = (t / 4) * Math.sin(t) + (Math.random() - 0.5) * 0.1;
        const y1 = (t / 4) * Math.cos(t) + (Math.random() - 0.5) * 0.1;
        pts.push({ x: x1, y: y1, label: 1 });

        const x2 = -(t / 4) * Math.sin(t) + (Math.random() - 0.5) * 0.1;
        const y2 = -(t / 4) * Math.cos(t) + (Math.random() - 0.5) * 0.1;
        pts.push({ x: x2, y: y2, label: 0 });
      }
    }
    pointsRef.current = pts;
    setEpoch(0);
    setLoss(0.72);
  };

  useEffect(() => {
    generateData(datasetType);
  }, [datasetType]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTraining) {
      timer = setInterval(() => {
        setEpoch((prev) => prev + 1);
        setLoss((prev) => Math.max(0.04, prev - learningRate * 0.08 * (Math.random() * 0.5 + 0.5)));
      }, 120);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTraining, learningRate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Render decision boundary background grid
    const gridSize = 30;
    const cellW = w / gridSize;
    const cellH = h / gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const nx = (i / gridSize) * 2 - 1;
        const ny = (j / gridSize) * 2 - 1;

        // Approximate decision surface based on simulated epochs
        const convergenceFactor = Math.min(1, epoch / 60);
        let pred = 0;

        if (datasetType === 'xor') {
          const raw = nx * ny;
          pred = 0.5 + (raw * 2.5 * convergenceFactor);
        } else if (datasetType === 'circles') {
          const dist = Math.hypot(nx, ny);
          pred = 0.5 + ((0.5 - dist) * 3 * convergenceFactor);
        } else {
          pred = 0.5 + Math.sin(nx * 3 + ny * 3) * 0.5 * convergenceFactor;
        }

        const clamped = Math.max(0, Math.min(1, pred));
        // Interpolate color: Blue (Class 0) to Orange/Red (Class 1)
        if (clamped > 0.5) {
          ctx.fillStyle = `rgba(239, 68, 68, ${(clamped - 0.5) * 0.7})`;
        } else {
          ctx.fillStyle = `rgba(59, 130, 246, ${(0.5 - clamped) * 0.7})`;
        }
        ctx.fillRect(i * cellW, j * cellH, cellW + 1, cellH + 1);
      }
    }

    // Draw coordinate axes
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Render Data Points
    pointsRef.current.forEach((pt) => {
      const cx = (pt.x + 1) * 0.5 * w;
      const cy = (pt.y + 1) * 0.5 * h;

      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = pt.label === 1 ? '#ef4444' : '#3b82f6';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    });
  }, [epoch, datasetType, hiddenNeurons, activationFn]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-600">
            Interactive Computational Mathematics
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Neural Decision Manifolds & Non-Linear Activation
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize how gradient descent warps the 2D feature plane to separate non-linear distributions.
          </p>
        </div>

        <button
          onClick={() => generateData(datasetType)}
          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Re-seed Manifold
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Canvas */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4">
          <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-white shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={420}
              height={320}
              className="w-full max-w-[420px] h-80 block"
            />
            <div className="absolute bottom-2 left-3 text-[11px] text-slate-600 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Class A
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block ml-2"></span> Class B
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 font-medium">Training Epochs</div>
              <div className="text-sm font-bold font-mono text-slate-900 tabular-numbers">{epoch}</div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 font-medium">Binary Cross-Entropy Loss</div>
              <div className="text-sm font-bold font-mono text-indigo-600 tabular-numbers">{loss.toFixed(4)}</div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 font-medium">Layer Neurons</div>
              <div className="text-sm font-bold font-mono text-slate-900">{hiddenNeurons} hidden</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6 bg-slate-50/40">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Architecture Hyperparameters
            </h4>

            {/* Dataset Type */}
            <div className="bg-white p-3.5 border border-slate-200 rounded-lg">
              <label className="text-xs font-semibold text-slate-800 block mb-1.5">
                Dataset Topology
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['xor', 'circles', 'spiral'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDatasetType(t)}
                    className={`py-1.5 text-xs font-medium rounded-md uppercase transition-colors ${
                      datasetType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Rate */}
            <div className="bg-white p-3.5 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-800">Learning Rate (η)</label>
                <span className="font-mono font-bold text-xs text-indigo-700">{learningRate}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Hidden Neurons */}
            <div className="bg-white p-3.5 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-800">Hidden Layer Capacity</label>
                <span className="font-mono font-bold text-xs text-indigo-700">{hiddenNeurons} units</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={hiddenNeurons}
                onChange={(e) => setHiddenNeurons(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Activation Function */}
            <div className="bg-white p-3.5 border border-slate-200 rounded-lg">
              <label className="text-xs font-semibold text-slate-800 block mb-1.5">
                Non-Linear Activation Function
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['tanh', 'relu', 'sigmoid'] as const).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setActivationFn(fn)}
                    className={`py-1.5 text-xs font-medium rounded-md uppercase transition-colors ${
                      activationFn === fn ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {fn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => setIsTraining(!isTraining)}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isTraining ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isTraining ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isTraining ? 'Pause Backpropagation' : 'Resume Gradient Descent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
