import { Card, Row, Col, Statistic, Select, Button, Table } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

export default function Analytics() {
  const columns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 80 },
    { title: '内容标题', dataIndex: 'title', key: 'title' },
    { title: '播放量', dataIndex: 'views', key: 'views', sorter: true },
    { title: '点赞', dataIndex: 'likes', key: 'likes', sorter: true },
    { title: '评论', dataIndex: 'comments', key: 'comments', sorter: true },
  ]

  const data = [
    { key: 1, rank: 1, title: '30天涨粉10万的秘密', views: '45.2K', likes: '3.2K', comments: 856 },
    { key: 2, rank: 2, title: '短视频拍摄技巧大全', views: '38.9K', likes: '2.8K', comments: 723 },
    { key: 3, rank: 3, title: '新手必看的运营指南', views: '32.1K', likes: '2.1K', comments: 645 },
    { key: 4, rank: 4, title: '如何提高视频完播率', views: '28.5K', likes: '1.9K', comments: 512 },
    { key: 5, rank: 5, title: '爆款文案写作技巧', views: '25.3K', likes: '1.7K', comments: 489 },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>数据分析</h1>
        <div>
          <Select defaultValue="7" style={{ width: 120, marginRight: 8 }}>
            <Select.Option value="7">最近7天</Select.Option>
            <Select.Option value="30">最近30天</Select.Option>
            <Select.Option value="90">最近90天</Select.Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Select.Option value="all">全部平台</Select.Option>
            <Select.Option value="douyin">抖音</Select.Option>
            <Select.Option value="xiaohongshu">小红书</Select.Option>
          </Select>
        </div>
      </div>

      {/* 数据卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总播放量"
              value={125600}
              suffix="次"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              较上周 +23%
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总点赞数"
              value={8900}
              suffix="个"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              较上周 +15%
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总评论数"
              value={2300}
              suffix="条"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              较上周 +8%
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总分享数"
              value={1200}
              suffix="次"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              较上周 +12%
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="新增粉丝"
              value={856}
              suffix="人"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              较上周 +45%
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="内容发布数"
              value={12}
              suffix="条"
              valueStyle={{ color: '#595959' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              较上周 0%
            </div>
          </Card>
        </Col>
      </Row>

      {/* 趋势图 */}
      <Card title="数据趋势" style={{ marginBottom: 24 }}>
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
          <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
            <div>数据趋势图表</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>（需要集成图表库如 Recharts 或 ECharts）</div>
          </div>
        </div>
      </Card>

      {/* 内容排行 */}
      <Card 
        title="内容表现排行"
        extra={
          <div>
            <Button>导出Excel报表</Button>
            <Button type="primary" style={{ marginLeft: 8 }}>生成PDF报告</Button>
          </div>
        }
      >
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
  )
}
