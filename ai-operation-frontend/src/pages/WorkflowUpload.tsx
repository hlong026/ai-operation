import { Card, Form, Input, Select, Button, Upload, message } from 'antd'
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input

export default function WorkflowUpload() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('Form values:', values)
    message.success('工作流上传成功！')
    navigate('/workflows')
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/workflows')}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      <Card title="上传工作流">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <h3>基本信息</h3>
          
          <Form.Item
            label="工作流名称"
            name="name"
            rules={[{ required: true, message: '请输入工作流名称' }]}
          >
            <Input placeholder="请输入工作流名称" />
          </Form.Item>

          <Form.Item
            label="工作流描述"
            name="description"
            rules={[{ required: true, message: '请输入工作流描述' }]}
          >
            <TextArea rows={3} placeholder="请输入工作流描述" />
          </Form.Item>

          <Form.Item
            label="工作流类型"
            name="type"
            rules={[{ required: true, message: '请选择工作流类型' }]}
          >
            <Select placeholder="请选择工作流类型">
              <Select.Option value="coze">Coze</Select.Option>
              <Select.Option value="n8n">n8n</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              <Select.Option value="content">内容创作</Select.Option>
              <Select.Option value="analysis">数据分析</Select.Option>
              <Select.Option value="marketing">营销推广</Select.Option>
              <Select.Option value="processing">数据处理</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="标签"
            name="tags"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Select
              mode="tags"
              placeholder="输入标签后按回车添加"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <h3 style={{ marginTop: 32 }}>技术配置</h3>

          <Form.Item
            label="Webhook URL"
            name="webhookUrl"
            rules={[
              { required: true, message: '请输入Webhook URL' },
              { type: 'url', message: '请输入有效的URL' }
            ]}
          >
            <Input 
              placeholder="https://..." 
              addonAfter={<Button type="link">测试连接</Button>}
            />
          </Form.Item>

          <Form.Item
            label="API Key (可选)"
            name="apiKey"
          >
            <Input.Password placeholder="请输入API Key" />
          </Form.Item>

          <Form.Item
            label="积分消耗"
            name="credits"
            rules={[{ required: true, message: '请输入积分消耗' }]}
          >
            <Input type="number" placeholder="每次执行消耗的积分" suffix="积分/次" />
          </Form.Item>

          <h3 style={{ marginTop: 32 }}>演示材料</h3>

          <Form.Item
            label="演示视频 (可选)"
            name="demoVideo"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>上传视频</Button>
            </Upload>
            <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 8 }}>
              支持MP4格式，最大100MB
            </div>
          </Form.Item>

          <Form.Item
            label="运行界面截图"
            name="screenshots"
            rules={[{ required: true, message: '请上传至少3张截图' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={5}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传截图</div>
              </div>
            </Upload>
            <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 8 }}>
              至少上传3张截图
            </div>
          </Form.Item>

          <h3 style={{ marginTop: 32 }}>使用说明</h3>

          <Form.Item
            label="详细说明"
            name="instructions"
            rules={[{ required: true, message: '请输入使用说明' }]}
          >
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
              <div style={{ padding: 16, minHeight: 300 }}>
                <p><strong>功能说明：</strong></p>
                <ul>
                  <li>描述工作流的主要功能</li>
                </ul>
                
                <p><strong>使用步骤：</strong></p>
                <ol>
                  <li>第一步...</li>
                  <li>第二步...</li>
                </ol>
                
                <p><strong>注意事项：</strong></p>
                <ul>
                  <li>重要提示...</li>
                </ul>
              </div>
            </div>
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/workflows')}>取消</Button>
              <Button type="default">保存草稿</Button>
              <Button type="primary" htmlType="submit">发布工作流</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
