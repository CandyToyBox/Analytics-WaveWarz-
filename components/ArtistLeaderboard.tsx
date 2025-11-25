
import React, { useState, useEffect } from 'react';
import { BattleSummary, ArtistLeaderboardStats } from '../types';
import { calculateArtistLeaderboard, mockEstimateVolumes } from '../services/artistLeaderboardService';
import { fetchBattleOnChain } from '../services/solanaService';
import { fetchArtistLeaderboardFromDB, saveArtistLeaderboardToDB } from '../services/supabaseClient';
import { formatSol, formatUsd, formatPct } from '../utils';
import { Trophy, Music, Disc, TrendingUp, Twitter, ExternalLink, Loader2, PlayCircle, Database, Check } from 'lucide-react';

interface Props {
  battles: BattleSummary[];
  solPrice: number;
}

export const ArtistLeaderboard: React.FC<Props> = ({ battles, solPrice }) => {
  const [stats, setStats] = useState<ArtistLeaderboardStats[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [dataOrigin, setDataOrigin] = useState<'Estimated' | 'Database' | 'Live'>('Estimated');

  // Load Data Effect
  useEffect(() => {
    const loadData = async () => {
      // 1. Try DB first
      const dbStats = await fetchArtistLeaderboardFromDB();
      if (dbStats && dbStats.length > 0) {
        // Recalculate USD dependent values
        const hydrated = dbStats.map(s => ({
            ...s,
            totalEarningsUsd: s.totalEarningsSol * solPrice,
            // Re-calc spotify if price changes significantly
            spotifyStreamEquivalents: (s.totalEarningsSol * solPrice) / 0.003
        })).sort((a,b) => b.totalEarningsSol - a.totalEarningsSol);
        
        setStats(hydrated);
        setDataOrigin('Database');
      } else {
        // 2. Fallback to estimation if no DB
        const initialStates = mockEstimateVolumes(battles);
        const calculated = calculateArtistLeaderboard(initialStates, solPrice);
        setStats(calculated);
        setDataOrigin('Estimated');
      }
    };
    loadData();
  }, [battles.length, solPrice]); // Re-run if battle count changes significantly or price updates

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const enrichedBattles = [];
    const BATCH_SIZE = 2; 
    const DELAY = 2000; 

    for (let i = 0; i < battles.length; i += BATCH_SIZE) {
        const batch = battles.slice(i, i + BATCH_SIZE);
        try {
            const promises = batch.map(b => fetchBattleOnChain(b));
            const results = await Promise.all(promises);
            enrichedBattles.push(...results);
        } catch (e) {
            console.error("Batch error", e);
            enrichedBattles.push(...batch.map(b => ({
                ...b, startTime: 0, endTime: 0, isEnded: true, artistASolBalance: b.artistASolBalance||0, artistBSolBalance: b.artistBSolBalance||0,
                artistASupply: 0, artistBSupply: 0, totalVolumeA: 0, totalVolumeB: 0, tradeCount: 0, uniqueTraders: 0, recentTrades: [], battleAddress: ''
            })));
        }
        setScanProgress(enrichedBattles.length);
        await new Promise(r => setTimeout(r, DELAY));
    }

    const refinedStats = calculateArtistLeaderboard(enrichedBattles, solPrice);
    setStats(refinedStats);
    setDataOrigin('Live');
    setIsScanning(false);

    // Save to DB for next time
    await saveArtistLeaderboardToDB(refinedStats);
  };

  const topArtist = stats[0];
  const runnersUp = stats.slice(1, 3);
  const rest = stats.slice(3);

  const TotalPayouts = stats.reduce((acc, curr) => acc + curr.totalEarningsSol, 0);
  const TotalStreams = stats.reduce((acc, curr) => acc + curr.spotifyStreamEquivalents, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Header Stats */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-fuchsia-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-slate-300 text-sm uppercase tracking-widest font-bold mb-2">Total Artist Payouts</h2>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                    {formatSol(TotalPayouts)} 
                    <span className="text-2xl text-slate-400 font-normal ml-2">({formatUsd(TotalPayouts, solPrice)})</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30 backdrop-blur-sm mt-4">
                    <Music size={20} className="animate-pulse" />
                    <span className="font-bold">Equivalent to {TotalStreams.toLocaleString()} Spotify Streams</span>
                </div>
             </div>
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* Data Source Control */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-slate-500">
               {dataOrigin === 'Database' && <><Check size={14} className="text-green-500" /> Loaded from Cache</>}
               {dataOrigin === 'Estimated' && <span className="text-orange-400">Viewing Estimated Data</span>}
               {dataOrigin === 'Live' && <span className="text-green-400 font-bold">Live On-Chain Data (Synced)</span>}
            </div>

             {isScanning ? (
                 <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                    <Loader2 className="animate-spin text-indigo-500" size={16} />
                    <span className="text-xs text-slate-400">Scanning Blockchain... ({scanProgress}/{battles.length})</span>
                 </div>
             ) : (
                 <button 
                   onClick={handleScan}
                   className={`flex items-center gap-2 text-xs font-bold transition-colors ${dataOrigin === 'Database' ? 'text-slate-500 hover:text-white' : 'text-indigo-400 hover:text-white'}`}
                 >
                    <PlayCircle size={14} /> {dataOrigin === 'Database' ? 'Force Resync Volume' : 'Sync Real-Time Volume'}
                 </button>
             )}
        </div>

        {/* The Podium (Top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {runnersUp[0] && <ArtistCard artist={runnersUp[0]} rank={2} solPrice={solPrice} />}
            {topArtist && <ArtistCard artist={topArtist} rank={1} solPrice={solPrice} isWinner />}
            {runnersUp[1] && <ArtistCard artist={runnersUp[1]} rank={3} solPrice={solPrice} />}
        </div>

        {/* The List (Rest) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-slate-950/50 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Rank 4+</span>
                <span>Earnings Breakdown</span>
            </div>
            <div className="divide-y divide-slate-800">
                {rest.map((artist, idx) => (
                    <div key={artist.artistName} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row items-center gap-4">
                        <div className="font-mono text-slate-500 w-8 text-center font-bold">#{idx + 4}</div>
                        
                        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0">
                                {artist.imageUrl ? (
                                    <img src={artist.imageUrl} className="w-full h-full object-cover" alt={artist.artistName} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <Music size={16} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-white">{artist.artistName}</div>
                                <div className="text-xs text-slate-500 flex gap-2">
                                    <span>{artist.battlesParticipated} Battles</span>
                                    <span>•</span>
                                    <span>{formatPct(artist.winRate)} WR</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-8 w-full sm:w-auto justify-between sm:justify-end">
                             <div className="text-right">
                                <div className="text-xs text-slate-500 mb-0.5">Stream Equiv.</div>
                                <div className="font-bold text-green-400 flex items-center justify-end gap-1">
                                    <Disc size={12} />
                                    {artist.spotifyStreamEquivalents.toLocaleString()}
                                </div>
                             </div>
                             <div className="text-right min-w-[100px]">
                                <div className="text-xs text-slate-500 mb-0.5">Total Earnings</div>
                                <div className="font-bold text-white font-mono">{formatSol(artist.totalEarningsSol)}</div>
                                <div className="text-[10px] text-slate-500">{formatUsd(artist.totalEarningsSol, solPrice)}</div>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

const ArtistCard: React.FC<{ artist: ArtistLeaderboardStats, rank: number, isWinner?: boolean, solPrice: number }> = ({ artist, rank, isWinner, solPrice }) => {
    return (
        <div className={`relative bg-slate-900 border ${isWinner ? 'border-yellow-500/50 shadow-xl shadow-yellow-900/20' : 'border-slate-800'} rounded-2xl overflow-hidden flex flex-col ${isWinner ? 'md:-mt-12 z-10' : ''}`}>
            {isWinner && (
                <div className="bg-gradient-to-r from-yellow-600 to-amber-500 text-white text-center py-1 text-xs font-bold uppercase tracking-widest">
                    #1 Top Earner
                </div>
            )}
            
            <div className="p-6 flex flex-col items-center text-center">
                <div className={`relative mb-4 ${isWinner ? 'w-24 h-24' : 'w-20 h-20'}`}>
                    <div className={`w-full h-full rounded-full overflow-hidden border-4 ${isWinner ? 'border-yellow-500' : rank === 2 ? 'border-slate-300' : 'border-orange-700'}`}>
                        {artist.imageUrl ? (
                            <img src={artist.imageUrl} alt={artist.artistName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Music /></div>
                        )}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-slate-900 ${
                        isWinner ? 'bg-yellow-500 text-black' : rank === 2 ? 'bg-slate-300 text-black' : 'bg-orange-700 text-white'
                    }`}>
                        #{rank}
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 truncate w-full">{artist.artistName}</h3>
                
                <div className="my-4 w-full bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Stream Equivalent</div>
                    <div className="text-xl font-black text-green-400 flex items-center justify-center gap-1.5">
                        <Disc size={18} className="animate-spin-slow" />
                        {artist.spotifyStreamEquivalents.toLocaleString()}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-4">
                    <div>
                        <div className="text-xs text-slate-500">Earnings</div>
                        <div className="font-bold text-white">{formatSol(artist.totalEarningsSol)}</div>
                        <div className="text-[10px] text-slate-500">{formatUsd(artist.totalEarningsSol, solPrice)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Win Rate</div>
                        <div className="font-bold text-indigo-400">{formatPct(artist.winRate)}</div>
                        <div className="text-[10px] text-slate-500">{artist.wins}W - {artist.losses}L</div>
                    </div>
                </div>

                <div className="flex gap-2 w-full pt-4 border-t border-slate-800">
                    {artist.twitterHandle && (
                        <a href={`https://twitter.com/${artist.twitterHandle}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-2 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors">
                            <Twitter size={16} />
                        </a>
                    )}
                    {artist.musicLink && (
                        <a href={artist.musicLink} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center py-2 rounded bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white transition-colors">
                            <Music size={16} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
