import React, { useState, useMemo } from 'react';
import { X, Check, Activity } from 'lucide-react';
import { PhysicsObject } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, ReferenceLine } from 'recharts';

export function BottomPanel({ element, history, historyVersion }: { 
  element?: PhysicsObject;
  history?: { t: number; x: number; y: number; v: number; vy: number }[];
  historyVersion?: number;
}) {
  const [xAxisKey, setXAxisKey] = useState<'t' | 'x'>('t');
  const [yAxisKey, setYAxisKey] = useState<'v' | 'x' | 'vy' | 'y'>('v');
  const [showGrid, setShowGrid] = useState(true);

  if (!element || !history || history.length === 0) {
    return (
      <div className="h-[260px] bg-white border-t border-slate-200 flex flex-col shrink-0 flex-shrink-0 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center border-b border-slate-200 px-4 h-10 shrink-0">
          <div className="h-full flex items-center border-b-2 border-blue-600 text-blue-600 font-medium px-1 cursor-pointer">图表</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <Activity size={32} className="mb-2 opacity-50" />
          <p className="text-[13px]">在运动状态下选择一个物体以查看数据图像</p>
          <p className="text-[12px] opacity-70">点击播放按钮开始记录数据</p>
        </div>
      </div>
    );
  }

  const yLabelMap = {
    v: '速度 v (m/s)',
    vy: '垂直速度 vy (m/s)',
    x: '水平位置 x (m)',
    y: '垂直位置 y (m)',
  };

  const xLabelMap = {
    t: '时间 t (s)',
    x: '水平位置 x (m)',
  };

  return (
    <div className="h-[260px] bg-white border-t border-slate-200 flex flex-col shrink-0 flex-shrink-0 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.02)]">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 h-10 shrink-0">
        <div className="flex items-center h-full gap-6">
          <div className="h-full flex items-center border-b-2 border-blue-600 text-blue-600 font-medium px-1 cursor-pointer">
            图表 - {element.title}
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-700 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Options */}
        <div className="w-[180px] border-r border-slate-200 p-3 space-y-4 shrink-0 bg-slate-50/50 flex flex-col">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">纵轴 (Y轴)</h3>
            <div className="space-y-1">
              <RadioOption label="水平速度 v" checked={yAxisKey === 'v'} onChange={() => setYAxisKey('v')} color="bg-green-500" />
              <RadioOption label="垂直速度 vy" checked={yAxisKey === 'vy'} onChange={() => setYAxisKey('vy')} color="bg-emerald-500" />
              <RadioOption label="水平位移 x" checked={yAxisKey === 'x'} onChange={() => setYAxisKey('x')} color="bg-blue-500" />
              <RadioOption label="垂直位移 y" checked={yAxisKey === 'y'} onChange={() => setYAxisKey('y')} color="bg-indigo-500" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">横轴 (X轴)</h3>
            <div className="space-y-1">
              <RadioOption label="时间 t" checked={xAxisKey === 't'} onChange={() => setXAxisKey('t')} color="bg-slate-600" />
              <RadioOption label="水平位移 x" checked={xAxisKey === 'x'} onChange={() => setXAxisKey('x')} color="bg-slate-600" />
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 p-4 relative flex flex-col pt-6 font-mono text-[11px]">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
                <XAxis 
                   dataKey={xAxisKey} 
                   type="number" 
                   domain={['dataMin', 'dataMax']}
                   tick={{ fill: '#64748b' }} 
                   tickFormatter={(val) => Number.isInteger(val) ? val.toString() : val.toFixed(1)}
                   label={{ value: xLabelMap[xAxisKey], position: 'insideBottomRight', offset: -10, fill: '#64748b' }}
                />
                <YAxis 
                   domain={['auto', 'auto']}
                   tick={{ fill: '#64748b' }} 
                   tickFormatter={(val) => Number.isInteger(val) ? val.toString() : val.toFixed(1)}
                   label={{ value: yLabelMap[yAxisKey], angle: -90, position: 'insideLeft', fill: '#64748b' }}
                />
                <RechartsTooltip 
                  formatter={(value: number) => value.toFixed(3)}
                  labelFormatter={(label: number) => `${xAxisKey === 't' ? '时间' : '位置'}: ${label.toFixed(3)}`}
                  contentStyle={{ borderRadius: '6px', fontSize: '12px', border: '1px solid #cbd5e1' }}
                />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Line 
                   type="monotone" 
                   dataKey={yAxisKey} 
                   stroke={yAxisKey === 'v' || yAxisKey === 'vy' ? '#10b981' : '#3b82f6'} 
                   strokeWidth={2}
                   dot={false}
                   isAnimationActive={false}
                />
              </LineChart>
           </ResponsiveContainer>
        </div>

        {/* Right Settings */}
        <div className="w-[180px] border-l border-slate-200 p-4 shrink-0 flex flex-col gap-4 text-[13px]">
          <h3 className="font-medium text-slate-700">图表设置</h3>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-slate-500">显示网格</span>
            <Toggle checked={showGrid} onChange={() => setShowGrid(!showGrid)} />
          </div>
          
          <div className="mt-auto p-3 bg-blue-50/50 rounded border border-blue-100 text-slate-600 text-[12px] leading-relaxed">
            <p><strong>提示:</strong></p>
            <p>数据记录直到暂停或点击停止时清除。</p>
            <p className="mt-1">Y轴支持负半轴显示对应负方向。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RadioOption({ label, color, checked, onChange }: { label: string; color: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${checked ? 'bg-slate-100' : 'hover:bg-slate-50'}`} onClick={onChange}>
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${checked ? `${color} border-transparent text-white` : 'border-slate-300 bg-white'}`}>
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
      </div>
      <span className={`text-[12px] ${checked ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{label}</span>
    </label>
  );
}

function Toggle({ checked, onChange }: { checked?: boolean; onChange?: () => void }) {
  return (
    <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-300'}`} onClick={onChange}>
      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${checked ? 'left-4.5' : 'left-0.5'}`}></div>
    </div>
  );
}
