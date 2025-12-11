import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

// 获取存储 key 名称
const storageKey = `sb-${new URL(supabaseUrl || 'http://localhost').hostname.split('.')[0]}-auth-token`

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      storageKey: storageKey,
      storage: window.localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
)

// 导出清除 session 的辅助函数
export const clearSupabaseSession = () => {
  console.log('Clearing Supabase session from localStorage')
  // 清除所有可能的 Supabase 存储 key
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => {
    console.log('Removing:', key)
    localStorage.removeItem(key)
  })
}
