import type {
  Product,
  Customer,
  Order,
  Employee,
  DeliveryAgent,
  Delivery,
  Supplier,
  PurchaseOrder,
  ServiceRequest,
  Testimonial,
  PromoBanner,
  Branch,
  MembershipTier,
  OrderStatus,
  PaymentMethod,
  Address,
  ProductReview,
  BranchPerformance,
  DashboardStats,
} from "@/types";
import {
  BRANCHES,
  CATEGORIES,
  CATEGORY_BRANDS,
  PRODUCT_TEMPLATES,
  FIRST_NAMES,
  LAST_NAMES,
  KERALE_CITIES,
  PRODUCT_IMAGES,
  BRANCH_COORDS,
} from "./constants";
import { slugify, calcDiscount } from "@/lib/utils";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 1) {
  return parseFloat((rand() * (max - min) + min).toFixed(decimals));
}

/** Fixed demo epoch so SSR and client hydrate with identical dates */
const DEMO_NOW = new Date("2026-07-14T12:00:00.000Z");

function randomDate(daysBack: number) {
  const d = new Date(DEMO_NOW);
  d.setDate(d.getDate() - randInt(0, daysBack));
  return d.toISOString();
}

function generateBarcode() {
  return `890${randInt(1000000000, 9999999999)}`;
}

function generateSku(brand: string, cat: string, i: number) {
  return `HR-${brand.slice(0, 3).toUpperCase()}-${cat.slice(0, 3).toUpperCase()}-${String(i).padStart(4, "0")}`;
}

function generateBranchStock(): Record<Branch, number> {
  const stock = {} as Record<Branch, number>;
  for (const b of BRANCHES) {
    stock[b] = randInt(0, 45);
  }
  return stock;
}

function generateSpecs(labels: string[]): { label: string; value: string }[] {
  const values: Record<string, string[]> = {
    Resolution: ["4K UHD", "Full HD", "8K", "HD Ready"],
    "Refresh Rate": ["60Hz", "120Hz", "144Hz"],
    HDR: ["HDR10", "HDR10+", "Dolby Vision"],
    "Smart OS": ["Tizen", "webOS", "Android TV", "Google TV"],
    "HDMI Ports": ["2", "3", "4"],
    "Speaker Output": ["20W", "40W", "60W"],
    Capacity: ["190L", "253L", "308L", "450L", "6.5kg", "8kg", "10kg"],
    "Energy Rating": ["3 Star", "4 Star", "5 Star"],
    Compressor: ["Digital Inverter", "Linear Inverter", "Reciprocating"],
    Shelves: ["3", "4", "5"],
    "Door Type": ["Single", "Double", "Side-by-Side"],
    Defrost: ["Frost Free", "Manual"],
    RPM: ["700", "1000", "1200", "1400"],
    "Wash Programs": ["10", "12", "15"],
    "Motor Type": ["Inverter", "Direct Drive", "Standard"],
    "Water Level": ["Auto", "Manual"],
    Tonnage: ["1 Ton", "1.5 Ton", "2 Ton"],
    "Cooling Capacity": ["3400W", "5100W", "6800W"],
    "I-Feel": ["Yes", "No"],
    Filter: ["Anti-Bacterial", "PM 2.5", "HEPA"],
    "Noise Level": ["22dB", "26dB", "32dB"],
    Display: ['6.1" AMOLED', '6.7" OLED', '6.5" AMOLED', '14" FHD', '15.6" FHD'],
    Processor: ["Snapdragon 8 Gen 3", "A17 Pro", "Dimensity 9200", "Intel i5", "Intel i7", "Ryzen 7", "M3"],
    RAM: ["8GB", "12GB", "16GB", "32GB"],
    Storage: ["128GB", "256GB", "512GB", "1TB"],
    Camera: ["50MP Triple", "48MP Dual", "108MP Quad"],
    Battery: ["5000mAh", "4500mAh", "6000mAh", "70Wh"],
    Graphics: ["Integrated", "RTX 4050", "RTX 4060", "Iris Xe"],
    Power: ["750W", "900W", "1200W", "2000W"],
    Material: ["Stainless Steel", "ABS", "Glass"],
    Jars: ["3", "4"],
    Modes: ["8", "10", "15"],
    Warranty: ["1 Year", "2 Years", "5 Years"],
    Connectivity: ["WiFi", "Zigbee", "Bluetooth", "WiFi+BLE"],
    Sensor: ["Motion", "PIR", "Temperature", "Humidity"],
    "App Support": ["iOS & Android", "Alexa & Google"],
    Range: ["10m", "30m", "100m"],
    "Output Power": ["20W", "40W", "100W", "200W"],
    "Driver Size": ["10mm", "40mm", "50mm"],
    Bluetooth: ["5.0", "5.2", "5.3"],
    Frequency: ["20Hz-20kHz"],
    Impedance: ["32 Ohm", "16 Ohm"],
    Coverage: ["200 sq ft", "500 sq ft", "1000 sq ft"],
    "Tank Capacity": ["1.5L", "2L", "8L"],
    "Filter Type": ["RO+UV", "UF", "HEPA H13"],
    "Speed Settings": ["3", "5"],
    Weight: ["1.2kg", "2.5kg", "5kg"],
    Attachments: ["4", "8", "12"],
    "Heat Settings": ["3", "5"],
    Runtime: ["60 min", "90 min", "120 min"],
    Waterproof: ["IPX4", "IPX7", "IP68"],
  };

  return labels.map((label) => ({
    label,
    value: pick(values[label] || ["Standard"]),
  }));
}

