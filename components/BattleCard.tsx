import React, { useState } from 'react';
import { BattleSummary } from '../types';
import { Calendar, Users, Music, Twitter, Image as ImageIcon, BarChart2 } from 'lucide-react';

interface Props {
  battle: BattleSummary;
  onSelect: (battle: BattleSummary) => void;
}

const BattleCardComponent: React.FC<Props> = ({ battle, onSelect }) => {
  const [imgSrc, setImgSrc] = useState(battle.imageUrl);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    setImgSrc(battle.imageUrl);
    setHasError(false);
    setIsLoaded(false);
  }, [battle.imageUrl]);

  const handleImageError = () => {
    setHasError(true);
    setImgSrc(''); 
  };

  return (
    <div 
      onClick={() => onSelect(battle)}
      className="group bg-navy-800 border border-navy-700 rounded-xl overflow-hidden hover:border-wave-blue/50 hover:shadow-lg hover:shadow-wave-blue/10 transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden bg-navy-950 flex items-center justify-center">
        {!hasError && imgSrc && imgSrc !== 'null' ? (
          <>
             <img 
              src={imgSrc} 
              alt={`${battle.artistA.name} vs ${battle.artistB.name}`}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onError={handleImageError}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
            />
            {!isLoaded && (
              <div className="absolute inset-0 bg-navy-900 animate-pulse flex items-center justify-center">
                 <ImageIcon size={24} className="text-navy-700" />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-50">No Image</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-900/20 to-transparent opacity-90" />
        
        {/* Status label removed as per request for archive view */}

        {battle.isCommunityBattle && (
          <div className="absolute top-3 left-3 z-10">
             <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-orange-500/90 text-white border border-orange-400/50 flex items-center gap-1 shadow-sm">
                <Users size={10} /> Community
             </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10">
          <div className="p-2 bg-navy-900/80 text-wave-blue border border-wave-blue/30 hover:bg-wave-blue hover:text-navy-950 rounded-full transition-all backdrop-blur-sm shadow-lg flex items-center gap-2 group/stats">
            <BarChart2 size={16} />
            <span className="text-xs font-bold w-0 overflow-hidden group-hover/stats:w-auto transition-all duration-300 whitespace-nowrap">View Stats</span>
           </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col -mt-12 relative z-10">
        <div className="flex justify-between items-center text-xs text-ui-gray mb-2">
          <div className="flex items-center gap-1 bg-navy-950/50 px-2 py-1 rounded-full backdrop-blur-sm border border-navy-700 font-mono">
            <Calendar size={12} />
            {new Date(battle.createdAt).toLocaleDateString()}
          </div>
          <div className="font-mono text-[10px] opacity-60">
            ID: {battle.battleId.slice(-6)}
          </div>
        </div>

        <h3 className="font-bold text-slate-100 text-lg mb-4 flex-1 drop-shadow-md">
          <span className="text-wave-blue">{battle.artistA.name}</span>
          <span className="text-slate-500 mx-2 text-sm italic">vs</span>
          <span className="text-wave-green">{battle.artistB.name}</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="flex gap-1 justify-center">
             {battle.artistA.musicLink && (
               <a href={battle.artistA.musicLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center py-2 rounded bg-wave-blue/10 hover:bg-wave-blue/20 text-wave-blue border border-wave-blue/20 transition-colors">
                 <Music size={14} />
               </a>
             )}
             {battle.artistA.twitter && (
               <a href={`https://twitter.com/${battle.artistA.twitter}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center py-2 rounded bg-navy-900 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 border border-navy-700 transition-colors">
                 <Twitter size={14} />
               </a>
             )}
          </div>

           <div className="flex gap-1 justify-center">
             {battle.artistB.musicLink && (
               <a href={battle.artistB.musicLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center py-2 rounded bg-wave-green/10 hover:bg-wave-green/20 text-wave-green border border-wave-green/20 transition-colors">
                 <Music size={14} />
               </a>
             )}
              {battle.artistB.twitter && (
               <a href={`https://twitter.com/${battle.artistB.twitter}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center py-2 rounded bg-navy-900 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 border border-navy-700 transition-colors">
                 <Twitter size={14} />
               </a>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BattleCard = React.memo(BattleCardComponent);