"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatCard = void 0;
var react_1 = require("react");
var StatCard = function (_a) {
    var label = _a.label, value = _a.value, subValue = _a.subValue, icon = _a.icon, _b = _a.colorClass, colorClass = _b === void 0 ? "text-white" : _b, trend = _a.trend;
    return (<div className="bg-navy-800 border border-navy-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-ui-gray text-sm font-medium font-body">{label}</span>
        {icon && <div className={"".concat(colorClass, " opacity-80")}>{icon}</div>}
      </div>
      <div className={"text-2xl font-bold ".concat(colorClass)}>{value}</div>
      {subValue && (<div className="text-slate-500 text-xs mt-1 font-mono flex items-center gap-1">
          {subValue.startsWith('$') ? <span className="text-action-green/80">{subValue}</span> : subValue}
        </div>)}
    </div>);
};
exports.StatCard = StatCard;
