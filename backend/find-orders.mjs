/**
 * find-orders.mjs — Find orders for specific user
 * Run: node find-orders.mjs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const MONGO_URI = process.env.MONGODB_URI;
const USER_ID   = '6a990a5fd14f28d420990 29c'.replace(/\s/g, ''); // from your token
const TOKEN     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTk5MGE1ZmQxNGYyOGQ0MjA5OTAyOWMiLCJpZCI6IjZhOTkwYTVmZDE0ZjI4ZDQyMDk5MDI5YyIsImVtYWlsIjoiODMwMzgzNDYyNkBrcmlzaGlzaGllbGQuZmFybWVyIiwiaWF0IjoxNzg4NDE4NjcwLCJleHAiOjE3ODkwMjM0NzB9.L0C1TXD34Td2lNvvhrKtP1DUM7NNbQxPqo4I_m8IeJI';
const PORT      = process.env.PORT || 5000;

console.log('\n🌾 KrishiSetu — Finding Orders for Your Account');
console.log('═══════════════════════════════════════════════\n');

try {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB Connected\n');

  const db = mongoose.connection.db;

  // Find user
  const user = await db.collection('users').findOne(
    { _id: new mongoose.Types.ObjectId(USER_ID) }
  );
  console.log('👤 User:');
  console.log(`   Name  : ${user?.name || 'N/A'}`);
  console.log(`   Phone : ${user?.phone || user?.emailOrPhone || 'N/A'}`);
  console.log(`   ID    : ${USER_ID}\n`);

  // Find all orders for this user (as buyer OR seller)
  const orders = await db.collection('orders').find({
    $or: [
      { buyerId: new mongoose.Types.ObjectId(USER_ID) },
      { sellerId: new mongoose.Types.ObjectId(USER_ID) }
    ]
  }).limit(5).toArray();

  if (orders.length === 0) {
    console.log('⚠️  No orders found for this user.\n');
    console.log('💡 Create an order first via POST /api/orders\n');

    // Show all orders in DB regardless
    const anyOrders = await db.collection('orders').find({}).limit(3).toArray();
    if (anyOrders.length > 0) {
      console.log('📦 All orders in DB (any user):');
      anyOrders.forEach((o, i) => {
        console.log(`   ${i+1}. orderNumber: ${o.orderNumber}`);
        console.log(`      orderId    : ${o._id.toString()}`);
        console.log(`      amount     : ₹${o.totalAmount}`);
        console.log(`      status     : ${o.orderStatus}`);
        console.log(`      buyerId    : ${o.buyerId?.toString()}\n`);
      });
    }
  } else {
    console.log(`📦 Found ${orders.length} order(s):\n`);
    orders.forEach((o, i) => {
      const role = o.buyerId?.toString() === USER_ID ? 'BUYER' : 'SELLER';
      console.log(`   ${i+1}. [${role}] ${o.orderNumber}`);
      console.log(`      orderId     : ${o._id.toString()}`);
      console.log(`      amount      : ₹${o.totalAmount}`);
      console.log(`      orderStatus : ${o.orderStatus}`);
      console.log(`      payStatus   : ${o.paymentStatus}\n`);
    });
  }

  // Use first buyer order for test
  const buyerOrder = orders.find(o => o.buyerId?.toString() === USER_ID) || orders[0];
  const testOrderId = buyerOrder?._id.toString() || 'NO_ORDER_FOUND';

  console.log('══════════════════════════════════════════════════════════');
  console.log('📬 POSTMAN READY — Copy these exactly:');
  console.log('══════════════════════════════════════════════════════════\n');

  console.log(`Bearer Token:`);
  console.log(`${TOKEN}\n`);

  console.log(`──────────────────────────────────────────────────────────`);
  console.log(`STEP 1 — Initiate Payment:`);
  console.log(`  URL    : POST http://localhost:${PORT}/api/payments/create`);
  console.log(`  Header : Authorization: Bearer ${TOKEN.substring(0,40)}...`);
  console.log(`  Body   : { "orderId": "${testOrderId}" }\n`);

  console.log(`STEP 2 — Check Escrow Status:`);
  console.log(`  URL    : GET http://localhost:${PORT}/api/payments/${testOrderId}\n`);

  console.log(`STEP 3 — Release Escrow (after DELIVERED):`);
  console.log(`  URL    : POST http://localhost:${PORT}/api/payments/${testOrderId}/release\n`);

  console.log(`STEP 4 — Refund:`);
  console.log(`  URL    : POST http://localhost:${PORT}/api/payments/${testOrderId}/refund`);
  console.log(`  Body   : { "reason": "Test refund" }\n`);

  console.log('══════════════════════════════════════════════════════════');
  console.log(`✅ ORDER ID TO USE: ${testOrderId}`);
  console.log('══════════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
