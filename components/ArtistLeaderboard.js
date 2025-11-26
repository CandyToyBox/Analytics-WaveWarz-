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
exports.ArtistLeaderboard = void 0;
var react_1 = require("react");
var artistLeaderboardService_1 = require("../services/artistLeaderboardService");
var solanaService_1 = require("../services/solanaService");
var supabaseClient_1 = require("../services/supabaseClient");
var utils_1 = require("../utils");
var lucide_react_1 = require("lucide-react");
var ArtistLeaderboard = function (_a) {
    var battles = _a.battles, solPrice = _a.solPrice;
    var _b = (0, react_1.useState)([]), stats = _b[0], setStats = _b[1];
    var _c = (0, react_1.useState)(false), isScanning = _c[0], setIsScanning = _c[1];
    var _d = (0, react_1.useState)(0), scanProgress = _d[0], setScanProgress = _d[1];
    var _e = (0, react_1.useState)('Estimated'), dataOrigin = _e[0], setDataOrigin = _e[1];
    // Load Data Effect
    (0, react_1.useEffect)(function () {
        var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var dbStats, hydrated, initialStates, calculated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supabaseClient_1.fetchArtistLeaderboardFromDB)()];
                    case 1:
                        dbStats = _a.sent();
                        if (dbStats && dbStats.length > 0) {
                            hydrated = dbStats.map(function (s) { return (__assign(__assign({}, s), { totalEarningsUsd: s.totalEarningsSol * solPrice, 
                                // Re-calc spotify if price changes significantly
                                spotifyStreamEquivalents: (s.totalEarningsSol * solPrice) / 0.003 })); }).sort(function (a, b) { return b.totalEarningsSol - a.totalEarningsSol; });
                            setStats(hydrated);
                            setDataOrigin('Database');
                        }
                        else {
                            initialStates = (0, artistLeaderboardService_1.mockEstimateVolumes)(battles);
                            calculated = (0, artistLeaderboardService_1.calculateArtistLeaderboard)(initialStates, solPrice);
                            setStats(calculated);
                            setDataOrigin('Estimated');
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        loadData();
    }, [battles.length, solPrice]); // Re-run if battle count changes significantly or price updates
    var handleScan = function () { return __awaiter(void 0, void 0, void 0, function () {
        var enrichedBattles, BATCH_SIZE, DELAY, i, batch, promises, results, e_1, refinedStats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsScanning(true);
                    setScanProgress(0);
                    enrichedBattles = [];
                    BATCH_SIZE = 2;
                    DELAY = 2000;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < battles.length)) return [3 /*break*/, 8];
                    batch = battles.slice(i, i + BATCH_SIZE);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    promises = batch.map(function (b) { return (0, solanaService_1.fetchBattleOnChain)(b); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 3:
                    results = _a.sent();
                    enrichedBattles.push.apply(enrichedBattles, results);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error("Batch error", e_1);
                    enrichedBattles.push.apply(enrichedBattles, batch.map(function (b) { return (__assign(__assign({}, b), { startTime: 0, endTime: 0, isEnded: true, artistASolBalance: b.artistASolBalance || 0, artistBSolBalance: b.artistBSolBalance || 0, artistASupply: 0, artistBSupply: 0, totalVolumeA: 0, totalVolumeB: 0, tradeCount: 0, uniqueTraders: 0, recentTrades: [], battleAddress: '' })); }));
                    return [3 /*break*/, 5];
                case 5:
                    setScanProgress(enrichedBattles.length);
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, DELAY); })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    i += BATCH_SIZE;
                    return [3 /*break*/, 1];
                case 8:
                    refinedStats = (0, artistLeaderboardService_1.calculateArtistLeaderboard)(enrichedBattles, solPrice);
                    setStats(refinedStats);
                    setDataOrigin('Live');
                    setIsScanning(false);
                    // Save to DB for next time
                    return [4 /*yield*/, (0, supabaseClient_1.saveArtistLeaderboardToDB)(refinedStats)];
                case 9:
                    // Save to DB for next time
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var topArtist = stats[0];
    var runnersUp = stats.slice(1, 3);
    var rest = stats.slice(3);
    var TotalPayouts = stats.reduce(function (acc, curr) { return acc + curr.totalEarningsSol; }, 0);
    var TotalStreams = stats.reduce(function (acc, curr) { return acc + curr.spotifyStreamEquivalents; }, 0);
    return (<div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Header Stats */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden shadow-lg">
             <div className="relative z-10">
                <h2 className="text-wave-blue text-sm uppercase tracking-widest font-bold mb-2">Total Artist Payouts</h2>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                    {(0, utils_1.formatSol)(TotalPayouts)} 
                    <span className="text-2xl text-ui-gray font-normal ml-2">({(0, utils_1.formatUsd)(TotalPayouts, solPrice)})</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-wave-green/10 text-wave-green px-4 py-2 rounded-full border border-wave-green/20 backdrop-blur-sm mt-4 shadow-sm">
                    <lucide_react_1.Music size={20} className="animate-pulse"/>
                    <span className="font-bold">Equivalent to {TotalStreams.toLocaleString()} Spotify Streams</span>
                </div>
             </div>
             {/* Background Gradient Accents */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-wave-blue/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-wave-green/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        </div>

        {/* Data Source Control */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-ui-gray">
               {dataOrigin === 'Database' && <><lucide_react_1.Check size={14} className="text-wave-green"/> Loaded from Cache</>}
               {dataOrigin === 'Estimated' && <span className="text-orange-400">Viewing Estimated Data</span>}
               {dataOrigin === 'Live' && <span className="text-wave-green font-bold">Live On-Chain Data (Synced)</span>}
            </div>

             {isScanning ? (<div className="flex items-center gap-3 bg-navy-900 px-4 py-2 rounded-lg border border-navy-800">
                    <lucide_react_1.Loader2 className="animate-spin text-wave-blue" size={16}/>
                    <span className="text-xs text-ui-gray">Scanning Blockchain... ({scanProgress}/{battles.length})</span>
                 </div>) : (<button onClick={handleScan} className={"flex items-center gap-2 text-xs font-bold transition-colors ".concat(dataOrigin === 'Database' ? 'text-ui-gray hover:text-white' : 'text-wave-blue hover:text-white')}>
                    <lucide_react_1.PlayCircle size={14}/> {dataOrigin === 'Database' ? 'Force Resync Volume' : 'Sync Real-Time Volume'}
                 </button>)}
        </div>

        {/* The Podium (Top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {runnersUp[0] && <ArtistCard artist={runnersUp[0]} rank={2} solPrice={solPrice}/>}
            {topArtist && <ArtistCard artist={topArtist} rank={1} solPrice={solPrice} isWinner/>}
            {runnersUp[1] && <ArtistCard artist={runnersUp[1]} rank={3} solPrice={solPrice}/>}
        </div>

        {/* The List (Rest) */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden">
            <div className="p-4 bg-navy-900 border-b border-navy-700 text-xs font-bold text-ui-gray uppercase tracking-wider flex justify-between">
                <span>Rank 4+</span>
                <span>Earnings Breakdown</span>
            </div>
            <div className="divide-y divide-navy-700">
                {rest.map(function (artist, idx) { return (<div key={artist.artistName} className="p-4 hover:bg-navy-700 transition-colors flex flex-col sm:flex-row items-center gap-4">
                        <div className="font-mono text-ui-gray w-8 text-center font-bold">#{idx + 4}</div>
                        
                        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-full bg-navy-900 overflow-hidden shrink-0 border border-navy-700">
                                {artist.imageUrl ? (<img src={artist.imageUrl} className="w-full h-full object-cover" alt={artist.artistName}/>) : (<div className="w-full h-full flex items-center justify-center text-ui-gray">
                                        <lucide_react_1.Music size={16}/>
                                    </div>)}
                            </div>
                            <div>
                                <div className="font-bold text-white">{artist.artistName}</div>
                                <div className="text-xs text-ui-gray flex gap-2">
                                    <span>{artist.battlesParticipated} Battles</span>
                                    <span>•</span>
                                    <span>{(0, utils_1.formatPct)(artist.winRate)} WR</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-8 w-full sm:w-auto justify-between sm:justify-end">
                             <div className="text-right">
                                <div className="text-xs text-ui-gray mb-0.5">Stream Equiv.</div>
                                <div className="font-bold text-wave-green flex items-center justify-end gap-1">
                                    <lucide_react_1.Disc size={12}/>
                                    {artist.spotifyStreamEquivalents.toLocaleString()}
                                </div>
                             </div>
                             <div className="text-right min-w-[100px]">
                                <div className="text-xs text-ui-gray mb-0.5">Total Earnings</div>
                                <div className="font-bold text-white font-mono">{(0, utils_1.formatSol)(artist.totalEarningsSol)}</div>
                                <div className="text-[10px] text-ui-gray">{(0, utils_1.formatUsd)(artist.totalEarningsSol, solPrice)}</div>
                             </div>
                        </div>
                    </div>); })}
            </div>
        </div>
    </div>);
};
exports.ArtistLeaderboard = ArtistLeaderboard;
var ArtistCard = function (_a) {
    var artist = _a.artist, rank = _a.rank, isWinner = _a.isWinner, solPrice = _a.solPrice;
    return (<div className={"relative bg-navy-800 border ".concat(isWinner ? 'border-yellow-500/50 shadow-xl shadow-yellow-900/10' : 'border-navy-700', " rounded-2xl overflow-hidden flex flex-col ").concat(isWinner ? 'md:-mt-12 z-10' : '')}>
            {isWinner && (<div className="bg-yellow-500 text-navy-950 text-center py-1 text-xs font-bold uppercase tracking-widest">
                    #1 Top Earner
                </div>)}
            
            <div className="p-6 flex flex-col items-center text-center">
                <div className={"relative mb-4 ".concat(isWinner ? 'w-24 h-24' : 'w-20 h-20')}>
                    <div className={"w-full h-full rounded-full overflow-hidden border-4 ".concat(isWinner ? 'border-yellow-500' : rank === 2 ? 'border-slate-300' : 'border-orange-700')}>
                        {artist.imageUrl ? (<img src={artist.imageUrl} alt={artist.artistName} className="w-full h-full object-cover"/>) : (<div className="w-full h-full bg-navy-900 flex items-center justify-center text-ui-gray"><lucide_react_1.Music /></div>)}
                    </div>
                    <div className={"absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-navy-800 ".concat(isWinner ? 'bg-yellow-500 text-black' : rank === 2 ? 'bg-slate-300 text-black' : 'bg-orange-700 text-white')}>
                        #{rank}
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 truncate w-full">{artist.artistName}</h3>
                
                <div className="my-4 w-full bg-navy-900 rounded-xl p-3 border border-navy-700">
                    <div className="text-[10px] text-ui-gray uppercase tracking-wider mb-1">Stream Equivalent</div>
                    <div className="text-xl font-black text-wave-green flex items-center justify-center gap-1.5">
                        <lucide_react_1.Disc size={18} className="animate-spin-slow"/>
                        {artist.spotifyStreamEquivalents.toLocaleString()}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-4">
                    <div>
                        <div className="text-xs text-ui-gray">Earnings</div>
                        <div className="font-bold text-white">{(0, utils_1.formatSol)(artist.totalEarningsSol)}</div>
                        <div className="text-[10px] text-ui-gray">{(0, utils_1.formatUsd)(artist.totalEarningsSol, solPrice)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-ui-gray">Win Rate</div>
                        <div className="font-bold text-wave-blue">{(0, utils_1.formatPct)(artist.winRate)}</div>
                        <div className="text-[10px] text-ui-gray">{artist.wins}W - {artist.losses}L</div>
                    </div>
                </div>

                <div className="flex gap-2 w-full pt-4 border-t border-navy-700">
                    {artist.twitterHandle && (<a href={"https://twitter.com/".concat(artist.twitterHandle)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-2 rounded bg-navy-900 hover:bg-sky-500/10 text-ui-gray hover:text-sky-400 border border-navy-700 transition-colors">
                            <lucide_react_1.Twitter size={16}/>
                        </a>)}
                    {artist.musicLink && (<a href={artist.musicLink} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-2 rounded bg-navy-900 hover:bg-wave-green/10 text-ui-gray hover:text-wave-green border border-navy-700 transition-colors">
                            <lucide_react_1.Music size={16}/>
                        </a>)}
                </div>
            </div>
        </div>);
};
