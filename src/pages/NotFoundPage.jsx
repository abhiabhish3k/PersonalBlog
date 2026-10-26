import React from 'react';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage({ navigate }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 gap-6">
      <div className="w-16 h-16 rounded-full bg-[#F2C94C] flex items-center justify-center font-bricolage text-[28px] font-bold text-[#1F2A24]">
        ?
      </div>

      <h1 className="font-bricolage text-[48px] sm:text-[64px] font-bold text-[#1F2A24] leading-tight tracking-tight">
        Page not found
      </h1>

      <p className="font-bricolage text-[18px] sm:text-[20px] text-[#4F5B53] max-w-md leading-relaxed">
        The story or page you're looking for doesn't exist, has moved, or is kept in private notes.
      </p>

      <div className="flex items-center gap-4 pt-2">
        <Button variant="primary" onClick={() => navigate('/writing')}>
          Browse writing
        </Button>
        <Button variant="ghost" onClick={() => navigate('/')}>
          Go to home
        </Button>
      </div>
    </div>
  );
}
