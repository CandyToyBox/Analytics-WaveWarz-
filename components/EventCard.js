"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCard = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var EventCardComponent = function (_a) {
    var event = _a.event, onSelect = _a.onSelect;
    var roundCount = event.rounds.length;
    var isMultiRound = roundCount > 1;
    var _b = (0, react_1.useState)(event.imageUrl), imgSrc = _b[0], setImgSrc = _b[1];
    var _c = (0, react_1.useState)(false), hasError = _c[0], setHasError = _c[1];
    (0, react_1.useEffect)(function () {
        setImgSrc(event.imageUrl);
        setHasError(false);
    }, [event.imageUrl]);
    var handleImageError = function () {
        setHasError(true);
    };
    return (<div onClick={function () { return onSelect(event); }} className="group bg-navy-800 border border-navy-700 rounded-xl overflow-hidden hover:border-wave-blue/50 hover:shadow-lg hover:shadow-wave-blue/10 transition-all cursor-pointer flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-navy-950 flex items-center justify-center">
        {!hasError && imgSrc && imgSrc !== 'null' ? (<img src={imgSrc} alt={"".concat(event.artistA.name, " vs ").concat(event.artistB.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={handleImageError} loading="lazy"/>) : (<div className="flex flex-col items-center justify-center text-slate-600">
            <lucide_react_1.Image size={32} className="mb-2 opacity-50"/>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-50">Event Image</span>
          </div>)}

        <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-900/40 to-transparent opacity-90"/>
        
        <div className="absolute top-3 right-3 z-10 flex gap-2">
           {isMultiRound && (<span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide bg-indigo-600/90 text-white border border-indigo-400/30 flex items-center gap-1 shadow-sm">
                <lucide_react_1.Layers size={10}/> {roundCount} Rounds
             </span>)}
           {event.isCommunityEvent && (<span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide bg-orange-500/90 text-white border border-orange-400/50 flex items-center gap-1 shadow-sm">
                <lucide_react_1.Users size={10}/> Community
             </span>)}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col -mt-12 relative z-10">
        <div className="flex justify-between items-center text-xs text-ui-gray mb-2">
          <div className="flex items-center gap-1 bg-navy-950/50 px-2 py-1 rounded-full backdrop-blur-sm border border-navy-700 font-mono">
            <lucide_react_1.Calendar size={12}/>
            {new Date(event.date).toLocaleDateString()}
          </div>
        </div>

        <h3 className="font-bold text-slate-100 text-lg mb-4 flex-1 drop-shadow-md">
          <span className="text-wave-blue">{event.artistA.name}</span>
          <span className="text-slate-500 mx-2 text-sm italic">vs</span>
          <span className="text-wave-green">{event.artistB.name}</span>
        </h3>

        <div className="mt-auto">
            <div className="w-full h-1 bg-navy-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-wave-blue/50" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">
                <span>{isMultiRound ? 'Full Event' : 'Single Battle'}</span>
                <span>View Stats &rarr;</span>
            </div>
        </div>
      </div>
    </div>);
};
exports.EventCard = react_1.default.memo(EventCardComponent);
