import React, { useId } from 'react';
import clsx from 'clsx';

interface BrandLogoProps extends React.HTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap: Record<NonNullable<BrandLogoProps['size']>, number> = {
  sm: 96,
  md: 144,
  lg: 192,
};

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className, ...imgProps }) => {
  const dimension = sizeMap[size];

  return (
    <img
      src="/images/branding/ewa-logo.svg"
      width={dimension}
      height={dimension}
      alt="EWA Box Water"
      className={clsx('inline-block object-contain', className)}
      {...imgProps}
    />
  );
};

export default BrandLogo;

export interface AnimatedLogoRingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  color?: string; // hex or tailwind-resolved color for text/ring
  showGuideCircle?: boolean;
}

/**
 * AnimatedLogoRing renders the EWA logo with a rotating circular text ring around it.
 * The ring uses an SVG textPath along a circle and a CSS animation utility `.ewa-rotate-slow`.
 */
export const AnimatedLogoRing: React.FC<AnimatedLogoRingProps> = ({
  size = 'md',
  text = 'JOIN THE EWAVE •',
  color = '#ffffff',
  showGuideCircle = false,
  className,
  ...divProps
}) => {
  const dimension = sizeMap[size];
  const ringSize = Math.round(dimension * 1.8);
  const ringPadding = Math.max(6, Math.round(dimension * 0.04));
  const radius = Math.round(ringSize / 2 - 12 - ringPadding);
  const pathId = `ewa-text-circle-${useId()}`;

  const repeatedText = Array.from({ length: 8 })
    .map(() => text.trim())
    .join(' ');

  return (
    <div
      className={clsx('relative inline-grid place-items-center isolate', className)}
      style={{ width: ringSize, height: ringSize }}
      {...divProps}
    >
      <img
        src="/images/branding/ewa-logo-white.svg"
        alt="EWA Box Water"
        width={dimension}
        height={dimension}
        className="relative z-10 object-contain"
      />
      <svg
        className="absolute inset-0 z-20 ewa-rotate-slow pointer-events-none"
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        width={ringSize}
        height={ringSize}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <path id={pathId} d={`M ${ringSize / 2},${ringSize / 2} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`} />
        </defs>
        {showGuideCircle && (
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeOpacity={0.25}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
        )}
        <text
          fill={color}
          className="font-extrabold tracking-[0.2em]"
          style={{ fontSize: Math.max(10, Math.round(dimension * 0.14)) }}
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};
