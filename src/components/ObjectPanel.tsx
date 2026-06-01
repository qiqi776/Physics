import React from 'react';

export function ObjectPanel({ onAddElement }: { onAddElement?: (element: { type: any, title: string }) => void }) {
  return (
    <div className="w-[240px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-0">
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="font-semibold text-slate-800 text-[15px]">物体库</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 px-1">基础物体 (拖拽添加)</h3>
          <div className="grid grid-cols-2 gap-3">
            <ObjectCard title="斜面" type="slope" onClick={() => onAddElement?.({ type: 'slope', title: '斜面' })}>
                <svg width="32" height="24" viewBox="0 0 32 24">
                  <polygon points="2,22 30,22 30,6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
                </svg>
            </ObjectCard>
            <ObjectCard title="质点" type="particle" onClick={() => onAddElement?.({ type: 'particle', title: '质点' })}>
               <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
            </ObjectCard>
            <ObjectCard title="滑块" type="block" onClick={() => onAddElement?.({ type: 'block', title: '滑块' })}>
               <div className="w-8 h-6 bg-blue-500 rounded-sm shadow-sm border border-blue-600"></div>
            </ObjectCard>
            <ObjectCard title="小球" type="ball" onClick={() => onAddElement?.({ type: 'ball', title: '小球' })}>
               <div className="w-6 h-6 bg-orange-400 rounded-full shadow-sm border border-orange-500"></div>
            </ObjectCard>
            <ObjectCard title="小车" type="vehicle" onClick={() => onAddElement?.({ type: 'vehicle', title: '小车' })}>
                <svg width="32" height="20" viewBox="0 0 32 20">
                  <rect x="2" y="2" width="28" height="12" fill="#3b82f6" rx="2" stroke="#2563eb" strokeWidth="1"/>
                  <circle cx="8" cy="16" r="3" fill="#334155" />
                  <circle cx="24" cy="16" r="3" fill="#334155" />
                </svg>
            </ObjectCard>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 px-1">连接件 (拖拽添加)</h3>
          <div className="grid grid-cols-2 gap-3">
            <ObjectCard title="细绳" type="rope" onClick={() => onAddElement?.({ type: 'rope', title: '细绳' })}>
              <svg width="30" height="30" viewBox="0 0 30 30">
                <line x1="5" y1="25" x2="25" y2="5" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
              </svg>
            </ObjectCard>
            <ObjectCard title="轻弹簧" type="spring" onClick={() => onAddElement?.({ type: 'spring', title: '轻弹簧' })}>
              <svg width="30" height="30" viewBox="0 0 30 30">
                <path d="M 5 25 L 8 20 L 12 25 L 16 20 L 20 25 L 24 20 L 27 25" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </ObjectCard>
            <ObjectCard title="固定轴滑轮" type="pulley" onClick={() => onAddElement?.({ type: 'pulley', title: '固定轴滑轮' })}>
              <svg width="30" height="30" viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="8" fill="none" stroke="#64748b" strokeWidth="2" />
                <circle cx="15" cy="15" r="2" fill="#64748b" />
                <line x1="15" y1="15" x2="15" y2="3" stroke="#64748b" strokeWidth="2" />
                <line x1="10" y1="3" x2="20" y2="3" stroke="#64748b" strokeWidth="2" />
              </svg>
            </ObjectCard>
            <ObjectCard title="刚性轻杆" type="rod" onClick={() => onAddElement?.({ type: 'rod', title: '刚性轻杆' })}>
              <svg width="30" height="30" viewBox="0 0 30 30">
                <line x1="5" y1="25" x2="25" y2="5" stroke="#e2e8f0" strokeWidth="4" />
                <line x1="5" y1="25" x2="25" y2="5" stroke="#94a3b8" strokeWidth="1" />
              </svg>
            </ObjectCard>
          </div>
        </div>

        <div>
           <h3 className="text-xs font-semibold text-slate-500 mb-3 px-1">复合系统 (点击添加)</h3>
           <div className="space-y-2">
             <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-600 text-[13px] border border-slate-200 shadow-sm transition-colors cursor-pointer">
               单摆模型
             </button>
             <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-600 text-[13px] border border-slate-200 shadow-sm transition-colors cursor-pointer">
               弹簧振子模型
             </button>
             <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-600 text-[13px] border border-slate-200 shadow-sm transition-colors cursor-pointer">
               阿特伍德机模型
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function ObjectCard({ title, children, type, onClick }: { title: string; children: React.ReactNode; type: string; onClick?: () => void }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, title }));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a drag image
    const dragIcon = document.createElement('div');
    dragIcon.innerHTML = title;
    dragIcon.style.padding = '4px 8px';
    dragIcon.style.background = '#3b82f6';
    dragIcon.style.color = 'white';
    dragIcon.style.borderRadius = '4px';
    dragIcon.style.position = 'absolute';
    dragIcon.style.top = '-1000px';
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 0, 0);
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  return (
    <div 
      className="relative flex flex-col border border-slate-200 rounded-lg overflow-hidden cursor-pointer active:cursor-grabbing hover:border-blue-400 hover:shadow-sm bg-white group transition-all"
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <div className="h-16 flex items-center justify-center text-slate-600">
        {children}
      </div>
      <div className="py-2 px-2 text-center text-xs font-medium border-t border-slate-100 bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
        {title}
      </div>
    </div>
  );
}
