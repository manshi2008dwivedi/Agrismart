import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA = process.env.DATA_PATH || path.join(ROOT, 'data', 'db.json');
const OUT = path.join(ROOT, 'data', 'export.sql');

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${val.toString().replace(/'/g, "''")}'`;
}

async function exportSql() {
  console.log(`Reading AgriSmart JSON database from: ${DATA}`);
  if (!fs.existsSync(DATA)) {
    console.error('Database file db.json not found.');
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const lines = [
    '-- AgriSmart Automated Data Migration Export',
    `-- Exported at: ${new Date().toISOString()}`,
    'BEGIN;',
    ''
  ];

  // Users
  for (const u of db.users || []) {
    lines.push(`INSERT INTO users (id, name, email, phone, role, salt, hash, created_at) VALUES (${esc(u.id)}, ${esc(u.name)}, ${esc(u.email)}, ${esc(u.phone)}, ${esc(u.role)}, ${esc(u.salt)}, ${esc(u.hash)}, ${esc(u.createdAt)}) ON CONFLICT (id) DO NOTHING;`);
  }

  // Farmers
  for (const f of db.farmers || []) {
    lines.push(`INSERT INTO farmers (id, owner_user_id, name, district, crops, verified) VALUES (${esc(f.id)}, ${esc(f.ownerUserId)}, ${esc(f.name)}, ${esc(f.district)}, ${esc(f.crops)}, ${esc(f.verified || false)}) ON CONFLICT (id) DO NOTHING;`);
  }

  // Crop Listings
  for (const l of db.cropListings || []) {
    lines.push(`INSERT INTO crop_listings (id, farmer_user_id, crop, crop_name, quantity, expected_price, harvest_date, mandi, notes, created_at) VALUES (${esc(l.id)}, ${esc(l.farmerUserId)}, ${esc(l.crop)}, ${esc(l.cropName)}, ${esc(l.quantity)}, ${esc(l.expectedPrice)}, ${esc(l.harvestDate)}, ${esc(l.mandi)}, ${esc(l.notes)}, ${esc(l.createdAt)}) ON CONFLICT (id) DO NOTHING;`);
  }

  // Offers
  for (const o of db.offers || []) {
    lines.push(`INSERT INTO offers (id, farmer_id, farmer_name, buyer_user_id, buyer_name, crop, crop_name, quantity, price, early_bonus_per_quintal, total_price_per_quintal, counter_price, delivery_by, status, created_at, responded_at, countered_at) VALUES (${esc(o.id)}, ${esc(o.farmerId)}, ${esc(o.farmerName)}, ${esc(o.buyerUserId)}, ${esc(o.buyerName)}, ${esc(o.crop)}, ${esc(o.cropName)}, ${esc(o.quantity)}, ${esc(o.price)}, ${esc(o.earlyBonusPerQuintal || 0)}, ${esc(o.totalPricePerQuintal)}, ${esc(o.counterPrice)}, ${esc(o.deliveryBy)}, ${esc(o.status)}, ${esc(o.createdAt)}, ${esc(o.respondedAt)}, ${esc(o.counteredAt)}) ON CONFLICT (id) DO NOTHING;`);
  }

  // Orders
  for (const ord of db.orders || []) {
    lines.push(`INSERT INTO orders (id, offer_id, buyer_user_id, farmer_id, crop, crop_name, quantity, price_per_quintal, total_amount, status, payment_status, delivery_status, payment_details, paid_at, created_at) VALUES (${esc(ord.id)}, ${esc(ord.offerId)}, ${esc(ord.buyerUserId)}, ${esc(ord.farmerId)}, ${esc(ord.crop)}, ${esc(ord.cropName)}, ${esc(ord.quantity)}, ${esc(ord.pricePerQuintal)}, ${esc(ord.totalAmount)}, ${esc(ord.status)}, ${esc(ord.paymentStatus)}, ${esc(ord.deliveryStatus)}, ${esc(ord.paymentDetails)}, ${esc(ord.paidAt)}, ${esc(ord.createdAt)}) ON CONFLICT (id) DO NOTHING;`);
  }

  // Reports
  for (const r of db.reports || []) {
    lines.push(`INSERT INTO reports (id, farmer_user_id, crop, crop_name, soil, acres, yield_quintal, estimated_revenue, estimated_cost, estimated_profit, fertilizer_plan, created_at) VALUES (${esc(r.id)}, ${esc(r.farmerUserId)}, ${esc(r.crop)}, ${esc(r.cropName)}, ${esc(r.soil)}, ${esc(r.acres)}, ${esc(r.yieldQuintal)}, ${esc(r.estimatedRevenue)}, ${esc(r.estimatedCost)}, ${esc(r.estimatedProfit)}, ${esc(r.fertilizerPlan)}, ${esc(r.createdAt)}) ON CONFLICT (id) DO NOTHING;`);
  }

  // Notifications
  for (const n of db.notifications || []) {
    lines.push(`INSERT INTO notifications (id, user_id, type, title, body, meta, read, created_at) VALUES (${esc(n.id)}, ${esc(n.userId)}, ${esc(n.type)}, ${esc(n.title)}, ${esc(n.body)}, ${esc(n.meta)}, ${esc(n.read || false)}, ${esc(n.createdAt)}) ON CONFLICT (id) DO NOTHING;`);
  }

  lines.push('');
  lines.push('COMMIT;');
  lines.push('');

  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log(`✅ SQL export complete! Successfully generated: ${OUT}`);
}

exportSql().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
