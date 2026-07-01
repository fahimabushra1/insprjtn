export interface Customer {
  uid?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  photo?: string;
  role?: string;
}

export interface Package {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  duration?: string;
  price: number;
  location: string;
  featured?: boolean;
  images?: string[];
  category?: string;
}

export interface Booking {
  _id: string;
  userId: string | Customer;
  packageId: string | Package;
  paymentId?: string | null;
  totalPrice: number;
  guests: number;
  startDate: string | Date;
  bookingStatus?: "pending" | "confirmed" | "cancelled";
  paymentStatus?: "pending" | "paid" | "failed";
  notes?: string;
  couponCode?: string;
  discountAmount?: number;
  paymentMethod?: string;
}

export interface TrackingContext {
  url?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  fbp?: string;
  fbc?: string;
}

export interface MetaUserData {
  em?: string[]; // SHA256 hashed emails
  ph?: string[]; // SHA256 hashed phones
  fn?: string[]; // SHA256 hashed first names
  ln?: string[]; // SHA256 hashed last names
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  [key: string]: any;
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  num_items?: number;
  search_string?: string;
  [key: string]: any; // Allow custom parameters for custom events
}

export interface MetaEventPayload {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: "website" | "app" | "physical_store" | "system_generated" | "other";
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
  opt_out?: boolean;
}
