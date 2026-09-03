/**
 * create-test-order.mjs — Creates a real test order in MongoDB
 * Run: node create-test-order.mjs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const MONGO_URI = process.env.MONGODB_URI;
const PORT      = process.env.PORT || 5000;

// Your user details from token
const BUYER_ID    = '6a990a5fd14f28d420990 29c'.replace(/\s/g, '');
const BUYER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTk5MGE1ZmQxNGYyOGQ0MjA5OTAyOWMiLCJpZCI6IjZhOTkwYTVmZDE0ZjI4ZDQyMDk5MDI5YyIsImVtYWlsIjoiODMwMzgzNDYyNkBrcmlzaGlzaGllbGQuZmFybWVyIiwiaWF0IjoxNzg4NDE4NjcwLCJleHAiOjE3ODkwMjM0NzB9.L0C1TXD34Td2lNvvhrKtP1DUM7NNbQxPqo4I_m8IeJI';

console.log('\n🌾 KrishiSetu — Creating Test Order in MongoDB');
console.log('═══════════════════════════════════════════════\n');

try {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB Connected\n');

  const db = mongoose.connection.db;

  // ── Find a seller (any farmer user) ───────────────────────────────────────
  let seller = await db.collection('users').findOne({
    _id: { $ne: new mongoose.Types.ObjectId(BUYER_ID) }
  });

  // If no other user, use same user as seller too (demo purposes)
  if (!seller) {
    seller = await db.collection('users').findOne({
      _id: new mongoose.Types.ObjectId(BUYER_ID)
    });
  }

  const buyer = await db.collection('users').findOne({
    _id: new mongoose.Types.ObjectId(BUYER_ID)
  });

  const orderNumber = `KS-TEST-${Date.now()}`;
  const subtotalAmount = 2500;   // ₹2500
  const logisticsFee   = 150;    // ₹150
  const totalAmount    = subtotalAmount + logisticsFee; // ₹2650

  // Price breakdown (server-side computation)
  const farmerEarnings      = Math.round(subtotalAmount * 0.82);  // ₹2050
  const logisticsCost       = logisticsFee + Math.round(subtotalAmount * 0.11); // ₹425
  const platformFee         = Math.round(subtotalAmount * 0.07);  // ₹175
  const intermediarySavings = Math.round(subtotalAmount * 0.35);  // ₹875

  const testOrder = {
    orderNumber,
    buyerId:          new mongoose.Types.ObjectId(BUYER_ID),
    buyerName:        buyer?.name || 'Test Buyer',
    buyerEmailOrPhone: buyer?.emailOrPhone || '8303834626',
    buyerRole:        'consumer',

    sellerId:         seller?._id || new mongoose.Types.ObjectId(BUYER_ID),
    sellerName:       seller?.name || 'Test Farmer',
    fpoName:          'Gorakhpur FPO',
    sellerDistrict:   'Gorakhpur',
    sellerState:      'Uttar Pradesh',

    items: [
      {
        productId:    new mongoose.Types.ObjectId(),
        title:        'Wheat (Sharbati) — Test',
        category:     'Grains',
        imageUrl:     '/images/crops/wheat.jpg',
        unit:         'kg',
        pricePerUnit: 25,
        quantity:     100,
        subtotal:     2500
      }
    ],

    subtotalAmount,
    logisticsFee,
    totalAmount,

    priceBreakdown: {
      consumerTotal:      totalAmount,
      farmerEarnings,
      logisticsCost,
      platformFee,
      intermediarySavings
    },

    deliveryAddress: {
      streetAddress: '123 Test Street',
      city:          'Gorakhpur',
      state:         'Uttar Pradesh',
      pincode:       '273001',
      landmark:      'Near Test Market'
    },

    paymentStatus:  'PENDING',
    paymentMethod:  'ESCROW',
    orderStatus:    'PENDING',

    statusHistory: [
      {
        status:    'PENDING',
        updatedAt: new Date(),
        note:      'Test order created via create-test-order.mjs'
      }
    ],
    paymentHistory: [],

    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection('orders').insertOne(testOrder);
  const orderId = result.insertedId.toString();

  console.log('✅ Test Order Created Successfully!\n');
  console.log(`   orderNumber : ${orderNumber}`);
  console.log(`   orderId     : ${orderId}`);
  console.log(`   totalAmount : ₹${totalAmount}`);
  console.log(`   farmerEarns : ₹${farmerEarnings}`);
  console.log(`   platformFee : ₹${platformFee}`);
  console.log(`   logistics   : ₹${logisticsCost}\n`);

  console.log('══════════════════════════════════════════════════════════');
  console.log('📬 POSTMAN STEPS — Copy & Paste These Exactly');
  console.log('══════════════════════════════════════════════════════════\n');

  console.log('┌─ STEP 1: Initiate Payment (Creates Razorpay Order) ─────');
  console.log('│  Method : POST');
  console.log(`│  URL    : http://localhost:${PORT}/api/payments/create`);
  console.log('│  Header : Authorization: Bearer');
  console.log(`│           ${BUYER_TOKEN}`);
  console.log('│  Body   :');
  console.log(`│  {`);
  console.log(`│    "orderId": "${orderId}"`);
  console.log(`│  }`);
  console.log('│  → Response will have: razorpayOrderId, amount, keyId');
  console.log('└─────────────────────────────────────────────────────────\n');

  console.log('┌─ STEP 2: Check Escrow Status ───────────────────────────');
  console.log('│  Method : GET');
  console.log(`│  URL    : http://localhost:${PORT}/api/payments/${orderId}`);
  console.log('│  Header : Authorization: Bearer <token>');
  console.log('│  → Returns: paymentState, escrowTimeline');
  console.log('└─────────────────────────────────────────────────────────\n');

  console.log('┌─ STEP 3: Release Escrow (simulate DELIVERED) ───────────');
  console.log('│');
  console.log('│  First update order status to DELIVERED:');
  console.log('│  Method : PUT');
  console.log(`│  URL    : http://localhost:${PORT}/api/orders/${orderId}/status`);
  console.log('│  Body   : { "orderStatus": "DELIVERED" }');
  console.log('│');
  console.log('│  Then release escrow:');
  console.log('│  Method : POST');
  console.log(`│  URL    : http://localhost:${PORT}/api/payments/${orderId}/release`);
  console.log('└─────────────────────────────────────────────────────────\n');

  console.log('┌─ STEP 4: Refund ────────────────────────────────────────');
  console.log('│  Method : POST');
  console.log(`│  URL    : http://localhost:${PORT}/api/payments/${orderId}/refund`);
  console.log('│  Body   : { "reason": "Test refund by buyer" }');
  console.log('└─────────────────────────────────────────────────────────\n');

  console.log('══════════════════════════════════════════════════════════');
  console.log('🎯 ORDER ID (copy this):');
  console.log(`   ${orderId}`);
  console.log('══════════════════════════════════════════════════════════\n');

  await mongoose.disconnect();

} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
