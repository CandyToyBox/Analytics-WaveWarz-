import type { VercelRequest, VercelResponse } from '@vercel/node';
import { announceBattle } from '../utils/farcaster.js';

/**
 * Helper: Post battle announcement to Farcaster
 */
async function postBattleToFarcaster(battle: any) {
  try {
    const result = await announceBattle({
      battleId: battle.battle_id,
      artist1Name: battle.artist1_name,
      artist2Name: battle.artist2_name,
      imageUrl: battle.image_url
    });

    if (result.success) {
      console.log('✅ Posted to Farcaster:', result.hash);
    } else {
      console.log('ℹ️  Farcaster posting skipped:', result.error);
    }
  } catch (error) {
    console.error('❌ Failed to post to Farcaster:', error);
  }
}

/**
 * Main Vercel Handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, table, record } = req.body;

  console.log(`📥 Received webhook: ${type} on ${table}`);

  try {
    if (table !== 'battles') {
      return res.status(200).json({ message: 'Ignored table' });
    }

    if (type === 'INSERT') {
      await postBattleToFarcaster(record);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
