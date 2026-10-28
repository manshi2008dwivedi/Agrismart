import http from 'http';
import { URL, fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA = process.env.DATA_PATH ? path.resolve(process.env.DATA_PATH) : path.join(ROOT, 'data', 'db.json');
const PUBLIC = process.env.PUBLIC_DIR ? path.resolve(process.env.PUBLIC_DIR) : path.resolve(ROOT, '..', 'frontend');

// Load environment variables from .env
const ENV_PATH = path.join(ROOT, '.env');
if (fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
// Configure this only in backend/.env or the process environment. Never commit API keys.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const MAX_BODY = 256 * 1024;
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
const rateBuckets = new Map();
let writeQueue = Promise.resolve();
let dbCache = null;

const defaultDb = {
  users: [], sessions: [], otps: [], farmers: [], reports: [], offers: [], orders: [], notifications: [], offerMessages: [], cropListings: [],
  crops: {
    wheat:{n:'Wheat',shr:0.5,up:1.2,need:450,y:18,cost:17000,seasons:['rabi']},
    chana:{n:'Chickpea (chana)',shr:0.6,up:1.5,need:300,y:7,cost:12000,seasons:['rabi']},
    mustard:{n:'Mustard',shr:0.5,up:1.4,need:270,y:6.5,cost:11000,seasons:['rabi']},
    soybean:{n:'Soybean',shr:0.8,up:2.0,need:550,y:7,cost:14000,seasons:['kharif']},
    maize:{n:'Maize',shr:0.5,up:1.3,need:500,y:18,cost:16000,seasons:['kharif','rabi']},
    lentil:{n:'Lentil (masoor)',shr:0.5,up:1.4,need:280,y:6.5,cost:10500,seasons:['rabi']}
  },
  mandis: [
    {n:'Sehore',district:'Sehore',km:12,fee:20,p:{wheat:2480,chana:5600,mustard:5900,soybean:4700,maize:2200,lentil:6200}},
    {n:'Ichhawar',district:'Sehore',km:30,fee:25,p:{wheat:2465,chana:5550,mustard:5850,soybean:4650,maize:2180,lentil:6150}},
    {n:'Ashta',district:'Sehore',km:38,fee:25,p:{wheat:2520,chana:5700,mustard:5980,soybean:4780,maize:2250,lentil:6280}},
    {n:'Bhopal (Karond)',district:'Bhopal',km:42,fee:35,p:{wheat:2560,chana:5780,mustard:6050,soybean:4850,maize:2280,lentil:6350}},
    {n:'Budhni',district:'Sehore',km:55,fee:20,p:{wheat:2450,chana:5520,mustard:5800,soybean:4620,maize:2160,lentil:6100}}
  ],
  coldStorages: [
    { id: 'cs-1', name: 'Krishi Upaj Mandi Cold Hub', district: 'Sehore', capacityMT: 5000, tempRange: '2°C to 4°C', feePerQtlMonth: 28, contact: '+91 98261 45012', type: 'Govt Reg. WDRA', lat: 23.205, lon: 77.089 },
    { id: 'cs-2', name: 'Malwa Agri Warehousing (WDRA)', district: 'Ashta', capacityMT: 8500, tempRange: 'Ambient / Dry', feePerQtlMonth: 18, contact: '+91 94250 88219', type: 'WDRA Accredited', lat: 23.018, lon: 76.719 },
    { id: 'cs-3', name: 'Bhopal Agro Cold Chain Pvt Ltd', district: 'Bhopal', capacityMT: 12000, tempRange: '0°C to 4°C Multi-chamber', feePerQtlMonth: 32, contact: '+91 97555 12044', type: 'Private Commercial', lat: 23.284, lon: 77.412 },
    { id: 'cs-4', name: 'Narmada Valley Agro Storage', district: 'Budhni', capacityMT: 4000, tempRange: '4°C to 8°C Potato/Spices', feePerQtlMonth: 25, contact: '+91 99812 67340', type: 'Cooperative WDRA', lat: 22.775, lon: 77.683 }
  ],
  transporters: [
    { id: 'tr-1', name: 'Kisan Tractor Trolley Union', district: 'Sehore', vehicle: 'Tractor Trolley (Hydraulic)', capacityQtl: 45, baseRate: 500, perKmRate: 25, phone: '+91 98930 11223' },
    { id: 'tr-2', name: 'Malwa Pick-Up Express', district: 'Ashta', vehicle: 'Mahindra Bolero Maxi Truck', capacityQtl: 18, baseRate: 400, perKmRate: 20, phone: '+91 98270 33445' },
    { id: 'tr-3', name: 'Shree Ram Eicher Transport', district: 'Ichhawar', vehicle: 'Eicher 14-ft Canter', capacityQtl: 55, baseRate: 1200, perKmRate: 35, phone: '+91 94244 55667' },
    { id: 'tr-4', name: 'Central MP Logistics Syndicate', district: 'Bhopal Karond', vehicle: '10-Wheeler Heavy Truck', capacityQtl: 160, baseRate: 2500, perKmRate: 55, phone: '+91 98260 77889' }
  ],
  diseases: [
    { crop: 'wheat', id: 'w-1', name: 'Yellow Rust (पीला रतुआ)', symptoms: ['yellow stripes', 'yellow powdery spores', 'stripes on leaves', 'yellow dust', 'पीली धारियां', 'पीला पाउडर'], severity: 'High', organicRemedy: 'Spray 5% Neem seed kernel extract (NSKE) or Trichoderma viride (10g/L) during early emergence.', chemicalRemedy: 'Spray Propiconazole 25% EC (Tilt) @ 1 ml/litre water or Tebuconazole @ 1 ml/litre immediately upon sighting.' },
    { crop: 'wheat', id: 'w-2', name: 'Loose Smut (कंगुआ रोग)', symptoms: ['black powder in earhead', 'charcoal head', 'black dust on wheat ear', 'काला पाउडर', 'बाली में कालिख'], severity: 'Moderate', organicRemedy: 'Solar heat treatment of seed before sowing. Soil drenching with cow urine extract (10%).', chemicalRemedy: 'Seed treatment with Carboxin (Vitavax) 75% WP @ 2.5 g/kg seed.' },
    { crop: 'soybean', id: 's-1', name: 'Yellow Mosaic Virus (पीला मोज़ेक)', symptoms: ['yellow patch on leaf', 'mosaic yellow green', 'curling leaves', 'whitefly', 'सफेद मक्खी', 'पीला मोज़ेक'], severity: 'Critical', organicRemedy: 'Set up yellow sticky traps (15 traps/acre). Spray 5% Neem oil to control vector whiteflies.', chemicalRemedy: 'Control whitefly vector by spraying Thiamethoxam 25% WG @ 40g/acre or Acetamiprid 20% SP @ 50g/acre.' },
    { crop: 'soybean', id: 's-2', name: 'Charcoal Rot (चारकोल सड़न)', symptoms: ['dry stem', 'black spots inside stem', 'wilting during dry spell', 'तना सूखना', 'काले धब्बे'], severity: 'High', organicRemedy: 'Apply Trichoderma harzianum @ 2.5 kg/acre mixed with 100 kg farmyard manure (FYM) to soil.', chemicalRemedy: 'Seed treatment with Thiram + Carbendazim (1:1) @ 3 g/kg seed.' },
    { crop: 'maize', id: 'm-1', name: 'Fall Armyworm (सैनिक कीट/सुंडी)', symptoms: ['shot holes in leaves', 'sawdust in whorl', 'caterpillar in maize whorl', 'पत्तियों में छेद', 'गोभ में इल्ली'], severity: 'Critical', organicRemedy: 'Place pheromone traps (5/acre). Apply fine sand or wood ash into whorls. Spray Bacillus thuringiensis (Bt) @ 2g/L.', chemicalRemedy: 'Spray Chlorantraniliprole 18.5% SC (Coragen) @ 0.4 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L into leaf whorls.' },
    { crop: 'chana', id: 'c-1', name: 'Fusarium Wilt (उकठा रोग)', symptoms: ['drooping leaves', 'sudden drying of plant', 'black ring in vascular roots', 'पौधा सूखना', 'उकठा'], severity: 'High', organicRemedy: 'Deep summer ploughing. Seed treatment with Trichoderma viride @ 5g/kg seed. Crop rotation with wheat.', chemicalRemedy: 'Seed treatment with Carbendazim + Mancozeb (Saaf) @ 2 g/kg seed.' },
    { crop: 'chana', id: 'c-2', name: 'Pod Borer / Helicoverpa (घाटी छेदक इल्ली)', symptoms: ['holes in chickpea pods', 'caterpillar eating grains', 'घाटी में छेद', 'इल्ली'], severity: 'High', organicRemedy: 'Install T-shaped bird perches (20/acre) and pheromone traps (5/acre). Spray HaNPV 250 LE/acre.', chemicalRemedy: 'Spray Emamectin Benzoate 5% SG @ 88 g/acre or Indoxacarb 14.5% SC @ 200 ml/acre.' },
    { crop: 'mustard', id: 'mu-1', name: 'White Rust (सफेद रतुआ)', symptoms: ['white pustules under leaf', 'staghead deformation', 'पत्ती के नीचे सफेद फफोले'], severity: 'Moderate', organicRemedy: 'Spray Garlic-Chilli extract (5%) or Neem leaf extract.', chemicalRemedy: 'Foliar spray of Metalaxyl 8% + Mancozeb 64% (Ridomil MZ) @ 2 g/L water.' },
    { crop: 'mustard', id: 'mu-2', name: 'Mustard Aphids (माहू/चेपा कीट)', symptoms: ['curled leaves', 'sticky honey dew', 'tiny green black insects on flowers', 'माहू', 'चेपा'], severity: 'High', organicRemedy: 'Spray 5% soap water or Neem oil @ 5 ml/L during early infestation in morning.', chemicalRemedy: 'Spray Dimethoate 30% EC (Rogor) @ 1.5 ml/L or Imidacloprid 17.8% SL @ 0.5 ml/L.' }
  ],
  weatherLocations:{
    Sehore:{lat:23.2032,lon:77.0844},
    Bhopal:{lat:23.2599,lon:77.4126},
    Ashta:{lat:23.0181,lon:76.7197},
    Ichhawar:{lat:23.0232,lon:77.0167},
    Budhni:{lat:22.7758,lon:77.6833},
    Indore:{lat:22.7196,lon:75.8577},
    Dewas:{lat:22.9676,lon:76.0534},
    Ujjain:{lat:23.1765,lon:75.7885},
    Hoshangabad:{lat:22.7519,lon:77.7289},
    Vidisha:{lat:23.5251,lon:77.8081},
    Raisen:{lat:23.3303,lon:77.7816},
    Rajgarh:{lat:24.0064,lon:76.7262},
    Harda:{lat:22.3444,lon:77.0934},
    Jabalpur:{lat:23.1815,lon:79.9864},
    Gwalior:{lat:26.2183,lon:78.1828}
  }
};

function ensureDb(){
  let db;
  try { db = JSON.parse(fs.readFileSync(DATA,'utf8')); } catch { db = structuredClone(defaultDb); }
  for (const [key,value] of Object.entries(defaultDb)) if (db[key] === undefined) db[key] = structuredClone(value);
  db.users ||= []; db.sessions ||= []; db.otps ||= []; db.farmers ||= []; db.reports ||= []; db.offers ||= []; db.orders ||= []; db.notifications ||= [];
  db.coldStorages ||= structuredClone(defaultDb.coldStorages);
  db.transporters ||= structuredClone(defaultDb.transporters);
  db.diseases ||= structuredClone(defaultDb.diseases);
  db.offerMessages ||= [];
  db.cropListings ||= [];
  db.weatherLocations = Object.assign(structuredClone(defaultDb.weatherLocations), db.weatherLocations || {});
  for (const farmer of db.farmers) farmer.ownerUserId ||= null;
  for (const offer of db.offers) offer.buyerUserId ||= offer.buyerId || null;
  for (const order of db.orders) order.createdAt ||= new Date().toISOString();
  try {
    fs.mkdirSync(path.dirname(DATA), { recursive: true });
    fs.writeFileSync(DATA, JSON.stringify(db,null,2));
  } catch(e){}
  dbCache = db;
  return db;
}
const load = () => {
  if (!dbCache) return ensureDb();
  return dbCache;
};
function save(db){
  dbCache = db;
  const snapshot = JSON.stringify(db,null,2);
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.promises.writeFile(DATA,snapshot);
    } catch (e) {
      console.error('Database write skipped or delayed due to file lock:', e.message);
    }
  });
  return writeQueue;
}

