// Supabase Edge Function: 发送验证码邮件
// 部署命令: supabase functions deploy send-verification-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  email: string
  code: string
  type: 'register' | 'reset_password' | 'change_email'
}

const getEmailSubject = (type: string): string => {
  switch (type) {
    case 'register':
      return '【AI运营系统】注册验证码'
    case 'reset_password':
      return '【AI运营系统】重置密码验证码'
    case 'change_email':
      return '【AI运营系统】更换邮箱验证码'
    default:
      return '【AI运营系统】验证码'
  }
}

const getEmailContent = (code: string, type: string): string => {
  const typeText = type === 'register' ? '注册' : type === 'reset_password' ? '重置密码' : '更换邮箱'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>验证码</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🚀 AI运营系统
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
                让内容创作变得简单高效
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="color: #333; margin: 0 0 20px; font-size: 22px; text-align: center;">
                您的${typeText}验证码
              </h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 30px;">
                请使用以下验证码完成${typeText}操作：
              </p>
              
              <!-- 验证码区域 - 突出显示 -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 30px;">
                <div style="background: #ffffff; border-radius: 8px; padding: 20px; display: inline-block;">
                  <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #667eea; font-family: 'Courier New', monospace;">
                    ${code}
                  </span>
                </div>
              </div>
              
              <div style="background: #fff7e6; border: 1px solid #ffd591; border-radius: 8px; padding: 16px; margin: 0 0 30px;">
                <p style="color: #d46b08; margin: 0; font-size: 14px; text-align: center;">
                  ⏰ 验证码有效期为 <strong>10分钟</strong>，请尽快使用
                </p>
              </div>
              
              <p style="color: #999; font-size: 14px; line-height: 1.6; text-align: center; margin: 0;">
                如果您没有进行此操作，请忽略此邮件。<br>
                请勿将验证码告知他人，以保护您的账号安全。
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f8f9fa; padding: 30px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="color: #999; font-size: 13px; margin: 0 0 10px;">
                此邮件由系统自动发送，请勿直接回复
              </p>
              <p style="color: #999; font-size: 13px; margin: 0;">
                © 2024 AI运营系统 · 让创作更简单
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, code, type } = await req.json() as EmailRequest

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Missing email or code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 使用 Resend 发送邮件
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'AI运营系统 <noreply@yourdomain.com>',
          to: [email],
          subject: getEmailSubject(type),
          html: getEmailContent(code, type),
        }),
      })

      if (!res.ok) {
        const error = await res.text()
        console.error('Resend error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to send email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else {
      // 开发环境：打印验证码到控制台
      console.log(`[DEV] Verification code for ${email}: ${code}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
