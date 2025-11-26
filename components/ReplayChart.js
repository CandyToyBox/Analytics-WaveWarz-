"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayChart = void 0;
var react_1 = require("react");
var recharts_1 = require("recharts");
var ReplayChart = function (_a) {
    var history = _a.history, currentTimestamp = _a.currentTimestamp, colorA = _a.colorA, colorB = _a.colorB, nameA = _a.nameA, nameB = _a.nameB;
    var data = history.map(function (h) { return (__assign(__assign({}, h), { timeLabel: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })); });
    return (<div className="h-64 w-full min-w-0 min-h-[200px]">
      <recharts_1.ResponsiveContainer width="100%" height="100%">
        <recharts_1.AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorA} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colorA} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorB} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colorB} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <recharts_1.CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false}/>
          <recharts_1.XAxis dataKey="timeLabel" stroke="#A0AEC0" fontSize={10} tickMargin={10} interval="preserveStartEnd"/>
          <recharts_1.YAxis stroke="#A0AEC0" fontSize={10} tickFormatter={function (val) { return "\u25CE".concat(val); }}/>
          <recharts_1.Tooltip contentStyle={{ backgroundColor: '#0D1321', borderColor: '#4A5568', color: '#f8fafc' }} itemStyle={{ fontSize: 12, fontFamily: 'monospace' }} labelStyle={{ fontSize: 10, color: '#A0AEC0', marginBottom: 5 }} cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '3 3' }}/>
          <recharts_1.Area type="monotone" dataKey="tvlA" name={nameA} stroke={colorA} fillOpacity={1} fill="url(#colorA)" strokeWidth={2}/>
          <recharts_1.Area type="monotone" dataKey="tvlB" name={nameB} stroke={colorB} fillOpacity={1} fill="url(#colorB)" strokeWidth={2}/>
          {/* The Playhead Line */}
          <recharts_1.ReferenceLine x={new Date(currentTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} stroke="#fff" strokeDasharray="3 3"/>
        </recharts_1.AreaChart>
      </recharts_1.ResponsiveContainer>
    </div>);
};
exports.ReplayChart = ReplayChart;
