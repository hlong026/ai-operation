import { supabase } from '../lib/supabase'
import type { CreditPackage, MembershipPlan, CreditTransaction, Withdrawal } from '../types/database.types'

// 获取积分充值套餐
export async function getCreditPackages(): Promise<CreditPackage[]> {
  const { data, error } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error
  return data || []
}

// 获取会员套餐
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error
  return data || []
}

// 获取用户积分交易记录
export async function getCreditTransactions(userId: string, limit = 20): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// 获取创作者收益记录
export async function getCreatorEarnings(creatorId: string, limit = 20): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('creator_id', creatorId)
    .gt('creator_earn', 0)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// 使用工作流/工具（扣费）
export async function useResource(
  resourceType: 'workflow' | 'tool',
  resourceId: string
): Promise<{ success: boolean; error?: string; credits_used?: number; new_balance?: number }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '请先登录' }

  const { data, error } = await supabase.rpc('use_resource_with_credits', {
    p_user_id: user.id,
    p_resource_type: resourceType,
    p_resource_id: resourceId
  })

  if (error) {
    console.error('useResource error:', error)
    return { success: false, error: error.message }
  }

  return data as { success: boolean; error?: string; credits_used?: number; new_balance?: number }
}

// 创建充值订单
export async function createRechargeOrder(packageId: string): Promise<{ orderId: string; amount: number }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('请先登录')

  // 获取套餐信息
  const { data: pkg, error: pkgError } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('id', packageId)
    .single()

  if (pkgError || !pkg) throw new Error('套餐不存在')

  // 创建订单
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      plan_name: pkg.name,
      amount: pkg.price,
      credits: pkg.credits + pkg.bonus_credits,
      payment_status: 'pending'
    })
    .select()
    .single()

  if (orderError) throw orderError

  return { orderId: order.id, amount: pkg.price }
}

// 确认充值（支付成功后调用）
export async function confirmRecharge(orderId: string, packageId: string): Promise<{ success: boolean; new_balance?: number }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false }

  // 更新订单状态
  await supabase
    .from('orders')
    .update({ payment_status: 'paid' })
    .eq('id', orderId)

  // 调用充值函数
  const { data, error } = await supabase.rpc('recharge_credits', {
    p_user_id: user.id,
    p_package_id: packageId,
    p_order_id: orderId
  })

  if (error) {
    console.error('confirmRecharge error:', error)
    return { success: false }
  }

  return data as { success: boolean; new_balance?: number }
}

// 获取提现记录
export async function getWithdrawals(userId: string): Promise<Withdrawal[]> {
  const { data, error } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// 申请提现
export async function requestWithdrawal(
  amount: number,
  paymentMethod: 'alipay' | 'wechat' | 'bank',
  paymentAccount: string
): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '请先登录' }

  const { data, error } = await supabase.rpc('request_withdrawal', {
    p_user_id: user.id,
    p_amount: amount,
    p_payment_method: paymentMethod,
    p_payment_account: paymentAccount
  })

  if (error) {
    console.error('requestWithdrawal error:', error)
    return { success: false, error: error.message }
  }

  return data as { success: boolean; error?: string }
}
