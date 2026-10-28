// AgriSmart Comprehensive Multilingual Engine (English & Hindi)
// Supports automatic language detection, cross-tab synchronization, and full dynamic UI updates

window.i18nDictionary = {
  en: {
    // Navigation & Common
    brand: 'Agri<span>Smart</span> 🌱',
    home: 'Home',
    tabHub: '🌱 Advisory & Smart Tools',
    tabFarmer: '👨‍🌾 Farmer Dashboard',
    tabBuyer: '🏢 Buyer Dashboard',
    tabAuth: '🔐 Login / Register',
    farmerDash: 'Farmer Dashboard',
    buyerDash: 'Buyer Dashboard',
    loginRegister: 'Login / Register',
    logout: 'Logout',
    langSelectLabel: '🌐 Language / भाषा:',
    detectLoc: '📍 Detect Location',
    detectingLoc: 'Detecting your location…',
    locDetected: 'Location detected. Coordinates are used only for weather.',
    locUnavailable: 'Location unavailable. Showing weather for your selected district.',
    locNotSupported: 'Geolocation is not supported. Showing weather for your selected district.',
    locNotDetected: 'Location not detected',
    locStatusHint: 'Click "Detect Location" to allow access. Coordinates are sent through the backend for weather and to a reverse-geocoding service to retrieve a place name.',
    loading: 'Loading…',
    refresh: 'Refresh',
    close: 'Close',
    today: 'Today',
    rainLabel: 'Rain',
    qPerAcre: 'q/acre',
    waterNeed: 'water need',
    estCost: 'estimated cost',
    perAcre: '/acre',
    total: 'total',

    // Hero Section
    heroTitle: 'Farm decisions made simple.',
    heroDesc: 'Get location-based weather information, agricultural market prices, and smart farming insights in one place.',
    startFarming: 'Start Farming →',
    farmLoc: '📍 Farm Location',
    locationDesc: 'Localized weather forecasts and farming tools for your selected district.',
    locationPrivacyNotice: 'If you use GPS, coordinates are sent to the weather backend and a reverse-geocoding provider to retrieve weather and a place name.',
    activeLocationLabel: 'Active weather location',
    assistantInputLabel: 'Ask a farming question',
    voiceButtonLabel: 'Speak your question',
    voiceButtonTitle: 'Speak in Hindi or English',
    coordinatesLabel: 'Coordinates',
    gpsVerified: 'GPS detected',
    districtSynced: 'District selected',
    districtLoading: 'Weather for the selected district is loading: {district}.',
    acquiringGps: '📡 Requesting your device location…',
    yourFarmLocation: 'Your farm location',

    // Weather Section
    liveWeather: '🌦️ Live Weather',
    temperature: 'Temperature',
    humidity: 'Humidity',
    rain: 'Rain',
    wind: 'Wind',
    weatherStatusDefault: 'Weather for your selected district loads automatically.',
    loadingWeather: 'Loading weather…',
    weatherLoaded: 'Live weather loaded from Open-Meteo.',
    weatherLiveLoaded: 'Live weather loaded from Open-Meteo.',
    weatherDemoLoaded: 'Open-Meteo is unavailable; showing illustrative demo weather.',
    weatherUnavailable: 'Weather is currently unavailable. Please try again.',
    forecast7Day: '📅 7-Day Weather Forecast',
    forecastUnavailable: 'Forecast unavailable right now.',
    detectToForecast: 'The selected district forecast loads automatically.',

    netCol: 'Estimated Net (₹/q)',
    demoEstimate: 'Demo estimate (₹0.80/km freight assumption)',

    // Soil & Fertilizer Calculator
    soilTitle: '🧪 Soil Health & Fertilizer Calculator (N-P-K)',
    soilDesc: 'Calculate balanced Urea, DAP, and Potash (MOP) bag requirements based on soil test ratings.',
    fertilizerDisclaimer: 'Illustrative estimate using preset demo values, not a soil-lab recommendation. Confirm fertilizer rates with a local agricultural expert.',
    calculateBags: 'Calculate Fertilizer Dose',
    fertPlotArea: 'Plot Area (Acres)',
    fertSoilN: 'Soil Nitrogen (N)',
    fertSoilP: 'Soil Phosphorus (P)',
    fertSoilK: 'Soil Potassium (K)',
    fertBagsRequired: 'Estimated Bag Requirement (50kg / 45kg Bags):',
    fertTiming: 'Application Timing Protocol:',
    fertEstCost: 'Estimated sample cost:',
    ureaLabel: 'Urea (45 kg)',
    dapLabel: 'DAP (50 kg)',
    mopLabel: 'MOP (50 kg)',
    bagsUnit: 'bags',
    atSowing: 'At sowing',
    firstTopDress: 'First top-dressing',
    secondTopDress: 'Second top-dressing',
    firstIrrigation: 'at first irrigation (21–25 days)',
    floweringStage: 'at flowering (45–50 days)',

    // Cold Storage & Logistics
    coldStorageTitle: '❄️ Sample Storage Directory',
    coldStorageDesc: 'Sample entries only; provider details and certifications have not been independently verified.',
    logisticsTitle: '🚛 Sample Transport Directory',
    logisticsDesc: 'Sample entries only; provider details have not been independently verified.',
    directoryDemoNotice: 'Sample entries only; provider details and certifications have not been independently verified.',
    sampleEntry: 'Sample entry — not verified',
    sampleContact: 'Sample contact (unverified)',
    capacityLabel: 'capacity',
    temperatureLabel: 'Storage temperature',
    storageFeeLabel: 'Sample storage fee',
    quintalMonth: 'quintal/month',
    quintalCapacity: 'quintal capacity',
    baseRateLabel: 'Sample base rate',
    kmUnit: 'km',
    footerSummary: 'Agriculture tools, sample market estimates, and a farmer-buyer demo marketplace.',
    quickPortals: 'Quick Portals',
    footerFarmerLink: '👨‍🌾 Farmer Dashboard & Sell Produce',
    footerBuyerLink: '🏢 Buyer Dashboard & Procurement',
    footerAuthLink: '🔐 Login / Farmer Registration',
    footerMandiLink: '💰 Sample Mandi Price Benchmarks',
    footerLegalTitle: 'Demo Data Notice',
    footerDisclaimer: 'This demo uses sample prices and estimates, not a live APMC feed. Confirm prices, provider details, eligibility, and terms with official sources before acting.',
    noDirectoryEntries: 'No sample entries are available.',
    directoryUnavailable: 'Directory data is unavailable. Please try again later.',
    callFacility: '📞 Call Facility',
    callDriver: '📞 Call Driver',
    feePerMonth: 'Fee: ₹{fee}/q/month',

    // AI Disease Scanner
    diseaseTitle: '🌿 Crop Disease & Pest Reference',
    diseaseDesc: 'Compare entered symptoms with a small demo reference. This is not an AI diagnosis or a substitute for expert advice.',
    photoPreviewHelp: 'The photo stays in this browser and is not sent for diagnosis. Enter symptoms below.',
    photoPreviewOnly: 'Photo selected for local preview only',
    chooseImageFile: 'Choose a valid image file.',
    imageTooLarge: 'Choose an image smaller than 5 MB.',
    imageReadError: 'The image could not be opened.',
    noDiseaseMatch: 'No reference match found. Try describing more symptoms or consult an agricultural expert.',
    diseaseUnavailable: 'The symptom reference is unavailable. Please try again later.',
    referenceMatch: 'Possible reference match · not a confirmed diagnosis',
    referenceDisclaimer: 'Use this result as a starting point only. Confirm disease and treatment with a local agriculture expert.',
    diseaseCropLabel: 'Crop Under Inspection',
    diseaseSympLabel: 'Visible Leaf / Plant Symptoms',
    diseaseSympPlaceholder: 'e.g., yellow stripes on leaves, powdery yellow spores, wilting...',
    diagnoseBtn: 'Diagnose Disease',
    organicRemedyLabel: '🌱 Organic Remedy:',
    chemicalRemedyLabel: '🧪 Chemical Protocol:',

    // Kisan Sahayak Voice Assistant
    assistantTitle: '🎙️ Kisan Sahayak — Voice & Agricultural Assistant',
    assistantDesc: 'Ask any farming query in Hindi or English (Voice & Text supported).',
    assistantPlaceholder: 'e.g., What is wheat mandi price today? How much urea for 2 acres?',
    askVoice: '🎤 Speak Query',
    askSubmit: 'Ask Sahayak',
    assistantAiMode: 'AI-generated answer. Verify important farming decisions with a qualified local expert.',
    assistantDemoMode: 'Demo rule-based answer. It may be incomplete or out of date.',
    assistantUnavailable: 'Unable to answer right now. Please try again later.',
    voiceUnavailable: 'Voice input is unavailable. Please type your question.',

    // Crop Recommendations
    cropReco: '🌱 Crop Recommendations',
    cropEstimateNotice: 'Illustrative demo estimates; confirm decisions with local agricultural experts.',
    cropDataUnavailable: 'Crop recommendations are unavailable. Please try again later.',
    fertilizerUnavailable: 'The fertilizer estimate is unavailable. Check your inputs and try again.',
    viewDetails: 'View Details',
    cropDetails: 'Crop details',
    recommended: 'Recommended',
    seasonalOption: 'Seasonal option',
    seasonLabel: 'Season:',
    yieldLabel: 'Expected yield:',
    costLabel: 'Estimated cultivation cost:',
    waterLabel: 'Water requirement:',
    riskLabel: 'Crop sensitivity:',
    lowerRisk: 'Lower price/production risk in this demo model.',
    moderateRisk: 'Moderate price/production risk in this demo model.',

    // Crops
    wheat: 'Wheat',
    maize: 'Maize',
    soybean: 'Soybean',
    chana: 'Chickpea (chana)',
    mustard: 'Mustard',
    lentil: 'Lentil (masoor)',

    // Weekdays
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',

    // Mandi Prices
    mandiPrices: '💰 Sample Mandi Price Benchmarks',
    cropCol: 'Crop',
    marketCol: 'Market',
    priceCol: 'Sample price (₹/q)',
    sourceCol: 'Source',
    loadingMarket: 'Loading market data...',
    demoMandiNotice: 'Demo mandi data loaded. It is not a live government feed.',
    startBackendNotice: 'Start the Agrismart backend and reload.',
    demoData: 'Agrismart demo data',

    // Marketplace Cards
    buyerMarketTitle: '🛒 Farmer Marketplace',
    buyingCropsTitle: 'Buying crops?',
    buyingCropsDesc: 'Browse the sample mandi catalog and send an offer to a registered farmer.',
    openBuyerDash: 'Open Buyer Dashboard',
    sellingCropsTitle: 'Selling crops?',
    sellingCropsDesc: 'Create a farmer profile to receive buyer offers through Agrismart.',
    openFarmerDash: 'Open Farmer Dashboard',
    footerText: 'Smart technology for smarter farming.',

    // Farmer Dashboard
    farmerMarketplaceEyebrow: 'BUYER–FARMER MARKETPLACE',
    farmerTitle: 'Farmer Dashboard 👨‍🌾',
    farmerIntro: 'Review offers addressed to your farmer profile, negotiate counter-rates, and respond to buyers.',
    farmerNote: 'Your farmer dashboard is protected by your account. Offers, orders, reports and notifications are stored on the AgriSmart backend.',
    yourProfile: 'Your farmer profile',
    farmProfileName: 'Farm profile name',
    districtOrTown: 'District or town',
    createProfileBtn: 'Create farmer profile',
    profileCreated: 'Farm profile created.',
    pendingOffers: '🤝 Pending Offers',
    waitingResponse: 'waiting for your response',
    accepted: '✅ Accepted',
    acceptedSub: 'accepted offers',
    rejected: '↩️ Rejected',
    rejectedSub: 'declined offers',
    quantityOffered: '📦 Quantity Offered',
    quintalsInPending: 'quintals in pending offers',
    ordersCard: '📋 Orders',
    confirmedOrdersSub: 'confirmed orders',
    offersForYou: 'Offers for you',
    offersSub: 'Accept, counter-offer, or reject buyer offers with direct negotiation chat.',
    refreshOffers: 'Refresh offers',
    noOffersYet: 'Select or create a farmer profile to view its offers.',
    noOffersFound: 'No offers yet.',
    buyerLabel: 'Buyer:',
    sentLabel: 'Sent',
    deliverByLabel: 'Deliver by',
    acceptBtn: 'Accept',
    rejectBtn: 'Reject',
    counterOfferBtn: 'Counter Offer 💬',
    chatBtn: 'Chat 💬',
    profitReportTitle: 'Farm profitability report',
    cropLabel: 'Crop',
    areaAcres: 'Area (acres)',
    productionQ: 'Production (quintals)',
    expensesRs: 'Expenses (₹)',
    salePriceRs: 'Sale price (₹/quintal)',
    saveReport: 'Save report',
    reportSaved: 'Report saved. Revenue {rev} · estimated profit {prof}.',
    savedReportsTitle: 'Saved Profitability Reports',
    savedReportsDesc: 'Track and review your saved crop economic returns and net margins.',
    noSavedReports: 'No profitability reports saved yet. Enter numbers above and click Save Report.',
    revenueLabel: 'Revenue',
    netProfitLabel: 'Net Profit',
    netLossLabel: 'Net Loss',
    profitPerAcre: 'Profit / Acre',
    deleteReport: 'Delete',
    printReport: 'Print / Receipt',
    switchToFarmer: 'Switch to Farmer Dashboard',
    switchToBuyer: 'Switch to Buyer Dashboard',
    updateProfileBtn: 'Update Farm Profile',
    profileUpdated: 'Farm profile updated successfully.',
    detectFarmerLocation: '📍 Auto-detect District',
    ordersTitle: 'Orders',
    ordersDesc: 'Accepted offers automatically become confirmed orders.',
    refreshOrders: 'Refresh orders',
    loadingOrders: 'Loading orders…',
    noOrdersYet: 'No orders yet.',
    paymentStatus: 'Payment:',
    deliveryStatus: 'Delivery:',
    statusPending: 'pending',
    statusReady: 'ready',
    statusInTransit: 'in transit',
    statusDelivered: 'delivered',
    statusPaid: 'paid',
    statusFailed: 'failed',
    statusAccepted: 'accepted',
    statusRejected: 'rejected',
    statusCountered: 'countered',
    farmerDisclaimer: 'Market prices are clearly labelled demo references. Payment and delivery are represented by order status fields; connect a payment/delivery provider for real transactions.',

    // Buyer Dashboard
    buyerMarketplaceEyebrow: 'AGRISMART MARKETPLACE',
    buyerTitle: 'Buyer Dashboard 🏢',
    buyerIntro: 'Find crops, submit offers, negotiate counter-offers, and deposit into secure escrow.',
    buyerNote: 'You are using a secure buyer account. Offers, orders and notifications are stored on the AgriSmart backend. Mandi prices remain clearly labelled as demo data until a live provider is connected.',
    availCrops: '🌾 Available Crops',
    inPriceCatalog: 'in sample price catalog',
    myOrders: '📦 My Orders',
    activeOffers: '🤝 Active Offers',
    savedInApp: 'saved in this app',
    completedCard: '✅ Completed',
    deliveredOrders: 'delivered orders',
    availCropsHeading: 'Available Crops',
    availCropsSub: 'Price references from the sample mandi dataset.',
    searchCropsPlaceholder: 'Search crops…',
    compareAllMandis: 'Compare all mandi prices',
    makeOffer: 'Make an Offer',
    expectedPriceRef: 'Expected price reference:',
    highestSamplePrice: 'Highest sample mandi price:',
    yieldShort: 'Yield:',
    loadingCrops: 'Loading crops from the Agrismart backend…',
    noCropsFound: 'No matching crops found.',
    makeOfferDialogTitle: 'Make an Offer',
    makeOfferDialogSub: 'Send your crop, quantity, price and optional early-sale bonus to a registered farmer.',
    sendToFarmer: 'Send to farmer',
    quantityQuintals: 'Quantity (quintals)',
    baseOfferPrice: 'Your base offer price (₹ per quintal)',
    earlyBonus: 'Extra early-sale bonus (₹ per quintal)',
    deliverByDate: 'Deliver by date (required when a bonus is offered)',
    totalIfOnTime: 'Total if delivered on time: {price} / quintal · bonus total: {bonus}',
    cancel: 'Cancel',
    saveOffer: 'Save offer',
    sentOffersHeading: 'Sent Offers & Negotiations',
    sentOffersSub: 'Offer status updates when the selected farmer responds or counters.',
    refreshStatus: 'Refresh status',
    noOffersSent: 'You have not saved any offers yet.',
    toFarmer: 'To farmer:',
    payEscrow: '💳 Deposit into Escrow (UPI QR)',
    notifications: 'Notifications',
    notificationsSub: 'Offer and order updates from farmers.',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications.',
    buyerDisclaimer: 'Market prices are demo references. Orders track agreement, payment state and delivery state; connect a payment gateway and logistics provider for real transactions.',

    // Auth Page
    authWelcome: 'Welcome back',
    authSubLogin: 'Login to manage your AgriSmart account.',
    authSubOtp: 'Fast & secure passwordless login with 6-digit email OTP.',
    authCreate: 'Create your account',
    authSubRegister: 'Create a secure farmer or buyer account.',
    tabLogin: 'Login',
    tabOtpLogin: '✉️ Email OTP Login',
    tabPasswordLogin: '🔑 Password Login',
    tabRegister: 'Create account',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    accountType: 'Account type',
    roleFarmer: 'Farmer',
    roleBuyer: 'Buyer',
    district: 'District',
    submitLogin: 'Login',
    submitRegister: 'Create account',
    sendOtpBtn: 'Send OTP to Email',
    resendOtpBtn: 'Resend OTP',
    otpLabel: 'Enter 6-digit OTP Code',
    otpPlaceholder: 'e.g. 123456',
    verifyOtpBtn: 'Verify OTP & Login',
    otpSentMsg: 'Verification code sent to your email! (Valid for 10 mins)',
    otpDevHint: 'Local/Demo mode OTP code: ',
    autofillOtp: 'Auto-fill OTP',
    waitCountdown: 'Resend in {s}s',
    backHome: '← Back to AgriSmart home',

    // Produce Marketplace & Listings
    tabListings: '🌾 Produce Marketplace',
    postProduceTitle: 'Post Harvest for Sale',
    postProduceSub: 'List your available crop quantity so verified buyers can send purchase offers.',
    cropVariety: 'Variety / Grade',
    expectedPrice: 'Expected Rate (₹/quintal)',
    harvestDate: 'Harvest / Available Date',
    listingNotes: 'Quality / Delivery Notes',
    submitListing: 'Publish Crop Listing',
    myListings: 'My Active Produce Listings',
    noListingsYet: 'No produce listings published yet.',
    deleteListing: 'Remove Listing',
    browseMarketplace: 'Available Farm Produce Marketplace',
    browseMarketplaceSub: 'Direct listings from local farmers ready for purchase.',
    makeOffer: 'Make Purchase Offer',
    noMarketplaceListings: 'No farmer listings currently available.',

    // Government Schemes
    govSchemes: '🏛️ Government Schemes & Subsidies',
    govSchemesSub: 'Central & State Government assistance programs for farmers.',
    schemeIncomeBadge: 'Direct Income Support',
    schemePmKisan: 'PM-Kisan Samman Nidhi',
    schemePmKisanDesc: 'This program may provide income support to eligible farm families. Check current terms and eligibility on the official portal.',
    schemeInsuranceBadge: 'Crop Insurance',
    schemePmFby: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    schemePmFbyDesc: 'Insurance terms, eligible crops, and premiums vary. Check the official portal for current details.',
    schemeMachineryBadge: 'Farm Machinery Subsidy',
    schemeMachinery: 'MP Krishi Yantra Anudan',
    schemeMachineryDesc: 'Availability, eligible equipment, and subsidy rates can change. Check the official state portal.',
    schemeCreditBadge: 'Institutional Credit',
    schemeKcc: 'Kisan Credit Card (KCC)',
    schemeKccDesc: 'Credit limits, interest, and eligibility depend on current rules and the lender. Check official details.',
    schemeEligibility: 'Eligibility details may change. Check the official portal.',
    kisanCallBadge: 'Kisan Call Centre',
    kisanCallTitle: 'National Kisan Call Centre (KCC)',
    kisanCallDesc: 'Contact the official helpline for agriculture-related questions. Verify availability before calling.',
    kisanCallHours: 'Check the official source for current hours and languages.',
    callOfficialHelpline: 'Call official helpline',
    kvkBadge: 'Agricultural extension centre',
    kvkTitle: 'KVK Sehore (Krishi Vigyan Kendra)',
    kvkDesc: 'Contact details and services should be confirmed with the institution before visiting.',
    kvkAddress: 'KVK Research Farm, Sehore (M.P.)',
    contactKvk: 'Contact KVK Sehore',
    icarBadge: 'ICAR institute',
    icarTitle: 'ICAR - CIAE Bhopal',
    icarDesc: 'Contact details and services should be confirmed with the institution before visiting.',
    icarAddress: 'Nabi Bagh, Berasia Road, Bhopal (M.P.)',
    contactIcar: 'Contact ICAR Bhopal',
    checkEligibility: 'Official Portal →',
    
    // Helplines & Support
    kisanHelplines: '☎️ Kisan Helpline & Support Directory',
    kisanHelplinesSub: 'Direct emergency assistance from agriculture scientists and call centers.',
    
    // Invoice / Bill
    printReceipt: '🧾 Print Mandi Bill',
    mandiInvoice: 'AgriSmart Official Mandi Bill / Vyapar Parchi'
  },

  hi: {
    // Navigation & Common
    brand: 'एग्री<span>स्मार्ट</span> 🌱',
    home: 'होम (मुख्य पृष्ठ)',
    tabHub: '🌱 कृषि सलाह एवं स्मार्ट टूल्स',
    tabFarmer: '👨‍🌾 किसान डैशबोर्ड',
    tabBuyer: '🏢 व्यापारी डैशबोर्ड',
    tabAuth: '🔐 लॉगिन / पंजीकरण',
    farmerDash: 'किसान डैशबोर्ड',
    buyerDash: 'व्यापारी डैशबोर्ड',
    loginRegister: 'लॉगिन / पंजीकरण',
    logout: 'लॉगआउट',
    langSelectLabel: '🌐 भाषा / Language:',
    detectLoc: '📍 स्थान पहचानें',
    detectingLoc: 'स्थान पहचाना जा रहा है…',
    locDetected: 'स्थान पहचाना गया। मौसम के लिए निर्देशांक प्रयुक्त।',
    locUnavailable: 'स्थान नहीं मिला। चुने हुए जिले का मौसम दिखाया जा रहा है।',
    locNotSupported: 'जियोलोकेशन उपलब्ध नहीं है। चुने हुए जिले का मौसम दिखाया जा रहा है।',
    locNotDetected: 'स्थान अभी पहचाना नहीं गया है',
    locStatusHint: 'पहुंच की अनुमति देने के लिए "स्थान पहचानें" पर क्लिक करें। मौसम और स्थान का नाम पाने के लिए निर्देशांक संबंधित सेवाओं को भेजे जाते हैं।',
    loading: 'लोड हो रहा है…',
    refresh: 'रिफ्रेश करें',
    close: 'बंद करें',
    today: 'आज',
    rainLabel: 'बारिश',
    qPerAcre: 'क्विंटल/एकड़',
    waterNeed: 'पानी की जरूरत',
    estCost: 'अनुमानित लागत',
    perAcre: '/एकड़',
    total: 'कुल राशि',

    // Hero Section
    heroTitle: 'खेती के सही निर्णय, अब आसान।',
    heroDesc: 'मौसम की लाइव जानकारी, कृषि मंडी भाव, और स्मार्ट खेती के सुझाव एक ही स्थान पर प्राप्त करें।',
    startFarming: 'खेती शुरू करें →',
    farmLoc: '📍 खेत का स्थान',
    locationDesc: 'आपके चुने हुए जिले के लिए स्थानीय मौसम और खेती के उपकरण।',
    locationPrivacyNotice: 'GPS इस्तेमाल करने पर मौसम और स्थान का नाम पाने के लिए निर्देशांक मौसम बैकएंड और रिवर्स-जियोकोडिंग सेवा को भेजे जाते हैं।',
    activeLocationLabel: 'सक्रिय मौसम स्थान',
    assistantInputLabel: 'खेती से जुड़ा सवाल पूछें',
    voiceButtonLabel: 'अपना सवाल बोलें',
    voiceButtonTitle: 'हिंदी या अंग्रेज़ी में बोलें',
    coordinatesLabel: 'निर्देशांक',
    gpsVerified: 'GPS स्थान मिला',
    districtSynced: 'जिला चुना गया',
    districtLoading: 'चयनित जिले का मौसम लोड हो रहा है: {district}।',
    acquiringGps: '📡 आपके डिवाइस से स्थान मांगा जा रहा है…',
    yourFarmLocation: 'आपका खेत स्थान',

    // Weather Section
    liveWeather: '🌦️ लाइव मौसम अपडेट',
    temperature: 'तापमान',
    humidity: 'नमी (आर्द्रता)',
    rain: 'बारिश',
    wind: 'हवा की गति',
    weatherStatusDefault: 'चुने हुए जिले का मौसम अपने आप लोड होता है।',
    loadingWeather: 'मौसम लोड हो रहा है…',
    weatherLoaded: 'ओपन-मेटियो से लाइव मौसम लोड किया गया।',
    weatherLiveLoaded: 'ओपन-मेटियो से लाइव मौसम लोड किया गया।',
    weatherDemoLoaded: 'ओपन-मेटियो उपलब्ध नहीं है; उदाहरण हेतु डेमो मौसम दिखाया जा रहा है।',
    weatherUnavailable: 'मौसम अभी उपलब्ध नहीं है। कृपया फिर कोशिश करें।',
    forecast7Day: '📅 7 दिनों का मौसम पूर्वानुमान',
    forecastUnavailable: 'मौसम पूर्वानुमान अभी उपलब्ध नहीं है।',
    detectToForecast: 'चुने हुए जिले का पूर्वानुमान अपने आप लोड होता है।',

    netCol: 'अनुमानित शुद्ध भाव (₹/क्विंटल)',
    demoEstimate: 'डेमो अनुमान (₹0.80/किमी परिवहन मानकर)',

    // Soil & Fertilizer Calculator
    soilTitle: '🧪 मृदा स्वास्थ्य एवं खाद कैलकुलेटर (N-P-K)',
    soilDesc: 'मिट्टी की जांच के आधार पर यूरिया, डीएपी, और पोटाश (MOP) की अनुमानित बोरियों की गणना करें।',
    fertilizerDisclaimer: 'पहले से तय डेमो मानों पर आधारित अनुमान; यह मिट्टी जांच की सिफारिश नहीं है। खाद की मात्रा स्थानीय कृषि विशेषज्ञ से जांचें।',
    calculateBags: 'खाद की मात्रा जानें',
    fertPlotArea: 'खेत का रकबा (एकड़)',
    fertSoilN: 'मिट्टी में नाइट्रोजन (N)',
    fertSoilP: 'मिट्टी में फास्फोरस (P)',
    fertSoilK: 'मिट्टी में पोटाश (K)',
    fertBagsRequired: 'अनुमानित बोरियों की आवश्यकता (50kg / 45kg):',
    fertTiming: 'खाद डालने का सही समय (शेड्यूल):',
    fertEstCost: 'डेमो मूल्यों पर अनुमानित लागत:',
    ureaLabel: 'यूरिया (45 किग्रा)',
    dapLabel: 'डीएपी (50 किग्रा)',
    mopLabel: 'एमओपी (50 किग्रा)',
    bagsUnit: 'बोरियां',
    atSowing: 'बुवाई के समय',
    firstTopDress: 'पहली ऊपरी खुराक',
    secondTopDress: 'दूसरी ऊपरी खुराक',
    firstIrrigation: 'पहली सिंचाई पर (21–25 दिन)',
    floweringStage: 'फूल आने पर (45–50 दिन)',

    // Cold Storage & Logistics
    coldStorageTitle: '❄️ नमूना भंडारण सूची',
    coldStorageDesc: 'केवल नमूना प्रविष्टियां; प्रदाता और प्रमाणपत्र की स्वतंत्र पुष्टि नहीं की गई है।',
    logisticsTitle: '🚛 नमूना परिवहन सूची',
    logisticsDesc: 'केवल नमूना प्रविष्टियां; प्रदाता विवरण की स्वतंत्र पुष्टि नहीं की गई है।',
    directoryDemoNotice: 'केवल नमूना प्रविष्टियां; प्रदाता और प्रमाणपत्र की स्वतंत्र पुष्टि नहीं की गई है।',
    sampleEntry: 'नमूना प्रविष्टि — सत्यापित नहीं',
    sampleContact: 'नमूना संपर्क (सत्यापित नहीं)',
    capacityLabel: 'क्षमता',
    temperatureLabel: 'भंडारण तापमान',
    storageFeeLabel: 'नमूना भंडारण शुल्क',
    quintalMonth: 'क्विंटल/माह',
    quintalCapacity: 'क्विंटल क्षमता',
    baseRateLabel: 'नमूना आधार शुल्क',
    kmUnit: 'किमी',
    footerSummary: 'खेती के उपकरण, मंडी के नमूना अनुमान और किसान-व्यापारी डेमो बाज़ार।',
    quickPortals: 'त्वरित लिंक',
    footerFarmerLink: '👨‍🌾 किसान डैशबोर्ड और उपज बेचें',
    footerBuyerLink: '🏢 खरीदार डैशबोर्ड और खरीद',
    footerAuthLink: '🔐 लॉगिन / किसान पंजीकरण',
    footerMandiLink: '💰 नमूना मंडी भाव',
    footerLegalTitle: 'डेमो डेटा सूचना',
    footerDisclaimer: 'इस डेमो में नमूना भाव और अनुमान हैं, लाइव APMC फीड नहीं। निर्णय से पहले भाव, प्रदाता, पात्रता और नियमों की पुष्टि आधिकारिक स्रोत से करें।',
    noDirectoryEntries: 'कोई नमूना प्रविष्टि उपलब्ध नहीं है।',
    directoryUnavailable: 'सूची उपलब्ध नहीं है। कृपया बाद में फिर कोशिश करें।',
    callFacility: '📞 संपर्क करें',
    callDriver: '📞 ड्राइवर से बात करें',
    feePerMonth: 'शुल्क: ₹{fee}/क्विंटल/माह',

    // AI Disease Scanner
    diseaseTitle: '🌿 फसल रोग एवं कीट संदर्भ',
    diseaseDesc: 'दर्ज लक्षणों की छोटे डेमो संदर्भ से तुलना करें। यह एआई निदान या कृषि विशेषज्ञ की सलाह का विकल्प नहीं है।',
    photoPreviewHelp: 'फोटो इसी ब्राउज़र में रहती है और निदान के लिए नहीं भेजी जाती। नीचे लक्षण दर्ज करें।',
    photoPreviewOnly: 'फोटो केवल स्थानीय पूर्वावलोकन के लिए चुनी गई है',
    chooseImageFile: 'कृपया सही छवि फ़ाइल चुनें।',
    imageTooLarge: '5 MB से छोटी छवि चुनें।',
    imageReadError: 'छवि खोली नहीं जा सकी।',
    noDiseaseMatch: 'कोई संदर्भ मेल नहीं मिला। अधिक लक्षण बताएं या कृषि विशेषज्ञ से सलाह लें।',
    diseaseUnavailable: 'लक्षण संदर्भ अभी उपलब्ध नहीं है। कृपया बाद में फिर कोशिश करें।',
    referenceMatch: 'संभावित संदर्भ मेल · पुष्टि किया हुआ निदान नहीं',
    referenceDisclaimer: 'इसे केवल शुरुआती जानकारी मानें। रोग और उपचार की पुष्टि स्थानीय कृषि विशेषज्ञ से करें।',
    diseaseCropLabel: 'फसल चुनें',
    diseaseSympLabel: 'पत्ती या पौधे पर दिखने वाले लक्षण',
    diseaseSympPlaceholder: 'उदा: पत्तियों पर पीली धारियां, उकठा रोग, सफेद फफूंद, पत्तियां मुड़ना...',
    diagnoseBtn: 'रोग की पहचान करें',
    organicRemedyLabel: '🌱 जैविक उपचार:',
    chemicalRemedyLabel: '🧪 रासायनिक उपचार:',

    // Kisan Sahayak Voice Assistant
    assistantTitle: '🎙️ किसान सहायक — आवाज़ एवं कृषि सहायक',
    assistantDesc: 'मौसम, खाद, मंडी भाव या फसल रोग के बारे में बोलकर या लिखकर पूछें।',
    assistantPlaceholder: 'उदा: आज सीहोर में गेहूं का भाव क्या है? 2 एकड़ में यूरिया कितना डालें?',
    askVoice: '🎤 बोलकर पूछें',
    askSubmit: 'सहायक से पूछें',
    assistantAiMode: 'एआई से बना उत्तर। खेती के महत्वपूर्ण निर्णय स्थानीय योग्य विशेषज्ञ से जांचें।',
    assistantDemoMode: 'डेमो नियमों पर आधारित उत्तर। यह अधूरा या पुराना हो सकता है।',
    assistantUnavailable: 'अभी उत्तर नहीं मिल सका। कृपया बाद में फिर कोशिश करें।',
    voiceUnavailable: 'आवाज़ से प्रश्न दर्ज नहीं हो सका। कृपया टाइप करें।',

    // Crop Recommendations
    cropReco: '🌱 फसल सिफारिशें एवं सलाह',
    cropEstimateNotice: 'डेमो के अनुमान; निर्णय से पहले स्थानीय कृषि विशेषज्ञ से पुष्टि करें।',
    cropDataUnavailable: 'फसल सुझाव उपलब्ध नहीं हैं। कृपया बाद में फिर कोशिश करें।',
    fertilizerUnavailable: 'उर्वरक अनुमान उपलब्ध नहीं है। जानकारी जांचकर फिर कोशिश करें।',
    viewDetails: 'विस्तार से देखें',
    cropDetails: 'फसल विवरण',
    recommended: 'अनुशंसित फसल',
    seasonalOption: 'मौसमी विकल्प',
    seasonLabel: 'मौसम:',
    yieldLabel: 'अनुमानित पैदावार:',
    costLabel: 'अनुमानित खेती लागत:',
    waterLabel: 'पानी की आवश्यकता:',
    riskLabel: 'फसल संवेदनशीलता:',
    lowerRisk: 'इस मॉडल में कम मूल्य/उत्पादन जोखिम।',
    moderateRisk: 'इस मॉडल में मध्यम मूल्य/उत्पादन जोखिम।',

    // Crops
    wheat: 'गेहूं',
    maize: 'मक्का',
    soybean: 'सोयाबीन',
    chana: 'चना',
    mustard: 'सरसों',
    lentil: 'मसूर',

    // Weekdays
    sun: 'रवि',
    mon: 'सोम',
    tue: 'मंगल',
    wed: 'बुध',
    thu: 'गुरु',
    fri: 'शुक्र',
    sat: 'शनि',

    // Mandi Prices
    mandiPrices: '💰 नमूना मंडी भाव',
    cropCol: 'फसल',
    marketCol: 'मंडी (बाजार)',
    priceCol: 'नमूना भाव (₹/क्विंटल)',
    sourceCol: 'स्रोत',
    loadingMarket: 'मंडी भाव लोड हो रहा है...',
    demoMandiNotice: 'डेमो मंडी भाव लोड किए गए। यह सरकारी लाइव फीड नहीं है।',
    startBackendNotice: 'एग्रीस्मार्ट बैकएंड चालू करें और पुनः लोड करें।',
    demoData: 'एग्रीस्मार्ट डेमो डेटा',

    // Marketplace Cards
    buyerMarketTitle: '🛒 किसान एवं खरीदार बाजार',
    buyingCropsTitle: 'फसल खरीदना चाहते हैं?',
    buyingCropsDesc: 'मंडी सूची देखें और पंजीकृत किसान को खरीद का प्रस्ताव भेजें।',
    openBuyerDash: 'व्यापारी डैशबोर्ड खोलें',
    sellingCropsTitle: 'फसल बेचना चाहते हैं?',
    sellingCropsDesc: 'व्यापारियों से प्रस्ताव प्राप्त करने के लिए किसान प्रोफ़ाइल बनाएं।',
    openFarmerDash: 'किसान डैशबोर्ड खोलें',
    footerText: 'उन्नत तकनीक, खुशहाल किसान।',

    // Farmer Dashboard
    farmerMarketplaceEyebrow: 'खरीदार-किसान बाजार मंच',
    farmerTitle: 'किसान डैशबोर्ड 👨‍🌾',
    farmerIntro: 'अपनी किसान प्रोफ़ाइल पर आए प्रस्ताव देखें, नए भाव पर मोलभाव करें और व्यापारियों को जवाब दें।',
    farmerNote: 'आपका किसान डैशबोर्ड सुरक्षित है। सभी प्रस्ताव, ऑर्डर, रिपोर्ट और सूचनाएं एग्रीस्मार्ट सर्वर पर सुरक्षित हैं।',
    yourProfile: 'आपकी किसान प्रोफ़ाइल',
    farmProfileName: 'खेत/फार्म का नाम',
    districtOrTown: 'जिला या तहसील',
    createProfileBtn: 'किसान प्रोफ़ाइल बनाएं',
    profileCreated: 'किसान प्रोफ़ाइल सफलतापूर्वक बन गई।',
    pendingOffers: '🤝 लंबित प्रस्ताव',
    waitingResponse: 'आपके जवाब की प्रतीक्षा में',
    accepted: '✅ स्वीकृत प्रस्ताव',
    acceptedSub: 'स्वीकार किए गए प्रस्ताव',
    rejected: '↩️ अस्वीकृत',
    rejectedSub: 'अस्वीकार किए गए प्रस्ताव',
    quantityOffered: '📦 प्रस्तावित मात्रा',
    quintalsInPending: 'लंबित प्रस्तावों में क्विंटल',
    ordersCard: '📋 कन्फर्म ऑर्डर',
    confirmedOrdersSub: 'कन्फर्म किए गए ऑर्डर',
    offersForYou: 'आपके लिए आए प्रस्ताव',
    offersSub: 'व्यापारी के प्रस्ताव स्वीकारें, नया भाव भेजें या सीधी चैट से बात करें।',
    refreshOffers: 'प्रस्ताव रिफ्रेश करें',
    noOffersYet: 'प्रस्ताव देखने के लिए किसान प्रोफ़ाइल चुनें या बनाएं।',
    noOffersFound: 'अभी कोई प्रस्ताव नहीं आया है।',
    buyerLabel: 'खरीदार:',
    sentLabel: 'भेजा गया:',
    deliverByLabel: 'डिलीवरी की अंतिम तिथि:',
    acceptBtn: 'स्वीकार करें',
    rejectBtn: 'अस्वीकार करें',
    counterOfferBtn: 'नया भाव (काउंटर) 💬',
    chatBtn: 'चैट करें 💬',
    profitReportTitle: 'खेत का मुनाफा रिपोर्ट',
    cropLabel: 'फसल',
    areaAcres: 'रकबा (एकड़)',
    productionQ: 'कुल उत्पादन (क्विंटल)',
    expensesRs: 'कुल खर्च (₹)',
    salePriceRs: 'बिक्री मूल्य (₹/क्विंटल)',
    saveReport: 'रिपोर्ट सेव करें',
    reportSaved: 'रिपोर्ट सुरक्षित की गई। कुल आय {rev} · अनुमानित शुद्ध मुनाफा {prof}।',
    savedReportsTitle: 'सहेजी गई लाभप्रदता रिपोर्टें',
    savedReportsDesc: 'अपनी सहेजी गई फसल लाभप्रदता रिपोर्ट और शुद्ध मुनाफे का इतिहास देखें।',
    noSavedReports: 'अभी तक कोई रिपोर्ट सहेजी नहीं गई है। ऊपर फॉर्म भरें और "रिपोर्ट सेव करें" दबाएं।',
    revenueLabel: 'कुल आय',
    netProfitLabel: 'शुद्ध लाभ',
    netLossLabel: 'हानि',
    profitPerAcre: 'प्रति एकड़ लाभ',
    deleteReport: 'हटाएं',
    printReport: 'प्रिंट / रसीद',
    switchToFarmer: 'किसान डैशबोर्ड पर स्विच करें',
    switchToBuyer: 'व्यापारी डैशबोर्ड पर स्विच करें',
    updateProfileBtn: 'फार्म प्रोफ़ाइल अपडेट करें',
    profileUpdated: 'फार्म प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई।',
    detectFarmerLocation: '📍 जिला स्वतः पहचानें',
    ordersTitle: 'ऑर्डर सूची',
    ordersDesc: 'स्वीकृत प्रस्ताव अपने आप कन्फर्म ऑर्डर बन जाते हैं।',
    refreshOrders: 'ऑर्डर रिफ्रेश करें',
    loadingOrders: 'ऑर्डर लोड हो रहे हैं…',
    noOrdersYet: 'अभी कोई ऑर्डर नहीं है।',
    paymentStatus: 'भुगतान:',
    deliveryStatus: 'डिलीवरी स्थिति:',
    statusPending: 'लंबित',
    statusReady: 'तैयार',
    statusInTransit: 'रास्ते में',
    statusDelivered: 'पहुंचा दिया गया',
    statusPaid: 'भुगतान प्राप्त',
    statusFailed: 'विफल',
    statusAccepted: 'स्वीकृत',
    statusRejected: 'अस्वीकृत',
    statusCountered: 'मोलभाव (काउंटर)',
    farmerDisclaimer: 'मंडी भाव केवल संदर्भ के लिए हैं। भुगतान और डिलीवरी स्थिति के आधार पर ट्रैक की जाती है।',

    // Buyer Dashboard
    buyerMarketplaceEyebrow: 'एग्रीस्मार्ट बाजार मंच',
    buyerTitle: 'व्यापारी डैशबोर्ड 🏢',
    buyerIntro: 'फसलें खोजें, खरीद प्रस्ताव भेजें, काउंटर-ऑफर स्वीकारें और एस्क्रो में भुगतान सुरक्षित रखें।',
    buyerNote: 'आप सुरक्षित व्यापारी खाते का उपयोग कर रहे हैं। सभी प्रस्ताव और ऑर्डर एग्रीस्मार्ट बैकएंड पर सुरक्षित रहते हैं।',
    availCrops: '🌾 उपलब्ध फसलें',
    inPriceCatalog: 'मूल्य सूची में उपलब्ध',
    myOrders: '📦 मेरे ऑर्डर',
    activeOffers: '🤝 सक्रिय प्रस्ताव',
    savedInApp: 'सक्रिय बोलियां',
    completedCard: '✅ पूर्ण ऑर्डर',
    deliveredOrders: 'पहुंचे हुए ऑर्डर',
    availCropsHeading: 'उपलब्ध फसलों की सूची',
    availCropsSub: 'मंडी डेटासेट से भाव संदर्भ।',
    searchCropsPlaceholder: 'फसल खोजें…',
    compareAllMandis: 'सभी मंडी भावों की तुलना करें',
    makeOffer: 'प्रस्ताव भेजें',
    expectedPriceRef: 'अपेक्षित मूल्य संदर्भ:',
    highestSamplePrice: 'सर्वोच्च मंडी भाव:',
    yieldShort: 'पैदावार:',
    loadingCrops: 'एग्रीस्मार्ट बैकएंड से फसलें लोड हो रही हैं…',
    noCropsFound: 'कोई मेल खाती फसल नहीं मिली।',
    makeOfferDialogTitle: 'खरीद प्रस्ताव भेजें',
    makeOfferDialogSub: 'पंजीकृत किसान को फसल, मात्रा, भाव और अग्रिम बोनस के साथ प्रस्ताव भेजें।',
    sendToFarmer: 'किसान चुनें',
    quantityQuintals: 'मात्रा (क्विंटल)',
    baseOfferPrice: 'आपका मूल भाव (₹ प्रति क्विंटल)',
    earlyBonus: 'अतिरिक्त शीघ्र-डिलीवरी बोनस (₹ प्रति क्विंटल)',
    deliverByDate: 'डिलीवरी की तिथि (बोनस के लिए अनिवार्य)',
    totalIfOnTime: 'समय पर डिलीवरी पर कुल भाव: {price} / क्विंटल · कुल बोनस: {bonus}',
    cancel: 'रद्द करें',
    saveOffer: 'प्रस्ताव भेजें',
    sentOffersHeading: 'भेजे गए प्रस्ताव एवं मोलभाव',
    sentOffersSub: 'किसान द्वारा जवाब देने या नया भाव (काउंटर) भेजने पर स्थिति अपडेट होती है।',
    refreshStatus: 'स्थिति रिफ्रेश करें',
    noOffersSent: 'आपने अभी तक कोई प्रस्ताव नहीं भेजा है।',
    toFarmer: 'किसान:',
    payEscrow: '💳 एस्क्रो में जमा करें (UPI QR)',
    notifications: 'सूचनाएं (नोटिफ़िकेशन)',
    notificationsSub: 'किसानों से प्रस्ताव एवं ऑर्डर के अपडेट।',
    markAllRead: 'सभी को पढ़ा हुआ चिन्हित करें',
    noNotifications: 'कोई नई सूचना नहीं है।',
    buyerDisclaimer: 'मंडी भाव केवल संदर्भ के लिए हैं। ऑर्डर समझौता, भुगतान और डिलीवरी की स्थिति ट्रैक की जाती है।',

    // Auth Page
    authWelcome: 'स्वागत है',
    authSubLogin: 'अपने एग्रीस्मार्ट खाते में लॉगिन करें।',
    authSubOtp: 'ईमेल पर प्राप्त 6-अंकों के ओटीपी से सुरक्षित व त्वरित लॉगिन।',
    authCreate: 'नया खाता बनाएं',
    authSubRegister: 'सुरक्षित किसान या व्यापारी खाता बनाएं।',
    tabLogin: 'लॉगिन',
    tabOtpLogin: '✉️ ईमेल ओटीपी लॉगिन',
    tabPasswordLogin: '🔑 पासवर्ड लॉगिन',
    tabRegister: 'खाता बनाएं',
    name: 'नाम',
    email: 'ईमेल',
    password: 'पासवर्ड (कम से कम 8 अक्षर)',
    accountType: 'खाते का प्रकार',
    roleFarmer: 'किसान (Farmer)',
    roleBuyer: 'व्यापारी (Buyer)',
    district: 'जिला',
    submitLogin: 'लॉगिन करें',
    submitRegister: 'खाता बनाएं',
    sendOtpBtn: 'ईमेल पर ओटीपी भेजें',
    resendOtpBtn: 'पुनः ओटीपी भेजें',
    otpLabel: '6-अंकों का ओटीपी दर्ज करें',
    otpPlaceholder: 'जैसे 123456',
    verifyOtpBtn: 'ओटीपी सत्यापित कर लॉगिन करें',
    otpSentMsg: 'ओटीपी कोड आपके ईमेल पर भेजा गया है! (10 मिनट के लिए मान्य)',
    otpDevHint: 'लोकल/डेमो मोड ओटीपी कोड: ',
    autofillOtp: 'ओटीपी स्वतः भरें',
    waitCountdown: '{s} सेकंड में पुनः भेजें',
    backHome: '← एग्रीस्मार्ट होम पर वापस जाएं',

    // Produce Marketplace & Listings
    tabListings: '🌾 फसल बिक्री केंद्र',
    postProduceTitle: 'फसल बिक्री सूची जोड़ें',
    postProduceSub: 'अपनी उपलब्ध फसल की मात्रा दर्ज करें ताकि व्यापारी सीधे खरीद प्रस्ताव भेज सकें।',
    cropVariety: 'किस्म / ग्रेड (जैसे शरबती, देसी)',
    expectedPrice: 'अपेक्षित भाव (₹/क्विंटल)',
    harvestDate: 'कटाई / तैयार होने की तारीख',
    listingNotes: 'गुणवत्ता व डिलीवरी विवरण',
    submitListing: 'फसल बिक्री प्रकाशित करें',
    myListings: 'मेरी सक्रिय फसल सूचियां',
    noListingsYet: 'अभी तक कोई फसल बिक्री सूची प्रकाशित नहीं की गई है।',
    deleteListing: 'सूची हटाएं',
    browseMarketplace: 'उपलब्ध किसान फसलें (मंडी बाज़ार)',
    browseMarketplaceSub: 'स्थानीय किसानों द्वारा सीधे बिक्री हेतु उपलब्ध फसलें।',
    makeOffer: 'खरीद प्रस्ताव भेजें',
    noMarketplaceListings: 'वर्तमान में कोई फसल सूची उपलब्ध नहीं है।',

    // Government Schemes
    govSchemes: '🏛️ सरकारी योजनाएं व कृषि सब्सिडी',
    govSchemesSub: 'किसानों के लिए केंद्र व राज्य सरकार की कल्याणकारी योजनाएं।',
    schemeIncomeBadge: 'सीधी आय सहायता',
    schemePmKisan: 'पीएम-किसान सम्मान निधि',
    schemePmKisanDesc: 'यह योजना पात्र किसान परिवारों को आय सहायता दे सकती है। वर्तमान नियम और पात्रता आधिकारिक पोर्टल पर जांचें।',
    schemeInsuranceBadge: 'फसल बीमा',
    schemePmFby: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    schemePmFbyDesc: 'बीमा के नियम, पात्र फसलें और प्रीमियम बदल सकते हैं। वर्तमान जानकारी आधिकारिक पोर्टल पर देखें।',
    schemeMachineryBadge: 'कृषि यंत्र सब्सिडी',
    schemeMachinery: 'एमपी कृषि यंत्र अनुदान',
    schemeMachineryDesc: 'उपलब्धता, पात्र उपकरण और अनुदान दरें बदल सकती हैं। राज्य के आधिकारिक पोर्टल पर जांचें।',
    schemeCreditBadge: 'संस्थागत ऋण',
    schemeKcc: 'किसान क्रेडिट कार्ड (KCC)',
    schemeKccDesc: 'ऋण सीमा, ब्याज और पात्रता वर्तमान नियमों तथा ऋणदाता पर निर्भर हैं। आधिकारिक जानकारी देखें।',
    schemeEligibility: 'पात्रता के नियम बदल सकते हैं। आधिकारिक पोर्टल पर जांचें।',
    kisanCallBadge: 'किसान कॉल सेंटर',
    kisanCallTitle: 'राष्ट्रीय किसान कॉल सेंटर (KCC)',
    kisanCallDesc: 'खेती संबंधी प्रश्नों के लिए आधिकारिक हेल्पलाइन से संपर्क करें। कॉल से पहले उपलब्धता जांचें।',
    kisanCallHours: 'वर्तमान समय और भाषाओं के लिए आधिकारिक स्रोत देखें।',
    callOfficialHelpline: 'आधिकारिक हेल्पलाइन पर कॉल करें',
    kvkBadge: 'कृषि विस्तार केंद्र',
    kvkTitle: 'KVK सीहोर (कृषि विज्ञान केंद्र)',
    kvkDesc: 'जाने से पहले संस्था से संपर्क विवरण और सेवाओं की पुष्टि करें।',
    kvkAddress: 'KVK अनुसंधान फार्म, सीहोर (म.प्र.)',
    contactKvk: 'KVK सीहोर से संपर्क करें',
    icarBadge: 'ICAR संस्थान',
    icarTitle: 'ICAR - CIAE भोपाल',
    icarDesc: 'जाने से पहले संस्था से संपर्क विवरण और सेवाओं की पुष्टि करें।',
    icarAddress: 'नबी बाग, बेरसिया रोड, भोपाल (म.प्र.)',
    contactIcar: 'ICAR भोपाल से संपर्क करें',
    checkEligibility: 'आधिकारिक पोर्टल →',
    
    // Helplines & Support
    kisanHelplines: '☎️ किसान हेल्पलाइन व कृषि वैज्ञानिक संपर्क',
    kisanHelplinesSub: 'कृषि वैज्ञानिकों व सरकारी कॉल सेंटर से 24x7 सीधी सहायता।',
    
    // Invoice / Bill
    printReceipt: '🧾 मंडी पर्ची प्रिंट करें',
    mandiInvoice: 'एग्रीस्मार्ट अधिकृत मंडी विक्रय पर्ची'
  }
};

