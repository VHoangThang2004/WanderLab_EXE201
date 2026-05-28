export type PlanKey = 'free' | 'starter' | 'professional';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Plan {
  id: string;
  name: string;
  key: PlanKey;
  price_monthly: number;
  features: string[];
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  payment_method: string;
  transaction_id: string | null;
}

export interface CreatePaymentPayload {
  plan_key: PlanKey;
  payment_method: 'vnpay' | 'momo';
}

export interface PaymentResult {
  status: PaymentStatus;
  transaction_id: string;
  amount: number;
  message: string;
}
