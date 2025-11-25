/**
 * Test script for webhook functionality
 * Run with: npx tsx api/test-webhook.ts
 */

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3001/api/webhooks/battles';

interface TestBattle {
  battle_id: string;
  artist1_name: string;
  artist2_name: string;
  status: string;
  artist1_pool: number;
  artist2_pool: number;
  created_at: string;
}

const testBattle: TestBattle = {
  battle_id: '999999',
  artist1_name: 'Test Artist Alpha',
  artist2_name: 'Test Artist Beta',
  status: 'active',
  artist1_pool: 10.5,
  artist2_pool: 8.3,
  created_at: new Date().toISOString()
};

async function testWebhookInsert() {
  console.log('🧪 Testing INSERT webhook...\n');

  const payload = {
    type: 'INSERT',
    table: 'battles',
    schema: 'public',
    record: testBattle
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ INSERT webhook test passed!');
    } else {
      console.log('\n❌ INSERT webhook test failed!');
    }
  } catch (error) {
    console.error('\n❌ Error testing webhook:', error);
  }
}

async function testWebhookUpdate() {
  console.log('\n🧪 Testing UPDATE webhook...\n');

  const payload = {
    type: 'UPDATE',
    table: 'battles',
    schema: 'public',
    record: {
      ...testBattle,
      artist1_pool: 25.7,
      artist2_pool: 18.4
    },
    old_record: testBattle
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ UPDATE webhook test passed!');
    } else {
      console.log('\n❌ UPDATE webhook test failed!');
    }
  } catch (error) {
    console.error('\n❌ Error testing webhook:', error);
  }
}

async function testHealthEndpoint() {
  console.log('🏥 Testing health endpoint...\n');

  const healthUrl = WEBHOOK_URL.replace('/api/webhooks/battles', '/health');

  try {
    const response = await fetch(healthUrl);
    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Health check passed!');
    } else {
      console.log('\n❌ Health check failed!');
    }
  } catch (error) {
    console.error('\n❌ Error testing health endpoint:', error);
  }
}

async function runTests() {
  console.log('🚀 Starting Webhook Tests\n');
  console.log('Target URL:', WEBHOOK_URL);
  console.log('━'.repeat(50));

  await testHealthEndpoint();
  console.log('\n' + '━'.repeat(50));

  await testWebhookInsert();
  console.log('\n' + '━'.repeat(50));

  await testWebhookUpdate();
  console.log('\n' + '━'.repeat(50));

  console.log('\n✨ All tests complete!\n');
}

// Run tests
runTests().catch(console.error);
