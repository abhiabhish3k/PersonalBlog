import React from 'react';

export default function Chip({ status = 'published', className = '' }) {
  let bgClass = 'bg-[#CFE0D2] text-[#1F2A24]'; // sage for published
  let label = 'Published';

  const normalized = (status || '').toLowerCase();

  if (normalized === 'draft') {
    bgClass = 'bg-[#F5E3A8] text-[#1F2A24]'; // butter-soft
    label = 'Draft';
  } else if (normalized === 'scheduled') {
    bgClass = 'bg-[#D8D2EA] text-[#1F2A24]'; // lavender
    label = 'Scheduled';
  } else if (normalized === 'unlisted') {
    bgClass = 'bg-[#D8D2EA] text-[#1F2A24]'; // lavender
    label = 'Unlisted';
  } else {
    bgClass = 'bg-[#CFE0D2] text-[#1F2A24]'; // sage
    label = 'Published';
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium font-bricolage select-none w-fit ${bgClass} ${className}`}
    >
      {label}
    </span>
  );
}
