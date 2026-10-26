import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'ghost' | 'gold' | 'light-ghost' | 'light-primary'
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
  href,
  target,
  rel,
}) {
  let baseStyle = 'inline-flex items-center justify-center font-bricolage font-medium text-[16px] min-h-[44px] px-6 py-3 rounded-full transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center select-none';
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-[#1F2A24] text-[#EEF1EA] hover:opacity-85 border border-transparent';
      break;
    case 'ghost':
      variantStyle = 'bg-transparent border-2 border-[#1F2A24] text-[#1F2A24] hover:bg-[#1F2A24] hover:text-[#EEF1EA]';
      break;
    case 'gold':
      variantStyle = 'bg-[#F2C94C] text-[#1F2A24] hover:opacity-90 border border-transparent shadow-xs';
      break;
    case 'light-ghost':
      // For midnight theme
      variantStyle = 'bg-transparent border-2 border-[#EEF1EA] text-[#EEF1EA] hover:bg-[#EEF1EA] hover:text-[#1F2A24]';
      break;
    case 'light-primary':
      // For midnight theme inverted
      variantStyle = 'bg-[#EEF1EA] text-[#1F2A24] hover:opacity-90 border border-transparent';
      break;
    default:
      variantStyle = 'bg-[#1F2A24] text-[#EEF1EA] hover:opacity-85';
  }

  const combinedClasses = `${baseStyle} ${variantStyle} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClasses}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
