import type { Branch, Category, Brand } from "@/types";

export const BRANCHES: Branch[] = [
  "Kattappana",
  "Thodupuzha",
  "Munnar",
  "Kumily",
  "Adimali",
  "Nedumkandam",
];

export const BRANCH_COORDS: Record<Branch, { lat: number; lng: number; address: string }> = {
  Kattappana: { lat: 9.755, lng: 77.115, address: "NH 185, Kattappana, Idukki" },
  Thodupuzha: { lat: 9.895, lng: 76.715, address: "Municipal Road, Thodupuzha" },
  Munnar: { lat: 10.089, lng: 77.062, address: "Old Munnar Road, Munnar" },
  Kumily: { lat: 9.605, lng: 77.165, address: "Thekkady Road, Kumily" },
  Adimali: { lat: 10.012, lng: 76.958, address: "Main Bazaar, Adimali" },
  Nedumkandam: { lat: 9.833, lng: 77.155, address: "Market Junction, Nedumkandam" },
};

export const CATEGORIES: Category[] = [
  {
    id: "cat-01",
    name: "Televisions",
    slug: "televisions",
    description: "Smart TVs, LED, OLED & QLED displays",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
    icon: "Tv",
    productCount: 0,
  },
  {
    id: "cat-02",
    name: "Refrigerators",
    slug: "refrigerators",
    description: "Single door, double door & side-by-side",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=400&fit=crop",
    icon: "Refrigerator",
    productCount: 0,
  },
  {
    id: "cat-03",
    name: "Washing Machines",
    slug: "washing-machines",
    description: "Front load, top load & semi-automatic",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&h=400&fit=crop",
    icon: "WashingMachine",
    productCount: 0,
  },
  {
    id: "cat-04",
    name: "Air Conditioners",
    slug: "air-conditioners",
    description: "Split, window & portable ACs",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
    icon: "AirVent",
    productCount: 0,
  },
  {
    id: "cat-05",
    name: "Mobile Phones",
    slug: "mobile-phones",
    description: "Smartphones from top brands",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    icon: "Smartphone",
    productCount: 0,
  },
  {
    id: "cat-06",
    name: "Laptops",
    slug: "laptops",
    description: "Gaming, business & student laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
    icon: "Laptop",
    productCount: 0,
  },
  {
    id: "cat-07",
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    description: "Mixers, ovens, chimneys & more",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop",
    icon: "CookingPot",
    productCount: 0,
  },
  {
    id: "cat-08",
    name: "Smart Home Devices",
    slug: "smart-home",
    description: "Smart locks, bulbs, cameras & hubs",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
    icon: "Home",
    productCount: 0,
  },
  {
    id: "cat-09",
    name: "Audio Systems",
    slug: "audio-systems",
    description: "Speakers, soundbars & headphones",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=400&fit=crop",
    icon: "Speaker",
    productCount: 0,
  },
  {
    id: "cat-10",
    name: "Small Home Appliances",
    slug: "small-appliances",
    description: "Irons, vacuums, fans & heaters",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    icon: "Fan",
    productCount: 0,
  },
  {
    id: "cat-11",
    name: "Personal Care Products",
    slug: "personal-care",
    description: "Grooming kits, dryers & trimmers",
    image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=600&h=400&fit=crop",
    icon: "Sparkles",
    productCount: 0,
  },
];

export const BRANDS: Brand[] = [
  { id: "b-01", name: "Samsung", logo: "/brands/samsung.svg", productCount: 0 },
  { id: "b-02", name: "LG", logo: "/brands/lg.svg", productCount: 0 },
  { id: "b-03", name: "Sony", logo: "/brands/sony.svg", productCount: 0 },
  { id: "b-04", name: "Whirlpool", logo: "/brands/whirlpool.svg", productCount: 0 },
  { id: "b-05", name: "Bosch", logo: "/brands/bosch.svg", productCount: 0 },
  { id: "b-06", name: "Apple", logo: "/brands/apple.svg", productCount: 0 },
  { id: "b-07", name: "OnePlus", logo: "/brands/oneplus.svg", productCount: 0 },
  { id: "b-08", name: "Xiaomi", logo: "/brands/xiaomi.svg", productCount: 0 },
  { id: "b-09", name: "HP", logo: "/brands/hp.svg", productCount: 0 },
  { id: "b-10", name: "Dell", logo: "/brands/dell.svg", productCount: 0 },
  { id: "b-11", name: "Lenovo", logo: "/brands/lenovo.svg", productCount: 0 },
  { id: "b-12", name: "Philips", logo: "/brands/philips.svg", productCount: 0 },
  { id: "b-13", name: "Panasonic", logo: "/brands/panasonic.svg", productCount: 0 },
  { id: "b-14", name: "Godrej", logo: "/brands/godrej.svg", productCount: 0 },
  { id: "b-15", name: "Voltas", logo: "/brands/voltas.svg", productCount: 0 },
  { id: "b-16", name: "Haier", logo: "/brands/haier.svg", productCount: 0 },
  { id: "b-17", name: "Boat", logo: "/brands/boat.svg", productCount: 0 },
  { id: "b-18", name: "JBL", logo: "/brands/jbl.svg", productCount: 0 },
];