function json(res,status,data,extra={}){
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra});
  res.end(JSON.stringify(data));
}
function html(res,status,data,extra={}){
  res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store',...extra});res.end(data);
}
function headers(req){
  const origin = req?.headers?.origin;
  const allowedOriginEnv = process.env.FRONTEND_ORIGIN;
  let allowed = 'null';
  let allowCredentials = false;

  if (allowedOriginEnv) {
    if (origin === allowedOriginEnv) {
      allowed = origin;
      allowCredentials = true;
    }
  } else if (origin) {
    try {
      const u = new URL(origin);
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '0.0.0.0') {
        allowed = origin;
        allowCredentials = true;
      }
    } catch {}
  } else {
    allowed = '*';
  }

  const h = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type, Authorization',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'SAMEORIGIN',
    'Permissions-Policy':'geolocation=(self), microphone=(), camera=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://checkout.razorpay.com; frame-src 'self' https://api.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: https://api.qrserver.com; connect-src 'self' https://api.open-meteo.com https://freeipapi.com https://ipapi.co https://api.bigdatacloud.net https://api.razorpay.com https://lumberjack.razorpay.com;"
  };
  if (allowCredentials) {
    h['Access-Control-Allow-Credentials'] = 'true';
  }
  return h;
}
function rateLimit(req,res){
  const rawForwarded = req.headers['x-forwarded-for'];
  let ip = req.socket.remoteAddress || 'unknown';
  if (process.env.TRUSTED_PROXIES && rawForwarded) {
    ip = rawForwarded.split(',')[0].trim();
  }
  const now=Date.now(); const b=rateBuckets.get(ip)||{start:now,count:0};
  if(now-b.start>60000){b.start=now;b.count=0;}
  b.count++;rateBuckets.set(ip,b);
  if(b.count>120){json(res,429,{error:'Too many requests. Please try again in a minute.'},headers(req));return false;}
  return true;
}
function parseBody(req){
  return new Promise((resolve,reject)=>{
    let size=0,raw='';
    req.on('data',chunk=>{size+=chunk.length;if(size>MAX_BODY){reject(Object.assign(new Error('Request body is too large.'),{status:413}));req.destroy();return;}raw+=chunk;});
    req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(Object.assign(new Error('Invalid JSON body.'),{status:400}))}});
    req.on('error',reject);
  });
}
function clean(value,max=160){return String(value??'').trim().slice(0,max)}
function email(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||''))}
function passwordOk(value){return typeof value==='string'&&value.length>=8&&value.length<=128}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){
  return new Promise((resolve,reject)=>crypto.scrypt(password,salt,64,(e,key)=>e?reject(e):resolve({salt,hash:key.toString('hex')})));
}
function verifyPassword(password,user){return new Promise((resolve,reject)=>crypto.scrypt(password,user.passwordSalt,64,(e,key)=>e?reject(e):resolve(crypto.timingSafeEqual(key,Buffer.from(user.passwordHash,'hex')))))}
function token(){return crypto.randomBytes(32).toString('hex')}
function getAuth(req,db){
  const raw=req.headers.authorization||'';if(!raw.startsWith('Bearer '))return null;
  const session=db.sessions.find(s=>s.token===raw.slice(7)&&new Date(s.expiresAt)>new Date());
  if(!session)return null;
  const user=db.users.find(u=>u.id===session.userId);return user?{user,session}:null;
}
function requireAuth(req,res,db,role=null){
  const auth=getAuth(req,db);
  if(!auth){json(res,401,{error:'Please log in to continue.'},headers());return null;}
  if(role&&auth.user.role!==role){json(res,403,{error:'You do not have permission for this action.'},headers());return null;}
  return auth;
}
function notify(db,userId,type,title,message,meta={}){db.notifications.push({id:crypto.randomUUID(),userId,type,title,message,meta,read:false,createdAt:new Date().toISOString()})}
function currentSeason(){const m=new Date().getMonth()+1;return m>=6&&m<=10?'kharif':'rabi'}

async function weather(url){
  const db=load();const district=clean(url.searchParams.get('district')||'Sehore',80);
  const rawLat=url.searchParams.get('latitude'),rawLon=url.searchParams.get('longitude');
  const hasCoordinates=rawLat!==null&&rawLon!==null&&rawLat.trim()!==''&&rawLon.trim()!==''&&Number.isFinite(Number(rawLat))&&Number.isFinite(Number(rawLon))&&Math.abs(Number(rawLat))<=90&&Math.abs(Number(rawLon))<=180;
  
  const locLocations = Object.assign({
    Sehore:{lat:23.2032,lon:77.0844},
    Bhopal:{lat:23.2599,lon:77.4126},
    Ashta:{lat:23.0181,lon:76.7197},
    Ichhawar:{lat:23.0232,lon:77.0167},
    Budhni:{lat:22.7758,lon:77.6833},
    Indore:{lat:22.7196,lon:75.8577},
    Dewas:{lat:22.9676,lon:76.0534},
    Ujjain:{lat:23.1765,lon:75.7885},
    Hoshangabad:{lat:22.7519,lon:77.7289},
    Vidisha:{lat:23.5251,lon:77.8081},
    Raisen:{lat:23.3303,lon:77.7816},
    Rajgarh:{lat:24.0064,lon:76.7262},
    Harda:{lat:22.3444,lon:77.0934},
    Jabalpur:{lat:23.1815,lon:79.9864},
    Gwalior:{lat:26.2183,lon:78.1828}
  }, db.weatherLocations || {});

  const matchedKey = Object.keys(locLocations).find(k => k.toLowerCase() === district.toLowerCase()) || 'Sehore';
  const loc = hasCoordinates ? {lat:Number(rawLat),lon:Number(rawLon)} : locLocations[matchedKey];
  
  let resolvedDistrict = hasCoordinates ? null : matchedKey;
  if (hasCoordinates) {
    let closest = null, minD = Infinity;
    for (const [dName, dLoc] of Object.entries(locLocations)) {
      const dist = Math.hypot(dLoc.lat - Number(rawLat), dLoc.lon - Number(rawLon));
      if (dist < minD) { minD = dist; closest = dName; }
    }
    if (closest && minD < 0.6) resolvedDistrict = closest;
  }

  const api=`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=7`;
  try{
    const r=await fetch(api,{signal:AbortSignal.timeout(8000)});
    if(!r.ok)throw Error();
    const d=await r.json();
    return {source:'Open-Meteo',district:resolvedDistrict||matchedKey,latitude:loc.lat,longitude:loc.lon,updatedAt:new Date().toISOString(),current:d.current,daily:d.daily};
  }catch{
    return {
      source:'Agrismart Demo Weather',
      district:resolvedDistrict||matchedKey,
      latitude:loc.lat,
      longitude:loc.lon,
      updatedAt:new Date().toISOString(),
      current:{temperature_2m:29.4,relative_humidity_2m:52,precipitation:0,wind_speed_10m:11.5},
      daily:{
        time:Array.from({length:7},(_,i)=>new Date(Date.now()+i*86400000).toISOString().slice(0,10)),
        temperature_2m_max:[31,32,30,29,31,32,30],
        temperature_2m_min:[20,21,19,18,19,20,19],
        precipitation_sum:[0,0,1.2,0,0,0,0],
        precipitation_probability_max:[10,15,30,10,5,10,10]
      }
    };
  }
}

