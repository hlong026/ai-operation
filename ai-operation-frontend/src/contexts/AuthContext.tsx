import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, clearSupabaseSession } from '../lib/supabase'
import type { Profile } from '../types/database.types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取用户 profile
  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId)
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('Profile query status:', status)
      
      if (error) {
        console.error('Error fetching profile:', error.message)
        console.error('Error code:', error.code)
        console.error('Error hint:', error.hint)
        console.error('Error details:', error.details)
        
        // 如果是 PGRST116 (没找到记录)，尝试创建 profile
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create...')
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              role: 'user',
              credits: 100,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Error creating profile:', createError)
            return null
          }
          console.log('Profile created successfully:', newProfile)
          return newProfile
        }
        return null
      }
      console.log('Profile fetched successfully:', data)
      return data
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err)
      return null
    }
  }

  // 初始化认证状态
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        // 获取当前 session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) setLoading(false)
          return
        }

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user) {
            const profile = await fetchProfile(session.user.id)
            setProfile(profile)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error('Auth init error:', err)
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setProfile(profile)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // 注册
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  // 登录
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  // 登出
  const signOut = async () => {
    console.log('AuthContext signOut called')
    try {
      // 1. 先清除 localStorage（最重要！）
      clearSupabaseSession()
      
      // 2. 清除本地状态
      setUser(null)
      setProfile(null)
      setSession(null)
      
      // 3. 调用 Supabase signOut（使用 global scope 确保服务端也清除）
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      if (error) {
        console.error('Supabase signOut error:', error)
      }
      
      console.log('SignOut completed successfully')
    } catch (err) {
      console.error('SignOut error:', err)
      // 即使出错也清除本地存储
      clearSupabaseSession()
    }
  }

  // 更新 profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }
    return { error }
  }

  // 刷新 profile
  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchProfile(user.id)
      setProfile(profile)
    }
  }

  // 调试日志
  console.log('AuthContext - Profile:', profile)
  console.log('AuthContext - isAdmin:', profile?.role === 'admin')

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
