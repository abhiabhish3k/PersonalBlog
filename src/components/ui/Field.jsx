import React from 'react';

export default function Field({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  multiline = false,
  rows = 4,
  className = '',
  disabled = false,
  autoComplete,
}) {
  const inputId = id || (name ? `field-${name}` : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-bricolage text-[14px] font-medium text-[#1F2A24] flex items-center justify-between"
        >
          <span>{label} {required && <span className="text-[#B88A00]">*</span>}</span>
        </label>
      )}

      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          disabled={disabled}
          className={`font-bricolage text-[16px] text-[#1F2A24] bg-white rounded-[14px] p-3.5 border-[1.5px] transition-colors outline-none resize-y ${
            error ? 'border-red-500' : 'border-[#7E8C80] focus:border-[#1F2A24]'
          } disabled:bg-stone-100 disabled:opacity-70`}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`h-[48px] px-4 font-bricolage text-[16px] text-[#1F2A24] bg-white rounded-[14px] border-[1.5px] transition-colors outline-none ${
            error ? 'border-red-500' : 'border-[#7E8C80] focus:border-[#1F2A24]'
          } disabled:bg-stone-100 disabled:opacity-70`}
        />
      )}

      {error && (
        <span className="font-bricolage text-[13px] text-red-600 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
