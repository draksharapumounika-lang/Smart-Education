import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Compass, Sun, ShieldCheck } from 'lucide-react';

export const OrbitalMechanicsSimulation: React.FC = () => {
  const [semiMajorAxis, setSemiMajorAxis] = useState<number>(140); // pixels
  const [eccentricity, setEccentricity] = useState<number>(0.55); // 0 to 0.85
  const [starMass, setStarMass] = useState<number>(1.0); // solar masses
  const [showTrails, setShowTrails] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);
  const trailPointsRef = useRef<Array<{ x: number; y: number }>>([]);

  // Keplerian Orbital calculations
  const semiMinorAxis = semiMajorAxis * Math.sqrt(Math.max(0.01, 1 - eccentricity * eccentricity));
  const focalDistance = semiMajorAxis * eccentricity;
  const perihelionDist = semiMajorAxis * (1 - eccentricity);
  const aphelionDist = semiMajorAxis * (1 + eccentricity);
  
  // Kepler's 3rd Law period: T ~ a^(3/2) / sqrt(M)
  const orbitalPeriod = Math.sqrt(Math.pow(semiMajorAxis / 100, 3) / starMass) * 3.14;

  const resetOrbit = () => {
    setSemiMajorAxis(140);
    setEccentricity(0.55);
    setStarMass(1.0);
    angleRef.current = 0;
    trailPointsRef.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Deep space background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // Subtle background stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 73 + 19) % w);
        const sy = ((i * 97 + 31) % h);
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Star is at focus F1 = (cx + focalDistance, cy) or center shifted
      const starX = cx - focalDistance;
      const starY = cy;

      // Draw Orbit Trajectory Ellipse
      ctx.beginPath();
      ctx.ellipse(cx, cy, semiMajorAxis, semiMinorAxis, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Major and Minor Axis Gridlines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(cx - semiMajorAxis, cy);
      ctx.lineTo(cx + semiMajorAxis, cy);
      ctx.moveTo(cx, cy - semiMinorAxis);
      ctx.lineTo(cx, cy + semiMinorAxis);
      ctx.stroke();
      ctx.setLineDash([]);

      // Second focus marker (empty)
      const f2X = cx + focalDistance;
      ctx.beginPath();
      ctx.arc(f2X, cy, 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.stroke();

      // Current planet position calculation via eccentric anomaly
      const M = angleRef.current;
      // Approximate true position on ellipse:
      const px = cx + semiMajorAxis * Math.cos(M);
      const py = cy + semiMinorAxis * Math.sin(M);

      // Distance from star to planet
      const r = Math.hypot(px - starX, py - starY);

      // Vis-Viva Equation: v^2 = G*M*(2/r - 1/a)
      const v = Math.sqrt(Math.max(0.1, starMass * 1800 * (2 / Math.max(10, r) - 1 / semiMajorAxis)));

      // Step angle forward with variable orbital speed (Kepler's Second Law)
      if (isPlaying) {
        const angularVelocity = (v / Math.max(20, r)) * simSpeed;
        angleRef.current = (angleRef.current + angularVelocity * dt * 2.5) % (Math.PI * 2);

        if (showTrails) {
          trailPointsRef.current.push({ x: px, y: py });
          if (trailPointsRef.current.length > 50) {
            trailPointsRef.current.shift();
          }
        }
      }

      // Draw planet orbit trail
      if (showTrails && trailPointsRef.current.length > 1) {
        ctx.beginPath();
        trailPointsRef.current.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw radius vector from central star to planet
      ctx.beginPath();
      ctx.moveTo(starX, starY);
      ctx.lineTo(px, py);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Central Star (Sun)
      const starRadius = 14 * Math.cbrt(starMass);
      const starGrad = ctx.createRadialGradient(starX, starY, 2, starX, starY, starRadius * 2);
      starGrad.addColorStop(0, '#fef08a');
      starGrad.addColorStop(0.4, '#eab308');
      starGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = starGrad;
      ctx.beginPath();
      ctx.arc(starX, starY, starRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(starX, starY, starRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      // Draw Planet
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Velocity and Gravitational Force Vectors
      if (showVectors) {
        // Gravitational force vector toward star
        const fgAngle = Math.atan2(starY - py, starX - px);
        const fgLength = Math.min(45, (starMass * 1400) / (r * 0.8));
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(fgAngle) * fgLength, py + Math.sin(fgAngle) * fgLength);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Velocity vector tangent to orbit
        const vx = -semiMajorAxis * Math.sin(M);
        const vy = semiMinorAxis * Math.cos(M);
        const vMag = Math.hypot(vx, vy);
        const vNormX = (vx / vMag) * Math.min(50, v * 1.4);
        const vNormY = (vy / vMag) * Math.min(50, v * 1.4);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + vNormX, py + vNormY);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Annotations for Perihelion and Aphelion
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('Perihelion (Max Speed)', cx - semiMajorAxis - 10, cy - 12);
      ctx.fillText('Aphelion (Min Speed)', cx + semiMajorAxis - 100, cy - 12);

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, semiMajorAxis, eccentricity, starMass, showTrails, showVectors, simSpeed]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Interactive Astrophysics & Classical Mechanics
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Keplerian Orbits & Conservation of Angular Momentum
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate 2-body gravitational dynamics governed by Newton's law of universal gravitation and Kepler's laws.
          </p>
        </div>

        <button
          onClick={resetOrbit}
          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Standard Orbit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Canvas Area */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-4">
          <div className="relative border border-slate-800 rounded-lg overflow-hidden shadow-inner bg-slate-950">
            <canvas
              ref={canvasRef}
              width={560}
              height={320}
              className="w-full h-80 block"
            />
            <div className="absolute top-3 left-3 flex items-center gap-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-700 text-[11px] text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span> Velocity Vector (v)
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-0.5 bg-rose-400 inline-block"></span> Gravitational Pull (Fg)
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 font-medium">Perihelion Distance</div>
              <div className="text-sm font-bold font-mono text-slate-900">
                {perihelionDist.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">AU</span>
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 font-medium">Aphelion Distance</div>
              <div className="text-sm font-bold font-mono text-slate-900">
                {aphelionDist.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">AU</span>
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 font-medium">Calculated Period (T)</div>
              <div className="text-sm font-bold font-mono text-indigo-700">
                {orbitalPeriod.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">Earth Yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Deck */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6 bg-slate-50/40">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Orbital Parameters & Stellar Mass
            </h4>

            {/* Eccentricity Slider */}
            <div className="bg-white p-3.5 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-800">
                  Orbital Eccentricity (e)
                </label>
                <span className="font-mono font-bold text-xs text-indigo-700">
                  {eccentricity.toFixed(2)} {eccentricity === 0 ? '(Circular)' : eccentricity > 0.6 ? '(Highly Elliptical)' : '(Mildly Elliptical)'}
                </span>
              </div>
              <input
                type="range"
                min="0.00"
                max="0.82"
                step="0.02"
                value={eccentricity}
                onChange={(e) => setEccentricity(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0.00 (Circle)</span>
                <span>0.40</span>
                <span>0.82 (Extreme)</span>
              </div>
            </div>

            {/* Semi-Major Axis */}
            <div className="bg-white p-3.5 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-800">
                  Semi-Major Axis (a)
                </label>
                <span className="font-mono font-bold text-xs text-indigo-700">
                  {(semiMajorAxis / 100).toFixed(2)} AU
                </span>
              </div>
              <input
                type="range"
                min="90"
                max="200"
                step="5"
                value={semiMajorAxis}
                onChange={(e) => setSemiMajorAxis(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0.90 AU</span>
                <span>1.40 AU</span>
                <span>2.00 AU</span>
              </div>
            </div>

            {/* Central Star Mass */}
            <div className="bg-white p-3.5 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Primary Star Mass (M☉)
                </label>
                <span className="font-mono font-bold text-xs text-indigo-700">
                  {starMass.toFixed(2)} M☉
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={starMass}
                onChange={(e) => setStarMass(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0.50 M☉ (Red Dwarf)</span>
                <span>1.00 M☉ (Sol)</span>
                <span>2.50 M☉ (High Mass)</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Show Force Vectors
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTrails}
                  onChange={(e) => setShowTrails(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                Show Orbital Particle Trail
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isPlaying ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause Motion' : 'Start Motion'}
              </button>
              <button
                onClick={() => setSimSpeed(simSpeed === 1.2 ? 2.5 : 1.2)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                {simSpeed > 2 ? 'High Velocity (2.5x)' : 'Standard Pace (1.2x)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
