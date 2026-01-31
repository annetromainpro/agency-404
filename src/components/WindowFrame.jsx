import React from 'react';
import { X, Minus, Square } from 'lucide-react';

const WindowFrame = ({ title, icon: Icon, children, onClose, onMinimize, isActive }) => {
  return (
    <div className={`flex flex-col h-full w-full bg-[#f0f0f0] rounded-t-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#37698a] overflow-hidden ${isActive ? 'ring-1 ring-white/50' : 'opacity-90'}`}>
      
      {/* --- HEADER WINDOWS 7 AERO --- */}
      <div className="h-8 bg-gradient-to-b from-[#87bceb] via-[#53a4e9] to-[#2b7dc0] flex justify-between items-center px-2 select-none border-b border-[#204d74]">
        <div className="flex items-center gap-2 text-white text-shadow-sm font-sans text-sm font-bold">
          {Icon && <Icon size={16} className="drop-shadow-md" />}
          <span style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={onMinimize} className="w-6 h-5 flex items-center justify-center hover:bg-white/30 rounded border border-transparent hover:border-white/50 transition-all text-white shadow-inner">
            <Minus size={12} strokeWidth={4} />
          </button>
          <button className="w-6 h-5 flex items-center justify-center hover:bg-white/30 rounded border border-transparent hover:border-white/50 transition-all text-white shadow-inner opacity-50 cursor-not-allowed">
            <Square size={10} strokeWidth={4} />
          </button>
          <button onClick={onClose} className="w-8 h-5 flex items-center justify-center bg-[#d44026] hover:bg-[#e81123] rounded border border-[#8b2315] hover:border-[#b12d1b] transition-all text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;