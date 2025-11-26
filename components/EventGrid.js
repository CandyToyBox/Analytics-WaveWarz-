"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGrid = void 0;
var react_1 = require("react");
var EventCard_1 = require("./EventCard");
var EventGridComponent = function (_a) {
    var events = _a.events, onSelect = _a.onSelect;
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Live Events & Tournaments</h2>
        <span className="text-slate-400 text-sm">{events.length} Events</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map(function (event) { return (<EventCard_1.EventCard key={event.id} event={event} onSelect={onSelect}/>); })}
      </div>
    </div>);
};
exports.EventGrid = react_1.default.memo(EventGridComponent);
