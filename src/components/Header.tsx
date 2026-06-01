import React from 'react';
import { FilePlus, FolderOpen, Save, SaveAll, Download, Undo2, Redo2, HelpCircle, MessageSquare, ChevronDown, User } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
            {/* Custom logo placeholder */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2M12 19v2M3 12h2M19 12h2M5.636 5.636l1.414 1.414M16.95 16.95l1.414 1.414M5.636 18.364l1.414-1.414M16.95 7.05l1.414-1.414" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">物理仿真空间</h1>
            <p className="text-[10px] text-slate-500 font-medium leading-none">Physics Sim Studio</p>
          </div>
        </div>
        
        <div className="h-5 w-px bg-slate-200 mx-2"></div>
        
        <nav className="flex items-center gap-1">
          <ToolbarButton icon={<FilePlus size={16} />} label="新建" />
          <ToolbarButton icon={<FolderOpen size={16} />} label="打开" />
          <ToolbarButton icon={<Save size={16} />} label="保存" />
          <ToolbarButton icon={<SaveAll size={16} />} label="另存为" />
          <ToolbarButton icon={<Download size={16} />} label="导出" />
          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          <ToolbarButton icon={<Undo2 size={16} />} label="撤销" />
          <ToolbarButton icon={<Redo2 size={16} />} label="恢复" />
        </nav>
      </div>
      
      <div className="flex items-center gap-4 text-slate-600">
        <button className="flex items-center gap-1.5 px-2 hover:text-slate-900 transition-colors">
          <HelpCircle size={16} />
          <span>帮助</span>
        </button>
        <button className="flex items-center gap-1.5 px-2 hover:text-slate-900 transition-colors">
          <MessageSquare size={16} />
          <span>反馈</span>
        </button>
        
        <div className="h-5 w-px bg-slate-200 mx-1"></div>
        
        <button className="flex items-center gap-2 px-2 hover:bg-slate-50 py-1.5 rounded-md transition-colors">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <User size={14} />
          </div>
          <span className="font-medium text-slate-700">老师</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}

function ToolbarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors">
      {icon}
      <span>{label}</span>
    </button>
  );
}
