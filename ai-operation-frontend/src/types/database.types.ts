export type UserRole = 'user' | 'admin'
export type MembershipType = 'free' | 'basic' | 'pro' | 'enterprise'
export type ResourceStatus = 'pending' | 'approved' | 'rejected'
export type TransactionType = 'recharge' | 'consume' | 'earn' | 'refund' | 'gift' | 'membership'
export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected'

export interface Profile {
  id: string
  email: string
  nickname: string | null
  avatar: string | null
  role: UserRole
  credits: number
  membership_type: MembershipType
  membership_expiry: string | null
  total_earnings: number
  pending_earnings: number
  withdrawn_earnings: number
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  user_id: string
  name: string
  description: string
  type: 'coze' | 'n8n'
  category: string
  tags: string[]
  webhook_url: string
  api_key: string | null
  credits_per_call: number
  creator_share_ratio: number
  demo_video: string | null
  screenshots: string[]
  instructions: string
  status: ResourceStatus
  reject_reason: string | null
  usage_count: number
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  user_id: string
  name: string
  description: string
  category: string
  icon: string
  webhook_url: string
  api_key: string | null
  instructions: string
  credits_per_call: number
  creator_share_ratio: number
  status: ResourceStatus
  reject_reason: string | null
  usage_count: number
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  user_id: string
  name: string
  description: string
  avatar: string | null
  category: string
  tags: string[]
  webhook_url: string
  api_key: string | null
  instructions: string
  credits_per_call: number
  creator_share_ratio: number
  status: ResourceStatus
  reject_reason: string | null
  usage_count: number
  rating: number
  review_count: number
  capabilities: string[]
  welcome_message: string | null
  sample_questions: string[]
  created_at: string
  updated_at: string
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  bonus_credits: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface MembershipPlan {
  id: string
  name: string
  type: MembershipType
  price_monthly: number
  price_yearly: number
  credits_monthly: number
  features: string[]
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  balance_after: number
  related_id: string | null
  related_type: 'workflow' | 'tool' | 'order' | 'membership' | null
  creator_id: string | null
  creator_earn: number
  description: string
  metadata: Record<string, any> | null
  created_at: string
}

export interface Withdrawal {
  id: string
  user_id: string
  amount: number
  status: WithdrawalStatus
  payment_method: 'alipay' | 'wechat' | 'bank'
  payment_account: string
  reject_reason: string | null
  processed_at: string | null
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  plan_name: string
  amount: number
  credits: number
  payment_method: 'wechat' | 'alipay' | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  transaction_id: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string; email: string }
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      workflows: {
        Row: Workflow
        Insert: Omit<Workflow, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'rating' | 'review_count'>
        Update: Partial<Omit<Workflow, 'id' | 'created_at'>>
      }
      tools: {
        Row: Tool
        Insert: Omit<Tool, 'id' | 'created_at' | 'updated_at' | 'usage_count'>
        Update: Partial<Omit<Tool, 'id' | 'created_at'>>
      }
      credit_packages: {
        Row: CreditPackage
      }
      membership_plans: {
        Row: MembershipPlan
      }
      credit_transactions: {
        Row: CreditTransaction
      }
      withdrawals: {
        Row: Withdrawal
      }
      orders: {
        Row: Order
      }
    }
  }
}
