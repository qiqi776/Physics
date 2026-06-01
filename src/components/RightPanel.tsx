import React from 'react';
import { ChevronDown, Eye, ChevronRight } from 'lucide-react';
import { PhysicsObject, CollisionSettings } from '../types';

export function RightPanel({ selectedElement, onUpdateElement, onDeleteElement, collisionSettings, onUpdateCollisionSettings }: { 
  selectedElement?: PhysicsObject, 
  onUpdateElement?: (id: string, updates: Partial<PhysicsObject>) => void, 
  onDeleteElement?: (id: string) => void,
  collisionSettings?: CollisionSettings,
  onUpdateCollisionSettings?: (settings: CollisionSettings) => void
}) {
  if (!selectedElement) {
    return (
      <div className="w-[280px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-[-2px_0_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center border-b border-slate-200 px-4 h-12 shrink-0">
          <div className="h-full flex items-center border-b-2 border-blue-600 text-blue-600 font-medium px-1 cursor-pointer">
            全局设置
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="flex items-center gap-1.5 mb-3 text-slate-800 font-medium">
              <ChevronDown size={14} />
              <h2>环境与物理</h2>
            </div>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 shadow-sm p-3 space-y-3">
              <div className="flex flex-col gap-2">
                <span className="text-slate-600 text-[13px]">全局碰撞类型</span>
                <div className="flex-1 flex items-center border border-slate-300 rounded overflow-hidden">
                  <select 
                    value={collisionSettings?.type || 'elastic'}
                    onChange={(e) => onUpdateCollisionSettings?.({ ...collisionSettings!, type: e.target.value as any, restitution: e.target.value === 'elastic' ? 1 : e.target.value === 'perfectly_inelastic' ? 0 : 0.5 })}
                    className="bg-white border-none outline-none w-full px-2 py-1.5 text-slate-700 text-[13px] appearance-none focus:ring-0"
                  >
                    <option value="elastic">完全弹性碰撞 (e=1)</option>
                    <option value="perfectly_inelastic">完全非弹性碰撞 (e=0)</option>
                    <option value="inelastic">非完全弹性碰撞</option>
                  </select>
                </div>
              </div>

              {collisionSettings?.type === 'inelastic' && (
                <InputRow 
                  label="恢复系数" 
                  symbol="e" 
                  value={collisionSettings.restitution.toString()} 
                  unit="" 
                  onChange={(val) => onUpdateCollisionSettings?.({ ...collisionSettings, restitution: parseFloat(val) || 0 })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[280px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-[-2px_0_8px_rgba(0,0,0,0.02)]">
      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 px-4 h-12 shrink-0">
        <div className="flex items-center h-full gap-6">
          <div className="h-full flex items-center border-b-2 border-blue-600 text-blue-600 font-medium px-1 cursor-pointer">
            属性
          </div>
          <div className="h-full flex items-center border-b-2 border-transparent text-slate-500 hover:text-slate-800 px-1 cursor-pointer transition-colors">
            初始条件
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Object Section */}
        <div>
          <div className="flex items-center gap-1.5 mb-3 text-slate-800 font-medium cursor-pointer">
            <ChevronDown size={14} />
            <h2>{selectedElement.title} ({selectedElement.id})</h2>
          </div>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 shadow-sm">
            <div className="flex items-center justify-between p-2.5 bg-white border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                <span className="font-medium text-slate-700 text-[13px]">{selectedElement.title}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <div className="w-6 h-4 bg-blue-400/20 rounded border border-blue-400/30"></div>
                <Eye size={14} className="cursor-pointer hover:text-slate-600" />
              </div>
            </div>
            
            <div className="p-3 space-y-3">
              <InputRow 
                label="质量" 
                symbol="m" 
                value={(selectedElement.mass || 1.0).toFixed(2)} 
                unit="kg" 
                onChange={(val) => onUpdateElement?.(selectedElement.id, { mass: parseFloat(val) || 0 })}
              />
              <InputRow 
                label="初速度" 
                symbol="v₀" 
                value={(selectedElement.velocity || 0).toFixed(2)} 
                unit="m/s" 
                onChange={(val) => onUpdateElement?.(selectedElement.id, { velocity: parseFloat(val) || 0 })}
              />
              <InputRow 
                label="位置X" 
                symbol="x₀" 
                value={selectedElement.x.toFixed(2)} 
                unit="m" 
                onChange={(val) => onUpdateElement?.(selectedElement.id, { x: parseFloat(val) || 0 })}
              />
              <InputRow 
                label="位置Y" 
                symbol="y₀" 
                value={selectedElement.y.toFixed(2)} 
                unit="m" 
                onChange={(val) => onUpdateElement?.(selectedElement.id, { y: parseFloat(val) || 0 })}
              />
              {['block', 'vehicle'].includes(selectedElement.type) && (
                <>
                  <InputRow 
                    label="长度" 
                    symbol="w" 
                    value={(selectedElement.width !== undefined ? selectedElement.width : 1).toFixed(2)} 
                    unit="m" 
                    onChange={(val) => onUpdateElement?.(selectedElement.id, { width: parseFloat(val) || 0.1 })}
                  />
                  <InputRow 
                    label="高度" 
                    symbol="h" 
                    value={(selectedElement.height !== undefined ? selectedElement.height : 1).toFixed(2)} 
                    unit="m" 
                    onChange={(val) => onUpdateElement?.(selectedElement.id, { height: parseFloat(val) || 0.1 })}
                  />
                </>
              )}
              {selectedElement.friction !== undefined && (
                <InputRow 
                  label="动摩擦" 
                  symbol="μ" 
                  value={selectedElement.friction.toFixed(2)} 
                  unit="" 
                  onChange={(val) => onUpdateElement?.(selectedElement.id, { friction: parseFloat(val) || 0 })}
                />
              )}
              {selectedElement.type === 'slope' && selectedElement.angle !== undefined && (
                <InputRow 
                  label="倾角" 
                  symbol="θ" 
                  value={selectedElement.angle.toFixed(1)} 
                  unit="°" 
                  onChange={(val) => onUpdateElement?.(selectedElement.id, { angle: parseFloat(val) || 0 })}
                />
              )}
            </div>
          </div>
        </div>

        {/* Force Section */}
        <div>
          <div className="flex items-center gap-1.5 mb-3 text-slate-800 font-medium cursor-pointer">
            <ChevronDown size={14} />
            <h2>力</h2>
          </div>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 shadow-sm">
            <div className="flex items-center justify-between p-2.5 bg-white border-b border-slate-200">
               <span className="font-medium text-slate-700 text-[13px]">合外力</span>
               <Toggle checked />
            </div>
            <div className="p-3 space-y-3 border-b border-slate-200 bg-white">
               <InputRow label="大小" symbol="F" value="0.00" unit="N" />
               <div className="flex items-center justify-between">
                 <span className="text-slate-600 w-12 text-left">方向</span>
                 <div className="flex-1 flex items-center border border-slate-300 rounded overflow-hidden">
                   <select className="bg-transparent border-none outline-none w-full px-2 py-1 text-slate-700 text-[13px] appearance-none focus:ring-0">
                     <option>水平向右</option>
                     <option>水平向左</option>
                     <option>自定义角度</option>
                   </select>
                   <ChevronDown size={14} className="text-slate-400 mr-2 pointer-events-none" />
                 </div>
               </div>
            </div>
            
            <div className="flex items-center justify-between p-2.5 bg-white border-b border-slate-200">
               <span className="text-slate-600 text-[13px]">摩擦力</span>
               <Toggle />
            </div>
            
            <div className="flex items-center justify-between p-2.5 bg-white border-b border-slate-200">
               <span className="font-medium text-slate-700 text-[13px]">重力</span>
               <Toggle checked />
            </div>
            <div className="p-3 bg-white">
               <InputRow label="g" symbol="" value="9.80" unit="m/s²" labelLayout="minimal" />
            </div>
          </div>
        </div>
        
        {/* More Options Section */}
        <div>
          <div className="flex items-center justify-between mt-6">
            <button 
              onClick={() => onDeleteElement?.(selectedElement.id)}
              className="w-full py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors text-[13px] font-medium"
            >
              删除该物体
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function InputRow({ label, symbol, value, unit, labelLayout = 'default', onChange }: { label: string; symbol: string; value: string; unit: string; labelLayout?: 'default' | 'minimal', onChange?: (val: string) => void }) {
  const [localVal, setLocalVal] = React.useState(value);

  // Sync local if external changes
  React.useEffect(() => {
    setLocalVal(value);
  }, [value]);

  const handleBlur = () => {
    if (localVal === '-' || localVal === '') {
      setLocalVal('0');
      onChange?.('0');
    } else {
      onChange?.(localVal);
      // Auto format standard number string back to local
      setLocalVal(parseFloat(localVal).toFixed(2));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVal(e.target.value);
    // As they type, fire onChange if it's a valid number so canvas updates immediately
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed) && e.target.value !== '-') {
      onChange?.(e.target.value);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {labelLayout === 'default' ? (
        <div translate="no" className="notranslate flex items-center gap-1 w-16 text-slate-600 shrink-0">
          <span>{label}</span>
          {symbol && <span className="font-serif italic text-slate-400 text-xs">{symbol}</span>}
        </div>
      ) : (
        <div className="w-8 text-slate-600 shrink-0 flex items-center justify-center font-serif italic notranslate" translate="no">{label}</div>
      )}
      <div className="flex-1 flex items-center border border-slate-300 rounded overflow-hidden bg-white">
        <input 
          type="text" 
          value={localVal} 
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border-none outline-none px-2 py-1 text-right text-slate-700 font-mono text-[13px]" 
        />
        {unit && (
          <div className="bg-slate-50 border-l border-slate-200 px-2 py-1 text-slate-400 min-w-[32px] text-center shrink-0 border-none notranslate" translate="no">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ checked }: { checked?: boolean }) {
  return (
    <div className={`w-8 h-4 rounded-full relative cursor-pointer ${checked ? 'bg-blue-500' : 'bg-slate-300'}`}>
      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${checked ? 'left-4.5' : 'left-0.5'}`}></div>
    </div>
  );
}
