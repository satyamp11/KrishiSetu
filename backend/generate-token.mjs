/**
 * generate-token.mjs
 * Run: node generate-token.mjs
 * 
 * Generates a test JWT token + gives Postman-ready curl commands
 * to test the full Razorpay Escrow payment flow.
 */

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'krishi_shield_ai_secure_jwt_secret_2026_key_987654321';
const MONGO_URI  = process.env.MONGODB_URI;
const PORT       = process.env.PORT || 5000;

console.log('\n🌾 KrishiSetu — Dev Token Generator & Payment API Test Guide');
console.log('══════════════════════════════════════════════════════════\n');

// ── Step 1: Generate a test JWT token ──────────────────────────────────────
const testUserId = new mongoose.Types.ObjectId().toString();

const token = jwt.sign(
  { userId: testUserId, id: testUserId, email: 'test@krishisetu.dev' },
  JWT_SECRET,
  { expiresIn: '7d' }
);

console.log('✅ JWT_SECRET being used:');
console.log(`   ${JWT_SECRET}\n`);

console.log('🔑 Generated Bearer Token (valid 7 days):');
console.log(`   ${token}\n`);
console.log('   ⚠️  This is a test token — NOT linked to any real user in DB.');
console.log('   For a real token, use the OTP login flow (Step A below).\n');

// ── Step 2: Find a real user from DB ───────────────────────────────────────
let realToken = null;
let realUserId = null;
let realOrderId = null;

try {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected — fetching real user & order for testing...\n');

  const db = mongoose.connection.db;

  // Fetch first user
  const user = await db.collection('users').findOne({});
  if (user) {
    realUserId = user._id.toString();
    realToken = jwt.sign(
      { userId: realUserId, id: realUserId, email: user.email || '' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log(`👤 Real User Found:`);
    console.log(`   Name   : ${user.name || 'N/A'}`);
    console.log(`   Phone  : ${user.phone || user.emailOrPhone || 'N/A'}`);
    console.log(`   Role   : ${user.role || 'farmer'}`);
    console.log(`   userId : ${realUserId}`);
    console.log(`\n🔑 Real User Bearer Token:`);
    console.log(`   ${realToken}\n`);
  }

  // Fetch first order where this user is buyer
  const order = await db.collection('orders').findOne(
    user ? { buyerId: user._id } : {}
  );
  if (order) {
    realOrderId = order._id.toString();
    console.log(`📦 Real Order Found:`);
    console.log(`   orderNumber : ${order.orderNumber}`);
    console.log(`   orderId     : ${realOrderId}`);
    console.log(`   totalAmount : ₹${order.totalAmount}`);
    console.log(`   status      : ${order.orderStatus}\n`);
  } else {
    console.log('⚠️  No orders found in DB. Create an order first via /api/orders\n');
  }

  await mongoose.disconnect();
} catch (err) {
  console.log(`⚠️  Could not connect to MongoDB: ${err.message}`);
  console.log('   Using test token above for Postman testing.\n');
}

const useToken  = realToken || token;
const useOrder  = realOrderId || 'PASTE_YOUR_ORDER_ID_HERE';

// ── Step 3: Print Postman-ready API flow ───────────────────────────────────
console.log('══════════════════════════════════════════════════════════');
console.log('📬 POSTMAN / CURL TEST GUIDE — Full Escrow Payment Flow');
console.log('══════════════════════════════════════════════════════════\n');

console.log('STEP A ─ Get Real Token via OTP Login:');
console.log(`   POST http://localhost:${PORT}/api/auth/send-otp`);
console.log(`   Body: { "identifier": "8303834626" }`);
console.log(`   → Check terminal for OTP, then:\n`);
console.log(`   POST http://localhost:${PORT}/api/auth/verify-otp`);
console.log(`   Body: { "identifier": "8303834626", "otp": "XXXXXX" }`);
console.log(`   → Copy "token" from response\n`);

console.log('──────────────────────────────────────────────────────────');
console.log('STEP B ─ Initiate Razorpay Payment (creates Razorpay order):');
console.log(`\n   POST http://localhost:${PORT}/api/payments/create`);
console.log(`   Header: Authorization: Bearer ${useToken.substring(0, 50)}...`);
console.log(`   Body:`);
console.log(`   {`);
console.log(`     "orderId": "${useOrder}"`);
console.log(`   }`);
console.log(`   → You get: razorpayOrderId, amount, keyId\n`);

console.log('──────────────────────────────────────────────────────────');
console.log('STEP C ─ Verify Payment (after Razorpay checkout completes):');
console.log(`\n   POST http://localhost:${PORT}/api/payments/verify`);
console.log(`   Header: Authorization: Bearer <token>`);
console.log(`   Body:`);
console.log(`   {`);
console.log(`     "razorpay_order_id": "order_XXXXXXXX",`);
console.log(`     "razorpay_payment_id": "pay_XXXXXXXX",`);
console.log(`     "razorpay_signature": "XXXXXXXX"`);
console.log(`   }`);
console.log(`   → Payment status becomes HELD_FOR_ORDER\n`);

console.log('──────────────────────────────────────────────────────────');
console.log('STEP D ─ Check Escrow Status + Timeline:');
console.log(`\n   GET http://localhost:${PORT}/api/payments/${useOrder}`);
console.log(`   Header: Authorization: Bearer <token>`);
console.log(`   → Returns escrowTimeline, paymentState\n`);

console.log('──────────────────────────────────────────────────────────');
console.log('STEP E ─ Release Escrow (after order DELIVERED):');
console.log(`\n   POST http://localhost:${PORT}/api/payments/${useOrder}/release`);
console.log(`   Header: Authorization: Bearer <token>`);
console.log(`   → Farmer gets paid, status = RELEASED\n`);

console.log('──────────────────────────────────────────────────────────');
console.log('STEP F ─ Refund (cancel/dispute):');
console.log(`\n   POST http://localhost:${PORT}/api/payments/${useOrder}/refund`);
console.log(`   Header: Authorization: Bearer <token>`);
console.log(`   Body: { "reason": "Order cancelled by buyer" }`);
console.log(`   → Status = REFUNDED\n`);

console.log('══════════════════════════════════════════════════════════');
console.log('💡 QUICK COPY — Bearer Token for Postman:');
console.log('──────────────────────────────────────────────────────────');
console.log(useToken);
console.log('══════════════════════════════════════════════════════════\n');
