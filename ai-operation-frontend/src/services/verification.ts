import { supabase } from '../lib/supabase'

// 开发模式标志
const DEV_MODE = (import.meta as any).env?.DEV ?? true

// 生成6位数字验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 发送验证码
export async function sendVerificationCode(
  email: string,
  type: 'register' | 'reset_password' | 'change_email' = 'register'
): Promise<{ success: boolean; error?: string; devCode?: string }> {
  try {
    // 生成验证码
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10分钟有效期

    // 检查是否已经发送过验证码（60秒内）
    const { data: existingCodes } = await supabase
      .from('verification_codes')
      .select('created_at')
      .eq('email', email)
      .eq('type', type)
      .eq('used', false)
      .gte('created_at', new Date(Date.now() - 60000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    if (existingCodes && existingCodes.length > 0) {
      return { success: false, error: '请等待60秒后再发送验证码' }
    }

    // 保存验证码到数据库
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email,
        code,
        type,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Insert verification code error:', insertError)
      
      // 开发模式：即使数据库插入失败，也返回验证码用于测试
      if (DEV_MODE) {
        console.log(`[DEV] 验证码: ${code}`)
        return { success: true, devCode: code }
      }
      
      return { success: false, error: '发送验证码失败，请稍后重试' }
    }

    // 开发模式：直接在控制台显示验证码
    if (DEV_MODE) {
      console.log(`[DEV] 验证码已发送到 ${email}: ${code}`)
      return { success: true, devCode: code }
    }

    // 生产模式：调用 Edge Function 发送邮件
    try {
      const { error: sendError } = await supabase.functions.invoke('send-verification-email', {
        body: { email, code, type },
      })

      if (sendError) {
        console.error('Send email error:', sendError)
        // 验证码已保存到数据库，用户可以通过其他方式获取
        return { success: true }
      }
    } catch (funcError) {
      console.error('Edge function error:', funcError)
      // 验证码已保存，继续
    }

    return { success: true }
  } catch (err) {
    console.error('Send verification code error:', err)
    return { success: false, error: '发送验证码失败' }
  }
}

// 验证验证码
export async function verifyCode(
  email: string,
  code: string,
  type: 'register' | 'reset_password' | 'change_email' = 'register'
): Promise<{ valid: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('verify_code', {
      p_email: email,
      p_code: code,
      p_type: type,
    })

    if (error) {
      console.error('Verify code error:', error)
      return { valid: false, error: '验证失败' }
    }

    if (!data) {
      return { valid: false, error: '验证码错误或已过期' }
    }

    return { valid: true }
  } catch (err) {
    console.error('Verify code error:', err)
    return { valid: false, error: '验证失败' }
  }
}
