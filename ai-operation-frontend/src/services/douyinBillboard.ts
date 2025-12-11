// 抖音榜单API服务
// API文档: https://api.tikhub.io

// 开发环境使用代理，生产环境直接调用（需要后端代理）
const isDev = (import.meta as any).env?.DEV ?? true
const API_BASE_URL = isDev ? '/tikhub-api' : 'https://api.tikhub.io'
const API_TOKEN = (import.meta as any).env?.VITE_TIKHUB_API_TOKEN || ''

// 低粉爆款数据类型
export interface LowFanItem {
  aweme_id: string
  title: string
  desc: string
  author: {
    uid: string
    nickname: string
    avatar_thumb: string
    follower_count: number
  }
  statistics: {
    digg_count: number
    comment_count: number
    share_count: number
    play_count: number
  }
  create_time: number
  cover: string
  video_url?: string
}

// API响应类型
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

// 标签参数类型 - 按API文档格式
// 格式: {"value": "顶级垂类标签id", "children": [{"value": "子级垂类标签id"}]}
interface TagParam {
  value: string
  children?: { value: string }[]
}

/**
 * 获取低粉爆款榜
 * @param page 页码
 * @param pageSize 每页数量
 * @param dateWindow 时间窗口，1按小时 24按天
 * @param parentTag 一级行业标签ID (如 "628" 表示美食)
 * @param childTags 二级行业标签ID数组 (如 ["62801"] 表示美食探店)
 */
export async function fetchLowFanList(
  page: number = 1,
  pageSize: number = 10,
  dateWindow: number = 24,
  parentTag?: string,
  childTags?: string[]
): Promise<{ success: boolean; data?: LowFanItem[]; error?: string }> {
  try {
    // 构建tags参数 - 格式: [{"value": "628", "children": [{"value": "62801"}]}]
    let tags: TagParam[] = []
    if (parentTag) {
      const tagParam: TagParam = { value: parentTag }
      if (childTags && childTags.length > 0) {
        tagParam.children = childTags.map(t => ({ value: t }))
      }
      tags = [tagParam]
    }

    const requestBody = {
      page,
      page_size: pageSize,
      date_window: dateWindow,
      tags: tags.length > 0 ? tags : undefined,
    }

    console.log('请求低粉爆款榜API:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(`${API_BASE_URL}/api/v1/douyin/billboard/fetch_hot_total_low_fan_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
        'accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<{ aweme_list?: LowFanItem[] }> = await response.json()
    
    if (result.code === 200 && result.data?.aweme_list) {
      return { success: true, data: result.data.aweme_list }
    }
    
    return { success: false, error: result.message || '获取数据失败' }
  } catch (error) {
    console.error('获取低粉爆款榜失败:', error)
    return { success: false, error: '网络请求失败，请稍后重试' }
  }
}

/**
 * 将API返回的低粉爆款数据转换为选题格式
 */
export function transformToTopicItems(items: LowFanItem[]) {
  return items.map(item => ({
    title: item.title || item.desc || '无标题',
    likes: item.statistics?.digg_count || 0,
    comments: item.statistics?.comment_count || 0,
    shares: item.statistics?.share_count || 0,
    plays: item.statistics?.play_count || 0,
    followers: item.author?.follower_count || 0,
    authorName: item.author?.nickname || '未知作者',
    authorAvatar: item.author?.avatar_thumb || '',
    cover: item.cover || '',
    awemeId: item.aweme_id,
    createTime: item.create_time,
  }))
}

export type TransformedTopicItem = ReturnType<typeof transformToTopicItems>[number]
