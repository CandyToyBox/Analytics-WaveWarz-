"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MomentumGauge = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var MomentumGauge = function (_a) {
    var volA = _a.volA, volB = _a.volB, nameA = _a.nameA, nameB = _a.nameB, colorA = _a.colorA, colorB = _a.colorB;
    var total = volA + volB || 1;
    var pctA = (volA / total) * 100;
    // Calculate needle rotation: -90deg (A) to 90deg (B)
    var rotation = ((pctA / 100) * 180) - 90;
    // Invert rotation logic because 0% A means 100% B (Right side)
    // Let's map 100% A (Left) to -90deg, 0% A (Right) to 90deg
    // If volA is high, rotation should be negative (Left)
    // If volB is high (volA low), rotation should be positive (Right)
    // Actually, standard gauge: Left is 0, Right is 100.
    // Let's say Left side is Artist A, Right side is Artist B.
    // 50/50 is 0deg (Up).
    // If A has 80%, B has 20%. Needle points left.
    var needleDeg = -((pctA - 50) / 50) * 90;
    return (<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <lucide_react_1.Zap className="w-5 h-5 text-yellow-400 fill-yellow-400"/>
          Momentum
        </h3>
        <span className="text-xs text-slate-500 uppercase tracking-wider">Buying Pressure</span>
      </div>

      <div className="relative h-24 w-full flex justify-center items-end overflow-hidden">
         {/* Gauge Background */}
         <div className="absolute w-48 h-24 bg-slate-800 rounded-t-full top-0 overflow-hidden">
            <div className="w-full h-full flex">
                <div style={{ backgroundColor: colorA, opacity: 0.2 }} className="flex-1 h-full"/>
                <div style={{ backgroundColor: colorB, opacity: 0.2 }} className="flex-1 h-full"/>
            </div>
         </div>

         {/* Needle */}
         <div className="absolute bottom-0 w-1 h-24 bg-white origin-bottom transition-transform duration-700 ease-out z-10" style={{
            transform: "rotate(".concat(needleDeg, "deg)"),
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
        }}>
             <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-white rounded-full"/>
         </div>
         
         {/* Center Pivot */}
         <div className="absolute bottom-[-10px] w-8 h-8 bg-slate-700 rounded-full z-20 border-4 border-slate-900"/>
      </div>

      <div className="flex justify-between mt-2 text-xs font-bold">
        <div style={{ color: colorA }}>{Math.round(pctA)}% {nameA}</div>
        <div style={{ color: colorB }}>{Math.round(100 - pctA)}% {nameB}</div>
      </div>
    </div>);
};
exports.MomentumGauge = MomentumGauge;
