import React from 'react';
import { THEME_COLORS } from '../../lib/constants.js';

export default function Thumb({
  theme = 'sage',
  coverUrl = '',
  alt = 'Story cover',
  variant = 'card', // 'card' | 'row' | 'cover' | 'hero' | 'dark-panel' | 'custom'
  className = '',
  style = {},
}) {
  const currentTheme = THEME_COLORS[theme] || THEME_COLORS.sage;
  const bgColor = variant === 'dark-panel' ? '#34463B' : currentTheme.bg;
  const circleColor = variant === 'dark-panel' ? '#F2C94C' : currentTheme.secondary;

  let radiusClass = 'rounded-[20px]';
  let sizeClass = 'h-[160px] w-full';

  if (variant === 'row') {
    radiusClass = 'rounded-[20px]';
    sizeClass = 'h-[110px] w-[160px] shrink-0';
  } else if (variant === 'cover') {
    radiusClass = 'rounded-[32px]';
    sizeClass = 'h-[340px] w-full';
  } else if (variant === 'hero') {
    radiusClass = 'rounded-[44px]';
    sizeClass = 'h-[380px] w-full';
  } else if (variant === 'dark-panel') {
    radiusClass = 'rounded-[20px]';
    sizeClass = 'h-[200px] w-[300px] shrink-0';
  }

  if (coverUrl) {
    return (
      <div
        className={`relative overflow-hidden ${radiusClass} ${sizeClass} bg-stone-200 ${className}`}
        style={style}
      >
        <img
          src={coverUrl}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  // Thumb art recipe: rectangle in theme color with 150px circle at bottom-right, offset 30px right & 40px down
  return (
    <div
      className={`relative overflow-hidden select-none ${radiusClass} ${sizeClass} ${className}`}
      style={{
        backgroundColor: bgColor,
        ...style,
      }}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full pointer-events-none transition-transform"
        style={{
          width: '150px',
          height: '150px',
          bottom: '-40px',
          right: '-30px',
          backgroundColor: circleColor,
        }}
      />
    </div>
  );
}
