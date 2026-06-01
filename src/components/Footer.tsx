import React from 'react';
import { ChevronDown, Maximize2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="h-8 border-t border-slate-200 bg-white flex items-center justify-between px-3 text-[12px] text-slate-500 shrink-0">
      <div className="flex items-center gap-4">
        <span>就绪</span>
      </div>
      
      <div className="flex items-center absolute left-1/2 -translate-x-1/2">
        <span className="text-slate-600">当前场景:</span>
        <span className="ml-1 text-slate-800 font-medium">水平直线运动</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 px-1 rounded">
          <span>单位制</span>
          <span className="font-medium text-slate-700">SI</span>
          <ChevronDown size={14} />
        </div>
        
        <div className="h-4 w-px bg-slate-200 mx-1"></div>
        
        <div className="flex items-center gap-2">
          <span>缩放</span>
          <div className="w-24 h-1.5 bg-slate-200 rounded-full relative ml-1">
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-500 rounded-l-full"></div>
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border border-slate-300 rounded-full shadow-sm cursor-pointer"></div>
          </div>
          <span className="font-mono ml-1 w-10 text-right">100%</span>
        </div>
        
        <button className="text-slate-400 hover:text-slate-600 ml-1">
          <Maximize2 size={14} />
        </button>
      </div>
    </footer>
  );
}