export const CATEGORY_BRANDS: Record<string, string[]> = {
  televisions: ["Samsung", "LG", "Sony", "Xiaomi", "OnePlus"],
  refrigerators: ["Samsung", "LG", "Whirlpool", "Godrej", "Haier", "Bosch"],
  "washing-machines": ["Samsung", "LG", "Whirlpool", "Bosch", "IFB".replace("IFB", "Haier")],
  "air-conditioners": ["Voltas", "LG", "Samsung", "Daikin".replace("Daikin", "Panasonic"), "Haier"],
  "mobile-phones": ["Samsung", "Apple", "OnePlus", "Xiaomi"],
  laptops: ["HP", "Dell", "Lenovo", "Apple", "Samsung"],
  "kitchen-appliances": ["Philips", "Bosch", "Whirlpool", "Panasonic", "Godrej"],
  "smart-home": ["Xiaomi", "Samsung", "Apple", "Philips"],
  "audio-systems": ["Sony", "JBL", "Boat", "Samsung", "LG"],
  "small-appliances": ["Philips", "Panasonic", "Godrej", "Haier"],
  "personal-care": ["Philips", "Panasonic", "Boat"],
};

export const PRODUCT_TEMPLATES: Record<
  string,
  { prefixes: string[]; models: string[]; specs: string[]; features: string[]; priceRange: [number, number] }
> = {
  televisions: {
    prefixes: ["Crystal UHD", "OLED", "QLED", "Neo QLED", "Smart LED", "4K Ultra HD"],
    models: ["55\"", "65\"", "43\"", "32\"", "75\"", "50\""],
    specs: ["Resolution", "Refresh Rate", "HDR", "Smart OS", "HDMI Ports", "Speaker Output"],
    features: ["4K HDR", "Voice Control", "Dolby Atmos", "Game Mode", "Screen Mirroring"],
    priceRange: [14999, 249999],
  },
  refrigerators: {
    prefixes: ["Frost Free", "Convertible", "Inverter", "Side-by-Side", "Multi Door"],
    models: ["190L", "253L", "308L", "360L", "450L", "570L"],
    specs: ["Capacity", "Energy Rating", "Compressor", "Shelves", "Door Type", "Defrost"],
    features: ["Digital Inverter", "Smart Connect", "Deodorizer", "Toughened Glass", "LED Lighting"],
    priceRange: [12999, 189999],
  },
  "washing-machines": {
    prefixes: ["Front Load", "Top Load", "Semi Automatic", "Fully Automatic", "Inverter"],
    models: ["6.5kg", "7kg", "8kg", "9kg", "10kg", "12kg"],
    specs: ["Capacity", "RPM", "Energy Rating", "Wash Programs", "Motor Type", "Water Level"],
    features: ["Steam Wash", "Smart Diagnosis", "Allergy Care", "Quick Wash", "Inverter Motor"],
    priceRange: [8999, 89999],
  },
  "air-conditioners": {
    prefixes: ["Split AC", "Window AC", "Inverter Split", "Convertible AC", "Smart AC"],
    models: ["1 Ton", "1.5 Ton", "2 Ton", "0.8 Ton"],
    specs: ["Tonnage", "Energy Rating", "Cooling Capacity", "I-Feel", "Filter", "Noise Level"],
    features: ["Copper Condenser", "4-Way Swing", "Anti-Bacterial Filter", "Sleep Mode", "WiFi Control"],
    priceRange: [24999, 79999],
  },
  "mobile-phones": {
    prefixes: ["Galaxy", "iPhone", "Nord", "Redmi", "Pixel"],
    models: ["Pro", "Plus", "Ultra", "5G", "SE", "Max"],
    specs: ["Display", "Processor", "RAM", "Storage", "Camera", "Battery"],
    features: ["5G", "AMOLED Display", "Fast Charging", "Wireless Charging", "IP68"],
    priceRange: [9999, 149999],
  },
  laptops: {
    prefixes: ["Pavilion", "Inspiron", "IdeaPad", "MacBook", "Galaxy Book", "VivoBook"],
    models: ["14\"", "15.6\"", "13\"", "16\"", "Pro", "Air"],
    specs: ["Processor", "RAM", "Storage", "Display", "Graphics", "Battery"],
    features: ["Backlit Keyboard", "Fingerprint", "Thunderbolt", "Full HD", "SSD"],
    priceRange: [32999, 199999],
  },
  "kitchen-appliances": {
    prefixes: ["Mixer Grinder", "Microwave", "OTG", "Chimney", "Induction Cooktop", "Air Fryer"],
    models: ["750W", "900W", "25L", "30L", "60cm", "90cm"],
    specs: ["Power", "Capacity", "Material", "Jars", "Modes", "Warranty"],
    features: ["Auto Cook", "Child Lock", "Cool Touch", "Non-Stick", "Timer"],
    priceRange: [1999, 45999],
  },
  "smart-home": {
    prefixes: ["Smart Bulb", "Smart Lock", "Security Camera", "Smart Plug", "Video Doorbell", "Hub"],
    models: ["WiFi", "Zigbee", "4K", "2K", "Pro", "Mini"],
    specs: ["Connectivity", "Resolution", "Battery", "Sensor", "App Support", "Range"],
    features: ["Alexa Compatible", "Google Home", "Motion Detection", "Night Vision", "2-Way Audio"],
    priceRange: [499, 24999],
  },
  "audio-systems": {
    prefixes: ["Soundbar", "Bluetooth Speaker", "True Wireless", "Headphones", "Home Theatre", "Neckband"],
    models: ["2.1ch", "5.1ch", "ANC", "Bass", "Pro", "Lite"],
    specs: ["Output Power", "Driver Size", "Battery", "Bluetooth", "Frequency", "Impedance"],
    features: ["Active Noise Cancel", "Dolby Atmos", "Deep Bass", "Fast Charge", "IPX7"],
    priceRange: [799, 89999],
  },
  "small-appliances": {
    prefixes: ["Steam Iron", "Vacuum Cleaner", "Ceiling Fan", "Room Heater", "Water Purifier", "Air Purifier"],
    models: ["1200W", "1400W", "48\"", "2000W", "RO+UV", "HEPA"],
    specs: ["Power", "Coverage", "Tank Capacity", "Filter Type", "Speed Settings", "Weight"],
    features: ["Auto Shut-off", "Dust Sensor", "Remote Control", "Washable Filter", "Overheat Protection"],
    priceRange: [999, 35999],
  },
  "personal-care": {
    prefixes: ["Hair Dryer", "Trimmer", "Epilator", "Straightener", "Grooming Kit", "Massager"],
    models: ["Pro", "Compact", "Travel", "Prestige", "Series 3000", "Series 5000"],
    specs: ["Power", "Attachments", "Heat Settings", "Runtime", "Waterproof", "Weight"],
    features: ["Ionic Technology", "Cool Shot", "Self-Sharpening", "Cordless", "Travel Lock"],
    priceRange: [599, 12999],
  },
};

