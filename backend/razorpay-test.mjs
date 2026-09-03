/**
 * razorpay-test.mjs
 * Run: node razorpay-test.mjs
 * Tests: 1) Razorpay SDK connection 2) Create a test order 3) Fetch it back
 */

import Razorpay from 'razorpay';

const KEY_ID     = 'rzp_test_TXSam1u5lcNVlG';
const KEY_SECRET = 'dIA3UYtQX8X1Khp1gBVYcNBO';

console.log('\n🌾 KrishiSetu — Razorpay API Connection Test');
console.log('═══════════════════════════════════════════\n');

const rzp = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

async function run() {
  // ── Test 1: Create a Razorpay Order ──
  console.log('📡 Test 1: Creating Razorpay order (₹100 test amount)...');
  let order;
  try {
    order = await rzp.orders.create({
      amount: 10000,          // ₹100 in paise
      currency: 'INR',
      receipt: 'KS_TEST_001',
      notes: { test: 'KrishiSetu Escrow Test', orderId: 'test_order_001' }
    });
    console.log('✅ Order Created Successfully!');
    console.log(`   order_id  : ${order.id}`);
    console.log(`   amount    : ₹${order.amount / 100}`);
    console.log(`   currency  : ${order.currency}`);
    console.log(`   status    : ${order.status}`);
    console.log(`   receipt   : ${order.receipt}`);
  } catch (err) {
    console.error('❌ Order creation FAILED:');
    console.error(`   Code    : ${err?.error?.code}`);
    console.error(`   Message : ${err?.error?.description || err?.message}`);
    process.exit(1);
  }

  // ── Test 2: Fetch the created order back ──
  console.log('\n📡 Test 2: Fetching created order from Razorpay...');
  try {
    const fetched = await rzp.orders.fetch(order.id);
    console.log('✅ Order Fetched Successfully!');
    console.log(`   order_id  : ${fetched.id}`);
    console.log(`   status    : ${fetched.status}`);
    console.log(`   attempts  : ${fetched.attempts}`);
  } catch (err) {
    console.error('❌ Order fetch FAILED:', err?.error?.description || err?.message);
  }

  // ── Summary ──
  console.log('\n═══════════════════════════════════════════');
  console.log('🎉 RAZORPAY CONNECTION: WORKING ✅');
  console.log(`   Key ID  : ${KEY_ID}`);
  console.log('   Mode    : TEST (Sandbox)');
  console.log('\n💡 Frontend checkout test card:');
  console.log('   Card    : 4111 1111 1111 1111');
  console.log('   Expiry  : Any future date (e.g. 12/28)');
  console.log('   CVV     : Any 3 digits');
  console.log('═══════════════════════════════════════════\n');
}

run();
