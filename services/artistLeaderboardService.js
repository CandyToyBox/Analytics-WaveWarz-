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
exports.calculateArtistLeaderboard = calculateArtistLeaderboard;
exports.mockEstimateVolumes = mockEstimateVolumes;
var utils_1 = require("../utils");
// Constants
var SPOTIFY_PER_STREAM_USD = 0.003;
// Helper to init an artist entry
var initArtistStats = function (name, wallet, avatar, twitter, music) { return ({
    artistName: name,
    walletAddress: wallet,
    imageUrl: avatar,
    twitterHandle: twitter,
    musicLink: music,
    totalEarningsSol: 0,
    totalEarningsUsd: 0,
    spotifyStreamEquivalents: 0,
    tradingFeeEarnings: 0,
    settlementEarnings: 0,
    battlesParticipated: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalVolumeGenerated: 0,
    avgVolumePerBattle: 0,
    bestBattleEarnings: 0,
    bestBattleName: '',
}); };
/**
 * Calculates leaderboard data.
 * NOTE: For "Trading Fees", this relies on the BattleState having volume data.
 * If using raw BattleSummary from DB without on-chain scan, volume will be 0.
 */
function calculateArtistLeaderboard(battles, solPrice) {
    var statsMap = new Map();
    var getOrInit = function (artist) {
        // Normalize key by wallet if available, else name
        var key = artist.wallet || artist.name;
        if (!statsMap.has(key)) {
            statsMap.set(key, initArtistStats(artist.name, artist.wallet, artist.avatar, artist.twitter, artist.musicLink));
        }
        return statsMap.get(key);
    };
    battles.forEach(function (battle) {
        // Skip if battle hasn't started or no pool data
        if (!battle.artistASolBalance && !battle.artistBSolBalance)
            return;
        var statsA = getOrInit(battle.artistA);
        var statsB = getOrInit(battle.artistB);
        statsA.battlesParticipated++;
        statsB.battlesParticipated++;
        // Volume Attribution
        statsA.totalVolumeGenerated += battle.totalVolumeA;
        statsB.totalVolumeGenerated += battle.totalVolumeB;
        // Determine Winner for Settlement
        var winnerId = (0, utils_1.calculateTVLWinner)(battle);
        var settlement = (0, utils_1.calculateSettlement)(battle);
        // --- ARTIST A EARNINGS ---
        // 1. Trading Fees (1% of volume on their side)
        var feesA = battle.totalVolumeA * 0.01;
        // 2. Settlement
        var settlementA = winnerId === 'A' ? settlement.toWinningArtist : settlement.toLosingArtist;
        var totalA = feesA + settlementA;
        statsA.tradingFeeEarnings += feesA;
        statsA.settlementEarnings += settlementA;
        statsA.totalEarningsSol += totalA;
        if (totalA > statsA.bestBattleEarnings) {
            statsA.bestBattleEarnings = totalA;
            statsA.bestBattleName = "vs ".concat(battle.artistB.name);
        }
        if (winnerId === 'A')
            statsA.wins++;
        else
            statsA.losses++;
        // --- ARTIST B EARNINGS ---
        var feesB = battle.totalVolumeB * 0.01;
        var settlementB = winnerId === 'B' ? settlement.toWinningArtist : settlement.toLosingArtist;
        var totalB = feesB + settlementB;
        statsB.tradingFeeEarnings += feesB;
        statsB.settlementEarnings += settlementB;
        statsB.totalEarningsSol += totalB;
        if (totalB > statsB.bestBattleEarnings) {
            statsB.bestBattleEarnings = totalB;
            statsB.bestBattleName = "vs ".concat(battle.artistA.name);
        }
        if (winnerId === 'B')
            statsB.wins++;
        else
            statsB.losses++;
    });
    // Final Calculations (USD, Stream Equivs, Rates)
    return Array.from(statsMap.values()).map(function (stat) {
        stat.winRate = stat.battlesParticipated > 0 ? (stat.wins / stat.battlesParticipated) * 100 : 0;
        stat.avgVolumePerBattle = stat.battlesParticipated > 0 ? stat.totalVolumeGenerated / stat.battlesParticipated : 0;
        stat.totalEarningsUsd = stat.totalEarningsSol * solPrice;
        // THE BIG CALCULATION: Spotify Equivalent
        // Earnings USD / 0.003
        stat.spotifyStreamEquivalents = stat.totalEarningsUsd > 0
            ? Math.floor(stat.totalEarningsUsd / SPOTIFY_PER_STREAM_USD)
            : 0;
        return stat;
    }).sort(function (a, b) { return b.totalEarningsSol - a.totalEarningsSol; });
}
function mockEstimateVolumes(battles) {
    // If we don't have scanned data, we can roughly estimate volume 
    // to avoid showing "0 earnings" in the demo before a scan.
    // Assumption: Volume is roughly 2x TVL in active battles (purely heuristic for demo)
    return battles.map(function (b) { return (__assign(__assign({}, b), { startTime: new Date(b.createdAt).getTime(), endTime: new Date(b.createdAt).getTime() + (b.battleDuration * 1000), isEnded: true, artistASolBalance: b.artistASolBalance || 0, artistBSolBalance: b.artistBSolBalance || 0, artistASupply: 0, artistBSupply: 0, 
        // Mock volume if 0 to show mechanics
        totalVolumeA: (b.artistASolBalance || 0) * 1.5, totalVolumeB: (b.artistBSolBalance || 0) * 1.5, tradeCount: 0, uniqueTraders: 0, recentTrades: [], battleAddress: '' })); });
}
