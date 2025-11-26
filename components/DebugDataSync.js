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
exports.DebugDataSync = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var data_1 = require("../data");
var supabaseClient_1 = require("../services/supabaseClient");
var DebugDataSync = function () {
    var _a = (0, react_1.useState)('checking'), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(''), message = _b[0], setMessage = _b[1];
    (0, react_1.useEffect)(function () {
        checkStatus();
    }, []);
    var checkStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supabaseClient_1.fetchBattlesFromSupabase)()];
                case 1:
                    existingData = _a.sent();
                    if (existingData && existingData.length > 0) {
                        setStatus('synced');
                    }
                    else {
                        setStatus('idle');
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSync = function () { return __awaiter(void 0, void 0, void 0, function () {
        var localData, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setStatus('uploading');
                    setMessage('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    localData = (0, data_1.getBattleLibrary)();
                    console.log("Starting sync with", localData.length, "records...");
                    return [4 /*yield*/, (0, supabaseClient_1.uploadBattlesToSupabase)(localData)];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        setStatus('success');
                        setMessage(result.message);
                        // Reload page after 2s to fetch from DB
                        setTimeout(function () { return window.location.reload(); }, 2000);
                    }
                    else {
                        setStatus('error');
                        setMessage(result.message || "Unknown upload error");
                        console.error("Sync Error:", result);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    setStatus('error');
                    setMessage(e_1.message || "Critical failure during sync");
                    console.error("Critical Sync Error:", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // If fully synced, show a minimal badge or nothing
    if (status === 'synced') {
        return null; // Hide completely if working perfectly
        // Or return a small badge:
        /*
        return (
          <div className="fixed bottom-4 right-4 z-50 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              <CheckCircle size={12} /> Database Connected
          </div>
        );
        */
    }
    return (<div className="fixed bottom-8 right-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 w-80">
        <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold text-sm">
          <lucide_react_1.Database size={16}/>
          <span>Database Sync Tool</span>
        </div>
        
        {status === 'checking' && (<div className="flex items-center gap-2 text-slate-500 text-xs">
                 <lucide_react_1.Loader2 size={12} className="animate-spin"/> Checking connection...
             </div>)}

        {status === 'idle' && (<>
            <p className="text-xs text-slate-500 mb-4">
            Upload local battle data to your new Supabase table. Only run this once.
            </p>
            <button onClick={handleSync} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-bold transition-colors">
                <lucide_react_1.UploadCloud size={14}/> Sync Local Data to DB
            </button>
          </>)}

        {status === 'uploading' && (<button disabled className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-400 py-2 rounded-lg text-xs font-bold cursor-not-allowed">
            <lucide_react_1.Loader2 size={14} className="animate-spin"/> Uploading...
          </button>)}

        {status === 'success' && (<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-1">
               <lucide_react_1.CheckCircle size={14}/> Success
             </div>
             <div className="text-[10px] text-green-300">{message}</div>
             <div className="text-[10px] text-slate-500 mt-1">Refresing page...</div>
          </div>)}

        {status === 'error' && (<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1">
               <lucide_react_1.AlertCircle size={14}/> Error
             </div>
             <div className="text-[10px] text-red-300 break-words font-mono max-h-24 overflow-y-auto">
               {message}
             </div>
          </div>)}
      </div>
    </div>);
};
exports.DebugDataSync = DebugDataSync;
