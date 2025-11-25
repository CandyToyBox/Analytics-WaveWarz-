import React, { useState, useEffect } from 'react';
import { BattleEvent } from '../types';
import { Calendar, Users, Layers, Image as ImageIcon } from 'lucide-react';

interface Props {
  event: BattleEvent;
  onClick: () => void;
}

const EventCardComponent: React.FC<Props> = ({ event, onClick }) => {
  const roundCount = event.rounds.length;
  const isMultiRound = roundCount > 1;

  const [imgSrc, setImgSrc] = useState(event.imageUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(event.imageUrl);
    setHasError(false);
  }, [event.imageUrl]);

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-900/20 transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image Header with Anti-Flicker Background */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        {!hasError && imgSrc && imgSrc !== 'null' ? (
          <img 
            src={imgSrc} 
            alt={`${event.artistA.name} vs ${event.artistB.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-700">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-50">Event Image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
        
        {/* Badge */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
           {isMultiRound && (
             <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide bg-indigo-600/90 text-white border border-indigo-400/30 flex items-center gap-1 shadow-sm">
                <Layers size={10} /> {roundCount} Rounds
             </span>
           )}
           {event.isCommunityEvent && (
             <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide bg-orange-500/90 text-white border border-orange-400/30 flex items-center gap-1 shadow-sm">
                <Users size={10} /> Community
             </span>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col -mt-12 relative z-10">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-full backdrop-blur-sm border border-slate-800">
            <Calendar size={12} />
            {new Date(event.date).toLocaleDateString()}
          </div>
        </div>

        <h3 className="font-bold text-slate-100 text-lg mb-4 flex-1 drop-shadow-md">
          <span className="text-cyan-400">{event.artistA.name}</span>
          <span className="text-slate-500 mx-2 text-sm italic">vs</span>
          <span className="text-fuchsia-400">{event.artistB.name}</span>
        </h3>

        <div className="mt-auto">
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-indigo-500/50" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                <span>{isMultiRound ? 'Full Event' : 'Single Battle'}</span>
                <span>View Stats &rarr;</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export const EventCard = React.memo(EventCardComponent);