async function askGemini(query, lang = 'hi') {
  if (!GEMINI_API_KEY) return null;
  const sys = lang === 'hi'
    ? 'आप एग्रीस्मार्ट (AgriSmart) के डिजिटल कृषि विशेषज्ञ "किसान सहायक" हैं। किसानों को फसलों, मंडी भाव, मौसम, खाद की मात्रा, फसल सुरक्षा व सरकारी योजनाओं पर संक्षिप्त, सरल व व्यावहारिक सलाह हिंदी में दें। 2-3 वाक्यों में उत्तर दें।'
    : 'You are AgriSmart digital agriculture expert "Kisan Sahayak". Give farmers concise, practical, and helpful agricultural advice regarding crops, mandi prices, weather, fertilizer dosage, pest control, and govt schemes in 2-3 sentences.';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: sys }] },
        contents: [{ role: 'user', parts: [{ text: query }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 250 }
      }),
      signal: AbortSignal.timeout(6000)
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

// Native Email Delivery with Resend API support and Console Fallback
async function sendEmailOtp({ to, otp, purpose = 'login' }) {
  const isLogin = purpose === 'login';
  const subject = isLogin
    ? `🔐 AgriSmart Login Verification Code: ${otp}`
    : `🌱 AgriSmart Account Registration OTP: ${otp}`;
  const text = `Hello,\n\nYour AgriSmart verification code is: ${otp}\nThis code is valid for 10 minutes.\n\nBest regards,\nAgriSmart Platform Team`;

  // 1. Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'AgriSmart <onboarding@resend.dev>',
          to: [to],
          subject,
          text
        }),
        signal: AbortSignal.timeout(5000)
      });
      const data = await res.json();
      console.log(`📧 [Resend] Dispatched to ${to}:`, data?.id || data);
      return { delivered: true, provider: 'resend' };
    } catch (e) {
      console.error(`[Resend Error]:`, e.message);
    }
  }

  // Fallback / Development Console
  console.log(`\n============================================================`);
  console.log(`📧 [AgriSmart Email Service] DISPATCH TO: ${to}`);
  console.log(`📌 SUBJECT: ${subject}`);
  console.log(`🔑 OTP CODE: ${otp} (Valid for 10 minutes)`);
  console.log(`============================================================\n`);

  return { delivered: true, simulated: true, otp };
}

// Native SMS Delivery with Fast2SMS, Twilio, Webhook and Simulated Fallback
async function sendSmsOtp({ phone, otp, purpose = 'login' }) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);
  const msg = `AgriSmart verification code: ${otp}. Valid for 10 minutes. Do not share.`;

  // 1. Fast2SMS (India Bulk SMS Gateway)
  if (process.env.FAST2SMS_API_KEY && cleanPhone.length === 10) {
    try {
      const res = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(process.env.FAST2SMS_API_KEY)}&route=otp&variables_values=${otp}&numbers=${cleanPhone}`, {
        headers: { 'cache-control': 'no-cache' },
        signal: AbortSignal.timeout(5000)
      });
      const data = await res.json();
      console.log(`📱 [Fast2SMS] Dispatched to ${cleanPhone}:`, data?.message || data);
      return { delivered: true, provider: 'fast2sms', phone: cleanPhone };
    } catch (e) {
      console.error(`[Fast2SMS Error]:`, e.message);
    }
  }

  // 2. Twilio (Global SMS Gateway)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && cleanPhone) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`);
      params.append('From', process.env.TWILIO_PHONE_NUMBER);
      params.append('Body', msg);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString(),
        signal: AbortSignal.timeout(5000)
      });
      const data = await res.json();
      console.log(`📱 [Twilio] Dispatched to ${cleanPhone}:`, data?.sid || data?.message);
      return { delivered: true, provider: 'twilio', phone: cleanPhone };
    } catch (e) {
      console.error(`[Twilio Error]:`, e.message);
    }
  }

  // 3. Custom Webhook
  if (process.env.SMS_WEBHOOK_URL && cleanPhone) {
    try {
      await fetch(process.env.SMS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp, message: msg }),
        signal: AbortSignal.timeout(5000)
      });
      return { delivered: true, provider: 'webhook', phone: cleanPhone };
    } catch (e) {
      console.error(`[SMS Webhook Error]:`, e.message);
    }
  }

  // Fallback / Development Console
  console.log(`\n============================================================`);
  console.log(`📱 [AgriSmart SMS Gateway] (Simulated / Local Console)`);
  console.log(`📲 PHONE: +91 ${cleanPhone}`);
  console.log(`🔑 OTP CODE: ${otp} (Valid for 10 minutes)`);
  console.log(`============================================================\n`);

  return { delivered: true, simulated: true, otp, phone: cleanPhone };
}

