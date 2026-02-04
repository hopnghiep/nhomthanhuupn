
import React, { useEffect } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity z-[60] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-background-secondary shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-border-primary`}>
        <header className="flex items-center justify-between p-4 sm:p-6 border-b border-border-primary bg-background-secondary sticky top-0 z-10">
          <h2 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tighter truncate pr-4">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-full transition-all flex-shrink-0"
            aria-label="Close panel"
          >
            <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto custom-scrollbar bg-background-primary p-4 sm:p-0">
          {children}
        </div>
      </div>
      
      <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
};

export default SlideOver;
