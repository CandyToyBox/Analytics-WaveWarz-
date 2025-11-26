"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhaleTicker = void 0;
var react_1 = require("react");
var utils_1 = require("../utils");
var lucide_react_1 = require("lucide-react");
var WhaleTicker = function (_a) {
    var trades = _a.trades, artistAName = _a.artistAName, artistBName = _a.artistBName, colorA = _a.colorA, colorB = _a.colorB;
    // Filter for whales (> 0.5 SOL for demo purposes)
    var whales = trades.filter(function (t) { return t.amount > 0.5; });
    if (whales.length === 0)
        return null;
    return (<div className="w-full bg-slate-900 border-y border-slate-800 overflow-hidden py-2 relative">
      <div className="flex animate-marquee gap-8 whitespace-nowrap px-4">
        {whales.map(function (trade, i) { return (<div key={trade.signature + i} className="flex items-center gap-2 text-sm font-mono">
             <lucide_react_1.CircleDollarSign className="w-4 h-4 text-yellow-400"/>
             <span className="text-white font-bold">{(0, utils_1.formatSol)(trade.amount)}</span>
             <span className={"flex items-center text-xs px-2 py-0.5 rounded-full ".concat(trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                {trade.type} 
                {trade.type === 'BUY' ? <lucide_react_1.ArrowUpRight size={12} className="ml-1"/> : <lucide_react_1.ArrowDownLeft size={12} className="ml-1"/>}
             </span>
             <span className="text-slate-500 text-xs">
               by {trade.trader.slice(0, 4)}...{trade.trader.slice(-4)}
             </span>
          </div>); })}
        {/* Duplicate for seamless loop */}
        {whales.map(function (trade, i) { return (<div key={trade.signature + i + '_dup'} className="flex items-center gap-2 text-sm font-mono">
             <lucide_react_1.CircleDollarSign className="w-4 h-4 text-yellow-400"/>
             <span className="text-white font-bold">{(0, utils_1.formatSol)(trade.amount)}</span>
             <span className={"flex items-center text-xs px-2 py-0.5 rounded-full ".concat(trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                {trade.type}
                {trade.type === 'BUY' ? <lucide_react_1.ArrowUpRight size={12} className="ml-1"/> : <lucide_react_1.ArrowDownLeft size={12} className="ml-1"/>}
             </span>
             <span className="text-slate-500 text-xs">
               by {trade.trader.slice(0, 4)}...{trade.trader.slice(-4)}
             </span>
          </div>); })}
      </div>
      <style>{"\n        .animate-marquee {\n          animation: marquee 20s linear infinite;\n        }\n        @keyframes marquee {\n          0% { transform: translateX(0); }\n          100% { transform: translateX(-50%); }\n        }\n      "}</style>
    </div>);
};
exports.WhaleTicker = WhaleTicker;
