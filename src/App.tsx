import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScenePanel } from './components/ScenePanel';
import { ObjectPanel } from './components/ObjectPanel';
import { RightPanel } from './components/RightPanel';
import { BottomPanel } from './components/BottomPanel';
import { MainCanvas } from './components/MainCanvas';
import { Footer } from './components/Footer';
import { PhysicsObject, CollisionSettings } from './types';
import { stepPhysics } from './lib/physics';

export default function App() {
  const [activeTab, setActiveTab] = useState('scene');
  const [elements, setElements] = useState<PhysicsObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collisionSettings, setCollisionSettings] = useState<CollisionSettings>({ type: 'elastic', restitution: 1.0 });
  
  // Physics engine states
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const initialElementsRef = useRef<PhysicsObject[]>([]);
  
  // Data chart state
  const [historyVersion, setHistoryVersion] = useState(0);
  const historyRef = useRef<Record<string, { t: number; x: number; y: number; v: number; vy: number }[]>>({});

  const updatePhysics = (timestamp: number) => {
    if (lastTimeRef.current !== null) {
      const dt = (timestamp - lastTimeRef.current) / 1000;
      setTime(t => {
        const newTime = t + dt;
        setElements(prev => {
          const nextElements = stepPhysics(prev, dt, collisionSettings);
          
          Object.values(nextElements).forEach(el => {
            if (!historyRef.current[el.id]) historyRef.current[el.id] = [];
            historyRef.current[el.id].push({
              t: newTime,
              x: el.x || 0,
              y: el.y || 0,
              v: el.velocity || 0,
              vy: Math.abs(el.vy || 0) > 0.001 ? el.vy || 0 : 0, 
            });
          });
          
          return nextElements;
        });
        return newTime;
      });
      // Throttle UI update of history
      setHistoryVersion(v => v + 1);
    }
    lastTimeRef.current = timestamp;
    animationRef.current = requestAnimationFrame(updatePhysics);
  };

  const handlePlay = () => {
    if (!isPlaying) {
      if (time === 0) {
        initialElementsRef.current = JSON.parse(JSON.stringify(elements));
        historyRef.current = {};
        setHistoryVersion(0);
      }
      setIsPlaying(true);
      lastTimeRef.current = null;
      animationRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    historyRef.current = {};
    setHistoryVersion(0);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    if (initialElementsRef.current.length > 0) {
      setElements(initialElementsRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleAddElement = (element: Omit<PhysicsObject, 'id' | 'x' | 'y'> & { x?: number, y?: number }) => {
    const getDefaultSize = (type: string) => {
      switch(type) {
        case 'block': return { w: 1, h: 1 };
        case 'vehicle': return { w: 1.5, h: 0.8 };
        case 'ball': return { w: 0.8, h: 0.8 };
        case 'particle': return { w: 0.4, h: 0.4 };
        default: return { w: 1, h: 1 };
      }
    };
    const size = getDefaultSize(element.type);

    const newElement: PhysicsObject = {
      ...element,
      id: Date.now().toString(),
      x: element.x || 0,
      y: element.y || 0,
      width: size.w,
      height: size.h,
      mass: 1.0,
      velocity: 0,
      vy: 0,
      friction: 0.2, // Default friction
      angle: element.type === 'slope' ? 30 : undefined, // Default angle for slope
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-800 text-[13px] font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'scene' && <ScenePanel />}
        {activeTab === 'object' && <ObjectPanel onAddElement={handleAddElement} />}
        {/* Render placeholders or nothing for other tabs for now */}
        {!['scene', 'object'].includes(activeTab) && (
          <div className="w-[240px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-0 p-4">
             <h2 className="font-semibold text-slate-800 text-[15px] mb-2">
               {activeTab === 'force' ? '力' : activeTab === 'constraint' ? '约束' : activeTab === 'tool' ? '工具' : '设置'}
             </h2>
             <p className="text-slate-500 text-sm">功能开发中...</p>
          </div>
        )}
        
        <div className="flex flex-col flex-1 min-w-0 h-full relative">
          <MainCanvas 
            elements={elements} 
            onDropElement={handleAddElement} 
            selectedId={selectedId} 
            onSelect={setSelectedId} 
            onUpdateElement={(id, updates) => {
              setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
            }}
            isPlaying={isPlaying}
            time={time}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
          />
          <BottomPanel 
            element={elements.find(el => el.id === selectedId)} 
            history={selectedId ? historyRef.current[selectedId] || [] : []}
            historyVersion={historyVersion}
          />
        </div>
        
        <RightPanel 
          selectedElement={elements.find(el => el.id === selectedId)} 
          onUpdateElement={(id, updates) => {
            setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
          }} 
          onDeleteElement={handleDeleteElement}
          collisionSettings={collisionSettings}
          onUpdateCollisionSettings={setCollisionSettings}
        />
      </div>
      
      <Footer />
    </div>
  );
}

