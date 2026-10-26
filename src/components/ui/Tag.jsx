import React from 'react';

export default function Tag({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#F2C94C] text-[#1F2A24] px-[14px] py-[4px] text-[14px] font-medium font-bricolage tracking-normal w-fit ${className}`}
    >
      {children}
    </span>
  );
}
