import type { VercelRequest, VercelResponse } from '@vercel/node';

// Cache for SOL price to avoid excessive API calls
let cachedPrice: { price: number; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 1 minute cache

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Check cache first
    if (cachedPrice && (Date.now() - cachedPrice.timestamp) < CACHE_TTL) {
      return res.status(200).json({
        success: true,
        price: cachedPrice.price,
        currency: 'USD',
        cached: true,
        timestamp: cachedPrice.timestamp
      });
    }

    // Fetch from CoinGecko API (free tier)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      // Return cached price if available, otherwise error
      if (cachedPrice) {
        return res.status(200).json({
          success: true,
          price: cachedPrice.price,
          currency: 'USD',
          cached: true,
          stale: true,
          timestamp: cachedPrice.timestamp
        });
      }
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const price = data.solana?.usd;

    if (typeof price !== 'number') {
      throw new Error('Invalid price data from CoinGecko');
    }

    // Update cache
    cachedPrice = {
      price,
      timestamp: Date.now()
    };

    return res.status(200).json({
      success: true,
      price,
      currency: 'USD',
      cached: false,
      timestamp: cachedPrice.timestamp
    });
  } catch (error) {
    console.error('SOL price fetch error:', error);
    
    // Return cached price if available
    if (cachedPrice) {
      return res.status(200).json({
        success: true,
        price: cachedPrice.price,
        currency: 'USD',
        cached: true,
        stale: true,
        timestamp: cachedPrice.timestamp,
        warning: 'Using cached price due to API error'
      });
    }

    return res.status(500).json({ 
      error: 'Failed to fetch SOL price',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
