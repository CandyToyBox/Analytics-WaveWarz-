import { Request, Response } from 'express';
import { announceBattle } from '../utils/farcaster';

interface BattleWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  old_record?: any;
  schema: string;
}

/**
 * Handles webhook events from Supabase battles table
 * Triggered on INSERT events for new battles
 */
export async function battleWebhookHandler(req: Request, res: Response) {
  try {
    const payload: BattleWebhookPayload = req.body;

    console.log('📥 Received webhook:', {
      type: payload.type,
      table: payload.table,
      battleId: payload.record?.battle_id
    });

    // Validate webhook payload
    if (!payload.type || !payload.record) {
      return res.status(400).json({
        error: 'Invalid webhook payload',
        received: payload
      });
    }

    // Handle different event types
    switch (payload.type) {
      case 'INSERT':
        await handleNewBattle(payload.record);
        break;

      case 'UPDATE':
        await handleBattleUpdate(payload.record, payload.old_record);
        break;

      case 'DELETE':
        console.log('🗑️  Battle deleted:', payload.old_record?.battle_id);
        break;

      default:
        console.log('ℹ️  Unhandled webhook type:', payload.type);
    }

    // Acknowledge webhook
    res.status(200).json({
      success: true,
      message: 'Webhook processed',
      type: payload.type
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Handle new battle creation
 */
async function handleNewBattle(record: any) {
  console.log('🆕 New battle created:', {
    battleId: record.battle_id,
    artist1: record.artist1_name,
    artist2: record.artist2_name,
    status: record.status
  });

  // Post to Farcaster (if enabled)
  if (process.env.ENABLE_FARCASTER_POSTING === 'true') {
    await postBattleToFarcaster(record);
  }

  // TODO: Additional actions:
  // - Trigger analytics update
  // - Cache battle data for faster Frame rendering
  // - Send Discord/Telegram notifications
}

/**
 * Handle battle updates (status changes, pool updates, etc.)
 */
async function handleBattleUpdate(newRecord: any, oldRecord: any) {
  console.log('🔄 Battle updated:', {
    battleId: newRecord.battle_id,
    changes: detectChanges(oldRecord, newRecord)
  });

  // TODO: Implement update actions:
  // - Notify on status changes (started -> ended)
  // - Alert on significant pool changes
  // - Update cached Frame images
}

/**
 * Detect what changed in the update
 */
function detectChanges(oldRecord: any, newRecord: any): string[] {
  const changes: string[] = [];

  if (oldRecord?.status !== newRecord?.status) {
    changes.push(`status: ${oldRecord?.status} → ${newRecord?.status}`);
  }

  if (oldRecord?.artist1_pool !== newRecord?.artist1_pool) {
    changes.push(`artist1_pool: ${oldRecord?.artist1_pool} → ${newRecord?.artist1_pool}`);
  }

  if (oldRecord?.artist2_pool !== newRecord?.artist2_pool) {
    changes.push(`artist2_pool: ${oldRecord?.artist2_pool} → ${newRecord?.artist2_pool}`);
  }

  if (oldRecord?.winner_decided !== newRecord?.winner_decided) {
    changes.push(`winner_decided: ${oldRecord?.winner_decided} → ${newRecord?.winner_decided}`);
  }

  return changes;
}

/**
 * Post battle announcement to Farcaster
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