let savedLanguage = 'hi';
try { savedLanguage = localStorage.getItem('agrismart-lang') || 'hi'; } catch {}
window.currentLanguage = savedLanguage === 'en' || savedLanguage === 'hi' ? savedLanguage : 'hi';

window.t = function(key) {
  const lang = window.currentLanguage || 'hi';
  const dict = window.i18nDictionary[lang] || window.i18nDictionary.en;
  if (dict && dict[key] !== undefined) return dict[key];
  if (window.i18nDictionary.en && window.i18nDictionary.en[key] !== undefined) return window.i18nDictionary.en[key];
  return key;
};

window.setLanguage = function(lang) {
  if (lang !== 'en' && lang !== 'hi') lang = 'hi';
  window.currentLanguage = lang;
  try {
    localStorage.setItem('agrismart-lang', lang);
  } catch (e) {}

  window.applyTranslations();

  // Notify any listeners
  try {
    document.dispatchEvent(new CustomEvent('agrismart-lang-changed', { detail: { lang } }));
  } catch (e) {}
};

window.applyTranslations = function() {
  const lang = window.currentLanguage || 'hi';
  document.documentElement.lang = lang;

  // Translate static text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = window.t(key);
    if (val !== undefined && val !== null) {
      if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
        el.value = val;
      } else {
        el.innerHTML = val;
      }
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = window.t(key);
    if (val) {
      el.setAttribute('placeholder', val);
    }
  });

  // Translate titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = window.t(key);
    if (val) {
      el.setAttribute('title', val);
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    const val = window.t(key);
    if (val) el.setAttribute('aria-label', val);
  });

  // Synchronize language dropdowns and toggle buttons
  document.querySelectorAll('.lang-select, #langSelect, #langSwitcher').forEach(sel => {
    sel.value = lang;
  });

  document.querySelectorAll('#langToggle, .lang-toggle-btn').forEach(btn => {
    btn.textContent = lang === 'hi' ? 'English' : 'हिंदी';
    btn.setAttribute('title', lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें');
  });
};

// Listen for storage changes from other browser tabs
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', e => {
    if (e.key === 'agrismart-lang' && ['en', 'hi'].includes(e.newValue) && e.newValue !== window.currentLanguage) {
      window.currentLanguage = e.newValue;
      window.applyTranslations();
      document.dispatchEvent(new CustomEvent('agrismart-lang-changed', { detail: { lang: e.newValue } }));
    }
  });
}

// Run translation immediately upon execution & when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.applyTranslations);
} else {
  window.applyTranslations();
}
