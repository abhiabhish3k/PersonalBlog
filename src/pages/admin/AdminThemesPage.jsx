import React from 'react';
import { THEME_COLORS } from '../../lib/constants.js';
import { getSettings, updateSettings } from '../../lib/storage.js';
import { useToast } from '../../components/ui/Toast.jsx';

export default function AdminThemesPage() {
  const { showToast } = useToast();
  const settings = getSettings();
  const currentDefault = settings.default_theme || 'sage';

  const themeKeys = ['sage', 'butter', 'lavender', 'peach', 'midnight'];

  const handleSelectDefault = async (key) => {
    try {
      await updateSettings({ default_theme: key });
      showToast('Default theme updated');
    } catch (error) {
      showToast(error?.message || 'Could not update the theme');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      <div>
        <h1 className="font-bricolage text-[36px] sm:text-[44px] font-bold text-[#1F2A24] leading-tight">
          Page themes
        </h1>
        <p className="font-bricolage text-[16px] text-[#4F5B53] mt-1">
          Pick the default mood for new stories. You can still change it per story.
        </p>
      </div>

      {/* Grid of five large theme cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {themeKeys.map((key) => {
          const info = THEME_COLORS[key];
          const isSelected = currentDefault === key;
          const textColor = info.isDark ? '#EEF1EA' : '#1F2A24';

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectDefault(key)}
              className={`rounded-[24px] p-6 h-[220px] flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-xs ${
                isSelected
                  ? 'ring-4 ring-[#1F2A24] ring-offset-4 scale-102'
                  : 'hover:-translate-y-1 hover:shadow-md'
              }`}
              style={{ backgroundColor: info.bg }}
            >
              <div className="flex justify-between items-start">
                <span
                  className="font-bricolage font-bold text-[24px]"
                  style={{ color: textColor }}
                >
                  {info.name}
                </span>

                {/* Secondary accent preview circle */}
                <span
                  className="w-5 h-5 rounded-full inline-block shadow-xs"
                  style={{ backgroundColor: info.secondary }}
                />
              </div>

              <div className="pt-4 border-t border-black/10">
                <span
                  className="font-bricolage font-medium text-[15px] underline underline-offset-4"
                  style={{ color: textColor }}
                >
                  {isSelected ? '✓ Default theme' : 'Set as default'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
