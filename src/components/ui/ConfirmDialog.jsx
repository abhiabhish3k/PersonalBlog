import React from 'react';
import Button from './Button.jsx';

export default function ConfirmDialog({
  isOpen,
  title = 'Delete item?',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 border border-[#C3CCBE]"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h3 id="dialog-title" className="font-bricolage text-[22px] font-bold text-[#1F2A24] leading-tight">
          {title}
        </h3>
        <p className="font-bricolage text-[15px] text-[#4F5B53] leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onCancel} className="!min-h-[40px] !py-2 !px-4 text-[14px]">
            {cancelText}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center font-bricolage font-medium text-[14px] min-h-[40px] px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
