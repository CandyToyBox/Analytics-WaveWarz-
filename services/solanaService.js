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
exports.deriveBattleVaultPDA = exports.deriveBattlePDA = void 0;
exports.fetchBattleOnChain = fetchBattleOnChain;
exports.fetchBatchTraderStats = fetchBatchTraderStats;
exports.fetchTraderProfile = fetchTraderProfile;
var web3_js_1 = require("@solana/web3.js");
var supabaseClient_1 = require("./supabaseClient");
// --- CONFIGURATION ---
var HELIUS_API_KEY = "8b84d8d3-59ad-4778-829b-47db8a9149fa";
var PROGRAM_ID = new web3_js_1.PublicKey("9TUfEHvk5fN5vogtQyrefgNqzKy2Bqb4nWVhSFUg2fYo");
var RPC_URL = "https://mainnet.helius-rpc.com/?api-key=".concat(HELIUS_API_KEY);
var BATTLE_SEED = 'battle';
var VAULT_SEED = 'battle_vault';
// --- PERFORMANCE OPTIMIZATION ---
// Create the encoder once instead of every time deriveBattlePDA is called
var encoder = new TextEncoder();
var battleSeedBuffer = encoder.encode(BATTLE_SEED);
var vaultSeedBuffer = encoder.encode(VAULT_SEED);
var battleCache = new Map();
var CACHE_TTL = 300000; // 5 minutes (Matches database cache validity idea)
// --- HELPERS ---
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
// Rate Limited Fetch Wrapper
// Increased retries to 6 and backoff to 2000ms base
function fetchWithRetry(url_1, options_1) {
    return __awaiter(this, arguments, void 0, function (url, options, retries, backoff) {
        var response, err_1;
        if (retries === void 0) { retries = 6; }
        if (backoff === void 0) { backoff = 2000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 7]);
                    return [4 /*yield*/, fetch(url, options)];
                case 1:
                    response = _a.sent();
                    if (!(response.status === 429)) return [3 /*break*/, 3];
                    if (retries <= 0)
                        throw new Error("Rate limit exceeded");
                    console.warn("Rate limited. Retrying in ".concat(backoff, "ms..."));
                    return [4 /*yield*/, sleep(backoff)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, fetchWithRetry(url, options, retries - 1, backoff * 2)];
                case 3:
                    if (!response.ok) {
                        throw new Error("HTTP Error: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    err_1 = _a.sent();
                    if (retries <= 0)
                        throw err_1;
                    return [4 /*yield*/, sleep(backoff)];
                case 6:
                    _a.sent();
                    return [2 /*return*/, fetchWithRetry(url, options, retries - 1, backoff * 2)];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// --- 1. PDA DERIVATION ---
var deriveBattlePDA = function (battleId) {
    var buffer = new ArrayBuffer(8);
    var view = new DataView(buffer);
    view.setBigUint64(0, BigInt(battleId), true);
    var pda = web3_js_1.PublicKey.findProgramAddressSync([
        battleSeedBuffer,
        new Uint8Array(buffer)
    ], PROGRAM_ID)[0];
    return pda;
};
exports.deriveBattlePDA = deriveBattlePDA;
var deriveBattleVaultPDA = function (battleId) {
    var buffer = new ArrayBuffer(8);
    var view = new DataView(buffer);
    view.setBigUint64(0, BigInt(battleId), true);
    var pda = web3_js_1.PublicKey.findProgramAddressSync([
        vaultSeedBuffer,
        new Uint8Array(buffer)
    ], PROGRAM_ID)[0];
    return pda;
};
exports.deriveBattleVaultPDA = deriveBattleVaultPDA;
// --- 2. ACCOUNT DECODING ---
function decodeBattleAccount(data, summary) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    var offset = 8; // Skip Discriminator
    var onChainBattleId = view.getBigUint64(offset, true);
    offset += 8;
    offset += 4; // bumps
    var startTime = Number(view.getBigInt64(offset, true));
    offset += 8;
    var endTime = Number(view.getBigInt64(offset, true));
    offset += 8;
    // Extract Public Keys (32 bytes each)
    var artistAWallet = new web3_js_1.PublicKey(data.slice(offset, offset + 32)).toBase58();
    offset += 32;
    var artistBWallet = new web3_js_1.PublicKey(data.slice(offset, offset + 32)).toBase58();
    offset += 32;
    var treasuryWallet = new web3_js_1.PublicKey(data.slice(offset, offset + 32)).toBase58();
    offset += 32;
    var mintA = new web3_js_1.PublicKey(data.slice(offset, offset + 32)).toBase58();
    offset += 32;
    var mintB = new web3_js_1.PublicKey(data.slice(offset, offset + 32)).toBase58();
    offset += 32;
    var artistASupply = Number(view.getBigUint64(offset, true)) / 1000000;
    offset += 8;
    var artistBSupply = Number(view.getBigUint64(offset, true)) / 1000000;
    offset += 8;
    var artistASolBalance = Number(view.getBigUint64(offset, true)) / 1000000000;
    offset += 8;
    var artistBSolBalance = Number(view.getBigUint64(offset, true)) / 1000000000;
    offset += 8;
    offset += 16; // Internal pools
    var winnerArtistA = view.getUint8(offset) === 1;
    offset += 1;
    var winnerDecided = view.getUint8(offset) === 1;
    offset += 1;
    offset += 1; // transaction_state
    offset += 1; // is_initialized
    var isActive = view.getUint8(offset) === 1;
    offset += 1;
    var totalDistribution = Number(view.getBigUint64(offset, true)) / 1000000000;
    offset += 8;
    return {
        startTime: startTime * 1000,
        endTime: endTime * 1000,
        isEnded: !isActive || (Date.now() > endTime * 1000),
        artistASolBalance: artistASolBalance,
        artistBSolBalance: artistBSolBalance,
        artistASupply: artistASupply,
        artistBSupply: artistBSupply,
        winnerDecided: winnerDecided,
        // On-Chain Address Data
        onChainWalletA: artistAWallet,
        onChainWalletB: artistBWallet,
        onChainMintA: mintA,
        onChainMintB: mintB,
        treasuryWallet: treasuryWallet
    };
}
// --- 3. HELIUS FETCHING ---
function fetchBattleOnChain(summary_1) {
    return __awaiter(this, arguments, void 0, function (summary, forceRefresh) {
        var isRecent, battlePda_1, cached, connection, battlePda, vaultPda, battleAddress, accountInfo, chainData, historyStats, e_1, result;
        var _a, _b, _c, _d, _e, _f, _g;
        if (forceRefresh === void 0) { forceRefresh = false; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    isRecent = summary.lastScannedAt && (Date.now() - new Date(summary.lastScannedAt).getTime() < CACHE_TTL);
                    if (!forceRefresh && isRecent && summary.totalVolumeA !== undefined) {
                        battlePda_1 = (0, exports.deriveBattlePDA)(summary.battleId).toBase58();
                        return [2 /*return*/, __assign(__assign({}, summary), { battleAddress: battlePda_1, startTime: new Date(summary.createdAt).getTime(), endTime: new Date(summary.createdAt).getTime() + (summary.battleDuration * 1000), isEnded: true, artistASolBalance: summary.artistASolBalance || 0, artistBSolBalance: summary.artistBSolBalance || 0, artistASupply: 0, artistBSupply: 0, totalVolumeA: summary.totalVolumeA || 0, totalVolumeB: summary.totalVolumeB || 0, tradeCount: summary.tradeCount || 0, uniqueTraders: summary.uniqueTraders || 0, recentTrades: summary.recentTrades || [] })];
                    }
                    cached = battleCache.get(summary.battleId);
                    if (!forceRefresh && cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
                        return [2 /*return*/, cached.data];
                    }
                    connection = new web3_js_1.Connection(RPC_URL);
                    battlePda = (0, exports.deriveBattlePDA)(summary.battleId);
                    vaultPda = (0, exports.deriveBattleVaultPDA)(summary.battleId);
                    battleAddress = battlePda.toBase58();
                    return [4 /*yield*/, connection.getAccountInfo(battlePda)];
                case 1:
                    accountInfo = _h.sent();
                    if (!accountInfo) {
                        console.warn("Battle Account not found on-chain.");
                        return [2 /*return*/, __assign(__assign({}, summary), { battleAddress: battleAddress, startTime: Date.now(), endTime: Date.now() + summary.battleDuration * 1000, isEnded: false, artistASolBalance: 0, artistBSolBalance: 0, artistASupply: 0, artistBSupply: 0, totalVolumeA: 0, totalVolumeB: 0, tradeCount: 0, uniqueTraders: 0, recentTrades: [] })];
                    }
                    chainData = decodeBattleAccount(accountInfo.data, summary);
                    historyStats = { volumeA: 0, volumeB: 0, tradeCount: 0, uniqueTraders: 0, recentTrades: [] };
                    _h.label = 2;
                case 2:
                    _h.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetchTransactionStats(battleAddress, vaultPda.toBase58(), chainData.artistASolBalance || 0, chainData.artistBSolBalance || 0)];
                case 3:
                    historyStats = _h.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _h.sent();
                    console.error("History fetch failed, returning partial data", e_1);
                    return [3 /*break*/, 5];
                case 5:
                    result = __assign(__assign(__assign({}, summary), chainData), { battleAddress: battleAddress, artistASolBalance: (_a = chainData.artistASolBalance) !== null && _a !== void 0 ? _a : 0, artistBSolBalance: (_b = chainData.artistBSolBalance) !== null && _b !== void 0 ? _b : 0, startTime: (_c = chainData.startTime) !== null && _c !== void 0 ? _c : Date.now(), endTime: (_d = chainData.endTime) !== null && _d !== void 0 ? _d : Date.now(), isEnded: (_e = chainData.isEnded) !== null && _e !== void 0 ? _e : false, artistASupply: (_f = chainData.artistASupply) !== null && _f !== void 0 ? _f : 0, artistBSupply: (_g = chainData.artistBSupply) !== null && _g !== void 0 ? _g : 0, totalVolumeA: historyStats.volumeA, totalVolumeB: historyStats.volumeB, tradeCount: historyStats.tradeCount, uniqueTraders: historyStats.uniqueTraders, recentTrades: historyStats.recentTrades });
                    // E. Update Caches
                    battleCache.set(summary.battleId, { data: result, timestamp: Date.now() });
                    // Fire and forget update to database
                    (0, supabaseClient_1.updateBattleDynamicStats)(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
// --- 4. TRANSACTION PARSING ---
// Generic fetcher for address transactions to be reused
function fetchAddressTransactions(address_1) {
    return __awaiter(this, arguments, void 0, function (address, limit, beforeSignature) {
        var query, url;
        if (limit === void 0) { limit = 50; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "&limit=".concat(limit).concat(beforeSignature ? "&before=".concat(beforeSignature) : '');
                    url = "https://api-mainnet.helius-rpc.com/v0/addresses/".concat(address, "/transactions/?api-key=").concat(HELIUS_API_KEY).concat(query);
                    return [4 /*yield*/, fetchWithRetry(url)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchTransactionStats(battleAddress, vaultAddress, tvlA, tvlB) {
    return __awaiter(this, void 0, void 0, function () {
        var volumeA, volumeB, tradeCount, traders, recentTrades, beforeSignature, hasMore, LIMIT, fetchedCount, totalTvl, ratioA, txs, _i, txs_1, tx, txVal, isBuy, trader, _a, _b, transfer;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    volumeA = 0;
                    volumeB = 0;
                    tradeCount = 0;
                    traders = new Set();
                    recentTrades = [];
                    beforeSignature = "";
                    hasMore = true;
                    LIMIT = 100;
                    fetchedCount = 0;
                    totalTvl = tvlA + tvlB || 1;
                    ratioA = tvlA / totalTvl;
                    _c.label = 1;
                case 1:
                    if (!(hasMore && fetchedCount < LIMIT)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetchAddressTransactions(battleAddress, 50, beforeSignature)];
                case 2:
                    txs = _c.sent();
                    if (!txs || txs.length === 0) {
                        hasMore = false;
                        return [3 /*break*/, 3];
                    }
                    for (_i = 0, txs_1 = txs; _i < txs_1.length; _i++) {
                        tx = txs_1[_i];
                        if (tx.nativeTransfers) {
                            txVal = 0;
                            isBuy = false;
                            trader = '';
                            for (_a = 0, _b = tx.nativeTransfers; _a < _b.length; _a++) {
                                transfer = _b[_a];
                                if (transfer.toUserAccount === vaultAddress || transfer.toUserAccount === battleAddress) {
                                    // BUY
                                    txVal += transfer.amount / 1000000000;
                                    trader = transfer.fromUserAccount;
                                    traders.add(transfer.fromUserAccount);
                                    isBuy = true;
                                }
                                else if (transfer.fromUserAccount === vaultAddress || transfer.fromUserAccount === battleAddress) {
                                    // SELL
                                    txVal += transfer.amount / 1000000000;
                                    trader = transfer.toUserAccount;
                                    traders.add(transfer.toUserAccount);
                                    isBuy = false;
                                }
                            }
                            if (txVal > 0 && trader) {
                                tradeCount++;
                                volumeA += txVal;
                                if (recentTrades.length < 20) {
                                    recentTrades.push({
                                        signature: tx.signature,
                                        amount: txVal,
                                        artistId: 'Unknown',
                                        type: isBuy ? 'BUY' : 'SELL',
                                        timestamp: tx.timestamp * 1000,
                                        trader: trader
                                    });
                                }
                            }
                        }
                        beforeSignature = tx.signature;
                    }
                    fetchedCount += txs.length;
                    if (txs.length < 50)
                        hasMore = false;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, {
                        volumeA: volumeA * ratioA,
                        volumeB: volumeA * (1 - ratioA),
                        tradeCount: tradeCount,
                        uniqueTraders: traders.size,
                        recentTrades: recentTrades
                    }];
            }
        });
    });
}
// --- 5. TRADER ANALYTICS SERVICE ---
function fetchBatchTraderStats(battles) {
    return __awaiter(this, void 0, void 0, function () {
        var traderMap, _i, battles_1, battle, battlePda, vaultPda, beforeSignature, hasMore, fetchedCount, DEPTH_LIMIT, txs, _a, txs_2, tx, _b, _c, transfer, amount, trader, type, entry, e_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    traderMap = new Map();
                    _i = 0, battles_1 = battles;
                    _d.label = 1;
                case 1:
                    if (!(_i < battles_1.length)) return [3 /*break*/, 8];
                    battle = battles_1[_i];
                    battlePda = (0, exports.deriveBattlePDA)(battle.battleId).toBase58();
                    vaultPda = (0, exports.deriveBattleVaultPDA)(battle.battleId).toBase58();
                    beforeSignature = "";
                    hasMore = true;
                    fetchedCount = 0;
                    DEPTH_LIMIT = 50;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 6, , 7]);
                    _d.label = 3;
                case 3:
                    if (!(hasMore && fetchedCount < DEPTH_LIMIT)) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchAddressTransactions(battlePda, 50, beforeSignature)];
                case 4:
                    txs = _d.sent();
                    if (!txs || txs.length === 0) {
                        hasMore = false;
                        return [3 /*break*/, 5];
                    }
                    for (_a = 0, txs_2 = txs; _a < txs_2.length; _a++) {
                        tx = txs_2[_a];
                        if (!tx.nativeTransfers)
                            continue;
                        for (_b = 0, _c = tx.nativeTransfers; _b < _c.length; _b++) {
                            transfer = _c[_b];
                            amount = transfer.amount / 1000000000;
                            trader = '';
                            type = null;
                            if (transfer.toUserAccount === vaultPda || transfer.toUserAccount === battlePda) {
                                trader = transfer.fromUserAccount;
                                type = 'INVEST';
                            }
                            else if (transfer.fromUserAccount === vaultPda || transfer.fromUserAccount === battlePda) {
                                trader = transfer.toUserAccount;
                                type = 'PAYOUT';
                            }
                            if (trader && type) {
                                if (!traderMap.has(trader)) {
                                    traderMap.set(trader, { invested: 0, payout: 0, battles: new Set() });
                                }
                                entry = traderMap.get(trader);
                                if (type === 'INVEST')
                                    entry.invested += amount;
                                if (type === 'PAYOUT')
                                    entry.payout += amount;
                                entry.battles.add(battle.id);
                            }
                        }
                        beforeSignature = tx.signature;
                    }
                    fetchedCount += txs.length;
                    if (txs.length < 50)
                        hasMore = false;
                    return [3 /*break*/, 3];
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_2 = _d.sent();
                    console.warn("Failed to aggregate battle ".concat(battle.id), e_2);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, traderMap];
            }
        });
    });
}
function fetchTraderProfile(walletAddress, library) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, allTxs, beforeSignature, hasMore, page, MAX_PAGES, query, url, batch, lastTx, e_3, history, battleMap, wavewarzProgramId, totalInvested, totalPayout, battlesParticipated, _i, allTxs_1, tx, accountKeys, involvesProgram, _a, _b, transfer, amount, knownBattle, unknownId, knownBattle, unknownId, wins, losses, stats;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, supabaseClient_1.fetchTraderSnapshotFromDB)(walletAddress)];
                case 1:
                    cached = _e.sent();
                    if (cached) {
                        // Check if reasonably fresh (e.g. < 24h) or just return immediately for demo
                        // You can add timestamp check here if desired
                        return [2 /*return*/, cached];
                    }
                    allTxs = [];
                    beforeSignature = '';
                    hasMore = true;
                    page = 0;
                    MAX_PAGES = 10;
                    _e.label = 2;
                case 2:
                    if (!(hasMore && page < MAX_PAGES)) return [3 /*break*/, 7];
                    query = "&limit=100".concat(beforeSignature ? "&before=".concat(beforeSignature) : '');
                    url = "https://api-mainnet.helius-rpc.com/v0/addresses/".concat(walletAddress, "/transactions/?api-key=").concat(HELIUS_API_KEY).concat(query);
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fetchWithRetry(url)];
                case 4:
                    batch = _e.sent();
                    if (!batch || batch.length === 0) {
                        hasMore = false;
                        return [3 /*break*/, 7];
                    }
                    allTxs.push.apply(allTxs, batch);
                    lastTx = batch[batch.length - 1];
                    beforeSignature = lastTx.signature;
                    page++;
                    return [3 /*break*/, 6];
                case 5:
                    e_3 = _e.sent();
                    console.error("Failed to fetch trader history page ".concat(page), e_3);
                    hasMore = false;
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 2];
                case 7:
                    history = [];
                    battleMap = new Map();
                    library.forEach(function (b) {
                        var pda = (0, exports.deriveBattlePDA)(b.battleId).toBase58();
                        var vault = (0, exports.deriveBattleVaultPDA)(b.battleId).toBase58();
                        battleMap.set(pda, b);
                        battleMap.set(vault, b);
                    });
                    wavewarzProgramId = PROGRAM_ID.toBase58();
                    totalInvested = 0;
                    totalPayout = 0;
                    battlesParticipated = new Set();
                    for (_i = 0, allTxs_1 = allTxs; _i < allTxs_1.length; _i++) {
                        tx = allTxs_1[_i];
                        accountKeys = ((_c = tx.accountData) === null || _c === void 0 ? void 0 : _c.map(function (a) { return a.account; })) || [];
                        involvesProgram = accountKeys.includes(wavewarzProgramId) ||
                            ((_d = tx.instructions) === null || _d === void 0 ? void 0 : _d.some(function (ix) { return ix.programId === wavewarzProgramId; }));
                        if (!tx.nativeTransfers)
                            continue;
                        for (_a = 0, _b = tx.nativeTransfers; _a < _b.length; _a++) {
                            transfer = _b[_a];
                            amount = transfer.amount / 1000000000;
                            if (transfer.fromUserAccount === walletAddress) {
                                knownBattle = battleMap.get(transfer.toUserAccount);
                                if (knownBattle) {
                                    totalInvested += amount;
                                    battlesParticipated.add(knownBattle.id);
                                    updateHistory(history, knownBattle.id, knownBattle.artistA.name, knownBattle.artistB.name, knownBattle.imageUrl, knownBattle.createdAt, amount, 0, { signature: tx.signature, type: 'INVEST', amount: amount, date: new Date(tx.timestamp * 1000).toISOString() });
                                }
                                else if (involvesProgram) {
                                    unknownId = "unlisted-".concat(transfer.toUserAccount);
                                    totalInvested += amount;
                                    battlesParticipated.add(unknownId);
                                    updateHistory(history, unknownId, "Unlisted Battle", "Unknown Opponent", "", new Date(tx.timestamp * 1000).toISOString(), amount, 0, { signature: tx.signature, type: 'INVEST', amount: amount, date: new Date(tx.timestamp * 1000).toISOString() });
                                }
                            }
                            if (transfer.toUserAccount === walletAddress) {
                                knownBattle = battleMap.get(transfer.fromUserAccount);
                                if (knownBattle) {
                                    totalPayout += amount;
                                    battlesParticipated.add(knownBattle.id);
                                    updateHistory(history, knownBattle.id, knownBattle.artistA.name, knownBattle.artistB.name, knownBattle.imageUrl, knownBattle.createdAt, 0, amount, { signature: tx.signature, type: 'PAYOUT', amount: amount, date: new Date(tx.timestamp * 1000).toISOString() });
                                }
                                else if (involvesProgram) {
                                    unknownId = "unlisted-".concat(transfer.fromUserAccount);
                                    totalPayout += amount;
                                    battlesParticipated.add(unknownId);
                                    updateHistory(history, unknownId, "Unlisted Battle", "Unknown Opponent", "", new Date(tx.timestamp * 1000).toISOString(), 0, amount, { signature: tx.signature, type: 'PAYOUT', amount: amount, date: new Date(tx.timestamp * 1000).toISOString() });
                                }
                            }
                        }
                    }
                    history.forEach(function (h) {
                        h.pnl = h.payout - h.invested;
                        if (h.pnl > 0)
                            h.outcome = 'WIN';
                        else if (h.pnl < 0 && h.payout > 0)
                            h.outcome = 'LOSS';
                        else if (h.payout === 0)
                            h.outcome = 'PENDING';
                    });
                    wins = history.filter(function (h) { return h.outcome === 'WIN'; }).length;
                    losses = history.filter(function (h) { return h.outcome === 'LOSS'; }).length;
                    stats = {
                        walletAddress: walletAddress,
                        totalInvested: totalInvested,
                        totalPayout: totalPayout,
                        netPnL: totalPayout - totalInvested,
                        battlesParticipated: battlesParticipated.size,
                        wins: wins,
                        losses: losses,
                        winRate: (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0,
                        favoriteArtist: "Unknown",
                        history: history.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); }),
                        lastUpdated: new Date().toISOString()
                    };
                    // C. Save to DB Cache
                    (0, supabaseClient_1.saveTraderSnapshotToDB)(stats);
                    return [2 /*return*/, stats];
            }
        });
    });
}
function updateHistory(history, battleId, nameA, nameB, img, date, invested, payout, tx) {
    var existingEntry = history.find(function (h) { return h.battleId === battleId; });
    if (existingEntry) {
        existingEntry.invested += invested;
        existingEntry.payout += payout;
        existingEntry.transactions.push(tx);
    }
    else {
        history.push({
            battleId: battleId,
            artistAName: nameA,
            artistBName: nameB,
            imageUrl: img,
            date: date,
            invested: invested,
            payout: payout,
            pnl: 0,
            outcome: 'PENDING',
            transactions: [tx]
        });
    }
}