export const FIRST_NAMES = [
  "Arjun", "Ananya", "Rahul", "Priya", "Vikram", "Meera", "Suresh", "Lakshmi",
  "Kiran", "Divya", "Ajay", "Nithya", "Ravi", "Sneha", "Manoj", "Anjali",
  "Deepak", "Kavya", "Nikhil", "Pooja", "Sanjay", "Asha", "Hari", "Rekha",
  "Vishnu", "Sowmya", "Gopal", "Indu", "Basil", "Tessy", "Jibin", "Merin",
  "Aby", "Tintu", "Nithin", "Athira", "Jithin", "Sreelakshmi", "Ashique", "Fathima",
];

export const LAST_NAMES = [
  "Nair", "Menon", "Pillai", "Kumar", "Joseph", "Thomas", "George", "Mathew",
  "Krishnan", "Rajan", "Varma", "Kurian", "Varghese", "Philip", "Abraham", "Jacob",
  "Shaji", "Babu", "Das", "Iyer", "Panicker", "Warrier", "Unni", "Chacko",
];

export const KERALE_CITIES = [
  "Kattappana", "Thodupuzha", "Munnar", "Kumily", "Adimali", "Nedumkandam",
  "Kottayam", "Ernakulam", "Thrissur", "Kollam", "Alappuzha", "Pathanamthitta",
];

/** Verified-working Unsplash photo IDs only (404s removed). */
export const PRODUCT_IMAGES: Record<string, string[]> = {
  televisions: [
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop",
  ],
  refrigerators: [
    "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop",
  ],
  "washing-machines": [
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=800&fit=crop",
  ],
  "air-conditioners": [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop",
  ],
  "mobile-phones": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop",
  ],
  laptops: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop",
  ],
  "kitchen-appliances": [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop",
  ],
  "smart-home": [
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&h=800&fit=crop",
  ],
  "audio-systems": [
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
  ],
  "small-appliances": [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop",
  ],
  "personal-care": [
    "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800&h=800&fit=crop",
  ],
};

export const COUPONS = [
  { code: "HIGHRANGE10", discount: 10, type: "percent" as const, minOrder: 5000, maxDiscount: 2000 },
  { code: "FESTIVE500", discount: 500, type: "flat" as const, minOrder: 10000, maxDiscount: 500 },
  { code: "WELCOME15", discount: 15, type: "percent" as const, minOrder: 3000, maxDiscount: 1500 },
  { code: "FREEDEL", discount: 0, type: "shipping" as const, minOrder: 0, maxDiscount: 0 },
  { code: "SUMMER20", discount: 20, type: "percent" as const, minOrder: 15000, maxDiscount: 5000 },
];
