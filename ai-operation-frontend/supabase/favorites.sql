-- 用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('agent', 'workflow', 'tool')),
  resource_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 确保同一用户不能重复收藏同一资源
  UNIQUE(user_id, resource_type, resource_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_resource ON user_favorites(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created ON user_favorites(created_at DESC);

-- RLS 策略
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的收藏
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- 用户只能添加自己的收藏
CREATE POLICY "Users can add own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的收藏
CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 添加收藏函数
CREATE OR REPLACE FUNCTION add_favorite(
  p_resource_type VARCHAR(20),
  p_resource_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_favorite_id UUID;
BEGIN
  INSERT INTO user_favorites (user_id, resource_type, resource_id)
  VALUES (auth.uid(), p_resource_type, p_resource_id)
  ON CONFLICT (user_id, resource_type, resource_id) DO NOTHING
  RETURNING id INTO v_favorite_id;
  
  RETURN v_favorite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 取消收藏函数
CREATE OR REPLACE FUNCTION remove_favorite(
  p_resource_type VARCHAR(20),
  p_resource_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM user_favorites
  WHERE user_id = auth.uid()
    AND resource_type = p_resource_type
    AND resource_id = p_resource_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 检查是否已收藏函数
CREATE OR REPLACE FUNCTION is_favorited(
  p_resource_type VARCHAR(20),
  p_resource_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_favorites
    WHERE user_id = auth.uid()
      AND resource_type = p_resource_type
      AND resource_id = p_resource_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
