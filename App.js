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
exports.default = App;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("./utils");
var StatCard_1 = require("./components/StatCard");
var DistributionChart_1 = require("./components/DistributionChart");
var RoiCalculator_1 = require("./components/RoiCalculator");
var BattleReplay_1 = require("./components/BattleReplay");
var BattleGrid_1 = require("./components/BattleGrid");
var EventGrid_1 = require("./components/EventGrid");
var TraderLeaderboard_1 = require("./components/TraderLeaderboard");
var ArtistLeaderboard_1 = require("./components/ArtistLeaderboard");
var WhaleTicker_1 = require("./components/WhaleTicker");
var MomentumGauge_1 = require("./components/MomentumGauge");
var ShareButton_1 = require("./components/ShareButton");
var TraderProfile_1 = require("./components/TraderProfile");
var DebugDataSync_1 = require("./components/DebugDataSync");
var data_1 = require("./data");
var solanaService_1 = require("./services/solanaService");
var supabaseClient_1 = require("./services/supabaseClient");
var recharts_1 = require("recharts");
// --- FILTER LOGIC ---
var isValidBattle = function (b) {
    if (b.isCommunityBattle)
        return true;
    if (!b.imageUrl || b.imageUrl.trim() === '' || b.imageUrl === 'null')
        return false;
    var isTestName = function (name) {
        return name.includes('Artist ') && /\d/.test(name) && name.length < 20;
    };
    if (isTestName(b.artistA.name) || isTestName(b.artistB.name))
        return false;
    if (b.artistA.name.includes("Unknown") || b.artistB.name.includes("Unknown"))
        return false;
    if (b.artistA.name.includes("Unlisted") || b.artistB.name.includes("Unlisted"))
        return false;
    if (!b.artistA.wallet || !b.artistB.wallet)
        return false;
    return true;
};
function App() {
    var _this = this;
    var _a = (0, react_1.useState)('grid'), currentView = _a[0], setCurrentView = _a[1];
    var _b = (0, react_1.useState)('artists'), leaderboardTab = _b[0], setLeaderboardTab = _b[1];
    var _c = (0, react_1.useState)(null), selectedBattle = _c[0], setSelectedBattle = _c[1];
    var _d = (0, react_1.useState)(null), selectedEvent = _d[0], setSelectedEvent = _d[1];
    var _e = (0, react_1.useState)(null), traderStats = _e[0], setTraderStats = _e[1];
    var _f = (0, react_1.useState)(''), searchQuery = _f[0], setSearchQuery = _f[1];
    var _g = (0, react_1.useState)(''), debouncedSearchQuery = _g[0], setDebouncedSearchQuery = _g[1];
    var _h = (0, react_1.useState)(false), isLoading = _h[0], setIsLoading = _h[1];
    var pollingRef = (0, react_1.useRef)(null);
    var _j = (0, react_1.useState)([]), library = _j[0], setLibrary = _j[1];
    var _k = (0, react_1.useState)(0), solPrice = _k[0], setSolPrice = _k[1];
    var _l = (0, react_1.useState)('Local'), dataSource = _l[0], setDataSource = _l[1];
    (0, react_1.useEffect)(function () {
        function initData() {
            return __awaiter(this, void 0, void 0, function () {
                var resp, data, e_1, csvData, supabaseData, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')];
                        case 1:
                            resp = _a.sent();
                            return [4 /*yield*/, resp.json()];
                        case 2:
                            data = _a.sent();
                            if (data.solana.usd)
                                setSolPrice(data.solana.usd);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.warn("Failed to fetch SOL Price", e_1);
                            setSolPrice(200);
                            return [3 /*break*/, 4];
                        case 4:
                            csvData = (0, data_1.getBattleLibrary)();
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, (0, supabaseClient_1.fetchBattlesFromSupabase)()];
                        case 6:
                            supabaseData = _a.sent();
                            if (supabaseData && supabaseData.length > 0) {
                                console.log("Loaded battles from Supabase");
                                setLibrary(supabaseData);
                                setDataSource('Supabase');
                            }
                            else {
                                console.log("Using local CSV data");
                                setLibrary(csvData);
                                setDataSource('Local');
                            }
                            return [3 /*break*/, 8];
                        case 7:
                            e_2 = _a.sent();
                            console.warn("Error loading data, falling back to CSV", e_2);
                            setLibrary(csvData);
                            setDataSource('Local');
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
        initData();
    }, []);
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return function () { return clearTimeout(timer); };
    }, [searchQuery]);
    var validLibrary = (0, react_1.useMemo)(function () { return library.filter(isValidBattle); }, [library]);
    var events = (0, react_1.useMemo)(function () { return (0, utils_1.groupBattlesIntoEvents)(validLibrary); }, [validLibrary]);
    (0, react_1.useEffect)(function () {
        if (pollingRef.current)
            clearInterval(pollingRef.current);
        if (currentView === 'dashboard' && selectedBattle && !selectedBattle.isEnded) {
            pollingRef.current = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var freshData, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, solanaService_1.fetchBattleOnChain)(selectedBattle, true)];
                        case 1:
                            freshData = _a.sent();
                            setSelectedBattle(freshData);
                            return [3 /*break*/, 3];
                        case 2:
                            e_3 = _a.sent();
                            console.warn("Silent refresh failed", e_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, 15000);
        }
        return function () {
            if (pollingRef.current)
                clearInterval(pollingRef.current);
        };
    }, [currentView, selectedBattle === null || selectedBattle === void 0 ? void 0 : selectedBattle.id, selectedBattle === null || selectedBattle === void 0 ? void 0 : selectedBattle.isEnded]);
    var handleSearch = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var stats, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!searchQuery)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    if (!(searchQuery.length >= 32 && searchQuery.length <= 44)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, solanaService_1.fetchTraderProfile)(searchQuery, library)];
                case 2:
                    stats = _a.sent();
                    setTraderStats(stats);
                    setCurrentView('trader');
                    setSelectedBattle(null);
                    setSelectedEvent(null);
                    return [3 /*break*/, 4];
                case 3:
                    setCurrentView('grid');
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_1 = _a.sent();
                    console.error("Search failed", err_1);
                    alert("Could not find wallet or data. Please check the address.");
                    return [3 /*break*/, 7];
                case 6:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleSelectBattle = (0, react_1.useCallback)(function (summary) { return __awaiter(_this, void 0, void 0, function () {
        var fullData, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, solanaService_1.fetchBattleOnChain)(summary)];
                case 2:
                    fullData = _a.sent();
                    setSelectedBattle(fullData);
                    setCurrentView('dashboard');
                    return [3 /*break*/, 5];
                case 3:
                    e_4 = _a.sent();
                    console.error("Failed to fetch battle data", e_4);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    var handleSelectTrader = (0, react_1.useCallback)(function (wallet) { return __awaiter(_this, void 0, void 0, function () {
        var stats, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, solanaService_1.fetchTraderProfile)(wallet, library)];
                case 2:
                    stats = _a.sent();
                    setTraderStats(stats);
                    setCurrentView('trader');
                    return [3 /*break*/, 5];
                case 3:
                    e_5 = _a.sent();
                    console.error("Failed to fetch trader", e_5);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [library]);
    var handleSelectEvent = (0, react_1.useCallback)(function (event) {
        setSelectedEvent(event);
    }, []);
    var handleBack = (0, react_1.useCallback)(function () {
        if (currentView === 'dashboard' || currentView === 'replay') {
            if (selectedEvent) {
                setSelectedBattle(null);
                setCurrentView('events');
            }
            else {
                setCurrentView('grid');
                setSelectedBattle(null);
            }
        }
        else if (currentView === 'events' && selectedEvent) {
            setSelectedEvent(null);
        }
        else if (currentView === 'trader') {
            setCurrentView('grid');
            setTraderStats(null);
            setSearchQuery('');
        }
        else {
            setCurrentView('grid');
        }
    }, [currentView, selectedEvent]);
    var battle = selectedBattle;
    var winner = battle ? (0, utils_1.calculateTVLWinner)(battle) : 'A';
    var settlement = battle ? (0, utils_1.calculateSettlement)(battle) : null;
    var totalVolume = battle ? battle.totalVolumeA + battle.totalVolumeB : 0;
    var totalTVL = battle ? battle.artistASolBalance + battle.artistBSolBalance : 0;
    var tvlData = battle ? [
        { name: battle.artistA.name, value: battle.artistASolBalance, color: battle.artistA.color },
        { name: battle.artistB.name, value: battle.artistBSolBalance, color: battle.artistB.color },
    ] : [];
    var filteredBattles = (0, react_1.useMemo)(function () {
        if (!debouncedSearchQuery || debouncedSearchQuery.length > 30)
            return validLibrary;
        return validLibrary.filter(function (b) {
            return b.artistA.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                b.artistB.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        });
    }, [validLibrary, debouncedSearchQuery]);
    return (<div className="min-h-screen bg-navy-950 text-white font-sans selection:bg-wave-blue/30 pb-20">
      {/* Header / Nav */}
      <header className="border-b border-navy-800 bg-navy-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0" onClick={function () { setCurrentView('grid'); setSelectedEvent(null); setSelectedBattle(null); setSearchQuery(''); }}>
            {/* Logo Text Gradient */}
            <span className="font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-wave-blue to-wave-green drop-shadow-sm hidden sm:inline">
              WAVEWARZ
            </span>
            <span className="font-bold text-2xl tracking-tight text-white sm:hidden">WW</span>
          </div>

          <div className="flex-1 max-w-lg relative group">
             <form onSubmit={handleSearch} className="relative">
               <input type="text" placeholder="Search Artist or Paste Wallet Address..." className="w-full bg-navy-900 border border-navy-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-wave-blue focus:ring-1 focus:ring-wave-blue transition-all placeholder:text-slate-500 font-body" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
               <lucide_react_1.Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4 group-focus-within:text-wave-blue transition-colors"/>
             </form>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-action-green bg-action-green/10 px-3 py-1.5 rounded-full border border-action-green/30">
                <lucide_react_1.TrendingUp size={12}/>
                <span>SOL: ${solPrice.toFixed(2)}</span>
            </div>

            <div className="hidden md:flex bg-navy-900 rounded-lg p-1 border border-navy-800">
              <button onClick={function () { setCurrentView('grid'); setSelectedBattle(null); setSelectedEvent(null); }} className={"flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ".concat(currentView === 'grid'
            ? 'bg-navy-800 text-white shadow-sm'
            : 'text-ui-gray hover:text-white')}>
                <lucide_react_1.LayoutGrid size={14}/> Battles
              </button>
              <button onClick={function () { setCurrentView('events'); setSelectedBattle(null); }} className={"flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ".concat(currentView === 'events'
            ? 'bg-navy-800 text-white shadow-sm'
            : 'text-ui-gray hover:text-white')}>
                <lucide_react_1.CalendarDays size={14}/> Events
              </button>
              <button onClick={function () { setCurrentView('leaderboard'); setSelectedBattle(null); setSelectedEvent(null); }} className={"flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ".concat(currentView === 'leaderboard'
            ? 'bg-navy-800 text-white shadow-sm'
            : 'text-ui-gray hover:text-white')}>
                <lucide_react_1.ListOrdered size={14}/> Leaderboard
              </button>
            </div>

            {(currentView === 'dashboard' || currentView === 'replay') && battle && (<>
                <ShareButton_1.ShareButton battle={battle}/>
                <button onClick={function () { return setCurrentView(currentView === 'replay' ? 'dashboard' : 'replay'); }} className={"flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ".concat(currentView === 'replay'
                ? 'bg-wave-blue text-navy-950 border-wave-blue'
                : 'bg-wave-blue/10 text-wave-blue border-wave-blue/30 hover:bg-wave-blue/20')}>
                  <lucide_react_1.History size={14}/>
                  <span className="hidden sm:inline">{currentView === 'replay' ? 'Exit' : 'Replay'}</span>
                </button>
              </>)}
          </div>
        </div>
        
        {currentView === 'dashboard' && battle && battle.recentTrades.length > 0 && (<WhaleTicker_1.WhaleTicker trades={battle.recentTrades} artistAName={battle.artistA.name} artistBName={battle.artistB.name} colorA={battle.artistA.color} colorB={battle.artistB.color}/>)}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {isLoading && (<div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <lucide_react_1.Loader2 className="w-10 h-10 text-wave-blue animate-spin mb-4"/>
            <div className="text-slate-300 font-mono">Crunching Blockchain Data...</div>
          </div>)}

        {currentView === 'trader' && traderStats && (<div>
            <button onClick={handleBack} className="flex items-center gap-2 text-ui-gray hover:text-white transition-colors text-sm font-medium mb-6">
              <lucide_react_1.ArrowLeft size={16}/> Back
            </button>
            <TraderProfile_1.TraderProfile stats={traderStats} onClose={handleBack}/>
          </div>)}

        {currentView === 'grid' && (<BattleGrid_1.BattleGrid battles={filteredBattles} onSelect={handleSelectBattle}/>)}

        {currentView === 'events' && !selectedEvent && (<EventGrid_1.EventGrid events={events} onSelect={handleSelectEvent}/>)}

        {currentView === 'events' && selectedEvent && (<div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="flex items-center gap-4">
                <button onClick={function () { return setSelectedEvent(null); }} className="p-2 bg-navy-800 border border-navy-700 rounded-lg hover:bg-navy-700 transition-colors">
                  <lucide_react_1.ArrowLeft size={20} className="text-ui-gray"/>
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {selectedEvent.artistA.name} <span className="text-ui-gray text-lg">vs</span> {selectedEvent.artistB.name}
                  </h2>
                  <div className="text-ui-gray text-sm font-body">
                    {selectedEvent.rounds.length} Rounds • {new Date(selectedEvent.date).toLocaleDateString()}
                  </div>
                </div>
             </div>
             
             <div className="p-4 bg-wave-blue/10 border border-wave-blue/20 rounded-xl text-sm text-wave-blue flex items-start gap-3">
                <lucide_react_1.Trophy size={18} className="mt-0.5 shrink-0"/>
                <div className="font-body">
                  <strong className="block mb-1 font-sans">Winning Condition: Best 2 out of 3</strong>
                  The winner of the round is determined by winning 2 out of 3 categories: Charts, Judges Panel, and Audience Poll.
                </div>
             </div>

             <BattleGrid_1.BattleGrid battles={selectedEvent.rounds} onSelect={handleSelectBattle}/>
          </div>)}

        {currentView === 'leaderboard' && (<div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
                 
                 <div className="bg-navy-900 p-1 rounded-lg border border-navy-800 flex gap-1">
                   <button onClick={function () { return setLeaderboardTab('artists'); }} className={"px-4 py-2 rounded-md text-sm font-bold transition-all ".concat(leaderboardTab === 'artists'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-ui-gray hover:text-slate-300')}>
                     Artists
                   </button>
                   <button onClick={function () { return setLeaderboardTab('traders'); }} className={"px-4 py-2 rounded-md text-sm font-bold transition-all ".concat(leaderboardTab === 'traders'
                ? 'bg-wave-blue text-navy-950 shadow-sm'
                : 'text-ui-gray hover:text-slate-300')}>
                     Traders
                   </button>
                 </div>
              </div>
              
              {leaderboardTab === 'artists' ? (<ArtistLeaderboard_1.ArtistLeaderboard battles={validLibrary} solPrice={solPrice}/>) : (<TraderLeaderboard_1.TraderLeaderboard battles={validLibrary} onSelectTrader={handleSelectTrader} solPrice={solPrice}/>)}
           </div>)}

        {currentView === 'replay' && battle && (<BattleReplay_1.BattleReplay battle={battle} onExit={function () { return setCurrentView('dashboard'); }}/>)}

        {currentView === 'dashboard' && battle && settlement && (<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex justify-between items-center">
              <button onClick={handleBack} className="flex items-center gap-2 text-ui-gray hover:text-white transition-colors text-sm font-medium">
                <lucide_react_1.ArrowLeft size={16}/> 
                {selectedEvent ? 'Back to Event' : 'Back to Archive'}
              </button>

              <div className="flex gap-2">
                 <a href={"https://solscan.io/account/".concat(battle.battleAddress)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-navy-900 border border-navy-800 text-ui-gray px-3 py-1.5 rounded-full hover:bg-navy-800 hover:text-white transition-colors">
                   <lucide_react_1.ExternalLink size={12}/>
                   <span>View Contract</span>
                 </a>
                 <div className="flex items-center gap-1.5 text-xs bg-action-green/10 border border-action-green/30 text-action-green px-3 py-1.5 rounded-full">
                   <lucide_react_1.ShieldCheck size={12}/>
                   <span>Verified On-Chain</span>
                 </div>
              </div>
            </div>

            <section className="relative overflow-hidden rounded-3xl border border-navy-800 bg-navy-800/50 p-8 md:p-12">
               <div className="absolute inset-0 z-0">
                 <img src={battle.imageUrl} alt="Battle Background" className="w-full h-full object-cover opacity-20 blur-sm"/>
                 <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-950"></div>
               </div>

               <div className="absolute top-0 left-1/4 w-96 h-96 bg-wave-blue/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none z-0"></div>
               <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-wave-green/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none z-0"></div>

               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                  {/* Artist A */}
                  <div className={"flex flex-col items-center text-center transition-all duration-500 ".concat(winner === 'A' && battle.isEnded ? 'scale-110 drop-shadow-[0_0_15px_rgba(34,181,232,0.5)]' : 'opacity-80')}>
                    <div className="w-24 h-24 rounded-full p-1 border-2 border-wave-blue mb-4 overflow-hidden shadow-lg shadow-wave-blue/20 bg-navy-950">
                      {battle.artistA.avatar ? (<img src={battle.artistA.avatar} alt="A" className="w-full h-full object-cover rounded-full"/>) : (<div className="w-full h-full bg-wave-blue/20 flex items-center justify-center text-wave-blue font-bold text-2xl">A</div>)}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{battle.artistA.name}</h2>
                    <div className="mt-2 text-3xl font-mono font-bold text-wave-blue">{(0, utils_1.formatSol)(battle.artistASolBalance)}</div>
                    <div className="text-xs text-wave-blue text-opacity-80 font-mono">
                       {(0, utils_1.formatUsd)(battle.artistASolBalance, solPrice)}
                    </div>
                    <div className="text-xs text-wave-blue/70 uppercase tracking-widest mt-1 font-bold">Total Value Locked</div>
                    <div className="flex gap-2 mt-3">
                      {battle.artistA.twitter && (<a href={"https://twitter.com/".concat(battle.artistA.twitter)} target="_blank" rel="noreferrer" className="p-2 bg-navy-900 rounded-full hover:bg-sky-500 hover:text-white transition-colors text-ui-gray">
                          <lucide_react_1.Twitter size={14}/>
                        </a>)}
                      {battle.artistA.musicLink && (<a href={battle.artistA.musicLink} target="_blank" rel="noreferrer" className="p-2 bg-navy-900 rounded-full hover:bg-wave-blue hover:text-white transition-colors text-ui-gray">
                          <lucide_react_1.Music size={14}/>
                        </a>)}
                    </div>
                  </div>

                  {/* VS / Result */}
                  <div className="flex flex-col items-center">
                    {battle.isEnded ? (<div className="flex flex-col items-center animate-in zoom-in duration-300">
                        <lucide_react_1.Trophy className="w-12 h-12 text-yellow-400 mb-2 drop-shadow-lg"/>
                        <span className="text-yellow-400 font-bold tracking-widest uppercase">Chart Winner</span>
                        <span className="text-white font-bold text-lg mt-1 text-center max-w-[200px]">{winner === 'A' ? battle.artistA.name : battle.artistB.name}</span>
                        <span className="text-ui-gray text-sm mt-2 font-body">Margin: {(0, utils_1.formatSol)(settlement.winMargin)}</span>
                      </div>) : (<div className="flex flex-col items-center w-full max-w-xs">
                        <div className="text-ui-gray font-mono text-sm mb-2">{(0, utils_1.formatPct)(battle.artistASolBalance / (totalTVL || 1) * 100)} vs {(0, utils_1.formatPct)(battle.artistBSolBalance / (totalTVL || 1) * 100)}</div>
                        <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden flex">
                          <div className="h-full bg-wave-blue transition-all duration-500" style={{ width: "".concat((battle.artistASolBalance / (totalTVL || 1)) * 100, "%") }}></div>
                          <div className="h-full bg-wave-green transition-all duration-500" style={{ width: "".concat((battle.artistBSolBalance / (totalTVL || 1)) * 100, "%") }}></div>
                        </div>
                      </div>)}
                  </div>

                  {/* Artist B */}
                  <div className={"flex flex-col items-center text-center transition-all duration-500 ".concat(winner === 'B' && battle.isEnded ? 'scale-110 drop-shadow-[0_0_15px_rgba(111,243,75,0.5)]' : 'opacity-80')}>
                    <div className="w-24 h-24 rounded-full p-1 border-2 border-wave-green mb-4 overflow-hidden shadow-lg shadow-wave-green/20 bg-navy-950">
                       {battle.artistB.avatar ? (<img src={battle.artistB.avatar} alt="B" className="w-full h-full object-cover rounded-full"/>) : (<div className="w-full h-full bg-wave-green/20 flex items-center justify-center text-wave-green font-bold text-2xl">B</div>)}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{battle.artistB.name}</h2>
                    <div className="mt-2 text-3xl font-mono font-bold text-wave-green">{(0, utils_1.formatSol)(battle.artistBSolBalance)}</div>
                    <div className="text-xs text-wave-green text-opacity-80 font-mono">
                       {(0, utils_1.formatUsd)(battle.artistBSolBalance, solPrice)}
                    </div>
                    <div className="text-xs text-wave-green/70 uppercase tracking-widest mt-1 font-bold">Total Value Locked</div>
                    <div className="flex gap-2 mt-3">
                      {battle.artistB.twitter && (<a href={"https://twitter.com/".concat(battle.artistB.twitter)} target="_blank" rel="noreferrer" className="p-2 bg-navy-900 rounded-full hover:bg-sky-500 hover:text-white transition-colors text-ui-gray">
                          <lucide_react_1.Twitter size={14}/>
                        </a>)}
                      {battle.artistB.musicLink && (<a href={battle.artistB.musicLink} target="_blank" rel="noreferrer" className="p-2 bg-navy-900 rounded-full hover:bg-wave-green hover:text-white transition-colors text-ui-gray">
                          <lucide_react_1.Music size={14}/>
                        </a>)}
                    </div>
                  </div>
               </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard_1.StatCard label="Total Volume" value={(0, utils_1.formatSol)(totalVolume)} subValue={(0, utils_1.formatUsd)(totalVolume, solPrice)} icon={<lucide_react_1.BarChart3 size={20}/>} colorClass="text-wave-blue"/>
              <StatCard_1.StatCard label="Total Trades" value={battle.tradeCount.toString()} subValue={"".concat(battle.uniqueTraders, " Unique Wallets")} icon={<lucide_react_1.TrendingUp size={20}/>} colorClass="text-action-green"/>
               <StatCard_1.StatCard label="Artist A Volume" value={(0, utils_1.formatSol)(battle.totalVolumeA)} subValue={(0, utils_1.formatUsd)(battle.totalVolumeA, solPrice)} icon={<lucide_react_1.Activity size={20}/>} colorClass="text-wave-blue"/>
               <StatCard_1.StatCard label="Artist B Volume" value={(0, utils_1.formatSol)(battle.totalVolumeB)} subValue={(0, utils_1.formatUsd)(battle.totalVolumeB, solPrice)} icon={<lucide_react_1.Activity size={20}/>} colorClass="text-wave-green"/>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-8">
                
                <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <lucide_react_1.DollarSign className="w-5 h-5 text-action-green"/>
                      Loser's Pool Distribution
                    </h3>
                    <div className="text-right">
                      <span className="block text-sm text-ui-gray bg-navy-900 px-3 py-1 rounded-lg border border-navy-800">
                        Total: {(0, utils_1.formatSol)(settlement.loserPoolTotal)}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">{(0, utils_1.formatUsd)(settlement.loserPoolTotal, solPrice)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DistributionChart_1.DistributionChart settlement={settlement}/>
                    
                    <div className="space-y-4 flex flex-col justify-center font-body">
                      <div className="p-4 bg-navy-950/50 rounded-xl border-l-4 border-action-green">
                        <div className="flex justify-between items-center">
                          <span className="text-ui-gray text-sm">Winning Traders (40%)</span>
                          <span className="text-action-green font-bold font-mono">{(0, utils_1.formatSol)(settlement.toWinningTraders)}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-navy-950/50 rounded-xl border-l-4 border-alert-red">
                        <div className="flex justify-between items-center">
                          <span className="text-ui-gray text-sm">Losing Traders (50% Retained)</span>
                          <span className="text-alert-red font-bold font-mono">{(0, utils_1.formatSol)(settlement.toLosingTraders)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-navy-950/50 rounded-xl border-l-4 border-wave-green">
                          <div className="text-slate-500 text-xs mb-1">Win Artist (5%)</div>
                          <div className="text-wave-green font-mono text-sm">{(0, utils_1.formatSol)(settlement.toWinningArtist)}</div>
                        </div>
                        <div className="p-3 bg-navy-950/50 rounded-xl border-l-4 border-wave-blue">
                          <div className="text-slate-500 text-xs mb-1">Platform (3%)</div>
                          <div className="text-wave-blue font-mono text-sm">{(0, utils_1.formatSol)(settlement.toPlatform)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 h-80 flex flex-col min-w-0">
                    <h3 className="text-lg font-bold text-white mb-6">Current TVL Comparison</h3>
                    <div className="flex-1 w-full min-h-[200px] min-w-0">
                      <recharts_1.ResponsiveContainer width="100%" height="100%">
                        <recharts_1.BarChart data={tvlData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <recharts_1.XAxis type="number" hide/>
                          <recharts_1.YAxis type="category" dataKey="name" width={100} stroke="#94a3b8" fontSize={12} fontFamily="Rajdhani"/>
                          <recharts_1.Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#151e32', borderColor: '#4A5568', color: '#f8fafc', fontFamily: 'Inter' }} formatter={function (value) { return (0, utils_1.formatSol)(value); }}/>
                          <recharts_1.Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {tvlData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={entry.color}/>); })}
                          </recharts_1.Bar>
                        </recharts_1.BarChart>
                      </recharts_1.ResponsiveContainer>
                    </div>
                  </div>
                  
                  <MomentumGauge_1.MomentumGauge volA={battle.totalVolumeA} volB={battle.totalVolumeB} nameA={battle.artistA.name} nameB={battle.artistB.name} colorA={battle.artistA.color} colorB={battle.artistB.color}/>
                </div>
              </div>

              <div className="space-y-8">
                <RoiCalculator_1.RoiCalculator battleState={battle}/>

                <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6">
                   <h3 className="text-lg font-bold text-white mb-4">Total Fee Revenue</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-navy-700">
                        <span className="text-ui-gray text-sm font-body">Artist A Earned</span>
                        <div className="text-right">
                          <span className="block text-wave-blue font-mono">{(0, utils_1.formatSol)(settlement.artistAEarnings)}</span>
                          <span className="text-[10px] text-slate-500">{(0, utils_1.formatUsd)(settlement.artistAEarnings, solPrice)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-navy-700">
                        <span className="text-ui-gray text-sm font-body">Artist B Earned</span>
                        <div className="text-right">
                          <span className="block text-wave-green font-mono">{(0, utils_1.formatSol)(settlement.artistBEarnings)}</span>
                          <span className="text-[10px] text-slate-500">{(0, utils_1.formatUsd)(settlement.artistBEarnings, solPrice)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-ui-gray text-sm font-body">Platform Revenue</span>
                        <div className="text-right">
                           <span className="block text-indigo-400 font-mono">{(0, utils_1.formatSol)(settlement.platformEarnings)}</span>
                           <span className="text-[10px] text-slate-500">{(0, utils_1.formatUsd)(settlement.platformEarnings, solPrice)}</span>
                        </div>
                      </div>
                   </div>
                   <div className="mt-4 p-3 bg-wave-blue/10 rounded-lg text-xs text-wave-blue leading-relaxed font-body">
                     Fees are calculated from 1% volume + settlement bonuses.
                   </div>
                </div>

                <div className="bg-navy-900 border border-navy-800 rounded-xl p-4 text-xs font-mono text-slate-500 break-all space-y-2">
                    <div className="font-bold text-ui-gray mb-1">PROGRAM ADDRESSES</div>
                    <div>PDA: <span className="text-slate-300">{battle.battleAddress}</span></div>
                    {battle.treasuryWallet && <div>Treasury: <span className="text-slate-300">{battle.treasuryWallet}</span></div>}
                    {battle.onChainWalletA && <div>Wallet A: <span className="text-slate-300">{battle.onChainWalletA}</span></div>}
                    {battle.onChainWalletB && <div>Wallet B: <span className="text-slate-300">{battle.onChainWalletB}</span></div>}
                </div>
              </div>
            </div>
          </div>)}
      </main>
      
      <footer className="fixed bottom-0 w-full bg-navy-950 border-t border-navy-800 py-1 px-4 text-[10px] text-slate-600 flex justify-between items-center z-40 backdrop-blur-sm bg-opacity-90">
         <div>WaveWarz Analytics v2.1</div>
         <div className="flex gap-4">
            <div className={"flex items-center gap-1.5 ".concat(dataSource === 'Supabase' ? 'text-action-green' : 'text-orange-500')}>
               <lucide_react_1.Database size={10}/>
               <span>Data Source: {dataSource}</span>
            </div>
            <div>RPC: Helius Mainnet</div>
         </div>
      </footer>

      <DebugDataSync_1.DebugDataSync />
    </div>);
}
