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
exports.supabase = void 0;
exports.fetchBattlesFromSupabase = fetchBattlesFromSupabase;
exports.updateBattleDynamicStats = updateBattleDynamicStats;
exports.uploadBattlesToSupabase = uploadBattlesToSupabase;
exports.fetchTraderSnapshotFromDB = fetchTraderSnapshotFromDB;
exports.saveTraderSnapshotToDB = saveTraderSnapshotToDB;
exports.fetchArtistLeaderboardFromDB = fetchArtistLeaderboardFromDB;
exports.saveArtistLeaderboardToDB = saveArtistLeaderboardToDB;
exports.fetchTraderLeaderboardFromDB = fetchTraderLeaderboardFromDB;
exports.saveTraderLeaderboardToDB = saveTraderLeaderboardToDB;
var supabase_js_1 = require("@supabase/supabase-js");
// --- CONFIGURATION ---
// OFFICIAL WAVEWARZ DB CONNECTION
// Replace defaults with your official Project URL and Anon Key when ready.
// The code will prefer environment variables if they exist.
var SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gshwqoplsxgqbdkssoit.supabase.co';
var SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaHdxb3Bsc3hncWJka3Nzb2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTQ2NDksImV4cCI6MjA3OTUzMDY0OX0.YNv0QgQfUMsrDyWQB3tnKVshal_h7ZjuobKWrQjfzlQ';
exports.supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
function fetchBattlesFromSupabase() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, err_1, errorMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!exports.supabase) {
                        console.warn("Supabase client not initialized. Using local fallback data.");
                        return [2 /*return*/, null];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exports.supabase
                            .from('battles')
                            .select('*')
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.warn("Supabase fetch warning (Official DB might be unreachable):", JSON.stringify(error, null, 2));
                        return [2 /*return*/, null];
                    }
                    if (!data || data.length === 0) {
                        console.log("Supabase connected but returned no battles. Using local fallback.");
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data.map(function (row) { return ({
                            id: row.id,
                            battleId: row.battle_id,
                            createdAt: row.created_at,
                            status: row.status,
                            artistA: {
                                id: 'A',
                                name: row.artist1_name,
                                color: '#06b6d4',
                                avatar: row.image_url, // Fallback to event image if specific artist image missing
                                wallet: row.artist1_wallet,
                                musicLink: row.artist1_music_link,
                                twitter: row.artist1_twitter
                            },
                            artistB: {
                                id: 'B',
                                name: row.artist2_name,
                                color: '#e879f9',
                                avatar: row.image_url,
                                wallet: row.artist2_wallet,
                                musicLink: row.artist2_music_link,
                                twitter: row.artist2_twitter
                            },
                            battleDuration: row.battle_duration,
                            winnerDecided: row.winner_decided,
                            artistASolBalance: row.artist1_pool || 0,
                            artistBSolBalance: row.artist2_pool || 0,
                            imageUrl: row.image_url,
                            streamLink: row.stream_link,
                            creatorWallet: row.creator_wallet,
                            isCommunityBattle: row.is_community_battle,
                            communityRoundId: row.community_round_id,
                            // Dynamic Stats from Cache (if available in DB schema)
                            totalVolumeA: row.total_volume_a || 0,
                            totalVolumeB: row.total_volume_b || 0,
                            tradeCount: row.trade_count || 0,
                            uniqueTraders: row.unique_traders || 0,
                            lastScannedAt: row.last_scanned_at,
                            recentTrades: row.recent_trades_cache,
                        }); })];
                case 3:
                    err_1 = _b.sent();
                    errorMessage = typeof err_1 === 'object' ? JSON.stringify(err_1, null, 2) : String(err_1);
                    console.warn("Supabase connection failed (using fallback):", errorMessage);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateBattleDynamicStats(state) {
    return __awaiter(this, void 0, void 0, function () {
        var error, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.supabase
                            .from('battles')
                            .update({
                            artist1_pool: state.artistASolBalance,
                            artist2_pool: state.artistBSolBalance,
                            total_volume_a: state.totalVolumeA,
                            total_volume_b: state.totalVolumeB,
                            trade_count: state.tradeCount,
                            unique_traders: state.uniqueTraders,
                            last_scanned_at: new Date().toISOString(),
                            recent_trades_cache: state.recentTrades
                        })
                            .eq('battle_id', state.battleId)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        console.warn("Failed to update battle cache:", error);
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.error("Supabase update error", e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function uploadBattlesToSupabase(battles) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, error, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!battles || battles.length === 0)
                        return [2 /*return*/, { success: false, message: 'No data to upload' }];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    rows = battles.map(function (b) { return ({
                        battle_id: b.battleId,
                        created_at: b.createdAt,
                        status: b.status,
                        artist1_name: b.artistA.name,
                        artist1_wallet: b.artistA.wallet,
                        artist1_music_link: b.artistA.musicLink,
                        artist1_twitter: b.artistA.twitter,
                        artist1_pool: b.artistASolBalance,
                        artist2_name: b.artistB.name,
                        artist2_wallet: b.artistB.wallet,
                        artist2_music_link: b.artistB.musicLink,
                        artist2_twitter: b.artistB.twitter,
                        artist2_pool: b.artistBSolBalance,
                        image_url: b.imageUrl,
                        stream_link: b.streamLink,
                        battle_duration: b.battleDuration,
                        winner_decided: b.winnerDecided,
                        is_community_battle: b.isCommunityBattle,
                        community_round_id: b.communityRoundId,
                        // Preserve existing if possible, but map for initial upload
                        total_volume_a: b.totalVolumeA || 0,
                        total_volume_b: b.totalVolumeB || 0
                    }); });
                    return [4 /*yield*/, exports.supabase
                            .from('battles')
                            .upsert(rows, { onConflict: 'battle_id', ignoreDuplicates: false })];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [2 /*return*/, { success: true, message: "Successfully synced ".concat(rows.length, " battles!") }];
                case 3:
                    e_2 = _a.sent();
                    console.error("Upload failed", e_2);
                    return [2 /*return*/, { success: false, message: e_2.message || JSON.stringify(e_2) }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// --- TRADER SNAPSHOTS ---
function fetchTraderSnapshotFromDB(wallet) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.supabase
                            .from('trader_snapshots')
                            .select('profile_data')
                            .eq('wallet_address', wallet)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error || !data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, data.profile_data];
                case 2:
                    e_3 = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveTraderSnapshotToDB(stats) {
    return __awaiter(this, void 0, void 0, function () {
        var e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.supabase.from('trader_snapshots').upsert({
                            wallet_address: stats.walletAddress,
                            profile_data: stats,
                            updated_at: new Date().toISOString()
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_4 = _a.sent();
                    console.error("Failed to save trader snapshot", e_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// --- ARTIST LEADERBOARD CACHE ---
function fetchArtistLeaderboardFromDB() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.supabase.from('artist_leaderboard').select('*')];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error || !data || data.length === 0)
                        return [2 /*return*/, null];
                    return [2 /*return*/, data.map(function (row) { return ({
                            artistName: row.artist_name,
                            walletAddress: row.wallet_address,
                            imageUrl: row.image_url,
                            twitterHandle: row.twitter_handle,
                            musicLink: row.music_link,
                            totalEarningsSol: row.total_earnings_sol,
                            totalEarningsUsd: 0, // Recalculated on frontend based on live price
                            spotifyStreamEquivalents: row.spotify_stream_equivalents,
                            tradingFeeEarnings: 0, // Details not cached in this simplified table
                            settlementEarnings: 0,
                            battlesParticipated: row.battles_participated,
                            wins: row.wins,
                            losses: row.losses,
                            winRate: row.win_rate,
                            totalVolumeGenerated: row.total_volume_generated,
                            avgVolumePerBattle: row.avg_volume_per_battle,
                            bestBattleEarnings: 0,
                            bestBattleName: '',
                        }); })];
                case 2:
                    e_5 = _b.sent();
                    console.warn("Failed to fetch artist leaderboard", e_5);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveArtistLeaderboardToDB(stats) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, error, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    rows = stats.map(function (s) { return ({
                        wallet_address: s.walletAddress || s.artistName, // Fallback PK
                        artist_name: s.artistName,
                        image_url: s.imageUrl,
                        twitter_handle: s.twitterHandle,
                        music_link: s.musicLink,
                        total_earnings_sol: s.totalEarningsSol,
                        spotify_stream_equivalents: s.spotifyStreamEquivalents,
                        battles_participated: s.battlesParticipated,
                        wins: s.wins,
                        losses: s.losses,
                        win_rate: s.winRate,
                        total_volume_generated: s.totalVolumeGenerated,
                        avg_volume_per_battle: s.avgVolumePerBattle,
                        updated_at: new Date().toISOString()
                    }); });
                    return [4 /*yield*/, exports.supabase.from('artist_leaderboard').upsert(rows, { onConflict: 'wallet_address' })];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    console.log("Artist Leaderboard Saved!");
                    return [3 /*break*/, 3];
                case 2:
                    e_6 = _a.sent();
                    console.error("Failed to save artist stats", e_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// --- TRADER LEADERBOARD CACHE ---
function fetchTraderLeaderboardFromDB() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, e_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.supabase.from('trader_leaderboard').select('*')];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error || !data || data.length === 0)
                        return [2 /*return*/, null];
                    return [2 /*return*/, data.map(function (row) { return ({
                            walletAddress: row.wallet_address,
                            totalInvested: row.total_invested,
                            totalPayout: row.total_payout,
                            netPnL: row.net_pnl,
                            roi: row.roi,
                            battlesParticipated: row.battles_participated,
                            wins: row.wins,
                            losses: row.losses,
                            winRate: 0 // Recalculated on frontend if needed
                        }); })];
                case 2:
                    e_7 = _b.sent();
                    console.warn("Failed to fetch trader leaderboard", e_7);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveTraderLeaderboardToDB(traders) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, error, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    rows = traders.map(function (t) { return ({
                        wallet_address: t.walletAddress,
                        total_invested: t.totalInvested,
                        total_payout: t.totalPayout,
                        net_pnl: t.netPnL,
                        roi: t.roi,
                        battles_participated: t.battlesParticipated,
                        wins: t.wins,
                        losses: t.losses,
                        updated_at: new Date().toISOString()
                    }); });
                    return [4 /*yield*/, exports.supabase.from('trader_leaderboard').upsert(rows, { onConflict: 'wallet_address' })];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    console.log("Trader Leaderboard Saved!");
                    return [3 /*break*/, 3];
                case 2:
                    e_8 = _a.sent();
                    console.error("Failed to save trader stats", e_8);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
