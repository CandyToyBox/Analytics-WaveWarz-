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
exports.ShareButton = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("../utils");
var ShareButton = function (_a) {
    var battle = _a.battle;
    var _b = (0, react_1.useState)(false), copied = _b[0], setCopied = _b[1];
    var handleShare = function () { return __awaiter(void 0, void 0, void 0, function () {
        var winner, text, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    winner = battle.artistASolBalance > battle.artistBSolBalance ? battle.artistA.name : battle.artistB.name;
                    text = "\uD83C\uDF0A WaveWarz Analytics Update!\n\n\u2694\uFE0F ".concat(battle.artistA.name, " vs ").concat(battle.artistB.name, "\n\n\uD83C\uDFC6 Leader: ").concat(winner, "\n\uD83D\uDCB0 TVL A: ").concat((0, utils_1.formatSol)(battle.artistASolBalance), "\n\uD83D\uDCB0 TVL B: ").concat((0, utils_1.formatSol)(battle.artistBSolBalance), "\n\uD83D\uDCCA Vol: ").concat((0, utils_1.formatSol)(battle.totalVolumeA + battle.totalVolumeB), "\n\nCheck the analytics live! #WaveWarz #Solana");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.clipboard.writeText(text)];
                case 2:
                    _a.sent();
                    setCopied(true);
                    setTimeout(function () { return setCopied(false); }, 2000);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('Failed to copy', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<button onClick={handleShare} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white">
      {copied ? <lucide_react_1.Check size={14} className="text-green-400"/> : <lucide_react_1.Share2 size={14}/>}
      {copied ? 'Copied!' : 'Share Stats'}
    </button>);
};
exports.ShareButton = ShareButton;
