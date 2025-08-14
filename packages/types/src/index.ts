export type Product = {
  id: string;
  name: string;
  sizeOz: number;
  sku: string;
  price: number;
};

export type Plan = {
  id: string;
  name: string;
  productId: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  minQty: number;
};

export type Subscription = {
  id: string;
  planId: string;
  userId: string;
  status: 'active' | 'paused';
  productId?: string;
  quantity: number;
  address: string;
  nextDeliveryDate: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  createdAt: string;
};

export type OneOffOrder = {
  id: string;
  productId: string;
  userId: string;
  status: 'pending' | 'delivered';
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'operator' | 'editor';
  
  // Address Information
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    instructions?: string;
    lat?: number;
    lng?: number;
  };
  
  // Business Information (optional for commercial customers)
  businessInfo?: {
    businessName?: string;
    businessType?: 'restaurant' | 'hotel' | 'office' | 'retail' | 'services' | 'other';
    taxId?: string;
    contactPerson?: string;
  };
  
  // Service Preferences
  preferences?: {
    deliveryPreference: 'home_delivery' | 'pickup_point';
    communicationPreference: 'email' | 'sms' | 'both';
    timeSlotPreference: 'morning' | 'afternoon' | 'evening' | 'flexible';
  };
  
  // Additional Information
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
};

export type Route = {
  id: string;
  name: string;
  area: string;
  driverId: string;
  driverName: string;
  status: 'active' | 'in-progress' | 'completed' | 'scheduled' | 'pending';
  deliveryDate: string;
  startTime: string;
  estimatedEndTime: string;
  actualEndTime?: string;
  stops: Array<{
    id: string;
    address: string;
    lat: number;
    lng: number;
    status: 'pending' | 'completed';
    eta: string;
  }>;
  details?: {
    stops: Array<{
      id: string;
      address: string;
      lat: number;
      lng: number;
      status: 'pending' | 'completed';
      eta: string;
    }>;
  };
};

export type Metrics = {
  mrr: number;
  churn: number;
  fulfillmentRate: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type PickupPoint = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  isActive: boolean;
  operatingHours: {
    monday: { open: string; close: string; closed?: boolean };
    tuesday: { open: string; close: string; closed?: boolean };
    wednesday: { open: string; close: string; closed?: boolean };
    thursday: { open: string; close: string; closed?: boolean };
    friday: { open: string; close: string; closed?: boolean };
    saturday: { open: string; close: string; closed?: boolean };
    sunday: { open: string; close: string; closed?: boolean };
  };
  capacity: number;
  currentLoad: number;
  contactPhone?: string;
  instructions?: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
};

export type DeliveryStatus = 'scheduled' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'cancelled' | 'skipped' | 'rescheduled';

export type DeliveryTimeSlot = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxCapacity: number;
  currentBookings: number;
};

export type Delivery = {
  id: string;
  subscriptionId: string;
  userId: string;
  orderId: string;
  routeId?: string;
  pickupPointId?: string;
  deliveryType: 'home_delivery' | 'pickup_point';
  status: DeliveryStatus;
  scheduledDate: string;
  timeSlotId?: string;
  actualDeliveryDate?: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    lat?: number;
    lng?: number;
    instructions?: string;
  };
  recipient: {
    name: string;
    phone: string;
    email: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    size: string;
  }>;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  notes?: string;
  customerNotes?: string;
  deliveryPhoto?: string;
  signature?: string;
  skipReason?: string;
  rescheduledFrom?: string;
  rescheduledTo?: string;
  rescheduledReason?: string;
  failureReason?: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
};

export type DeliverySkipRequest = {
  id: string;
  deliveryId: string;
  subscriptionId: string;
  userId: string;
  reason: 'vacation' | 'business_trip' | 'temporarily_not_needed' | 'address_change' | 'other';
  customReason?: string;
  skipDate: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
};

export type DeliveryRescheduleRequest = {
  id: string;
  deliveryId: string;
  subscriptionId: string;
  userId: string;
  originalDate: string;
  requestedDate: string;
  timeSlotId?: string;
  reason: 'not_available' | 'address_change' | 'preference_change' | 'emergency' | 'other';
  customReason?: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
};

export type DeliveryNotification = {
  id: string;
  deliveryId: string;
  userId: string;
  type: 'scheduled' | 'out_for_delivery' | 'delivered' | 'failed' | 'rescheduled' | 'pickup_ready';
  title: string;
  message: string;
  sentAt: string;
  readAt?: string;
  channels: Array<'email' | 'sms' | 'push'>;
  metadata?: {
    estimatedArrival?: string;
    trackingUrl?: string;
    driverContact?: string;
    pickupCode?: string;
  };
};

export type PickupNotification = {
  id: string;
  pickupPointId: string;
  deliveryId: string;
  userId: string;
  pickupCode: string;
  status: 'ready' | 'collected' | 'expired';
  availableUntil: string;
  createdAt: string;
  collectedAt?: string;
  collectedBy?: string;
};

export type DeliveryEfficiencyReport = {
  id: string;
  reportType: 'daily' | 'weekly' | 'monthly';
  period: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    skippedDeliveries: number;
    rescheduledDeliveries: number;
    averageDeliveryTime: number;
    onTimeDeliveryRate: number;
    customerSatisfactionScore?: number;
  };
  driverMetrics: Array<{
    driverId: string;
    driverName: string;
    totalDeliveries: number;
    successRate: number;
    averageDeliveryTime: number;
    customerRating?: number;
  }>;
  routeMetrics: Array<{
    routeId: string;
    routeName: string;
    efficiency: number;
    totalStops: number;
    completedStops: number;
    averageTimePerStop: number;
  }>;
  pickupPointMetrics: Array<{
    pickupPointId: string;
    pickupPointName: string;
    totalPickups: number;
    successfulPickups: number;
    averagePickupTime: number;
    utilizationRate: number;
  }>;
  generatedAt: string;
  generatedBy: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  productId: string;
  productName: string;
  productSize: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  price: number;
  originalPrice?: number;
  discount?: number;
  minQuantity: number;
  maxQuantity: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionCheckout = {
  planId: string;
  quantity: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    instructions?: string;
  };
  paymentMethod: {
    type: 'card' | 'paypal';
    cardLast4?: string;
    cardBrand?: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  startDate: string;
  totalAmount: number;
  taxAmount: number;
  discountAmount?: number;
};

export type SubscriptionHistory = {
  id: string;
  subscriptionId: string;
  action: 'created' | 'paused' | 'resumed' | 'cancelled' | 'modified' | 'payment_failed' | 'payment_succeeded';
  description: string;
  metadata?: {
    oldValue?: any;
    newValue?: any;
    reason?: string;
    amount?: number;
  };
  performedBy: string;
  performedAt: string;
};

export type SubscriptionNotification = {
  id: string;
  subscriptionId: string;
  userId: string;
  type: 'payment_reminder' | 'payment_failed' | 'subscription_paused' | 'subscription_resumed' | 'subscription_cancelled' | 'delivery_scheduled' | 'plan_changed';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  actionRequired?: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
};

export type PaymentMethod = {
  id: string;
  userId: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  isDefault: boolean;
  cardLast4?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  paypalEmail?: string;
  bankName?: string;
  bankLast4?: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Invoice = {
  id: string;
  subscriptionId: string;
  userId: string;
  invoiceNumber: string;
  status: 'draft' | 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  dueDate: string;
  paidAt?: string;
  paymentMethodId?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  createdAt: string;
  updatedAt: string;
};
