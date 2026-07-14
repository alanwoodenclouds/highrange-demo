export type Branch =
  | "Kattappana"
  | "Thodupuzha"
  | "Munnar"
  | "Kumily"
  | "Adimali"
  | "Nedumkandam";

export type MembershipTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type DeliveryStatus =
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned";

export type PaymentMethod =
  | "upi"
  | "card"
  | "netbanking"
  | "cod"
  | "emi"
  | "wallet";

export type EmployeeRole =
  | "admin"
  | "manager"
  | "sales"
  | "inventory"
  | "delivery"
  | "technician"
  | "accountant"
  | "cashier";

export type ServiceStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "awaiting_parts"
  | "completed"
  | "cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  barcode: string;
  images: string[];
  specs: ProductSpec[];
  features: string[];
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isFlashSale: boolean;
  emiFrom: number;
  warranty: string;
  energyRating?: string;
  branchStock: Record<Branch, number>;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  tier: MembershipTier;
  loyaltyPoints: number;
  totalSpent: number;
  orderCount: number;
  addresses: Address[];
  segment: string;
  preferredBranch: Branch;
  joinedAt: string;
  lastPurchase?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  shippingAddress: Address;
  branch: Branch;
  createdAt: string;
  deliveredAt?: string;
  invoiceNumber?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: string;
  branch: Branch;
  avatar?: string;
  salary: number;
  joinDate: string;
  status: "active" | "on_leave" | "inactive";
  attendanceToday: "present" | "absent" | "late" | "half_day";
  performanceScore: number;
  shift: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  branch: Branch;
  status: "available" | "on_delivery" | "off_duty";
  rating: number;
  deliveriesToday: number;
  totalDeliveries: number;
  avatar?: string;
  currentLocation?: { lat: number; lng: number };
}

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  agentId: string;
  agentName: string;
  status: DeliveryStatus;
  branch: Branch;
  address: string;
  pincode: string;
  estimatedTime: string;
  otp: string;
  distance: number;
  createdAt: string;
  timeline: { status: string; time: string; note?: string }[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  categories: string[];
  rating: number;
  paymentTerms: string;
  totalOrders: number;
  outstanding: number;
  status: "active" | "inactive";
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  total: number;
  status: "draft" | "sent" | "confirmed" | "received" | "cancelled";
  branch: Branch;
  createdAt: string;
  expectedDate: string;
}

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  type: "repair" | "installation" | "warranty" | "amc" | "maintenance";
  status: ServiceStatus;
  priority: "low" | "medium" | "high" | "urgent";
  technicianId?: string;
  technicianName?: string;
  branch: Branch;
  description: string;
  createdAt: string;
  scheduledDate?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  gradient: string;
}

export interface DashboardStats {
  totalSales: number;
  revenue: number;
  orders: number;
  deliveries: number;
  inventoryValue: number;
  pendingDeliveries: number;
  attendanceRate: number;
  customerSatisfaction: number;
  salesChange: number;
  revenueChange: number;
  ordersChange: number;
}

export interface BranchPerformance {
  branch: Branch;
  sales: number;
  orders: number;
  inventory: number;
  employees: number;
  satisfaction: number;
}
