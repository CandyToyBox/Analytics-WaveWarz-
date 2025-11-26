"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionChart = void 0;
var react_1 = require("react");
var recharts_1 = require("recharts");
var utils_1 = require("../utils");
var DistributionChart = function (_a) {
    var settlement = _a.settlement;
    var data = [
        { name: 'Winning Traders', value: settlement.toWinningTraders, color: '#22c55e' }, // Green
        { name: 'Losing Traders', value: settlement.toLosingTraders, color: '#ef4444' }, // Red
        { name: 'Winning Artist', value: settlement.toWinningArtist, color: '#e879f9' }, // Fuchsia
        { name: 'Platform', value: settlement.toPlatform, color: '#3b82f6' }, // Blue
        { name: 'Losing Artist', value: settlement.toLosingArtist, color: '#f59e0b' }, // Amber
    ];
    return (<div className="h-80 w-full min-w-0 min-h-[300px]">
      <recharts_1.ResponsiveContainer width="100%" height="100%">
        <recharts_1.PieChart>
          <recharts_1.Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {data.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={entry.color} stroke="rgba(0,0,0,0.5)"/>); })}
          </recharts_1.Pie>
          <recharts_1.Tooltip formatter={function (value) { return (0, utils_1.formatSol)(value); }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}/>
          <recharts_1.Legend wrapperStyle={{ fontSize: '12px' }}/>
        </recharts_1.PieChart>
      </recharts_1.ResponsiveContainer>
    </div>);
};
exports.DistributionChart = DistributionChart;
