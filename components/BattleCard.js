"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleCard = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var BattleCardComponent = function (_a) {
    var battle = _a.battle, onSelect = _a.onSelect;
    var _b = (0, react_1.useState)(battle.imageUrl), imgSrc = _b[0], setImgSrc = _b[1];
    var _c = (0, react_1.useState)(false), hasError = _c[0], setHasError = _c[1];
    var _d = (0, react_1.useState)(false), isLoaded = _d[0], setIsLoaded = _d[1];
    react_1.default.useEffect(function () {
        setImgSrc(battle.imageUrl);
        setHasError(false);
        setIsLoaded(false);
    }, [battle.imageUrl]);
    var handleImageError = function () {
        setHasError(true);
        setImgSrc('');
    };
    return (<div onClick={function () { return onSelect(battle); }} className="group bg-navy-800 border border-navy-700 rounded-xl overflow-hidden hover:border-wave-blue/50 hover:shadow-lg hover:shadow-wave-blue/10 transition-all cursor-pointer flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-navy-950 flex items-center justify-center">
        {!hasError && imgSrc && imgSrc !== 'null' ? (<>
             <img src={imgSrc} alt={"".concat(battle.artistA.name, " vs ").concat(battle.artistB.name)} className={"w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ".concat(isLoaded ? 'opacity-100' : 'opacity-0')} onError={handleImageError} onLoad={function () { return setIsLoaded(true); }} loading="lazy"/>
            {!isLoaded && (<div className="absolute inset-0 bg-navy-900 animate-pulse flex items-center justify-center">
                 <lucide_react_1.Image size={24} className="text-navy-700"/>
              </div>)}
          </>) : (<div className="flex flex-col items-center justify-center text-slate-600">
            <lucide_react_1.Image size={32} className="mb-2 opacity-50"/>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-50">No Image</span>
          </div>)}
        
        <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-900/20 to-transparent opacity-90"/>
        
        {/* Status label removed as per request for archive view */}

        {battle.isCommunityBattle && (<div className="absolute top-3 left-3 z-10">
             <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-orange-500/90 text-white border border-orange-400/50 flex items-center gap-1 shadow-sm">
                <lucide_react_1.Users size={10}/> Community
             </span>
          </div>)}

        <div className="absolute bottom-3 right-3 z-10">
          <div className="p-2 bg-navy-900/80 text-wave-blue border border-wave-blue/30 hover:bg-wave-blue hover:text-navy-950 rounded-full transition-all backdrop-blur-sm shadow-lg flex items-center gap-2 group/stats">
            <lucide_react_1.BarChart2 size={16}/>
            <span className="text-xs font-bold w-0 overflow-hidden group-hover/stats:w-auto transition-all duration-300 whitespace-nowrap">View Stats</span>
           </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col -mt-12 relative z-10">
        <div className="flex justify-between items-center text-xs text-ui-gray mb-2">
          <div className="flex items-center gap-1 bg-navy-950/50 px-2 py-1 rounded-full backdrop-blur-sm border border-navy-700 font-mono">
            <lucide_react_1.Calendar size={12}/>
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
             {battle.artistA.musicLink && (<a href={battle.artistA.musicLink} target="_blank" rel="noreferrer" onClick={function (e) { return e.stopPropagation(); }} className="flex-1 flex items-center justify-center py-2 rounded bg-wave-blue/10 hover:bg-wave-blue/20 text-wave-blue border border-wave-blue/20 transition-colors">
                 <lucide_react_1.Music size={14}/>
               </a>)}
             {battle.artistA.twitter && (<a href={"https://twitter.com/".concat(battle.artistA.twitter)} target="_blank" rel="noreferrer" onClick={function (e) { return e.stopPropagation(); }} className="flex-1 flex items-center justify-center py-2 rounded bg-navy-900 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 border border-navy-700 transition-colors">
                 <lucide_react_1.Twitter size={14}/>
               </a>)}
          </div>

           <div className="flex gap-1 justify-center">
             {battle.artistB.musicLink && (<a href={battle.artistB.musicLink} target="_blank" rel="noreferrer" onClick={function (e) { return e.stopPropagation(); }} className="flex-1 flex items-center justify-center py-2 rounded bg-wave-green/10 hover:bg-wave-green/20 text-wave-green border border-wave-green/20 transition-colors">
                 <lucide_react_1.Music size={14}/>
               </a>)}
              {battle.artistB.twitter && (<a href={"https://twitter.com/".concat(battle.artistB.twitter)} target="_blank" rel="noreferrer" onClick={function (e) { return e.stopPropagation(); }} className="flex-1 flex items-center justify-center py-2 rounded bg-navy-900 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 border border-navy-700 transition-colors">
                 <lucide_react_1.Twitter size={14}/>
               </a>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.BattleCard = react_1.default.memo(BattleCardComponent);
