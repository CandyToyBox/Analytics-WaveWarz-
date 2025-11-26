"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleGrid = void 0;
var react_1 = require("react");
var BattleCard_1 = require("./BattleCard");
var BattleGridComponent = function (_a) {
    var battles = _a.battles, onSelect = _a.onSelect;
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Battle Archive</h2>
        <span className="text-slate-400 text-sm">{battles.length} Battles Recorded</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {battles.map(function (battle) { return (<BattleCard_1.BattleCard key={battle.id} battle={battle} onSelect={onSelect}/>); })}
      </div>
    </div>);
};
exports.BattleGrid = react_1.default.memo(BattleGridComponent);
