import React from 'react';
import { Check } from 'lucide-react';

export function ScenePanel() {
  return (
    <div className="w-[240px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-0">
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="font-semibold text-slate-800 text-[15px]">场景库</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <SceneCard title="水平直线" active>
             <div className="w-full h-full flex items-center justify-center">
                <svg width="40" height="20" viewBox="0 0 60 20" className="opacity-70">
                  <line x1="0" y1="18" x2="60" y2="18" stroke="currentColor" strokeWidth="2" />
                  <rect x="20" y="2" width="20" height="16" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
             </div>
          </SceneCard>
          <SceneCard title="斜面">
              <div className="w-full h-full flex items-center justify-center">
                <svg width="40" height="30" viewBox="0 0 60 40" className="opacity-70">
                  <polygon points="5,35 55,35 55,10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="25" y="14" width="16" height="12" transform="rotate(26 25 14)" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
          </SceneCard>
          <SceneCard title="抛体运动">
             <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <svg width="40" height="30" viewBox="0 0 60 40" className="opacity-70">
                  <path d="M 5 35 Q 30 0 55 35" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="20" cy="15" r="4" fill="currentColor" opacity="0.5" />
                  <path d="M 20 15 L 30 10" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
             </div>
          </SceneCard>
          <SceneCard title="圆周运动">
             <div className="w-full h-full flex items-center justify-center">
                <svg width="40" height="30" viewBox="0 0 60 40" className="opacity-70">
                  <circle cx="30" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="45" cy="20" r="4" fill="currentColor" opacity="0.5" />
                  <path d="M 45 20 L 55 20" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <path d="M 30 20 L 45 20" stroke="currentColor" strokeWidth="1" />
                </svg>
             </div>
          </SceneCard>
          <SceneCard title="竖直上抛">
            <div className="w-full h-full flex items-center justify-center">
                <svg width="30" height="40" viewBox="0 0 40 60" className="opacity-70">
                   <line x1="10" y1="50" x2="30" y2="50" stroke="currentColor" strokeWidth="2" />
                   <path d="M 15 50 L 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                   <path d="M 25 15 L 25 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                   <circle cx="15" cy="30" r="4" fill="currentColor" opacity="0.5" />
                   <path d="M 15 30 L 15 20" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
                </svg>
            </div>
          </SceneCard>
          <SceneCard title="自由落体">
             <div className="w-full h-full flex items-center justify-center">
                <svg width="30" height="40" viewBox="0 0 40 60" className="opacity-70">
                   <path d="M 20 10 L 20 45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrow)" />
                   <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.5" />
                </svg>
            </div>
          </SceneCard>
        </div>
        
        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 px-1">我的场景</h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-md bg-blue-50 text-blue-700 text-[13px] font-medium border-l-2 border-blue-600">
              默认场景
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-600 text-[13px] border-l-2 border-transparent">
              弹簧振子动画
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneCard({ title, children, active }: { title: string; children: React.ReactNode; active?: boolean }) {
  return (
    <div className={`relative flex flex-col border rounded-lg overflow-hidden cursor-pointer group ${active ? 'border-blue-500 bg-blue-50/10 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}>
      <div className="h-16 flex items-center justify-center text-slate-600 bg-white">
        {children}
      </div>
      <div className="py-2 px-2 text-center text-xs font-medium border-t border-slate-100 bg-white">
        {title}
      </div>
      {active && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 text-white rounded-[4px] flex items-center justify-center shadow-sm">
          <Check size={12} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
