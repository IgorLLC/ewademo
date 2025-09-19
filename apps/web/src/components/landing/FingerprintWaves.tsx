import React, { useEffect, useRef } from 'react';
import { contours } from 'd3-contour';
import { scaleLinear } from 'd3-scale';
import { createNoise3D } from 'simplex-noise';

interface FingerprintWavesProps {
  width?: number;
  height?: number;
  className?: string;
  /** Hex or rgba string for main line color */
  colorA?: string;
  /** Secondary color for subtle layered lines */
  colorB?: string;
  /** Number of contour thresholds (rings). Higher => tighter lines */
  thresholds?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Stroke width for front layer */
  strokeMain?: number;
  /** Stroke width for back layer */
  strokeSub?: number;
}

const FingerprintWaves: React.FC<FingerprintWavesProps> = ({
  width = 1600,
  height = 900,
  className,
  colorA = '#2EC2E7',
  colorB = '#7EE6FF',
  thresholds = 38,
  speed = 0.25,
  strokeMain = 4,
  strokeSub = 3,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    let isActive = true;
    const ctxWidth = width;
    const ctxHeight = height;
    const mulberry32 = (seed: number) => {
      let a = seed >>> 0;
      return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };
    const hashString = (str: string) => {
      let h = 0;
      for (let i = 0; i < str.length; i += 1) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
      return h >>> 0;
    };
    const noise3D = createNoise3D(mulberry32(hashString('ewa-fingerprint')));

    const gridX = 220; // grid resolution; balanced for perf
    const gridY = Math.round(gridX * (ctxHeight / ctxWidth));
    const values = new Float32Array(gridX * gridY);

    const xScale = scaleLinear().domain([0, gridX - 1]).range([0, ctxWidth]);
    const yScale = scaleLinear().domain([0, gridY - 1]).range([0, ctxHeight]);

    const contourGen = contours()
      .size([gridX, gridY])
      .thresholds(thresholds);

    const layerA = svg.querySelector('#layerA') as SVGGElement | null;
    const layerB = svg.querySelector('#layerB') as SVGGElement | null;
    if (!layerA || !layerB) return;

    const render = (t: number) => {
      // Populate scalar field with organic ridges
      let i = 0;
      const time = t * 0.001 * speed;
      for (let y = 0; y < gridY; y += 1) {
        for (let x = 0; x < gridX; x += 1, i += 1) {
          const nx = x / gridX - 0.5;
          const ny = y / gridY - 0.5;
          const radial = Math.hypot(nx, ny);
          const ridge = Math.sin((nx * 3.2 + ny * 3.2 + radial * 6.5) * Math.PI);
          const n = noise3D(nx * 1.5, ny * 1.5, time * 0.15);
          // Weight noise with radial to form fingerprint-like rings
          values[i] = ridge * 0.65 + n * 0.45 - radial * 0.15;
        }
      }

      const cs = contourGen(values);

      // Draw
      const toPathD = (c: any) =>
        c.coordinates
          .map(
            (multi: any) =>
              multi
                .map((ring: [number, number][]) =>
                  'M' +
                  ring
                    .map((p) => `${xScale(p[0]).toFixed(2)},${yScale(p[1]).toFixed(2)}`)
                    .join('L') +
                  'Z',
                )
                .join(' '),
          )
          .join(' ');

      // Split into two layers for depth
      const half = Math.floor(cs.length / 2);
      const upper = cs.slice(half);
      const lower = cs.slice(0, half);

      layerA.innerHTML = '';
      layerB.innerHTML = '';

      for (const c of lower) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', toPathD(c));
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', colorB);
        p.setAttribute('stroke-width', String(strokeSub));
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        p.setAttribute('opacity', '0.55');
        layerB.appendChild(p);
      }

      for (const c of upper) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', toPathD(c));
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', colorA);
        p.setAttribute('stroke-width', String(strokeMain));
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        p.setAttribute('opacity', '0.8');
        layerA.appendChild(p);
      }
    };

    const loop = (ts: number) => {
      if (!isActive) return;
      render(ts);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      isActive = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [width, height, thresholds, colorA, colorB, speed]);

  return (
    <svg
      ref={ref}
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <g id="layerB" />
      <g id="layerA" />
    </svg>
  );
};

export default FingerprintWaves;