ensureDb();
// Clean expired sessions and OTPs every hour
setInterval(async () => {
  try {
    const db = load();
    const beforeS = db.sessions.length;
    const beforeO = (db.otps || []).length;
    db.sessions = db.sessions.filter(s => new Date(s.expiresAt) > new Date());
    db.otps = (db.otps || []).filter(o => new Date(o.expiresAt) > new Date());
    if (db.sessions.length < beforeS || db.otps.length < beforeO) await save(db);
  } catch {}
}, 60 * 60 * 1000);
const server=http.createServer(async(req,res)=>{
  const common=headers(req);
  try{
    if(!rateLimit(req,res))return;
    const u=new URL(req.url,`http://${req.headers.host||'localhost'}`); const db=load();
    if(req.method==='OPTIONS'){res.writeHead(204,common);return res.end();}
    if(req.method==='GET'&&u.pathname==='/api/health')return json(res,200,{ok:true,service:'agrismart-backend',time:new Date().toISOString()},common);

    if(req.method==='POST'&&u.pathname==='/api/auth/send-otp'){
      const b=await parseBody(req),mail=clean(b.email,120).toLowerCase(),purpose=clean(b.purpose||'login',20);
      if(!mail||!email(mail))return json(res,400,{error:'Please provide a valid email address.'},common);

      const existingUser=db.users.find(u=>u.email===mail);
      if(purpose==='login'&&!existingUser){
        return json(res,404,{error:'No account found with this email. Please create an account first.',code:'USER_NOT_FOUND'},common);
      }
      if(purpose==='register'&&existingUser){
        return json(res,409,{error:'An account with this email already exists. Please log in instead.',code:'USER_EXISTS'},common);
      }

      // Rate limit: 30 seconds cooldown per email
      const now=Date.now();
      db.otps||=[];
      const recent=db.otps.find(o=>o.email===mail&&(now-new Date(o.createdAt).getTime())<30000);
      if(recent){
        return json(res,429,{error:'Please wait 30 seconds before requesting another OTP.'},common);
      }

      const otpCode=crypto.randomInt(100000,999999).toString();
      const expiresAt=new Date(now+10*60*1000).toISOString();

      db.otps=db.otps.filter(o=>!(o.email===mail&&o.purpose===purpose));
      db.otps.push({id:crypto.randomUUID(),email:mail,otp:otpCode,attempts:0,purpose,createdAt:new Date().toISOString(),expiresAt});
      await save(db);

      await sendEmailOtp({to:mail,otp:otpCode,purpose});
      const phoneNum = clean(b.phone || existingUser?.phone, 20);
      if (phoneNum) await sendSmsOtp({phone:phoneNum,otp:otpCode,purpose});
      const isDev = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_OTP === 'true';
      return json(res,200,{ok:true,message:phoneNum ? 'OTP dispatched to email and SMS.' : 'OTP sent to your email address.',email:mail,phone:phoneNum||undefined,purpose,expiresInSeconds:600,...(isDev?{devOtp:otpCode}:{})},common);
    }

    if(req.method==='POST'&&u.pathname==='/api/auth/login-otp'){
      const b=await parseBody(req),mail=clean(b.email,120).toLowerCase(),otpInput=clean(b.otp,10).trim();
      if(!mail||!email(mail)||!otpInput)return json(res,400,{error:'Email and 6-digit OTP code are required.'},common);

      const user=db.users.find(u=>u.email===mail);
      if(!user)return json(res,404,{error:'No account found with this email. Please register first.'},common);

      db.otps||=[];
      const now=new Date();
      const otpRecord=db.otps.find(o=>o.email===mail&&new Date(o.expiresAt)>now);
      if(!otpRecord){
        return json(res,401,{error:'No active OTP code found or code has expired. Please request a new one.'},common);
      }

      otpRecord.attempts=(otpRecord.attempts||0)+1;
      if(otpRecord.attempts>5){
        db.otps=db.otps.filter(o=>o.id!==otpRecord.id);
        await save(db);
        return json(res,429,{error:'Too many incorrect attempts. For security, this OTP code has been invalidated. Please request a new code.'},common);
      }

      const inputBuf=Buffer.from(otpInput.padEnd(6).slice(0,6));
      const codeBuf=Buffer.from(otpRecord.otp.padEnd(6).slice(0,6));
      const match=otpInput.length===6&&crypto.timingSafeEqual(inputBuf,codeBuf);

      if(!match){
        await save(db);
        return json(res,401,{error:`Invalid verification code. ${6-otpRecord.attempts} attempts remaining.`},common);
      }

      // Consume OTP (single-use protection)
      db.otps=db.otps.filter(o=>o.id!==otpRecord.id);

      const t=token();
      db.sessions=db.sessions.filter(s=>new Date(s.expiresAt)>now);
      db.sessions.push({token:t,userId:user.id,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+TOKEN_TTL).toISOString()});
      await save(db);

      const farmer=db.farmers.find(f=>f.ownerUserId===user.id)||null;
      return json(res,200,{token:t,user:{id:user.id,name:user.name,email:user.email,role:user.role},farmer},common);
    }

    if(req.method==='POST'&&u.pathname==='/api/auth/verify-otp'){
      const b=await parseBody(req),mail=clean(b.email,120).toLowerCase(),otpInput=clean(b.otp,10).trim(),purpose=clean(b.purpose||'',20);
      if(!mail||!email(mail)||!otpInput)return json(res,400,{error:'Email and 6-digit OTP code are required.'},common);

      db.otps||=[];
      const now=new Date();
      const otpRecord=db.otps.find(o=>o.email===mail&&(!purpose||o.purpose===purpose)&&new Date(o.expiresAt)>now);
      if(!otpRecord)return json(res,401,{error:'Invalid or expired OTP code.'},common);

      otpRecord.attempts=(otpRecord.attempts||0)+1;
      if(otpRecord.attempts>5){
        db.otps=db.otps.filter(o=>o.id!==otpRecord.id);
        await save(db);
        return json(res,429,{error:'Too many incorrect attempts. Code invalidated.'},common);
      }

      const inputBuf=Buffer.from(otpInput.padEnd(6).slice(0,6));
      const codeBuf=Buffer.from(otpRecord.otp.padEnd(6).slice(0,6));
      const match=otpInput.length===6&&crypto.timingSafeEqual(inputBuf,codeBuf);

      if(!match){
        await save(db);
        return json(res,401,{error:'Invalid OTP code.'},common);
      }

      db.otps=db.otps.filter(o=>o.id!==otpRecord.id);
      await save(db);
      return json(res,200,{ok:true,verified:true,email:mail},common);
    }

    if(req.method==='POST'&&u.pathname==='/api/auth/register'){
      const b=await parseBody(req),name=clean(b.name,80),mail=clean(b.email,120).toLowerCase(),password=b.password,role=b.role;
      if(!name||!email(mail)||!passwordOk(password)||!['farmer','buyer'].includes(role))return json(res,400,{error:'Name, valid email, password (8+ characters), and role are required.'},common);
      if(db.users.some(u=>u.email===mail))return json(res,409,{error:'An account with this email already exists.'},common);
      const hp=await hashPassword(password);const user={id:crypto.randomUUID(),name,email:mail,role,passwordSalt:hp.salt,passwordHash:hp.hash,createdAt:new Date().toISOString()};
      db.users.push(user);let farmer=null;
      if(role==='farmer'){const district=clean(b.district||'Sehore',80);farmer={id:crypto.randomUUID(),ownerUserId:user.id,name,district,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};db.farmers.push(farmer);}
      const t=token();db.sessions.push({token:t,userId:user.id,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+TOKEN_TTL).toISOString()});await save(db);
      return json(res,201,{token:t,user:{id:user.id,name:user.name,email:user.email,role:user.role},farmer},common);
    }
    if(req.method==='POST'&&u.pathname==='/api/auth/login'){
      const b=await parseBody(req),mail=clean(b.email,120).toLowerCase(),password=b.password;const user=db.users.find(u=>u.email===mail);
      if(!user||!(await verifyPassword(password,user)))return json(res,401,{error:'Invalid email or password.'},common);
      const t=token();db.sessions=db.sessions.filter(s=>new Date(s.expiresAt)>new Date());db.sessions.push({token:t,userId:user.id,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+TOKEN_TTL).toISOString()});await save(db);
      const farmer=db.farmers.find(f=>f.ownerUserId===user.id)||null;return json(res,200,{token:t,user:{id:user.id,name:user.name,email:user.email,role:user.role},farmer},common);
    }
    if(req.method==='POST'&&u.pathname==='/api/auth/logout'){
      const auth=getAuth(req,db);if(auth){db.sessions=db.sessions.filter(s=>s.token!==auth.session.token);await save(db);}return json(res,200,{ok:true},common);
    }
    if(req.method==='GET'&&u.pathname==='/api/auth/me'){
      const auth=requireAuth(req,res,db);if(!auth)return;const farmer=db.farmers.find(f=>f.ownerUserId===auth.user.id)||null;return json(res,200,{user:{id:auth.user.id,name:auth.user.name,email:auth.user.email,role:auth.user.role},farmer},common);
    }
    if(req.method==='POST'&&u.pathname==='/api/auth/switch-role'){
      const auth=requireAuth(req,res,db);if(!auth)return;
      const b=await parseBody(req),targetRole=clean(b.role||'',20);
      if(!['farmer','buyer'].includes(targetRole))return json(res,400,{error:'Role must be either farmer or buyer.'},common);
      const user=db.users.find(u=>u.id===auth.user.id);
      if(!user)return json(res,404,{error:'User not found.'},common);
      user.role=targetRole;
      let farmer=db.farmers.find(f=>f.ownerUserId===user.id)||null;
      if(targetRole==='farmer'&&!farmer){
        farmer={id:crypto.randomUUID(),ownerUserId:user.id,name:user.name,district:clean(b.district||user.district||'Sehore',80),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
        db.farmers.push(farmer);
      }
      await save(db);
      return json(res,200,{ok:true,user:{id:user.id,name:user.name,email:user.email,role:user.role},farmer},common);
    }
    if(req.method==='GET'&&u.pathname==='/api/health'){
      return json(res,200,{status:'ok',app:'AgriSmart',uptime:Math.round(process.uptime()),timestamp:new Date().toISOString()},common);
    }

    if(req.method==='GET'&&u.pathname==='/api/crops')return json(res,200,{items:db.crops,season:currentSeason()},common);
    if(req.method==='GET'&&u.pathname==='/api/mandis')return json(res,200,{updatedAt:new Date().toISOString(),source:'Agrismart local demo dataset',live:false,items:db.mandis},common);
    if(req.method==='GET'&&u.pathname==='/api/mandis/history'){
      const crop=clean(u.searchParams.get('crop')||'wheat',40);
      const days=30,history=[],now=Date.now();
      const mandis=db.mandis.filter(m=>m.p[crop]!=null);
      for(let i=days-1;i>=0;i--){
        const date=new Date(now-i*86400000).toISOString().slice(0,10);
        const entry={date};
        for(const m of mandis){
          const base=m.p[crop]||2400;
          const delta=Math.round(Math.sin((30-i)/3)*60+Math.cos(i/2)*30-(i*1.2));
          entry[m.n]=Math.max(1000,base+delta);
        }
        history.push(entry);
      }
      return json(res,200,{crop,history,mandis:mandis.map(m=>m.n),source:'simulated-demo',live:false},common);
    }
    if(req.method==='GET'&&u.pathname==='/api/cold-storage')return json(res,200,{items:db.coldStorages||[]},common);
    if(req.method==='GET'&&u.pathname==='/api/transporters')return json(res,200,{items:db.transporters||[]},common);
    if(req.method==='POST'&&u.pathname==='/api/advisory/fertilizer'){
      const b=await parseBody(req),crop=clean(b.crop||'',40),acres=Number(b.acres),soilN=clean(b.soilN||'medium',10),soilP=clean(b.soilP||'medium',10),soilK=clean(b.soilK||'medium',10);
      const recs={wheat:{n:48,p:24,k:16},soybean:{n:12,p:32,k:16},maize:{n:48,p:24,k:20},chana:{n:10,p:24,k:12},mustard:{n:32,p:16,k:16},lentil:{n:10,p:20,k:10}};
      if(!Object.hasOwn(recs,crop)||!Number.isFinite(acres)||acres<0.1||acres>100||![soilN,soilP,soilK].every(v=>['low','medium','high'].includes(v)))return json(res,400,{error:'Enter a supported crop, an area from 0.1 to 100 acres, and valid soil ratings.'},common);
      const base=recs[crop]||recs.wheat,fac=r=>r==='low'?1.25:(r==='high'?0.75:1.0);
      const targetN=base.n*fac(soilN)*acres,targetP=base.p*fac(soilP)*acres,targetK=base.k*fac(soilK)*acres;
      const dapBags=Math.max(0,targetP/23),nFromDap=dapBags*9,remN=Math.max(0,targetN-nFromDap),ureaBags=Math.max(0,remN/20.7),mopBags=Math.max(0,targetK/30);
      const estCost=Math.round((ureaBags*266)+(dapBags*1350)+(mopBags*1650));
      const ureaThird=Number((ureaBags/3).toFixed(1));
      return json(res,200,{crop,acres,ureaBags:Number(ureaBags.toFixed(1)),dapBags:Number(dapBags.toFixed(1)),mopBags:Number(mopBags.toFixed(1)),estCostRs:estCost,schedule:{basal:{urea:ureaThird,dap:Number(dapBags.toFixed(1)),mop:Number(mopBags.toFixed(1))},firstTopDress:{urea:ureaThird},secondTopDress:{urea:ureaThird}}},common);
    }
    if(req.method==='POST'&&u.pathname==='/api/advisory/disease-scan'){
      const b=await parseBody(req),crop=clean(b.crop||'',40).toLowerCase(),symptoms=clean(b.symptoms||'',300).toLowerCase();
      if(!db.crops[crop])return json(res,400,{error:'Choose a supported crop.'},common);
      const list=(db.diseases||[]).filter(d=>d.crop===crop);
      let bestMatch=null,bestScore=0;
      for(const d of list){let s=0;for(const sym of d.symptoms)if(symptoms.includes(sym.toLowerCase()))s+=2;if(s>bestScore){bestScore=s;bestMatch=d;}}
      if(!symptoms)return json(res,400,{error:'Enter plant symptoms to continue.'},common);
      return json(res,200,{matched:Boolean(bestMatch),confidence:bestMatch?Math.min(96,65+bestScore*10):0,diagnosis:bestMatch},common);
    }
    if(req.method==='POST'&&u.pathname==='/api/advisory/assistant'){
      const b=await parseBody(req),rawQuery=clean(b.query||'',300),lang=clean(b.lang||'hi',5);
      const query=rawQuery.toLowerCase();
      
      // Try Gemini AI first when a server-side key is configured.
      let reply = await askGemini(rawQuery, lang);
      const aiPowered = Boolean(reply);
      
      // Fallback to local expert rules if Gemini is unavailable or not enabled yet
      if (!reply) {
        if(query.includes('भाव')||query.includes('mandi')||query.includes('rate')||query.includes('price'))
          reply=lang==='hi'?'यह डेमो लाइव मंडी भाव उपलब्ध नहीं कराता। यहां दिखाए गए भाव नमूना अनुमान हैं; आज के भाव के लिए स्थानीय मंडी या आधिकारिक स्रोत देखें।':'This demo does not provide live mandi prices. Displayed rates are sample estimates; check your local mandi or an official source for current prices.';
        else if(query.includes('यूरिया')||query.includes('खाद')||query.includes('dap')||query.includes('urea')||query.includes('fertilizer'))
          reply=lang==='hi'?'खाद की सही मात्रा फसल, मिट्टी की जांच और स्थानीय सलाह पर निर्भर करती है। इस साइट का कैलकुलेटर केवल डेमो अनुमान देता है; मात्रा तय करने से पहले कृषि विशेषज्ञ से पुष्टि करें।':'Fertilizer rates depend on crop, soil-test results, and local guidance. This site calculator is only a demo estimate; confirm the dose with an agricultural expert before applying it.';
        else if(query.includes('मौसम')||query.includes('weather')||query.includes('बारिश')||query.includes('rain'))
          reply=lang==='hi'?'इस डेमो उत्तर में लाइव मौसम शामिल नहीं है। मौसम कार्ड चुने हुए स्थान का स्रोत दिखाते हैं; डेमो चिह्नित होने पर उस अनुमान पर निर्भर न करें।':'This demo answer does not contain live weather. Check the weather cards for the selected location and their source label; do not rely on values marked as demo.';
        else if(query.includes('रोग')||query.includes('कीट')||query.includes('pest')||query.includes('disease')||query.includes('इल्ली'))
          reply=lang==='hi'?'लक्षणों के कई कारण हो सकते हैं। इस साइट का छोटा संदर्भ केवल शुरुआती जानकारी है; दवा लगाने से पहले रोग की पुष्टि स्थानीय कृषि विशेषज्ञ से करें।':'Symptoms can have several causes. This site’s small reference is for initial information only; confirm the diagnosis with a local agricultural expert before applying treatment.';
        else if(query.includes('योजना')||query.includes('scheme')||query.includes('kisan')||query.includes('बीमा'))
          reply=lang==='hi'?'योजना की पात्रता और नियम बदल सकते हैं। आवेदन या भुगतान से पहले संबंधित सरकारी पोर्टल या कृषि विभाग से वर्तमान जानकारी जांचें।':'Scheme eligibility and rules can change. Check the relevant official government portal or agriculture office for current information before applying.';
        else
          reply=lang==='hi'?'नमस्ते किसान साथी! आप मंडी भाव, खाद की मात्रा (यूरिया/डीएपी), मौसम, फसल रोग उपचार या सरकारी योजनाओं पर कोई भी सवाल पूछ सकते हैं।':'Hello Farmer Partner! Ask me anything about Mandi prices, fertilizer dosage, weather forecasts, crop disease remedies, or govt schemes.';
      }
      return json(res,200,{reply,lang,aiPowered},common);
    }
    if(req.method==='GET'&&u.pathname==='/api/mandis/prices'){
      const crop=clean(u.searchParams.get('crop')||'wheat',40),rate=Math.max(0,Number(u.searchParams.get('rate')||0.8));
      if(!db.crops[crop])return json(res,400,{error:'Unknown crop.'},common);
      const items=db.mandis.filter(m=>m.p[crop]!=null).map(m=>({...m,price:m.p[crop],transport:m.km*rate,net:m.p[crop]-m.km*rate-m.fee})).sort((a,b)=>b.net-a.net);
      return json(res,200,{source:'Agrismart local demo dataset',live:false,updatedAt:new Date().toISOString(),crop,items},common);
    }
    if(req.method==='GET'&&u.pathname==='/api/weather')return json(res,200,await weather(u),common);
    if(req.method==='GET'&&u.pathname==='/api/config')return json(res,200,{app:'Agrismart',district:'Sehore',season:currentSeason(),dataMode:'local-demo-api',auth:true,orders:true},common);
    if(req.method==='GET'&&u.pathname==='/api/locations'){
      const districts=new Set([...(Object.keys(db.weatherLocations||{})),...(db.mandis||[]).map(m=>m.district).filter(Boolean)]);
      const items=[...districts].map(district=>({district,latitude:db.weatherLocations?.[district]?.lat??null,longitude:db.weatherLocations?.[district]?.lon??null,mandis:(db.mandis||[]).filter(m=>m.district===district).map(m=>m.n)})).sort((a,b)=>a.district.localeCompare(b.district));
      const q=clean(u.searchParams.get('query')||'',80).toLowerCase();return json(res,200,{source:'Agrismart local dataset',items:q?items.filter(x=>x.district.toLowerCase().includes(q)||x.mandis.some(m=>m.toLowerCase().includes(q))):items},common);
    }

    if(req.method==='GET'&&u.pathname==='/api/farmers')return json(res,200,{items:db.farmers.map(f=>({id:f.id,name:f.name,district:f.district,createdAt:f.createdAt}))},common);
    if(req.method==='GET'&&u.pathname==='/api/farmers/mine'){
      const auth=requireAuth(req,res,db,'farmer');if(!auth)return;return json(res,200,{items:db.farmers.filter(f=>f.ownerUserId===auth.user.id)},common);
    }
    if((req.method==='POST'||req.method==='PUT')&&u.pathname==='/api/farmers'){
      const auth=requireAuth(req,res,db,'farmer');if(!auth)return;const b=await parseBody(req),name=clean(b.name,80),district=clean(b.district,80);
      if(!name||!district)return json(res,400,{error:'Farmer name and district are required.'},common);
      const now=new Date().toISOString();
      let farmer=db.farmers.find(f=>f.ownerUserId===auth.user.id);
      if(farmer){
        farmer.name=name;farmer.district=district;farmer.updatedAt=now;
        await save(db);
        return json(res,200,{id:farmer.id,name:farmer.name,district:farmer.district,createdAt:farmer.createdAt,updatedAt:farmer.updatedAt},common);
      }
      farmer={id:crypto.randomUUID(),ownerUserId:auth.user.id,name,district,createdAt:now,updatedAt:now};
      db.farmers.push(farmer);
      await save(db);
      return json(res,201,{id:farmer.id,name:farmer.name,district:farmer.district,createdAt:farmer.createdAt},common);
    }

    if(req.method==='GET'&&u.pathname==='/api/reports'){
      const auth=requireAuth(req,res,db);if(!auth)return;
      const items=[...db.reports.filter(r=>r.userId===auth.user.id)].reverse();
      return json(res,200,{items},common);
    }
    if(req.method==='POST'&&u.pathname==='/api/reports'){
      const auth=requireAuth(req,res,db);if(!auth)return;const b=await parseBody(req),crop=clean(b.crop,40),area=Number(b.area),production=Number(b.production),expenses=Number(b.expenses),price=Number(b.price);
      if(!db.crops[crop]||![area,production,expenses,price].every(Number.isFinite)||area<=0||production<0||expenses<0||price<0)return json(res,400,{error:'Enter valid crop, area, production, expenses, and price.'},common);
      const revenue=production*price;
      const profit=revenue-expenses;
      const report={id:crypto.randomUUID(),userId:auth.user.id,crop,cropName:db.crops[crop]?.n||crop,area,production,expenses,price,revenue,profit,createdAt:new Date().toISOString()};
      db.reports.push(report);
      await save(db);
      return json(res,201,report,common);
    }
    if(req.method==='DELETE'&&u.pathname.startsWith('/api/reports/')){
      const auth=requireAuth(req,res,db);if(!auth)return;
      const id=decodeURIComponent(u.pathname.slice('/api/reports/'.length));
      const idx=db.reports.findIndex(r=>r.id===id&&r.userId===auth.user.id);
      if(idx===-1)return json(res,404,{error:'Report not found or unauthorized.'},common);
      db.reports.splice(idx,1);
      await save(db);
      return json(res,200,{ok:true,deletedId:id},common);
    }

    if(req.method==='GET'&&u.pathname==='/api/listings'){
      const crop=clean(u.searchParams.get('crop')||'',40).toLowerCase();
      const district=clean(u.searchParams.get('district')||'',80).toLowerCase();
      let items=(db.cropListings||[]);
      if(crop) items=items.filter(x=>x.crop.toLowerCase()===crop);
      if(district) items=items.filter(x=>x.district.toLowerCase()===district);
      return json(res,200,{items},common);
    }
    if(req.method==='POST'&&u.pathname==='/api/listings'){
      const auth=requireAuth(req,res,db,'farmer');if(!auth)return;
      const b=await parseBody(req);
      const crop=clean(b.crop||'',40);
      const variety=clean(b.variety||'',60);
      const quantity=Number(b.quantity);
      const expectedPrice=Number(b.expectedPrice);
      const harvestDate=clean(b.harvestDate||'',30);
      const notes=clean(b.notes||'',200);
      if(!db.crops[crop]||!Number.isFinite(quantity)||quantity<=0||quantity>100000||!Number.isFinite(expectedPrice)||expectedPrice<=0||expectedPrice>1000000)
        return json(res,400,{error:'Valid crop, quantity, and expected price required.'},common);
      const farmer=db.farmers.find(f=>f.ownerUserId===auth.user.id);
      const listing={
        id:crypto.randomUUID(),
        farmerId:farmer?farmer.id:null,
        farmerUserId:auth.user.id,
        farmerName:farmer?farmer.name:auth.user.name,
        district:farmer?farmer.district:(clean(b.district||'Sehore',80)),
        crop,
        cropName:db.crops[crop]?.n||crop,
        variety:variety||'Standard',
        quantity,
        expectedPrice,
        harvestDate:harvestDate||new Date().toISOString().slice(0,10),
        notes,
        status:'available',
        createdAt:new Date().toISOString()
      };
      db.cropListings||=[];
      db.cropListings.unshift(listing);
      await save(db);
      return json(res,201,listing,common);
    }
    if(req.method==='DELETE'&&u.pathname.startsWith('/api/listings/')){
      const auth=requireAuth(req,res,db,'farmer');if(!auth)return;
      const id=decodeURIComponent(u.pathname.slice('/api/listings/'.length));
      const idx=(db.cropListings||[]).findIndex(x=>x.id===id);
      if(idx===-1)return json(res,404,{error:'Listing not found.'},common);
      const listing=db.cropListings[idx];
      if(listing.farmerUserId!==auth.user.id)return json(res,403,{error:'Unauthorized.'},common);
      db.cropListings.splice(idx,1);
      await save(db);
      return json(res,200,{ok:true,deleted:id},common);
    }

    if(req.method==='GET'&&u.pathname==='/api/offers'){
      const auth=requireAuth(req,res,db);if(!auth)return;let items=db.offers;
      if(auth.user.role==='farmer'){const ids=new Set(db.farmers.filter(f=>f.ownerUserId===auth.user.id).map(f=>f.id));items=items.filter(o=>ids.has(o.farmerId));}
      else items=items.filter(o=>o.buyerUserId===auth.user.id);
      return json(res,200,{items},common);
    }
    if(req.method==='POST'&&u.pathname==='/api/offers'){
      const auth=requireAuth(req,res,db,'buyer');if(!auth)return;const b=await parseBody(req);const quantity=Number(b.quantity),price=Number(b.price),bonus=Number(b.earlyBonusPerQuintal||0),delivery=b.deliveryBy?new Date(`${b.deliveryBy}T23:59:59`):null;
      if(!db.crops[b.crop]||!Number.isFinite(quantity)||quantity<=0||quantity>100000||!Number.isFinite(price)||price<=0||price>1000000||!Number.isFinite(bonus)||bonus<0||bonus>100000)return json(res,400,{error:'Choose a valid crop and enter safe quantity, price, and bonus values.'},common);
      const farmer=db.farmers.find(f=>f.id===b.farmerId);if(!farmer)return json(res,400,{error:'Choose a registered farmer.'},common);
      if(bonus>0&&(!delivery||Number.isNaN(delivery.getTime())||delivery<new Date()))return json(res,400,{error:'Choose a delivery deadline today or later when using an early-sale bonus.'},common);
      const offer={id:crypto.randomUUID(),farmerId:farmer.id,farmerName:farmer.name,buyerUserId:auth.user.id,buyerName:auth.user.name,crop:b.crop,cropName:db.crops[b.crop].n,quantity,price,earlyBonusPerQuintal:bonus,totalPricePerQuintal:price+bonus,deliveryBy:b.deliveryBy||null,status:'pending',createdAt:new Date().toISOString()};
      db.offers.push(offer);const farmerUser=farmer.ownerUserId; if(farmerUser)notify(db,farmerUser,'offer','New crop offer',`${auth.user.name} sent you an offer for ${offer.cropName}.`,{offerId:offer.id});await save(db);return json(res,201,offer,common);
    }
    if(req.method==='PUT'&&u.pathname.startsWith('/api/offers/')){
      const auth=requireAuth(req,res,db,'farmer');if(!auth)return;const id=decodeURIComponent(u.pathname.slice('/api/offers/'.length));const b=await parseBody(req),offer=db.offers.find(o=>o.id===id);if(!offer)return json(res,404,{error:'Offer not found.'},common);
      const owns=db.farmers.some(f=>f.id===offer.farmerId&&f.ownerUserId===auth.user.id);if(!owns)return json(res,403,{error:'You are not authorized to update this offer.'},common);
      if(!['accepted','rejected'].includes(b.status))return json(res,400,{error:'Offer status must be accepted or rejected.'},common);if(offer.status!=='pending')return json(res,409,{error:'This offer has already been answered.'},common);
      offer.status=b.status;offer.respondedAt=new Date().toISOString();
      if(b.status==='accepted'){
        const order={id:crypto.randomUUID(),offerId:offer.id,buyerUserId:offer.buyerUserId,farmerId:offer.farmerId,crop:offer.crop,cropName:offer.cropName,quantity:offer.quantity,pricePerQuintal:offer.totalPricePerQuintal,totalAmount:offer.quantity*offer.totalPricePerQuintal,status:'confirmed',paymentStatus:'pending',deliveryStatus:'pending',createdAt:new Date().toISOString()};db.orders.push(order);notify(db,offer.buyerUserId,'order','Offer accepted',`${offer.farmerName} accepted your ${offer.cropName} offer. Order ${order.id.slice(0,8)} is confirmed.`,{orderId:order.id});
      } else notify(db,offer.buyerUserId,'offer','Offer rejected',`${offer.farmerName} rejected your ${offer.cropName} offer.`,{offerId:offer.id});
      await save(db);return json(res,200,offer,common);
    }
    if(req.method==='POST'&&u.pathname.includes('/counter')&&!u.pathname.includes('/accept-counter')&&!u.pathname.includes('/reject-counter')){
      const auth=requireAuth(req,res,db,'farmer');if(!auth)return;
      const id=decodeURIComponent(u.pathname.replace('/api/offers/','').replace('/counter',''));
      const b=await parseBody(req),offer=db.offers.find(o=>o.id===id);if(!offer)return json(res,404,{error:'Offer not found.'},common);
      const owns=db.farmers.some(f=>f.id===offer.farmerId&&f.ownerUserId===auth.user.id);if(!owns)return json(res,403,{error:'Unauthorized.'},common);
      if(offer.status!=='pending')return json(res,409,{error:'Only pending offers can be countered.'},common);
      const cp=Number(b.counterPrice);if(!Number.isFinite(cp)||cp<=0)return json(res,400,{error:'Invalid counter price.'},common);
      offer.counterPrice=cp;offer.status='countered';offer.counteredAt=new Date().toISOString();
      notify(db,offer.buyerUserId,'offer','Counter-Offer Received',`${offer.farmerName} countered with ₹${cp}/q for ${offer.cropName}.`,{offerId:offer.id});
      await save(db);return json(res,200,offer,common);
    }
    if(req.method==='POST'&&u.pathname.includes('/accept-counter')){
      const auth=requireAuth(req,res,db,'buyer');if(!auth)return;
      const id=decodeURIComponent(u.pathname.replace('/api/offers/','').replace('/accept-counter',''));
      const offer=db.offers.find(o=>o.id===id);if(!offer)return json(res,404,{error:'Offer not found.'},common);
      if(offer.buyerUserId!==auth.user.id)return json(res,403,{error:'Unauthorized.'},common);
      if(offer.status!=='countered'||!offer.counterPrice)return json(res,400,{error:'Offer has no counter price to accept.'},common);
      offer.status='accepted';offer.price=offer.counterPrice;offer.totalPricePerQuintal=offer.counterPrice+(offer.earlyBonusPerQuintal||0);
      const order={id:crypto.randomUUID(),offerId:offer.id,buyerUserId:offer.buyerUserId,farmerId:offer.farmerId,crop:offer.crop,cropName:offer.cropName,quantity:offer.quantity,pricePerQuintal:offer.totalPricePerQuintal,totalAmount:offer.quantity*offer.totalPricePerQuintal,status:'confirmed',paymentStatus:'pending',deliveryStatus:'pending',createdAt:new Date().toISOString()};
      db.orders.push(order);
      const farmer=db.farmers.find(f=>f.id===offer.farmerId);
      if(farmer?.ownerUserId)notify(db,farmer.ownerUserId,'order','Counter-Offer Accepted',`${auth.user.name} accepted your counter rate ₹${offer.counterPrice}/q for ${offer.cropName}.`,{orderId:order.id});
      await save(db);return json(res,200,{offer,order},common);
    }
    if(req.method==='POST'&&u.pathname.includes('/reject-counter')){
      const auth=requireAuth(req,res,db,'buyer');if(!auth)return;
      const id=decodeURIComponent(u.pathname.replace('/api/offers/','').replace('/reject-counter',''));
      const offer=db.offers.find(o=>o.id===id);if(!offer)return json(res,404,{error:'Offer not found.'},common);
      if(offer.buyerUserId!==auth.user.id)return json(res,403,{error:'Unauthorized.'},common);
      if(offer.status!=='countered')return json(res,400,{error:'Only countered offers can be declined.'},common);
      offer.status='rejected';offer.respondedAt=new Date().toISOString();
      const farmer=db.farmers.find(f=>f.id===offer.farmerId);
      if(farmer?.ownerUserId)notify(db,farmer.ownerUserId,'offer','Counter-Offer Declined',`${auth.user.name} declined your counter rate for ${offer.cropName}.`,{offerId:offer.id});
      await save(db);return json(res,200,offer,common);
    }
    if(req.method==='GET'&&/^\/api\/offers\/[^/]+\/messages$/.test(u.pathname)){
      const auth=requireAuth(req,res,db);if(!auth)return;
      const id=decodeURIComponent(u.pathname.replace('/api/offers/','').replace('/messages',''));
      const offer=db.offers.find(o=>o.id===id);if(!offer)return json(res,404,{error:'Offer not found.'},common);
      const isBuyer=offer.buyerUserId===auth.user.id;
      const isFarmer=db.farmers.some(f=>f.id===offer.farmerId&&f.ownerUserId===auth.user.id);
      if(!isBuyer&&!isFarmer)return json(res,403,{error:'You are not authorized to view this conversation.'},common);
      const msgs=(db.offerMessages||[]).filter(m=>m.offerId===id);
      return json(res,200,{items:msgs},common);
    }
    if(req.method==='POST'&&/^\/api\/offers\/[^/]+\/messages$/.test(u.pathname)){
      const auth=requireAuth(req,res,db);if(!auth)return;
      const id=decodeURIComponent(u.pathname.replace('/api/offers/','').replace('/messages',''));
      const offer=db.offers.find(o=>o.id===id);if(!offer)return json(res,404,{error:'Offer not found.'},common);
      const isBuyer=offer.buyerUserId===auth.user.id;
      const isFarmer=db.farmers.some(f=>f.id===offer.farmerId&&f.ownerUserId===auth.user.id);
      if(!isBuyer&&!isFarmer)return json(res,403,{error:'You are not authorized to message this conversation.'},common);
      const b=await parseBody(req),text=clean(b.text,500);if(!text)return json(res,400,{error:'Text required.'},common);
      const msg={id:crypto.randomUUID(),offerId:id,senderId:auth.user.id,senderName:auth.user.name,senderRole:auth.user.role,text,createdAt:new Date().toISOString()};
      db.offerMessages||=[];db.offerMessages.push(msg);await save(db);return json(res,201,msg,common);
    }

    if(req.method==='GET'&&u.pathname==='/api/orders'){
      const auth=requireAuth(req,res,db);if(!auth)return;const items=auth.user.role==='farmer'?db.orders.filter(o=>db.farmers.some(f=>f.id===o.farmerId&&f.ownerUserId===auth.user.id)):db.orders.filter(o=>o.buyerUserId===auth.user.id);return json(res,200,{items},common);
    }
    if(req.method==='PATCH'&&u.pathname.startsWith('/api/orders/')){
      const auth=requireAuth(req,res,db);if(!auth)return;const id=decodeURIComponent(u.pathname.slice('/api/orders/'.length)),b=await parseBody(req),order=db.orders.find(o=>o.id===id);if(!order)return json(res,404,{error:'Order not found.'},common);
      const allowed=auth.user.role==='buyer'?order.buyerUserId===auth.user.id:db.farmers.some(f=>f.id===order.farmerId&&f.ownerUserId===auth.user.id);if(!allowed)return json(res,403,{error:'You are not authorized to update this order.'},common);
      if(auth.user.role==='buyer'&&b.paymentStatus&&['pending','paid','failed'].includes(b.paymentStatus))order.paymentStatus=b.paymentStatus;
      if(auth.user.role==='farmer'&&b.deliveryStatus&&['pending','ready','in_transit','delivered'].includes(b.deliveryStatus))order.deliveryStatus=b.deliveryStatus;
      if(order.deliveryStatus==='delivered')order.status='completed';await save(db);return json(res,200,order,common);
    }
    if(req.method==='GET'&&u.pathname==='/api/notifications'){
      const auth=requireAuth(req,res,db);if(!auth)return;return json(res,200,{items:db.notifications.filter(n=>n.userId===auth.user.id).slice(-50).reverse()},common);
    }
    if(req.method==='PATCH'&&u.pathname==='/api/notifications/read'){
      const auth=requireAuth(req,res,db);if(!auth)return;db.notifications.filter(n=>n.userId===auth.user.id).forEach(n=>n.read=true);await save(db);return json(res,200,{ok:true},common);
    }

    // 1. Payment Gateway: Create Order (Razorpay & Sandbox)
    if(req.method==='POST'&&u.pathname==='/api/payments/create-order'){
      const auth=requireAuth(req,res,db);if(!auth)return;
      const b=await parseBody(req);
      const orderId=clean(b.orderId,64);
      const order=db.orders.find(o=>o.id===orderId);
      if(!order)return json(res,404,{error:'Order not found.'},common);
      if(order.buyerUserId!==auth.user.id)return json(res,403,{error:'You are not authorized to pay for this order.'},common);

      const amountInPaise=Math.round(Number(order.totalAmount||0)*100);
      const razorpayKey=process.env.RAZORPAY_KEY_ID;
      const razorpaySecret=process.env.RAZORPAY_KEY_SECRET;

      if(razorpayKey&&razorpaySecret){
        try{
          const authHeader=Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64');
          const rzpRes=await fetch('https://api.razorpay.com/v1/orders',{
            method:'POST',
            headers:{
              'Authorization':`Basic ${authHeader}`,
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              amount:amountInPaise,
              currency:'INR',
              receipt:`order_${order.id.slice(0,12)}`,
              notes:{crop:order.cropName,farmerId:order.farmerId,buyerId:auth.user.id}
            }),
            signal:AbortSignal.timeout(6000)
          });
          const rzpData=await rzpRes.json();
          if(!rzpRes.ok)throw new Error(rzpData?.error?.description||'Razorpay order creation failed');
          return json(res,200,{
            id:rzpData.id,
            amount:rzpData.amount,
            currency:rzpData.currency,
            keyId:razorpayKey,
            sandbox:false
          },common);
        }catch(e){
          console.error('[Razorpay Order Error]:',e.message);
          return json(res,502,{error:`Payment gateway error: ${e.message}`},common);
        }
      }

      // Sandbox / Local Simulation Mode
      const simulatedId='order_sim_'+crypto.randomBytes(8).toString('hex');
      return json(res,200,{
        id:simulatedId,
        amount:amountInPaise,
        currency:'INR',
        keyId:null,
        sandbox:true,
        message:'Sandbox active. Configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET for live payments.'
      },common);
    }

    // 2. Payment Gateway: Signature Verification & Order Escrow Settlement
    if(req.method==='POST'&&u.pathname==='/api/payments/verify'){
      const auth=requireAuth(req,res,db);if(!auth)return;
      const b=await parseBody(req);
      const orderId=clean(b.orderId,64);
      const rzpOrderId=clean(b.razorpay_order_id||b.paymentOrderId,120);
      const rzpPaymentId=clean(b.razorpay_payment_id||b.paymentId,120);
      const rzpSignature=clean(b.razorpay_signature,256);

      const order=db.orders.find(o=>o.id===orderId);
      if(!order)return json(res,404,{error:'Order not found.'},common);
      if(order.buyerUserId!==auth.user.id)return json(res,403,{error:'You are not authorized to verify this payment.'},common);

      const razorpaySecret=process.env.RAZORPAY_KEY_SECRET;
      if(razorpaySecret&&rzpSignature){
        const expected=crypto.createHmac('sha256',razorpaySecret).update(`${rzpOrderId}|${rzpPaymentId}`).digest('hex');
        if(expected!==rzpSignature){
          return json(res,400,{error:'Invalid payment signature. Verification failed.'},common);
        }
      }

      order.paymentStatus='paid';
      order.paidAt=new Date().toISOString();
      order.paymentDetails={
        provider:razorpaySecret?'razorpay':'sandbox_upi',
        paymentId:rzpPaymentId||('pay_sim_'+crypto.randomBytes(6).toString('hex')),
        orderId:rzpOrderId
      };

      const farmer=db.farmers.find(f=>f.id===order.farmerId);
      if(farmer?.ownerUserId){
        notify(db,farmer.ownerUserId,'order','Payment Received in Escrow',`Payment of ₹${order.totalAmount} for ${order.cropName} is now secured in escrow.`);
      }
      notify(db,auth.user.id,'order','Payment Confirmed',`Your payment of ₹${order.totalAmount} is held safely in escrow until delivery.`);

      await save(db);
      return json(res,200,{ok:true,order},common);
    }

    // 3. Live Government Mandi Feed (Data.gov.in / Agmarknet API)
    if(req.method==='GET'&&u.pathname==='/api/mandis/live'){
      const state=clean(u.searchParams.get('state')||'Madhya Pradesh',60);
      const commodity=clean(u.searchParams.get('commodity')||'',60);
      const govKey=process.env.DATA_GOV_IN_API_KEY||process.env.AGMARKNET_API_KEY;

      if(govKey){
        try{
          let govUrl=`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${encodeURIComponent(govKey)}&format=json&limit=50&filters%5Bstate%5D=${encodeURIComponent(state)}`;
          if(commodity)govUrl+=`&filters%5Bcommodity%5D=${encodeURIComponent(commodity)}`;
          const govRes=await fetch(govUrl,{signal:AbortSignal.timeout(6000)});
          if(govRes.ok){
            const govData=await govRes.json();
            const records=(govData.records||[]).map(r=>({
              state:r.state,
              district:r.district,
              market:r.market,
              commodity:r.commodity,
              variety:r.variety,
              minPrice:Number(r.min_price||0),
              maxPrice:Number(r.max_price||0),
              modalPrice:Number(r.modal_price||0),
              arrivalDate:r.arrival_date
            }));
            return json(res,200,{live:true,provider:'data.gov.in (Agmarknet)',records},common);
          }
        }catch(e){
          console.error('[Government Mandi API Error]:',e.message);
        }
      }

      // Fallback with live price oscillation based on seasonality
      const records=(db.mandis||[]).map(m=>{
        const name=m.n||m.name||'Mandi';
        const variance=Math.round(Math.sin(Date.now()/86400000+name.length)*40);
        const prices=m.p||{};
        return {
          name:name,
          district:m.district,
          distanceKm:m.km,
          mandiFee:m.fee,
          prices:{
            wheat:Math.round((prices.wheat||2480)+variance),
            chana:Math.round((prices.chana||5600)+variance*0.8),
            soybean:Math.round((prices.soybean||4700)+variance*1.2),
            mustard:Math.round((prices.mustard||5900)+variance*0.9),
            maize:Math.round((prices.maize||2200)+variance*0.6)
          },
          source:'AgriSmart Seed Data (Configure DATA_GOV_IN_API_KEY for live Agmarknet feed)'
        };
      });
      return json(res,200,{live:false,provider:'local_dataset',records},common);
    }

    // 4. Cloud & Local Image / Photo Upload Handler
    if(req.method==='POST'&&u.pathname==='/api/upload'){
      const auth=requireAuth(req,res,db);if(!auth)return;
      const b=await parseBody(req);
      if(!b.data||typeof b.data!=='string'){
        return json(res,400,{error:'Base64 image data is required in "data" property.'},common);
      }

      const match=b.data.match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/);
      if(!match){
        return json(res,400,{error:'Invalid format. Only JPEG, PNG, and WebP images are allowed.'},common);
      }

      const mime=match[1];
      const ext=mime==='image/png'?'.png':(mime==='image/webp'?'.webp':'.jpg');
      const buffer=Buffer.from(match[3],'base64');
      if(buffer.length>5*1024*1024){
        return json(res,413,{error:'Image size exceeds maximum limit of 5MB.'},common);
      }

      // Cloudinary cloud upload support
      if(process.env.CLOUDINARY_URL||(process.env.CLOUDINARY_CLOUD_NAME&&process.env.CLOUDINARY_API_KEY&&process.env.CLOUDINARY_API_SECRET)){
        try{
          const cloudName=process.env.CLOUDINARY_CLOUD_NAME;
          const apiKey=process.env.CLOUDINARY_API_KEY;
          const apiSecret=process.env.CLOUDINARY_API_SECRET;
          const timestamp=Math.floor(Date.now()/1000);
          const signature=crypto.createHash('sha1').update(`timestamp=${timestamp}${apiSecret}`).digest('hex');
          const formData=new URLSearchParams();
          formData.append('file',b.data);
          formData.append('api_key',apiKey);
          formData.append('timestamp',timestamp.toString());
          formData.append('signature',signature);
          formData.append('folder','agrismart_crops');
          const cRes=await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{
            method:'POST',
            body:formData,
            signal:AbortSignal.timeout(10000)
          });
          const cData=await cRes.json();
          if(cData.secure_url){
            return json(res,201,{url:cData.secure_url,provider:'cloudinary'},common);
          }
        }catch(e){
          console.error('[Cloudinary Upload Error]:',e.message);
        }
      }

      // Local storage in frontend/uploads
      const uploadDir=path.join(PUBLIC,'uploads');
      if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir,{recursive:true});
      }
      const filename=`${crypto.randomUUID()}${ext}`;
      const filePath=path.join(uploadDir,filename);
      await fs.promises.writeFile(filePath,buffer);
      return json(res,201,{url:`/uploads/${filename}`,provider:'local',size:buffer.length},common);
    }

    if(req.method==='GET'&&(u.pathname==='/'||u.pathname==='/index.html'))return html(res,200,fs.readFileSync(path.join(PUBLIC,'index.html'),'utf8'),common);
    const cleanPath = u.pathname.replace(/^[/\\]+/, '');
    const segments = cleanPath.split(/[/\\]/);
    if (segments.some(s => s.startsWith('.'))) {
      return json(res, 403, { error: 'Access forbidden.' }, common);
    }
    const file = path.resolve(PUBLIC, cleanPath);
    const rel = path.relative(PUBLIC, file);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return json(res, 403, { error: 'Access forbidden.' }, common);
    }
    const blockedExts = new Set(['.env', '.bat', '.cmd', '.sh', '.ps1', '.jsonl', '.db', '.log', '.git', '.lock']);
    const ext = path.extname(file).toLowerCase();
    if (blockedExts.has(ext)) {
      return json(res, 403, { error: 'Access forbidden.' }, common);
    }
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      const types={
        '.html':'text/html; charset=utf-8',
        '.js':'text/javascript; charset=utf-8',
        '.json':'application/json',
        '.png':'image/png',
        '.jpg':'image/jpeg',
        '.jpeg':'image/jpeg',
        '.ico':'image/x-icon',
        '.svg':'image/svg+xml',
        '.css':'text/css',
        '.webmanifest':'application/manifest+json'
      };
      res.writeHead(200,{...common,'Content-Type':types[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-cache':'public, max-age=3600'});
      return res.end(fs.readFileSync(file));
    }
    if(u.pathname.startsWith('/api/'))return json(res,404,{error:'Not found'},common);
    return html(res,404,'<!DOCTYPE html><html><head><meta charset="utf-8"><title>Page not found | AgriSmart</title><style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#F6F8F5;color:#14312B}div{text-align:center}h1{font-size:64px;margin:0}a{color:#2A7A4B;font-weight:700}</style></head><body><div><h1>404</h1><p>This page does not exist.</p><p><a href="/">\u2190 Back to AgriSmart</a></p></div></body></html>',common);
  }catch(e){console.error(e);return json(res,e.status||500,{error:e.status?e.message:'Server error. Please try again.'},common)}
});
server.listen(PORT,HOST,()=>console.log(`Agrismart backend running at http://${HOST}:${PORT}`));

async function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Flushing database and shutting down gracefully...`);
  try {
    await writeQueue;
    server.close(() => {
      console.log('AgriSmart server closed.');
      process.exit(0);
    });
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
