import React from 'react';
import { THEME_COLORS } from '../../lib/constants.js';

export default function ThemeSwatch({ themeKey, selected, onSelect }) {
  const info = THEME_COLORS[themeKey] || THEME_COLORS.sage;

  return (
    <button
      type="button"
      onClick={() => onSelect(themeKey)}
      aria-label={`Theme ${info.name}`}
      className={`relative w-[44px] h-[44px] rounded-full transition-transform active:scale-95 cursor-pointer flex items-center justify-center ${
        selected ? 'ring-3 ring-[#1F2A24] ring-offset-2' : 'hover:scale-105 border border-black/10'
      }`}
      style={{ backgroundColor: info.bg }}
    >
      {selected && (
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: info.isDark ? '#EEF1EA' : '#1F2A24' }}
        />
      )}
    </button>
  );
}