export function generateProducts(count = 520): Product[] {
  const products: Product[] = [];
  let idx = 1;

  for (const cat of CATEGORIES) {
    const template = PRODUCT_TEMPLATES[cat.slug];
    if (!template) continue;
    const brands = CATEGORY_BRANDS[cat.slug] || ["Samsung"];
    const perCat = Math.ceil(count / CATEGORIES.length);

    for (let i = 0; i < perCat; i++) {
      const brand = pick(brands);
      const prefix = pick(template.prefixes);
      const model = pick(template.models);
      const name = `${brand} ${prefix} ${model}`;
      const [minP, maxP] = template.priceRange;
      const mrp = randInt(minP, maxP);
      const discountPct = randInt(5, 40);
      const price = Math.round(mrp * (1 - discountPct / 100));
      const images = PRODUCT_IMAGES[cat.slug] || PRODUCT_IMAGES.televisions;
      const branchStock = generateBranchStock();
      const totalStock = Object.values(branchStock).reduce((a, b) => a + b, 0);

      products.push({
        id: `prod-${String(idx).padStart(4, "0")}`,
        name,
        slug: slugify(`${name}-${idx}`),
        brand,
        category: cat.name,
        categorySlug: cat.slug,
        description: `Experience premium quality with the ${name}. Designed for modern Indian homes, this ${cat.name.toLowerCase().slice(0, -1)} delivers exceptional performance, energy efficiency, and stylish design. Available across all Highrange stores in Idukki.`,
        shortDescription: `${brand} ${prefix} – ${model} with advanced features for everyday excellence.`,
        price,
        mrp,
        discount: calcDiscount(mrp, price),
        rating: randFloat(3.5, 4.9),
        reviewCount: randInt(12, 2500),
        stock: totalStock,
        sku: generateSku(brand, cat.slug, idx),
        barcode: generateBarcode(),
        images: pickN(images, Math.min(3, images.length)).concat(images[0]),
        specs: generateSpecs(template.specs),
        features: pickN(template.features, 4),
        tags: pickN(["Best Seller", "New Arrival", "Energy Efficient", "Smart", "Premium", "Value Buy"], randInt(1, 3)),
        isFeatured: rand() > 0.85,
        isTrending: rand() > 0.8,
        isBestSeller: rand() > 0.82,
        isFlashSale: rand() > 0.9,
        emiFrom: Math.round(price / 12),
        warranty: pick(["1 Year", "2 Years", "3 Years", "5 Years on Compressor"]),
        energyRating: ["refrigerators", "washing-machines", "air-conditioners"].includes(cat.slug)
          ? pick(["3 Star", "4 Star", "5 Star"])
          : undefined,
        branchStock,
        createdAt: randomDate(365),
      });
      idx++;
    }
  }

  return products.slice(0, count);
}

