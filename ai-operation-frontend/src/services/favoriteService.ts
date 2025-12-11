import { supabase } from '../lib/supabase'

export type ResourceType = 'agent' | 'workflow' | 'tool'

export interface Favorite {
  id: string
  user_id: string
  resource_type: ResourceType
  resource_id: string
  created_at: string
}

// 本地存储 key
const LOCAL_STORAGE_KEY = 'user_favorites'

// 获取本地收藏
function getLocalFavorites(): Favorite[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 保存本地收藏
function saveLocalFavorites(favorites: Favorite[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites))
}

// 获取用户所有收藏
export async function getFavorites(resourceType?: ResourceType): Promise<Favorite[]> {
  try {
    let query = supabase
      .from('user_favorites')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (resourceType) {
      query = query.eq('resource_type', resourceType)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Favorite[]
  } catch (err) {
    // 数据库不可用时使用本地存储
    console.warn('使用本地存储获取收藏:', err)
    const local = getLocalFavorites()
    if (resourceType) {
      return local.filter(f => f.resource_type === resourceType)
    }
    return local
  }
}

// 添加收藏
export async function addFavorite(resourceType: ResourceType, resourceId: string): Promise<Favorite | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('未登录')

    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        resource_type: resourceType,
        resource_id: resourceId
      })
      .select()
      .single()
    
    if (error) {
      // 如果是重复收藏，忽略错误
      if (error.code === '23505') return null
      throw error
    }
    return data as Favorite
  } catch (err) {
    // 数据库不可用时使用本地存储
    console.warn('使用本地存储添加收藏:', err)
    const { data: { user } } = await supabase.auth.getUser()
    const local = getLocalFavorites()
    
    // 检查是否已存在
    const exists = local.some(f => 
      f.resource_type === resourceType && f.resource_id === resourceId
    )
    if (exists) return null

    const newFavorite: Favorite = {
      id: Date.now().toString(),
      user_id: user?.id || 'local',
      resource_type: resourceType,
      resource_id: resourceId,
      created_at: new Date().toISOString()
    }
    local.unshift(newFavorite)
    saveLocalFavorites(local)
    return newFavorite
  }
}

// 取消收藏
export async function removeFavorite(resourceType: ResourceType, resourceId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
    
    if (error) throw error
  } catch (err) {
    // 数据库不可用时使用本地存储
    console.warn('使用本地存储删除收藏:', err)
    const local = getLocalFavorites()
    const filtered = local.filter(f => 
      !(f.resource_type === resourceType && f.resource_id === resourceId)
    )
    saveLocalFavorites(filtered)
  }
}

// 检查是否已收藏
export async function isFavorited(resourceType: ResourceType, resourceId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  } catch (err) {
    // 数据库不可用时使用本地存储
    const local = getLocalFavorites()
    return local.some(f => 
      f.resource_type === resourceType && f.resource_id === resourceId
    )
  }
}

// 批量检查是否已收藏
export async function checkFavorites(resourceType: ResourceType, resourceIds: string[]): Promise<Set<string>> {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('resource_id')
      .eq('resource_type', resourceType)
      .in('resource_id', resourceIds)
    
    if (error) throw error
    return new Set((data || []).map(f => f.resource_id))
  } catch (err) {
    // 数据库不可用时使用本地存储
    console.warn('使用本地存储检查收藏:', err)
    const local = getLocalFavorites()
    const favIds = local
      .filter(f => f.resource_type === resourceType && resourceIds.includes(f.resource_id))
      .map(f => f.resource_id)
    return new Set(favIds)
  }
}

// 切换收藏状态
export async function toggleFavorite(resourceType: ResourceType, resourceId: string): Promise<boolean> {
  const favorited = await isFavorited(resourceType, resourceId)
  if (favorited) {
    await removeFavorite(resourceType, resourceId)
    return false
  } else {
    await addFavorite(resourceType, resourceId)
    return true
  }
}
