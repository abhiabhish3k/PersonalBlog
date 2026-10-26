import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export default function Dropzone({ onFileSelected, className = '', label = 'Drop an image here or click to browse' }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const processFile = (file) => {
    setError('');
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid format. Please upload PNG, JPG, WebP, or GIF.');
      return;
    }

    if (file.size > MAX_BYTES) {
      setError('File is too large. Maximum size is 5 MB.');
      return;
    }

    // Convert to data URL for seamless offline persistence
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileSelected({
        url: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[16px] cursor-pointer transition-colors text-center ${
          isDragOver
            ? 'border-[#1F2A24] bg-stone-100'
            : 'border-[#7E8C80] hover:border-[#1F2A24] bg-white/60'
        } ${className}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex items-center gap-2 text-[#4F5B53] font-bricolage text-[15px]">
          <Upload className="w-5 h-5 text-[#1F2A24]" />
          <span>{label}</span>
        </div>
        <span className="text-[12px] text-[#7E8C80] font-bricolage mt-1">
          PNG, JPG, WebP, GIF up to 5MB
        </span>
      </div>

      {error && (
        <p className="font-bricolage text-[13px] text-red-600 px-1">
          {error}
        </p>
      )}
    </div>
  );
}