function generateAddress(name: string, phone: string): Address {
  return {
    id: `addr-${randInt(1000, 9999)}`,
    label: pick(["Home", "Office", "Other"]),
    name,
    phone,
    line1: `${randInt(1, 99)}, ${pick(["Temple Road", "Main Street", "Market Road", "Civil Station Road", "NH Bypass"])}`,
    line2: pick(["Near Bus Stand", "Opposite Church", "Behind Temple", ""]),
    city: pick(KERALE_CITIES),
    state: "Kerala",
    pincode: String(randInt(685501, 685590)),
    isDefault: true,
  };
}

export function generateCustomers(count = 1050): Customer[] {
  const tiers: MembershipTier[] = ["Bronze", "Silver", "Gold", "Platinum"];
  const segments = ["Regular", "Premium", "Wholesale", "New", "Inactive", "VIP"];
  const customers: Customer[] = [];

  for (let i = 1; i <= count; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const name = `${first} ${last}`;
    const phone = `9${randInt(100000000, 999999999)}`;
    const orderCount = randInt(0, 45);
    const avgOrder = randInt(5000, 80000);
    const tier = orderCount > 20 ? pick(["Gold", "Platinum"] as MembershipTier[]) : pick(tiers);

    customers.push({
      id: `cust-${String(i).padStart(4, "0")}`,
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@email.com`,
      phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${first}${i}`,
      tier,
      loyaltyPoints: randInt(0, 15000),
      totalSpent: orderCount * avgOrder,
      orderCount,
      addresses: [generateAddress(name, phone)],
      segment: pick(segments),
      preferredBranch: pick(BRANCHES),
      joinedAt: randomDate(730),
      lastPurchase: orderCount > 0 ? randomDate(90) : undefined,
    });
  }
  return customers;
}

