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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBattlesIntoEvents = exports.calculateLeaderboard = exports.generateBattleHistory = exports.calculateTraderRoi = exports.calculateSettlement = exports.formatPct = exports.formatUsd = exports.formatSol = exports.calculateTVLWinner = void 0;
// Constants defined in the blueprint
var FEES = {
    ARTIST_TRADING_FEE: 0.01,
    PLATFORM_TRADING_FEE: 0.005,
};
var DISTRIBUTION = {
    WINNING_TRADERS: 0.40,
    WINNING_ARTIST: 0.05,
    LOSING_ARTIST: 0.02,
    PLATFORM_BONUS: 0.03,
    LOSING_TRADERS: 0.50, // Stays with losing traders (returned value)
};
var calculateTVLWinner = function (state) {
    return state.artistASolBalance > state.artistBSolBalance ? 'A' : 'B';
};
exports.calculateTVLWinner = calculateTVLWinner;
// Updated to 4 decimal places for micro-transactions
var formatSol = function (val) {
    return "\u25CE".concat((val || 0).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }));
};
exports.formatSol = formatSol;
// New USD Formatter
var formatUsd = function (solAmount, solPrice) {
    if (!solPrice)
        return '';
    var usdVal = solAmount * solPrice;
    return "($".concat(usdVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), " USD)");
};
exports.formatUsd = formatUsd;
var formatPct = function (val) {
    return "".concat((val || 0).toFixed(2), "%");
};
exports.formatPct = formatPct;
var calculateSettlement = function (state) {
    var winner = (0, exports.calculateTVLWinner)(state);
    var isAWin = winner === 'A';
    var winnerTVL = isAWin ? state.artistASolBalance : state.artistBSolBalance;
    var loserTVL = isAWin ? state.artistBSolBalance : state.artistASolBalance;
    var winMargin = winnerTVL - loserTVL;
    // Step 4: Prize Pool Distribution
    // The blueprint states these percentages apply to the Loser's Pool
    var dist = {
        toWinningTraders: loserTVL * DISTRIBUTION.WINNING_TRADERS,
        toWinningArtist: loserTVL * DISTRIBUTION.WINNING_ARTIST,
        toLosingArtist: loserTVL * DISTRIBUTION.LOSING_ARTIST,
        toPlatform: loserTVL * DISTRIBUTION.PLATFORM_BONUS,
        toLosingTraders: loserTVL * DISTRIBUTION.LOSING_TRADERS,
    };
    // Step 3 & 6 & 7: Earnings Calculations
    // Accumulated fees during battle
    var artistAFees = state.totalVolumeA * FEES.ARTIST_TRADING_FEE;
    var artistBFees = state.totalVolumeB * FEES.ARTIST_TRADING_FEE;
    var platformFees = (state.totalVolumeA + state.totalVolumeB) * FEES.PLATFORM_TRADING_FEE;
    // Final Earnings Logic
    var artistAEarnings = artistAFees + (isAWin ? dist.toWinningArtist : dist.toLosingArtist);
    var artistBEarnings = artistBFees + (isAWin ? dist.toLosingArtist : dist.toWinningArtist);
    var platformEarnings = platformFees + dist.toPlatform;
    return __assign(__assign({ winnerId: winner, winMargin: winMargin, loserPoolTotal: loserTVL }, dist), { artistAEarnings: artistAEarnings, artistBEarnings: artistBEarnings, platformEarnings: platformEarnings });
};
exports.calculateSettlement = calculateSettlement;
var calculateTraderRoi = function (battleState, sim) {
    var winner = (0, exports.calculateTVLWinner)(battleState);
    var isWin = sim.side === winner;
    // Simple simulation logic
    var investment = sim.investmentSol;
    var payout = 0;
    var note = '';
    if (isWin) {
        // Winner share logic
        var winnerPool = winner === 'A' ? battleState.artistASolBalance : battleState.artistBSolBalance;
        var loserPool = winner === 'A' ? battleState.artistBSolBalance : battleState.artistASolBalance;
        var share = winnerPool > 0 ? investment / winnerPool : 0;
        var winnings = loserPool * DISTRIBUTION.WINNING_TRADERS * share;
        payout = investment + winnings;
        note = 'Winner payout + share of loser pool';
    }
    else {
        // Loser share logic
        payout = investment * DISTRIBUTION.LOSING_TRADERS;
        note = 'Loser retains 50% of value';
    }
    var profit = payout - investment;
    var roi = investment > 0 ? (profit / investment) * 100 : 0;
    return { roi: roi, payout: payout, profit: profit, note: note };
};
exports.calculateTraderRoi = calculateTraderRoi;
var generateBattleHistory = function (battle, count) {
    if (count === void 0) { count = 100; }
    var history = [];
    var events = [];
    var now = Date.now();
    var start = battle.startTime || (now - 1000 * 60 * 60);
    var end = battle.endTime || now;
    var duration = end - start;
    var step = duration / count;
    var currentA = 0;
    var currentB = 0;
    var targetA = battle.artistASolBalance;
    var targetB = battle.artistBSolBalance;
    for (var i = 0; i <= count; i++) {
        var time = start + (step * i);
        var progress = i / count;
        // Cubic easing for visual effect
        var ease = 1 - Math.pow(1 - progress, 3);
        currentA = targetA * ease;
        currentB = targetB * ease;
        history.push({
            timestamp: time,
            tvlA: currentA,
            tvlB: currentB,
            volumeA: battle.totalVolumeA * ease,
            volumeB: battle.totalVolumeB * ease,
            priceA: 0,
            priceB: 0
        });
    }
    events.push({ timestamp: start, type: 'START', description: 'Battle Begins' });
    if (battle.isEnded)
        events.push({ timestamp: end, type: 'END', description: 'Battle Ends' });
    return { history: history, events: events };
};
exports.generateBattleHistory = generateBattleHistory;
var calculateLeaderboard = function (library) {
    var artistMap = new Map();
    var getOrInit = function (artist) {
        if (!artistMap.has(artist.name)) {
            artistMap.set(artist.name, {
                name: artist.name,
                wins: 0,
                losses: 0,
                totalBattles: 0,
                winRate: 0,
                avatar: artist.avatar,
                lastActive: "",
                totalVolume: 0,
                totalTVL: 0,
                biggestWin: 0
            });
        }
        return artistMap.get(artist.name);
    };
    library.forEach(function (battle) {
        var a = getOrInit(battle.artistA);
        var b = getOrInit(battle.artistB);
        a.totalBattles++;
        b.totalBattles++;
        if (battle.createdAt > a.lastActive)
            a.lastActive = battle.createdAt;
        if (battle.createdAt > b.lastActive)
            b.lastActive = battle.createdAt;
    });
    return Array.from(artistMap.values()).sort(function (a, b) { return b.totalBattles - a.totalBattles; });
};
exports.calculateLeaderboard = calculateLeaderboard;
// --- EVENT GROUPING LOGIC ---
var groupBattlesIntoEvents = function (battles) {
    var events = [];
    // Sort by date ascending first to process rounds in order
    var sortedBattles = __spreadArray([], battles, true).sort(function (a, b) { return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); });
    sortedBattles.forEach(function (battle) {
        // Check if this battle belongs to the latest event processed
        var lastEvent = events[events.length - 1];
        if (lastEvent) {
            // Logic: Same artists, created within 24 hours of the event's first round
            var sameArtists = (battle.artistA.name === lastEvent.artistA.name && battle.artistB.name === lastEvent.artistB.name) ||
                (battle.artistA.name === lastEvent.artistB.name && battle.artistB.name === lastEvent.artistA.name);
            var eventTime = new Date(lastEvent.date).getTime();
            var battleTime = new Date(battle.createdAt).getTime();
            var timeDiffHours = (battleTime - eventTime) / (1000 * 60 * 60);
            if (sameArtists && timeDiffHours < 24) {
                lastEvent.rounds.push(battle);
                return;
            }
        }
        // New Event
        events.push({
            id: battle.id,
            date: battle.createdAt,
            artistA: battle.artistA,
            artistB: battle.artistB,
            rounds: [battle],
            imageUrl: battle.imageUrl,
            isCommunityEvent: !!battle.isCommunityBattle
        });
    });
    // Return events sorted by date descending (newest first)
    return events.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
};
exports.groupBattlesIntoEvents = groupBattlesIntoEvents;
