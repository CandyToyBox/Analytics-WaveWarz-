
import { createClient } from '@supabase/supabase-js';
import { BattleSummary } from '../types';

// Updated credentials provided by user
const SUPABASE_URL = 'https://gshwqoplsxgqbdkssoit.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaHdxb3Bsc3hncWJka3Nzb2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTQ2NDksImV4cCI6MjA3OTUzMDY0OX0.YNv0QgQfUMsrDyWQB3tnKVshal_h7ZjuobKWrQjfzlQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchBattlesFromSupabase(): Promise<BattleSummary[] | null> {
  if (!supabase) {
    console.warn("Supabase client not initialized. Using local fallback data.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('battles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Gracefully handle error (e.g. table not found) so app falls back to CSV
      console.warn("Supabase fetch warning:", JSON.stringify(error, null, 2));
      return null;
    }

    if (!data || data.length === 0) {
      console.log("Supabase table found but empty. Using local fallback data.");
      return null;
    }

    // Map Supabase DB rows to BattleSummary type
    return data.map((row: any) => ({
      id: row.id,
      battleId: row.battle_id,
      createdAt: row.created_at,
      status: row.status,
      artistA: {
        id: 'A',
        name: row.artist1_name,
        color: '#06b6d4',
        avatar: row.image_url,
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
      // Fallback for TVL if provided in DB
      artistASolBalance: row.artist1_pool || 0,
      artistBSolBalance: row.artist2_pool || 0,
      imageUrl: row.image_url,
      streamLink: row.stream_link,
      creatorWallet: row.creator_wallet,
      isCommunityBattle: row.is_community_battle,
      communityRoundId: row.community_round_id
    }));

  } catch (err: any) {
    // Catch network or client instantiation errors
    const errorMessage = typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);
    console.warn("Supabase connection failed (using fallback):", errorMessage);
    return null;
  }
}

// Function to upload local data.ts to Supabase
export async function uploadBattlesToSupabase(battles: BattleSummary[]) {
  if (!battles || battles.length === 0) return { success: false, message: 'No data to upload' };

  try {
    // Transform BattleSummary objects back to DB columns
    const rows = battles.map(b => ({
      // id: b.id, // Let Supabase generate new UUIDs or keep existing if you want strict sync
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
      community_round_id: b.communityRoundId
    }));

    // Upsert based on battle_id to prevent duplicates if run multiple times
    const { error } = await supabase
      .from('battles')
      .upsert(rows, { onConflict: 'battle_id' });

    if (error) throw error;
    
    return { success: true, message: `Successfully synced ${rows.length} battles!` };
  } catch (e: any) {
    console.error("Upload failed", e);
    return { success: false, message: e.message || JSON.stringify(e) };
  }
}
