

export const CREDIT_TYPES = [
  {value: "fertilizer", label: "Fertilizer"},
  {value: "hybrid_seed", label: "Hybrid Seed"},
  {value: "agro_chemicals", label: "Agro Chemicals"},
  {value: "mechanisation", label: "Mechanisation"},
]

export const PAYMENT_STATUS = [
  {value: "paid", label: "Paid"},
  {value: "partial", label: "Partial"},
  {value: "overdue", label: "Overdue"},
  {value: "active", label: "Active"},
  {value: "inactive", label: "Inactive"},
]

export const PAYBACK_PAYMENT_STATUS = [
  {value: "full", label: "Full Payment"},
  {value: "partial", label: "Partial Payment"}
]

export const APPROVAL_STATUS = [
  {value: "pending", label: "Pending"},
  {value: "approved", label: "Approved"},
]

export const PAYMENT_TYPES = [
  {value: "cash_payback", label: "Cash Payback"},
  {value: "crop_exchange", label: "Crop Exchange"},
]

export const INFLOW_ISSUES = [
  {value: "transit_damage", label: "Transit Damage"},
  {value: "bad_roads", label: "Bad Roads"},
  {value: "bad_weather", label: "Bad Weather"},
]

export const PAYMENT_METHODS = [
  {value: "cash", label: "Cash"},
  {value: "mobile_money", label: "Mobile Money"},
  {value: "bank_transfer", label: "Bank Transfer"},  
]

export const PAYMENT_MODE_TYPES = [
  {value: "partial", label: "Partial Payment"},
  {value: "full", label: "Full Payment"},
]

export const ORDER_STATUS_MAP_APPROVAL = {
  pending: "availability_check",
  availability_check: "order_pickup",
  truck_pickup: "order_picked_up",
  partial_payment: "order_pickup"
}

export const ORDER_STATUS_MAP_OUTFLOW = {
  pending: "availability_check",
  availability_check: "truck_pickup",
  truck_pickup: "delivery",
  delivered: "order_approval",
  partial_payment: "order_approval",
  full_payment: "order_approval",
  complete: "approved"
}

export const INBOUND_ORDER_PENDING_STATUS = [
  {value: "delivery_inspection", label: "Delivery Inspection"},
  {value: "order_approval", label: "Order Approval"},
  {value: "approved", label: "Approved"},
  {value: "cancelled", label: "Cancelled"}
]

export const OUTBOUND_ORDER_PENDING_STATUS = [
  {value: "pending", label: "Availability Check"},
  {value: "availability_check", label: "Truck Pickup"},
  {value: "truck_pickup", label: "Delivery"},
  {value: "delivered", label: "Order Approval"}
]
