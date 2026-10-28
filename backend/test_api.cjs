const http = require('http');

async function req(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    const r = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json;
        try { json = JSON.parse(data); } catch { json = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });
    r.on('error', reject);
    if (body) r.write(typeof body === 'string' ? body : JSON.stringify(body));
    r.end();
  });
}

async function run() {
  console.log('Testing endpoints:');
  
  // 1. Health
  let res = await req('GET', '/api/health');
  console.log('GET /api/health:', res.status, res.body.ok ? 'OK' : 'FAIL');

  // 2. Static files
  res = await req('GET', '/');
  console.log('GET /:', res.status, typeof res.body === 'string' && res.body.includes('AgriSmart') ? 'OK' : 'FAIL');

  res = await req('GET', '/farmer.html');
  console.log('GET /farmer.html:', res.status);

  res = await req('GET', '/buyer.html');
  console.log('GET /buyer.html:', res.status);

  res = await req('GET', '/auth.html');
  console.log('GET /auth.html:', res.status);

  res = await req('GET', '/i18n.js');
  console.log('GET /i18n.js:', res.status);

  // 3. Crops
  res = await req('GET', '/api/crops');
  console.log('GET /api/crops:', res.status, Object.keys(res.body.items || {}).length, 'crops');

  // 4. Mandis
  res = await req('GET', '/api/mandis');
  console.log('GET /api/mandis:', res.status, (res.body.items || []).length, 'mandis');

  // 5. Mandis history
  res = await req('GET', '/api/mandis/history?crop=wheat');
  console.log('GET /api/mandis/history:', res.status, (res.body.history || []).length, 'days');

  // 6. Cold storage
  res = await req('GET', '/api/cold-storage');
  console.log('GET /api/cold-storage:', res.status, (res.body.items || []).length, 'cold storages');

  // 7. Transporters
  res = await req('GET', '/api/transporters');
  console.log('GET /api/transporters:', res.status, (res.body.items || []).length, 'transporters');

  // 8. Advisory fertilizer
  res = await req('POST', '/api/advisory/fertilizer', { crop: 'wheat', acres: 2, soilN: 'medium', soilP: 'low', soilK: 'high' });
  console.log('POST /api/advisory/fertilizer:', res.status, res.body.ureaBags ? 'OK' : 'FAIL');

  // 9. Advisory disease scan
  res = await req('POST', '/api/advisory/disease-scan', { crop: 'wheat', symptoms: 'yellow powder on leaves' });
  console.log('POST /api/advisory/disease-scan:', res.status, res.body.diagnosis?.name);

  // 10. Advisory assistant
  res = await req('POST', '/api/advisory/assistant', { query: 'wheat price', lang: 'en' });
  console.log('POST /api/advisory/assistant:', res.status, res.body.reply ? 'OK' : 'FAIL');

  // 11. Weather
  res = await req('GET', '/api/weather?district=Sehore');
  console.log('GET /api/weather:', res.status, res.body.source);

  // 12. Locations
  res = await req('GET', '/api/locations');
  console.log('GET /api/locations:', res.status, (res.body.items || []).length, 'locations');

  // 13. Auth registration - Farmer
  const farmerEmail = `farmer_test_${Date.now()}@example.com`;
  res = await req('POST', '/api/auth/register', {
    name: 'Ramesh Test Farmer',
    email: farmerEmail,
    password: 'password123',
    role: 'farmer',
    district: 'Sehore'
  });
  console.log('Register farmer:', res.status, res.body.user ? 'OK' : res.body.error);
  const farmerToken = res.body.token;
  const farmerId = res.body.farmer?.id;

  // 14. Auth registration - Buyer
  const buyerEmail = `buyer_test_${Date.now()}@example.com`;
  res = await req('POST', '/api/auth/register', {
    name: 'BigMart Buyer',
    email: buyerEmail,
    password: 'password123',
    role: 'buyer'
  });
  console.log('Register buyer:', res.status, res.body.user ? 'OK' : res.body.error);
  const buyerToken = res.body.token;

  // 15. GET /api/auth/me
  res = await req('GET', '/api/auth/me', null, { Authorization: `Bearer ${farmerToken}` });
  console.log('GET /api/auth/me (farmer):', res.status, res.body.user?.email);

  res = await req('GET', '/api/auth/me', null, { Authorization: `Bearer ${buyerToken}` });
  console.log('GET /api/auth/me (buyer):', res.status, res.body.user?.email);

  // 15b. Email OTP System tests
  // a) Request OTP for non-existent email -> 404
  res = await req('POST', '/api/auth/send-otp', { email: 'nonexistent_user@example.com', purpose: 'login' });
  console.log('Send OTP (non-existent):', res.status, res.body.code === 'USER_NOT_FOUND' ? '404 USER_NOT_FOUND OK' : res.status);

  // b) Request OTP for existing farmer -> 200 + devOtp
  res = await req('POST', '/api/auth/send-otp', { email: farmerEmail, purpose: 'login' });
  const farmerOtp = res.body.devOtp;
  console.log('Send OTP (farmer):', res.status, farmerOtp ? `OK (OTP: ${farmerOtp})` : 'FAIL');

  // c) Login with invalid OTP -> 401
  res = await req('POST', '/api/auth/login-otp', { email: farmerEmail, otp: '000000' });
  console.log('Login with invalid OTP:', res.status, res.status === 401 ? '401 Rejected OK' : 'FAIL');

  // d) Login with valid OTP -> 200 + token
  res = await req('POST', '/api/auth/login-otp', { email: farmerEmail, otp: farmerOtp });
  const otpLoginToken = res.body.token;
  console.log('Login with valid OTP:', res.status, otpLoginToken ? `OK (Welcome ${res.body.user?.name})` : 'FAIL');

  // e) Replay consumed OTP -> 401
  res = await req('POST', '/api/auth/login-otp', { email: farmerEmail, otp: farmerOtp });
  console.log('Replay consumed OTP:', res.status, res.status === 401 ? '401 Rejected OK' : 'FAIL');

  // 16. Buyer creates offer
  res = await req('POST', '/api/offers', {
    farmerId,
    crop: 'wheat',
    quantity: 50,
    price: 2500,
    earlyBonusPerQuintal: 50,
    deliveryBy: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10)
  }, { Authorization: `Bearer ${buyerToken}` });
  console.log('POST /api/offers (buyer):', res.status, res.body.id ? 'OK' : res.body.error);
  const offerId = res.body.id;

  // 17. GET /api/offers as farmer
  res = await req('GET', '/api/offers', null, { Authorization: `Bearer ${farmerToken}` });
  console.log('GET /api/offers (farmer):', res.status, res.body.items?.length);

  // 18. Chat messages
  res = await req('POST', `/api/offers/${offerId}/messages`, { text: 'Hello farmer, can you deliver by Friday?' }, { Authorization: `Bearer ${buyerToken}` });
  console.log('POST message (buyer):', res.status, res.body.id ? 'OK' : res.body.error);

  res = await req('GET', `/api/offers/${offerId}/messages`, null, { Authorization: `Bearer ${farmerToken}` });
  console.log('GET messages:', res.status, res.body.items?.length, 'messages');

  // 19. Farmer counter offer
  res = await req('POST', `/api/offers/${offerId}/counter`, { counterPrice: 2600 }, { Authorization: `Bearer ${farmerToken}` });
  console.log('POST counter (farmer):', res.status, res.body.status);

  // 20. Buyer accepts counter
  res = await req('POST', `/api/offers/${offerId}/accept-counter`, {}, { Authorization: `Bearer ${buyerToken}` });
  console.log('POST accept-counter (buyer):', res.status, res.body.offer?.status, 'Order created:', res.body.order?.id);
  const orderId = res.body.order?.id;

  // 20b. Test reject-counter flow
  res = await req('POST', '/api/offers', {
    farmerId,
    crop: 'chana',
    quantity: 20,
    price: 5200,
    deliveryBy: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10)
  }, { Authorization: `Bearer ${buyerToken}` });
  const offer2Id = res.body.id;
  await req('POST', `/api/offers/${offer2Id}/counter`, { counterPrice: 5800 }, { Authorization: `Bearer ${farmerToken}` });
  res = await req('POST', `/api/offers/${offer2Id}/reject-counter`, {}, { Authorization: `Bearer ${buyerToken}` });
  console.log('POST reject-counter (buyer):', res.status, res.body.status === 'rejected' ? 'OK (rejected)' : 'FAIL');

  // 21. Check orders
  res = await req('GET', '/api/orders', null, { Authorization: `Bearer ${farmerToken}` });
  console.log('GET /api/orders (farmer):', res.status, res.body.items?.length);

  res = await req('GET', '/api/orders', null, { Authorization: `Bearer ${buyerToken}` });
  console.log('GET /api/orders (buyer):', res.status, res.body.items?.length);

  // 22. Buyer update order payment
  res = await req('PATCH', `/api/orders/${orderId}`, { paymentStatus: 'paid' }, { Authorization: `Bearer ${buyerToken}` });
  console.log('PATCH order payment (buyer):', res.status, res.body.paymentStatus);

  // 23. Farmer update order delivery
  res = await req('PATCH', `/api/orders/${orderId}`, { deliveryStatus: 'delivered' }, { Authorization: `Bearer ${farmerToken}` });
  console.log('PATCH order delivery (farmer):', res.status, res.body.deliveryStatus, 'Status:', res.body.status);

  // 24. Farmer saves report
  res = await req('POST', '/api/reports', {
    crop: 'wheat',
    area: 2,
    production: 35,
    expenses: 30000,
    price: 2600
  }, { Authorization: `Bearer ${farmerToken}` });
  const reportId = res.body.id;
  console.log('POST /api/reports (farmer):', res.status, res.body.profit ? 'OK' : res.body.error);

  // 25. GET reports
  res = await req('GET', '/api/reports', null, { Authorization: `Bearer ${farmerToken}` });
  console.log('GET /api/reports (farmer):', res.status, 'Report count:', res.body.items?.length);

  // 25b. DELETE report
  res = await req('DELETE', `/api/reports/${reportId}`, null, { Authorization: `Bearer ${farmerToken}` });
  console.log('DELETE /api/reports (farmer):', res.status, res.body.ok ? 'OK' : 'FAIL');

  // 25c. Test switch role
  res = await req('POST', '/api/auth/switch-role', { role: 'farmer' }, { Authorization: `Bearer ${buyerToken}` });
  console.log('POST /api/auth/switch-role (buyer -> farmer):', res.status, res.body.user?.role === 'farmer' ? 'OK' : 'FAIL');

  res = await req('POST', '/api/auth/switch-role', { role: 'buyer' }, { Authorization: `Bearer ${buyerToken}` });
  console.log('POST /api/auth/switch-role (farmer -> buyer):', res.status, res.body.user?.role === 'buyer' ? 'OK' : 'FAIL');

  // 26. Notifications
  res = await req('GET', '/api/notifications', null, { Authorization: `Bearer ${farmerToken}` });
  console.log('GET /api/notifications (farmer):', res.status, res.body.items?.length);

  res = await req('PATCH', '/api/notifications/read', {}, { Authorization: `Bearer ${farmerToken}` });
  console.log('PATCH /api/notifications/read (farmer):', res.status, res.body.ok);

  // 27. Farmer posts a produce listing (Marketplace)
  res = await req('POST', '/api/listings', {
    farmerId,
    crop: 'wheat',
    cropName: 'Wheat',
    variety: 'Sharbati Gold',
    quantity: 25,
    expectedPrice: 2650,
    harvestDate: '2026-11-01',
    notes: 'Premium grain, moisture below 10%'
  }, { Authorization: `Bearer ${farmerToken}` });
  console.log('POST /api/listings (farmer):', res.status, res.body.id ? 'OK' : res.body.error);
  const listingId = res.body.id;

  // 28. Buyer browses produce listings (Marketplace)
  res = await req('GET', '/api/listings', null, { Authorization: `Bearer ${buyerToken}` });
  console.log('GET /api/listings (buyer):', res.status, 'Items found:', res.body.items?.length);

  // 29. Farmer deletes the produce listing
  res = await req('DELETE', `/api/listings/${listingId}`, null, { Authorization: `Bearer ${farmerToken}` });
  console.log('DELETE /api/listings (farmer):', res.status, res.body.ok ? 'OK' : res.body.error);

  // 30. Verify listing is removed
  res = await req('GET', '/api/listings', null, { Authorization: `Bearer ${buyerToken}` });
  console.log('GET /api/listings after delete:', res.status, 'Items count:', res.body.items?.length);

  // 31. Live Mandi Rates
  res = await req('GET', '/api/mandis/live?state=Madhya+Pradesh&commodity=Wheat');
  console.log('GET /api/mandis/live:', res.status, res.body.provider, 'Records:', res.body.records?.length);

  // 32. Payment Gateway - Create Order
  res = await req('POST', '/api/payments/create-order', { orderId }, { Authorization: `Bearer ${buyerToken}` });
  console.log('POST /api/payments/create-order:', res.status, res.body.id ? 'Order created: ' + res.body.id : res.body.error);
  const paymentOrderId = res.body.id;

  // 33. Payment Gateway - Verify Signature / Sandbox Payment
  res = await req('POST', '/api/payments/verify', {
    orderId,
    paymentOrderId,
    paymentId: 'pay_test_' + Date.now()
  }, { Authorization: `Bearer ${buyerToken}` });
  console.log('POST /api/payments/verify:', res.status, res.body.ok ? 'Verified & Paid' : res.body.error);

  // 34. Image Upload (Base64 JPEG 1x1 test pixel)
  const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  res = await req('POST', '/api/upload', { data: testPixel }, { Authorization: `Bearer ${farmerToken}` });
  console.log('POST /api/upload:', res.status, res.body.url ? 'URL: ' + res.body.url : res.body.error);

  console.log('\nAll tests completed.');
}

run().catch(console.error);
