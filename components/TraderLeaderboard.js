"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderLeaderboard = void 0;
var react_1 = require("react");
var solanaService_1 = require("../services/solanaService");
var supabaseClient_1 = require("../services/supabaseClient");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("../utils");
var TraderLeaderboard = function (_a) {
    var battles = _a.battles, onSelectTrader = _a.onSelectTrader, solPrice = _a.solPrice;
    var _b = (0, react_1.useState)([]), traders = _b[0], setTraders = _b[1];
    var _c = (0, react_1.useState)(''), search = _c[0], setSearch = _c[1];
    var _d = (0, react_1.useState)(false), isScanning = _d[0], setIsScanning = _d[1];
    var _e = (0, react_1.useState)(0), progressCount = _e[0], setProgressCount = _e[1];
    var _f = (0, react_1.useState)('Empty'), dataOrigin = _f[0], setDataOrigin = _f[1];
    var rawStatsRef = (0, react_1.useRef)(new Map());
    var _g = (0, react_1.useState)('netPnL'), sortKey = _g[0], setSortKey = _g[1];
    var _h = (0, react_1.useState)('desc'), sortDir = _h[0], setSortDir = _h[1];
    // Load from DB on mount
    (0, react_1.useEffect)(function () {
        var init = function () { return __awaiter(void 0, void 0, void 0, function () {
            var cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supabaseClient_1.fetchTraderLeaderboardFromDB)()];
                    case 1:
                        cached = _a.sent();
                        if (cached && cached.length > 0) {
                            setTraders(cached);
                            setDataOrigin('Database');
                        }
                        else {
                            setDataOrigin('Empty');
                            // Auto scan if nothing in DB
                            startScan();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        init();
    }, []);
    var startScan = function () {
        setTraders([]);
        rawStatsRef.current.clear();
        setIsScanning(true);
        setProgressCount(0);
        setDataOrigin('Live');
    };
    // Scanning Logic
    (0, react_1.useEffect)(function () {
        var active = true;
        var runBatchScan = function () { return __awaiter(void 0, void 0, void 0, function () {
            var BATCH_SIZE, i, batch, batchResults, _loop_1, _i, batchResults_1, _a, wallet, stats, newTraderList, e_1, finalTraders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        BATCH_SIZE = 3;
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < battles.length)) return [3 /*break*/, 7];
                        if (!active || !isScanning)
                            return [3 /*break*/, 7];
                        batch = battles.slice(i, i + BATCH_SIZE);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, solanaService_1.fetchBatchTraderStats)(batch)];
                    case 3:
                        batchResults = _b.sent();
                        _loop_1 = function (wallet, stats) {
                            if (!rawStatsRef.current.has(wallet)) {
                                rawStatsRef.current.set(wallet, { invested: 0, payout: 0, battles: new Set() });
                            }
                            var entry = rawStatsRef.current.get(wallet);
                            entry.invested += stats.invested;
                            entry.payout += stats.payout;
                            stats.battles.forEach(function (b) { return entry.battles.add(b); });
                        };
                        for (_i = 0, batchResults_1 = batchResults; _i < batchResults_1.length; _i++) {
                            _a = batchResults_1[_i], wallet = _a[0], stats = _a[1];
                            _loop_1(wallet, stats);
                        }
                        newTraderList = Array.from(rawStatsRef.current.entries()).map(function (_a) {
                            var address = _a[0], data = _a[1];
                            var netPnL = data.payout - data.invested;
                            var roi = 0;
                            if (data.invested > 0)
                                roi = (netPnL / data.invested) * 100;
                            return {
                                walletAddress: address,
                                totalInvested: data.invested,
                                totalPayout: data.payout,
                                netPnL: netPnL,
                                roi: roi,
                                battlesParticipated: data.battles.size,
                                wins: netPnL > 0 ? 1 : 0,
                                losses: netPnL < 0 ? 1 : 0,
                                winRate: netPnL > 0 ? 100 : 0
                            };
                        });
                        setTraders(newTraderList);
                        setProgressCount(Math.min(i + BATCH_SIZE, battles.length));
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1500); })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        console.error("Batch scan failed", e_1);
                        return [3 /*break*/, 6];
                    case 6:
                        i += BATCH_SIZE;
                        return [3 /*break*/, 1];
                    case 7:
                        if (active && isScanning) {
                            setIsScanning(false);
                            finalTraders = Array.from(rawStatsRef.current.entries()).map(function (_a) {
                                var address = _a[0], data = _a[1];
                                var netPnL = data.payout - data.invested;
                                return {
                                    walletAddress: address,
                                    totalInvested: data.invested,
                                    totalPayout: data.payout,
                                    netPnL: netPnL,
                                    roi: data.invested > 0 ? (netPnL / data.invested) * 100 : 0,
                                    battlesParticipated: data.battles.size,
                                    wins: netPnL > 0 ? 1 : 0,
                                    losses: netPnL < 0 ? 1 : 0,
                                    winRate: 0
                                };
                            });
                            (0, supabaseClient_1.saveTraderLeaderboardToDB)(finalTraders);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        if (isScanning && battles.length > 0) {
            runBatchScan();
        }
        return function () { active = false; };
    }, [isScanning, battles]);
    var handleSort = function (key) {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortKey(key);
            setSortDir('desc');
        }
    };
    var filteredTraders = traders
        .filter(function (t) { return t.walletAddress.toLowerCase().includes(search.toLowerCase()); })
        .sort(function (a, b) {
        var valA = a[sortKey];
        var valB = b[sortKey];
        return sortDir === 'asc' ? valA - valB : valB - valA;
    });
    var SortIcon = function (_a) {
        var colKey = _a.colKey;
        if (sortKey !== colKey)
            return <lucide_react_1.ArrowUpDown size={12} className="opacity-30"/>;
        return sortDir === 'asc' ? <lucide_react_1.ArrowUp size={12} className="text-wave-blue"/> : <lucide_react_1.ArrowDown size={12} className="text-wave-blue"/>;
    };
    return (<div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <lucide_react_1.Search className="absolute left-3 top-2.5 text-ui-gray w-4 h-4"/>
          <input type="text" placeholder="Filter by Wallet Address..." className="w-full bg-navy-800 border border-navy-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-wave-blue transition-all placeholder:text-ui-gray" value={search} onChange={function (e) { return setSearch(e.target.value); }}/>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="flex-1 md:flex-none text-right">
                <div className="flex items-center justify-end gap-2 text-[10px] uppercase font-bold tracking-wider mb-1">
                    {dataOrigin === 'Database' ? (<span className="text-wave-green flex items-center gap-1"><lucide_react_1.Check size={10}/> Data from Cache</span>) : (<span className="text-ui-gray">
                           {isScanning ? 'Scanning Blockchain...' : 'Live Scan Complete'}
                        </span>)}
                </div>
                {isScanning && (<div className="flex items-center gap-2">
                        <div className="h-1.5 w-32 bg-navy-800 rounded-full overflow-hidden">
                            <div className={"h-full transition-all duration-500 ".concat(isScanning ? 'bg-wave-blue animate-pulse' : 'bg-wave-green')} style={{ width: "".concat((progressCount / Math.max(battles.length, 1)) * 100, "%") }}/>
                        </div>
                        <span className="text-xs font-mono text-ui-gray">{progressCount}/{battles.length}</span>
                    </div>)}
             </div>

            <button onClick={isScanning ? function () { return setIsScanning(false); } : startScan} className={"px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ".concat(isScanning
            ? 'bg-alert-red/10 text-alert-red border border-alert-red/30 hover:bg-alert-red/20'
            : 'bg-wave-blue text-navy-950 hover:bg-wave-blue/90 shadow-lg shadow-wave-blue/20')}>
              {isScanning ? <><lucide_react_1.StopCircle size={14}/> Stop</> : <><lucide_react_1.PlayCircle size={14}/> Force Rescan</>}
            </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden shadow-sm relative min-h-[400px]">
        
        {/* Loading State */}
        {traders.length === 0 && isScanning && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-950/80 z-20 backdrop-blur-sm">
             <lucide_react_1.Loader2 size={40} className="text-wave-blue animate-spin mb-4"/>
             <p className="text-ui-gray font-mono text-sm">Aggregating trader data across all battles...</p>
           </div>)}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-navy-900 border-b border-navy-700 text-ui-gray text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 w-16">Rank</th>
                <th className="p-4">Trader Wallet</th>
                <th className="p-4 text-right cursor-pointer hover:bg-navy-800/50 transition-colors select-none" onClick={function () { return handleSort('battlesParticipated'); }}>
                  <div className="flex items-center justify-end gap-1">Battles <SortIcon colKey="battlesParticipated"/></div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:bg-navy-800/50 transition-colors select-none" onClick={function () { return handleSort('totalInvested'); }}>
                  <div className="flex items-center justify-end gap-1">Total Vol <SortIcon colKey="totalInvested"/></div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:bg-navy-800/50 transition-colors select-none" onClick={function () { return handleSort('netPnL'); }}>
                  <div className="flex items-center justify-end gap-1">Net PnL <SortIcon colKey="netPnL"/></div>
                </th>
                <th className="p-4 text-right pr-6 cursor-pointer hover:bg-navy-800/50 transition-colors select-none" onClick={function () { return handleSort('roi'); }}>
                  <div className="flex items-center justify-end gap-1">ROI % <SortIcon colKey="roi"/></div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-navy-700">
              {filteredTraders.map(function (trader, index) { return (<tr key={trader.walletAddress} className="hover:bg-navy-700 transition-colors group">
                  <td className="p-4 pl-6">
                    <span className={"inline-flex items-center justify-center w-6 h-6 rounded font-bold text-xs ".concat(index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                index === 1 ? 'bg-slate-300/20 text-slate-300' :
                    index === 2 ? 'bg-orange-700/20 text-orange-500' :
                        'text-ui-gray')}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-navy-900 rounded-lg">
                        <lucide_react_1.Wallet size={16} className="text-ui-gray"/>
                      </div>
                      <button onClick={function () { return onSelectTrader(trader.walletAddress); }} className="font-mono text-slate-300 hover:text-wave-blue hover:underline text-xs sm:text-sm transition-colors text-left">
                        {trader.walletAddress}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-ui-gray">
                    {trader.battlesParticipated}
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-mono text-slate-200">{(0, utils_1.formatSol)(trader.totalInvested)}</div>
                    <div className="text-[10px] text-ui-gray">{(0, utils_1.formatUsd)(trader.totalInvested, solPrice)}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={"font-mono font-bold ".concat(trader.netPnL >= 0 ? 'text-green-400' : 'text-alert-red')}>
                       {trader.netPnL > 0 ? '+' : ''}{(0, utils_1.formatSol)(trader.netPnL)}
                    </div>
                    <div className="text-[10px] text-ui-gray">{(0, utils_1.formatUsd)(trader.netPnL, solPrice)}</div>
                  </td>
                  <td className={"p-4 text-right pr-6 font-mono ".concat(trader.roi >= 0 ? 'text-green-400' : 'text-alert-red')}>
                    {(0, utils_1.formatPct)(trader.roi)}
                  </td>
                </tr>); })}
              
              {!isScanning && filteredTraders.length === 0 && (<tr>
                   <td colSpan={6} className="p-12 text-center text-ui-gray">
                     <div className="flex flex-col items-center gap-2">
                       <lucide_react_1.Trophy size={32} className="opacity-20"/>
                       <p>No active traders found.</p>
                     </div>
                   </td>
                 </tr>)}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-navy-900 border-t border-navy-700 text-xs text-ui-gray flex justify-between items-center">
           <span>* Metrics based on realized PnL across {battles.length} battles.</span>
           <span className={isScanning ? 'text-wave-blue animate-pulse' : ''}>
               {isScanning ? 'Live Updating...' : "Last Updated: ".concat(new Date().toLocaleTimeString())}
           </span>
        </div>
      </div>
    </div>);
};
exports.TraderLeaderboard = TraderLeaderboard;
