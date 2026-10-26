import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext({
  showToast: () => {},
});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, duration = 2000) => {
    setToast(message);
    const timer = setTimeout(() => {
      setToast(null);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200 transform animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="bg-[#1F2A24] text-[#EEF1EA] font-bricolage text-[15px] font-medium px-6 py-3 rounded-full shadow-lg border border-white/10 select-none whitespace-nowrap">
            {toast}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export default ToastProvider;