export function generateOrders(products: Product[], customers: Customer[], count = 250): Order[] {
  const statuses: OrderStatus[] = [
    "pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned",
  ];
  const payments: PaymentMethod[] = ["upi", "card", "netbanking", "cod", "emi", "wallet"];
  const orders: Order[] = [];

  for (let i = 1; i <= count; i++) {
    const customer = pick(customers);
    const itemCount = randInt(1, 4);
    const items = pickN(products, itemCount).map((p) => ({
      productId: p.id,
      productName: p.name,
      quantity: randInt(1, 2),
      price: p.price,
      image: p.images[0],
    }));
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const discount = randInt(0, Math.min(5000, Math.floor(subtotal * 0.15)));
    const deliveryCharge = subtotal > 10000 ? 0 : 199;
    const tax = Math.round((subtotal - discount) * 0.18);
    const total = subtotal - discount + deliveryCharge + tax;
    const status = pick(statuses);
    const createdAt = randomDate(180);

    orders.push({
      id: `ord-${String(i).padStart(4, "0")}`,
      orderNumber: `HR${DEMO_NOW.getFullYear()}${String(i).padStart(6, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      items,
      subtotal,
      discount,
      deliveryCharge,
      tax,
      total,
      status,
      paymentMethod: pick(payments),
      paymentStatus: status === "cancelled" ? "failed" : status === "returned" ? "refunded" : pick(["paid", "paid", "paid", "pending"]),
      shippingAddress: customer.addresses[0],
      branch: pick(BRANCHES),
      createdAt,
      deliveredAt: status === "delivered" ? randomDate(30) : undefined,
      invoiceNumber: `INV-HR-${String(i).padStart(6, "0")}`,
    });
  }
  return orders;
}

export function generateEmployees(count = 55): Employee[] {
  const roles = ["admin", "manager", "sales", "inventory", "delivery", "technician", "accountant", "cashier"] as const;
  const depts = ["Management", "Sales", "Operations", "Logistics", "Service", "Finance", "HR"];
  const shifts = ["Morning (9AM-5PM)", "Evening (1PM-9PM)", "Full Day (10AM-7PM)"];
  const employees: Employee[] = [];

  for (let i = 1; i <= count; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const role = pick([...roles]);

    employees.push({
      id: `emp-${String(i).padStart(3, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@highrange.in`,
      phone: `9${randInt(100000000, 999999999)}`,
      role,
      department: pick(depts),
      branch: pick(BRANCHES),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=emp${i}`,
      salary: randInt(18000, 85000),
      joinDate: randomDate(1500),
      status: pick(["active", "active", "active", "on_leave", "inactive"]),
      attendanceToday: pick(["present", "present", "present", "late", "absent", "half_day"]),
      performanceScore: randFloat(3.0, 5.0),
      shift: pick(shifts),
    });
  }
  return employees;
}

export function generateDeliveryAgents(count = 24): DeliveryAgent[] {
  const vehicles = [
    { type: "Bike", prefix: "KL" },
    { type: "Van", prefix: "KL" },
    { type: "Mini Truck", prefix: "KL" },
  ];
  const agents: DeliveryAgent[] = [];

  for (let i = 1; i <= count; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const vehicle = pick(vehicles);
    const branch = pick(BRANCHES);
    const coords = BRANCH_COORDS[branch];

    agents.push({
      id: `da-${String(i).padStart(3, "0")}`,
      name: `${first} ${last}`,
      phone: `9${randInt(100000000, 999999999)}`,
      vehicleType: vehicle.type,
      vehicleNumber: `${vehicle.prefix}-${randInt(10, 99)}-${String.fromCharCode(65 + randInt(0, 25))}${String.fromCharCode(65 + randInt(0, 25))}-${randInt(1000, 9999)}`,
      branch,
      status: pick(["available", "on_delivery", "on_delivery", "off_duty"]),
      rating: randFloat(3.8, 5.0),
      deliveriesToday: randInt(0, 12),
      totalDeliveries: randInt(50, 2000),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=da${i}`,
      currentLocation: {
        lat: coords.lat + (rand() - 0.5) * 0.05,
        lng: coords.lng + (rand() - 0.5) * 0.05,
      },
    });
  }
  return agents;
}

export function generateDeliveries(
  orders: Order[],
  agents: DeliveryAgent[],
  count = 80
): Delivery[] {
  const statuses = ["assigned", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"] as const;
  const deliveries: Delivery[] = [];
  const eligible = orders.filter((o) =>
    ["shipped", "out_for_delivery", "delivered", "processing"].includes(o.status)
  );

  for (let i = 1; i <= Math.min(count, eligible.length); i++) {
    const order = eligible[i - 1] || pick(orders);
    const agent = pick(agents);
    const status = pick([...statuses]);
    const createdAt = randomDate(14);

    deliveries.push({
      id: `del-${String(i).padStart(3, "0")}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.shippingAddress.phone,
      agentId: agent.id,
      agentName: agent.name,
      status,
      branch: order.branch,
      address: `${order.shippingAddress.line1}, ${order.shippingAddress.city}`,
      pincode: order.shippingAddress.pincode,
      estimatedTime: pick(["30 mins", "45 mins", "1 hour", "2 hours", "Today by 6 PM"]),
      otp: String(randInt(1000, 9999)),
      distance: randFloat(1, 35, 1),
      createdAt,
      timeline: [
        { status: "Order Confirmed", time: createdAt, note: "Order ready for dispatch" },
        { status: "Assigned to Agent", time: createdAt, note: `Assigned to ${agent.name}` },
        ...(status !== "assigned"
          ? [{ status: "Picked Up", time: createdAt, note: "Package collected from warehouse" }]
          : []),
        ...(status === "delivered"
          ? [{ status: "Delivered", time: createdAt, note: "OTP verified & delivered" }]
          : []),
      ],
    });
  }
  return deliveries;
}

export function generateSuppliers(count = 14): Supplier[] {
  const names = [
    "Kerala Distributors Pvt Ltd",
    "South India Electronics",
    "Digital Hub Wholesale",
    "Appliance World Traders",
    "TechZone Distributors",
    "Home Comfort Supplies",
    "Galaxy Mobile Distributors",
    "Cool Air Systems Ltd",
    "Kitchen Pro Wholesale",
    "Smart Life Electronics",
    "Eastern Gadgets Co",
    "Premium Appliance Hub",
    "Idukki Trade Links",
    "Malabar Electronics Mart",
    "Coastal Distributors",
  ];
  const categories = CATEGORIES.map((c) => c.name);

  return names.slice(0, count).map((name, i) => ({
    id: `sup-${String(i + 1).padStart(3, "0")}`,
    name,
    contactPerson: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    email: `contact@${slugify(name).slice(0, 15)}.com`,
    phone: `9${randInt(100000000, 999999999)}`,
    categories: pickN(categories, randInt(2, 5)),
    rating: randFloat(3.5, 5.0),
    paymentTerms: pick(["Net 30", "Net 45", "Net 15", "Advance 50%"]),
    totalOrders: randInt(20, 500),
    outstanding: randInt(0, 500000),
    status: pick(["active", "active", "active", "inactive"]),
  }));
}

export function generatePurchaseOrders(suppliers: Supplier[], count = 40): PurchaseOrder[] {
  return Array.from({ length: count }, (_, i) => {
    const supplier = pick(suppliers);
    const items = Array.from({ length: randInt(2, 6) }, () => ({
      productName: pick([
        "Samsung 55\" Crystal UHD",
        "LG 253L Refrigerator",
        "Voltas 1.5 Ton AC",
        "Whirlpool 7kg Washing Machine",
        "Sony Soundbar 2.1",
        "Philips Mixer Grinder",
      ]),
      quantity: randInt(5, 50),
      unitPrice: randInt(5000, 80000),
    }));
    const total = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

    return {
      id: `po-${String(i + 1).padStart(3, "0")}`,
      poNumber: `PO-HR-${String(i + 1).padStart(5, "0")}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      items,
      total,
      status: pick(["draft", "sent", "confirmed", "received", "cancelled"]),
      branch: pick(BRANCHES),
      createdAt: randomDate(90),
      expectedDate: randomDate(-30),
    };
  });
}

export function generateServiceRequests(customers: Customer[], employees: Employee[], count = 60): ServiceRequest[] {
  const types = ["repair", "installation", "warranty", "amc", "maintenance"] as const;
  const statuses = ["open", "assigned", "in_progress", "awaiting_parts", "completed", "cancelled"] as const;
  const priorities = ["low", "medium", "high", "urgent"] as const;
  const techs = employees.filter((e) => e.role === "technician");
  const products = [
    "Samsung Refrigerator", "LG Washing Machine", "Voltas AC", "Sony Bravia TV",
    "Whirlpool Microwave", "Bosch Dishwasher", "Haier AC", "Godrej Refrigerator",
  ];

  return Array.from({ length: count }, (_, i) => {
    const customer = pick(customers);
    const status = pick([...statuses]);
    const tech = techs.length ? pick(techs) : undefined;

    return {
      id: `srv-${String(i + 1).padStart(3, "0")}`,
      ticketNumber: `SR-HR-${String(i + 1).padStart(5, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      productName: pick(products),
      type: pick([...types]),
      status,
      priority: pick([...priorities]),
      technicianId: status !== "open" ? tech?.id : undefined,
      technicianName: status !== "open" ? tech?.name : undefined,
      branch: pick(BRANCHES),
      description: pick([
        "Not cooling properly",
        "Unusual noise during operation",
        "Display not working",
        "Installation required at home",
        "Warranty claim for compressor",
        "AMC renewal and servicing",
        "Water leakage issue",
        "Remote not pairing",
      ]),
      createdAt: randomDate(60),
      scheduledDate: status !== "open" && status !== "cancelled" ? randomDate(-7) : undefined,
    };
  });
}

export function generateReviews(count = 50): ProductReview[] {
  const comments = [
    "Excellent product! Very happy with the purchase from Highrange.",
    "Good value for money. Delivery was prompt.",
    "Installation team was professional. Product works great.",
    "Quality is top notch. Highly recommend.",
    "Slight delay in delivery but product is perfect.",
    "Best electronics store in Idukki. Shopping here for years.",
    "EMI options made it affordable. Great experience.",
    "After-sales service is impressive.",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `rev-${i + 1}`,
    userName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES).charAt(0)}.`,
    rating: randInt(3, 5),
    title: pick(["Great buy!", "Worth it", "Excellent", "Good product", "Satisfied"]),
    comment: pick(comments),
    date: randomDate(120),
    verified: rand() > 0.3,
    helpful: randInt(0, 50),
  }));
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya Menon",
    role: "Homeowner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    rating: 5,
    comment: "Bought our entire home appliance set from Highrange. From TV to AC – seamless experience and excellent service!",
    location: "Kattappana",
  },
  {
    id: "t2",
    name: "Rahul Joseph",
    role: "Business Owner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    rating: 5,
    comment: "Their delivery to Munnar was surprisingly fast. Staff is knowledgeable and pricing is competitive.",
    location: "Munnar",
  },
  {
    id: "t3",
    name: "Priya Thomas",
    role: "Teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
    comment: "The EMI options and exchange offers made upgrading our fridge so easy. Highly recommend!",
    location: "Thodupuzha",
  },
  {
    id: "t4",
    name: "Vikram Nair",
    role: "Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    rating: 4,
    comment: "Service center response was quick when our washing machine needed repair. Genuine parts and fair pricing.",
    location: "Kumily",
  },
];

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: "banner-1",
    title: "Summer Cool Sale",
    subtitle: "Up to 40% off on ACs & Refrigerators",
    cta: "Shop Now",
    href: "/products?category=air-conditioners",
    image: "https://images.unsplash.com/photo-1631545806609-cbbcf37fcff3?w=1400&h=600&fit=crop",
    gradient: "from-teal-900/90 via-teal-800/70 to-transparent",
  },
  {
    id: "banner-2",
    title: "Smart Living Festival",
    subtitle: "Upgrade your home with latest Smart TVs & IoT devices",
    cta: "Explore",
    href: "/products?category=televisions",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1400&h=600&fit=crop",
    gradient: "from-slate-900/90 via-slate-800/70 to-transparent",
  },
  {
    id: "banner-3",
    title: "No Cost EMI Available",
    subtitle: "Buy now, pay later on select products – interest free",
    cta: "View Offers",
    href: "/products?sort=emi",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=600&fit=crop",
    gradient: "from-orange-900/90 via-orange-800/60 to-transparent",
  },
];

export function getDashboardStats(orders: Order[], products: Product[], deliveries: Delivery[], employees: Employee[]): DashboardStats {
  const delivered = orders.filter((o) => o.status === "delivered");
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const present = employees.filter((e) => e.attendanceToday === "present" || e.attendanceToday === "late").length;

  return {
    totalSales: delivered.length,
    revenue,
    orders: orders.length,
    deliveries: deliveries.length,
    inventoryValue,
    pendingDeliveries: deliveries.filter((d) => !["delivered", "failed", "returned"].includes(d.status)).length,
    attendanceRate: Math.round((present / employees.length) * 100),
    customerSatisfaction: 4.6,
    salesChange: 12.4,
    revenueChange: 18.2,
    ordersChange: 8.7,
  };
}

export function getBranchPerformance(orders: Order[], products: Product[], employees: Employee[]): BranchPerformance[] {
  return BRANCHES.map((branch) => {
    const branchOrders = orders.filter((o) => o.branch === branch && o.status === "delivered");
    return {
      branch,
      sales: branchOrders.reduce((s, o) => s + o.total, 0),
      orders: branchOrders.length,
      inventory: products.reduce((s, p) => s + (p.branchStock[branch] || 0), 0),
      employees: employees.filter((e) => e.branch === branch).length,
      satisfaction: randFloat(4.0, 4.9),
    };
  });
}

// Pre-generate all data as singletons
export const PRODUCTS = generateProducts(520);
export const CUSTOMERS = generateCustomers(1050);
export const ORDERS = generateOrders(PRODUCTS, CUSTOMERS, 250);
export const EMPLOYEES = generateEmployees(55);
export const DELIVERY_AGENTS = generateDeliveryAgents(24);
export const DELIVERIES = generateDeliveries(ORDERS, DELIVERY_AGENTS, 80);
export const SUPPLIERS = generateSuppliers(14);
export const PURCHASE_ORDERS = generatePurchaseOrders(SUPPLIERS, 40);
export const SERVICE_REQUESTS = generateServiceRequests(CUSTOMERS, EMPLOYEES, 60);
export const REVIEWS = generateReviews(50);
export const DASHBOARD_STATS = getDashboardStats(ORDERS, PRODUCTS, DELIVERIES, EMPLOYEES);
export const BRANCH_PERFORMANCE = getBranchPerformance(ORDERS, PRODUCTS, EMPLOYEES);

export const CATEGORIES_WITH_COUNTS = CATEGORIES.map((c) => ({
  ...c,
  productCount: PRODUCTS.filter((p) => p.categorySlug === c.slug).length,
}));
