import React from 'react';
import { BoxSelect, Cuboid, Zap, Link2, Wrench, Ruler, LineChart, Settings } from 'lucide-react';

export function Sidebar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
  return (
    <aside className="w-[72px] border-r border-slate-200 bg-white flex flex-col shrink-0 items-center py-4 gap-6 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
      <NavItem icon={<BoxSelect size={20} />} label="场景" active={activeTab === 'scene'} onClick={() => onTabChange('scene')} />
      <NavItem icon={<Cuboid size={20} />} label="物体" active={activeTab === 'object'} onClick={() => onTabChange('object')} />
      <NavItem icon={<Zap size={20} />} label="力" active={activeTab === 'force'} onClick={() => onTabChange('force')} />
      <NavItem icon={<Link2 size={20} />} label="约束" active={activeTab === 'constraint'} onClick={() => onTabChange('constraint')} />
      <NavItem icon={<Wrench size={20} />} label="工具" active={activeTab === 'tool'} onClick={() => onTabChange('tool')} />
      <NavItem icon={<Ruler size={20} />} label="测量" active={activeTab === 'measure'} onClick={() => onTabChange('measure')} />
      <NavItem icon={<LineChart size={20} />} label="图表" active={activeTab === 'chart'} onClick={() => onTabChange('chart')} />
      
      <div className="flex-1"></div>
      
      <NavItem icon={<Settings size={20} />} label="设置" active={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
    </aside>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl gap-1 transition-colors relative ${
        active ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>}
      {icon}
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}
