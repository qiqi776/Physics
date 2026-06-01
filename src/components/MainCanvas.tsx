import React, { useRef, useState, useEffect } from 'react';
import { MousePointer2, Hand, ZoomIn, ZoomOut, Maximize, Play, Pause, Square, SkipBack, Grid, TrendingUp, Maximize2, Layers } from 'lucide-react';
import { PhysicsObject } from '../types';

interface MainCanvasProps {
  elements: PhysicsObject[];
  onDropElement: (element: Omit<PhysicsObject, 'id'>) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<PhysicsObject>) => void;
  isPlaying: boolean;
  time: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function MainCanvas({ elements, onDropElement, selectedId, onSelect, onUpdateElement, isPlaying, time, onPlay, onPause, onReset }: MainCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingEntityId, setDraggingEntityId] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.type && data.title) {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const pixelsPerMeter = 80;
            const centerX = rect.width / 2;
            const x = (e.clientX - rect.left - centerX - pan.x) / pixelsPerMeter;

            onDropElement({
              type: data.type,
              title: data.title,
              x: Math.round(x * 100) / 100,
              y: 0
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onSelect(id);
    setDraggingEntityId(id);
    setHasMoved(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setHasMoved(true);
      setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    } else if (draggingEntityId && containerRef.current) {
      setHasMoved(true);
      const rect = containerRef.current.getBoundingClientRect();
      const pixelsPerMeter = 80;
      const centerX = rect.width / 2;
      const newX = (e.clientX - rect.left - centerX - pan.x) / pixelsPerMeter;
      
      const el = elements.find(el => el.id === draggingEntityId);
      if (el) {
         const newY = Math.max(0, el.y - e.movementY / 80); // 80px = 1m
         onUpdateElement(draggingEntityId, { x: Math.round(newX * 100) / 100, y: Math.round(newY * 100) / 100 });
      }
    }
  };

  const handleMouseUp = () => {
    if (isPanning && !hasMoved) {
      onSelect(null);
    }
    setIsPanning(false);
    setDraggingEntityId(null);
  };

  useEffect(() => {
    const handleUp = () => {
      setIsPanning(false);
      setDraggingEntityId(null);
    };
    window.addEventListener('mouseup', handleUp);
    return () => window.removeEventListener('mouseup', handleUp);
  }, []);

  return (
    <div 
         ref={containerRef}
         className="flex-1 relative flex flex-col bg-white overflow-hidden cursor-crosshair" 
         onMouseDown={handleCanvasMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onDragOver={handleDragOver}
         onDrop={handleDrop}
         style={{ 
           backgroundPosition: `${pan.x}px ${pan.y}px`,
           backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)", 
           backgroundSize: "20px 20px" 
         }}>
      
      {/* Top Toolbar */}

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        
        <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm p-1 pointer-events-auto h-10">
          <ToolbarButton icon={<MousePointer2 size={16} />} active />
          <ToolbarButton icon={<Hand size={16} />} />
          <div className="w-px h-5 bg-slate-200 mx-1"></div>
          <ToolbarButton icon={<ZoomIn size={16} />} />
          <ToolbarButton icon={<ZoomOut size={16} />} />
          <ToolbarButton icon={<Maximize size={16} />} />
          <div className="w-px h-5 bg-slate-200 mx-1"></div>
          <button className="px-3 h-8 text-[13px] font-medium text-slate-600 hover:bg-slate-100 rounded flex items-center">
            2D
          </button>
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-sm p-1 px-2 pointer-events-auto h-10 gap-1 pr-1 border-r-0 rounded-r-none">
          <button onClick={onReset} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <SkipBack size={16} fill="currentColor" />
          </button>
          
          {!isPlaying ? (
            <button onClick={onPlay} className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors bg-blue-50">
              <Play size={16} fill="currentColor" />
            </button>
          ) : (
            <button onClick={onPause} className="w-8 h-8 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-full transition-colors bg-amber-50">
              <Pause size={14} fill="currentColor" />
            </button>
          )}

          <button onClick={onReset} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <Square size={12} fill="currentColor" />
          </button>
          
          <div className="w-px h-5 bg-slate-200 mx-1"></div>
          
          <div className="text-[13px] font-mono font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-inner w-20 text-center notranslate" translate="no">
            {time.toFixed(2)} s
          </div>
        </div>
      </div>
      
      {/* Canvas Area Simulation */}
      <div className="flex-1 flex items-center justify-center relative pointer-events-none overflow-hidden">
        <div className="relative w-full h-[400px] mt-20" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
          {/* Ground Line */}
          <div className="absolute bottom-[80px] left-[-3000px] right-[-3000px] h-[2px] bg-slate-800"></div>
          
          {/* Axis Markings */}
          <div className="absolute bottom-[55px] left-[-3000px] right-[-3000px] h-[20px]">
            {Array.from({ length: 121 }, (_, i) => i - 60).map(mark => (
              <div key={mark} className="absolute text-[11px] text-slate-500 font-medium transform -translate-x-1/2 text-center" style={{ left: `calc(50% + ${mark * 80}px)` }}>
                <div className="w-px h-1.5 bg-slate-400 mx-auto mb-0.5"></div>
                {mark}m
              </div>
            ))}
          </div>

          {/* Render Elements */}
          {elements.map(el => {
            const w = el.width || 1;
            const h = el.height || 1;
            const isSelected = selectedId === el.id;
            
            // Fixed scale for display: 1m = 80px
            const pxWidth = w * 80;
            const pxHeight = h * 80;

            return (
              <div 
                key={el.id}
                className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing transition-shadow ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                style={{ 
                  left: `calc(50% + ${el.x * 80}px)`, 
                  transform: 'translateX(-50%)',
                  bottom: `calc(82px + ${Math.max(0, el.y) * 80}px)`, 
                  width: `${pxWidth}px`,
                  height: `${pxHeight}px`,
                  zIndex: isSelected ? 10 : 1
                }}
                onMouseDown={(e) => handleElementMouseDown(e, el.id)}
              >
                {el.type === 'vehicle' && (
                  <div className="w-full h-full bg-blue-400 border-[2px] border-blue-600 rounded-sm shadow-md flex items-center justify-center relative">
                    <span className="text-white font-italic text-lg font-serif">m</span>
                    
                    {/* Wheels */}
                    <div className="absolute -bottom-2.5 left-2 w-4 h-4 bg-slate-700 rounded-full border border-slate-500 flex items-center justify-center" style={{ transform: 'scale(1.2)' }}>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-2.5 right-2 w-4 h-4 bg-slate-700 rounded-full border border-slate-500 flex items-center justify-center" style={{ transform: 'scale(1.2)' }}>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                    </div>
                  </div>
                )}

                {el.type === 'block' && (
                  <div className="w-full h-full bg-blue-500 border-[2px] border-blue-700 rounded-sm shadow-md flex items-center justify-center">
                    <span className="text-white font-italic text-lg font-serif">m</span>
                  </div>
                )}

                {el.type === 'ball' && (
                  <div className="w-full h-full bg-orange-400 border-[2px] border-orange-600 rounded-full shadow-md flex items-center justify-center relative">
                    <span className="text-white font-italic text-lg font-serif">m</span>
                  </div>
                )}
                
                {el.type === 'particle' && (
                   <div className="w-full h-full bg-purple-500 border-[2px] border-purple-700 rounded-full shadow-md"></div>
                )}

                {el.type === 'slope' && (
                   <div className="relative w-full h-full border border-transparent">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="drop-shadow-md">
                         <polygon 
                           points={`0,100 100,100 100,${100 - 100 * Math.tan((el.angle || 30) * Math.PI / 180)}`} 
                           fill="#cbd5e1" 
                           stroke="#94a3b8" 
                           strokeWidth="1"
                        />
                      </svg>
                   </div>
                )}
                
                {['rope', 'spring', 'pulley', 'rod'].includes(el.type) && (
                  <div className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-600 shadow-sm whitespace-nowrap text-center text-ellipsis overflow-hidden">
                    {el.title}
                  </div>
                )}

                {/* Velocity Vector Container */}
                {el.velocity !== undefined && Math.abs(el.velocity) > 0.05 && (
                  <div className={`absolute top-1/2 ${el.velocity > 0 ? 'left-full ml-1' : 'right-full mr-1 flex-row-reverse'} w-16 h-0.5 bg-green-500 transform -translate-y-1/2 flex items-center z-10 pointer-events-none`}>
                    <div className={`w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ${el.velocity > 0 ? 'border-l-[8px] border-l-green-500 absolute -right-2' : 'border-r-[8px] border-r-green-500 absolute -left-2'}`}></div>
                    <div className={`absolute -top-5 ${el.velocity > 0 ? 'left-2' : 'right-2'} text-green-600 font-bold italic text-[12px] whitespace-nowrap`} translate="no">
                      v={Math.abs(el.velocity).toFixed(1)}
                    </div>
                  </div>
                )}

                {/* Friction Factor */}
                {el.friction !== undefined && Math.max(0, el.y) === 0 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-mono text-slate-600 whitespace-nowrap pointer-events-none font-bold" translate="no">
                    μ={el.friction.toFixed(2)}
                  </div>
                )}
              </div>
            );
          })}
          
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-4 left-4 flex items-center bg-white border border-slate-200 rounded-lg shadow-sm p-1 h-10 z-20">
        <ToolbarButton icon={<Grid size={16} />} active />
        <ToolbarButton icon={<TrendingUp size={16} />} />
        <div className="w-px h-5 bg-slate-200 mx-1"></div>
        <ToolbarButton icon={<Maximize2 size={16} />} />
        <ToolbarButton icon={<Layers size={16} />} />
        <ToolbarButton icon={<ZoomIn size={16} className="rotate-45" />} />
      </div>
    </div>
  );
}

function ToolbarButton({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
      active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
    }`}>
      {icon}
    </button>
  );
}
