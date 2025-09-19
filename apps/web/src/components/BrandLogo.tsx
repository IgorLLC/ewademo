import React from 'react';
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
