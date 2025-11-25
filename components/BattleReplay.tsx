import React, { useState, useEffect, useMemo } from 'react';
import { BattleState, BattleHistoryPoint, ReplayEvent } from '../types';
import { generateBattleHistory, formatSol } from '../utils';
import { Play, Pause, SkipBack, SkipForward, Zap, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import { ReplayChart } from './ReplayChart';
import { StatCard } from './StatCard';

interface Props {
  battle: BattleState;
  onExit: () => void;
}

export const BattleReplay: React.FC<Props> = ({ battle, onExit }) => {
  // Generate static history once on mount
  const { history, events } = useMemo(() => generateBattleHistory(battle, 100), [battle]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100); // ms per tick

  const currentPoint = history[currentIndex];

  // Playback Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && currentIndex < history.length - 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= history.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, history.length, speed]);

  // Derived Events for the Log
  const pastEvents = events.filter(e => e.timestamp <= currentPoint.timestamp).reverse();

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value);
    setCurrentIndex(newIndex);
  };

  const progressPct = (currentIndex / (history.length - 1)) * 100;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Controls */}
      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <SkipBack className="w-6 h-6 text-wave-blue" />
              Historical Replay
            </h2>
            <p className="text-ui-gray text-sm">Relive the battle timeline step-by-step</p>
          </div>
          <button 
            onClick={onExit} 
            className="flex items-center gap-2 px-4 py-2 bg-action-green/10 text-action-green border border-action-green/30 rounded-lg hover:bg-action-green hover:text-navy-950 transition-all font-bold text-sm shadow-lg shadow-action-green/10"
          >
            <ArrowLeft size={16} />
            Return to Live View
          </button>
        </div>

        {/* Timeline Controls */}
        <div className="flex flex-col gap-4">
          {/* Progress Bar & Scrub */}
          <div className="relative w-full h-2 bg-navy-950 rounded-full group">
             <div 
              className="absolute h-full bg-wave-blue rounded-full pointer-events-none z-10 shadow-[0_0_10px_rgba(34,181,232,0.5)]" 
              style={{ width: `${progressPct}%` }}
             />
             <input 
               type="range" 
               min="0" 
               max={history.length - 1} 
               value={currentIndex} 
               onChange={handleScrub}
               className="absolute w-full h-full opacity-0 cursor-pointer z-20"
             />
          </div>
          <div className="flex justify-between text-xs text-ui-gray font-mono">
             <span>{new Date(history[0].timestamp).toLocaleTimeString()}</span>
             <span>{new Date(currentPoint.timestamp).toLocaleTimeString()}</span>
             <span>{new Date(history[history.length-1].timestamp).toLocaleTimeString()}</span>
          </div>

          {/* Button Controls */}
          <div className="flex justify-center items-center gap-6">
            <button 
              onClick={() => setCurrentIndex(0)}
              className="p-2 text-ui-gray hover:text-white transition-colors"
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isPlaying ? 'bg-alert-red/20 text-alert-red hover:bg-alert-red/30' : 'bg-action-green/20 text-action-green hover:bg-action-green/30'
              }`}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>

            <button 
              onClick={() => setCurrentIndex(history.length - 1)}
              className="p-2 text-ui-gray hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>

            <select 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-navy-900 border border-navy-700 rounded text-xs text-white py-1 px-2 ml-4 focus:outline-none focus:border-wave-blue"
            >
              <option value={200}>0.5x</option>
              <option value={100}>1x</option>
              <option value={50}>2x</option>
              <option value={20}>5x</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Visual Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Replay Stats At Current Moment */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              label={`${battle.artistA.name} TVL`}
              value={formatSol(currentPoint.tvlA)}
              colorClass={currentPoint.tvlA > currentPoint.tvlB ? "text-wave-blue" : "text-ui-gray"}
              icon={<TrendingUp size={18} />}
              subValue={`Vol: ${formatSol(currentPoint.volumeA)}`}
            />
            <StatCard 
              label={`${battle.artistB.name} TVL`}
              value={formatSol(currentPoint.tvlB)}
              colorClass={currentPoint.tvlB > currentPoint.tvlA ? "text-wave-green" : "text-ui-gray"}
              icon={<TrendingUp size={18} />}
              subValue={`Vol: ${formatSol(currentPoint.volumeB)}`}
            />
          </div>

          {/* The Big Chart */}
          <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 h-80 min-w-0">
            <ReplayChart 
              history={history} 
              currentTimestamp={currentPoint.timestamp}
              colorA={battle.artistA.color}
              colorB={battle.artistB.color}
              nameA={battle.artistA.name}
              nameB={battle.artistB.name}
            />
          </div>
        </div>

        {/* Event Log Sidebar */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 h-[500px] overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Battle Log
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-navy-600 scrollbar-track-navy-900">
            {pastEvents.length === 0 ? (
              <div className="text-ui-gray text-center py-10 text-sm">Waiting for events...</div>
            ) : (
              pastEvents.map((evt, idx) => (
                <div key={`${evt.timestamp}-${idx}`} className="bg-navy-900/50 p-3 rounded-lg border border-navy-700 animate-in slide-in-from-left-2">
                   <div className="flex justify-between text-[10px] text-ui-gray mb-1 font-mono">
                     <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                     <span className={`font-bold ${evt.type === 'LEAD_CHANGE' ? 'text-yellow-400' : 'text-slate-500'}`}>{evt.type}</span>
                   </div>
                   <div className="text-sm text-white">
                     {evt.description}
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};