import React from 'react';
import Card from './Card';
import '../styles/CardDemo.css';

const CardDemo: React.FC = () => {
  return (
    <div className="card-demo-container">
      <h1>通用卡片组件演示</h1>
      <p className="demo-description">
        展示不同变体和自定义属性的Card组件用法，点击卡片查看交互效果
      </p>

      <div className="demo-section">
        <h2>基础变体</h2>
        <div className="card-grid">
          {/* 默认卡片 */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">默认卡片</h3>
            </div>
            <div className="card-content">
              <p>基础卡片样式，包含默认阴影和边框</p>
              <ul>
                <li>border-radius: 8px</li>
                <li>padding: 16px</li>
                <li>基础阴影效果</li>
              </ul>
            </div>
            <div className="card-footer">
              <button className="demo-btn">操作按钮</button>
            </div>
          </Card>

          {/* 分析数据卡片 */}
          <Card variant="analytics">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px' }}>📊</span>
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '14px' }}>总使用次数</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>12,580</div>
                <div style={{ fontSize: '12px', color: '#27ae60' }}>↑ 12.5% 较上月</div>
              </div>
            </div>
          </Card>

          {/* 支付方式卡片 */}
          <Card variant="method">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>招商银行储蓄卡</h4>
                <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>**** **** **** 5678</p>
              </div>
              <div style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                默认支付
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#f3f4f6', color: '#374151' }}>
                编辑
              </button>
              <button style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                删除
              </button>
            </div>
          </Card>
        </div>
      </div>

      <div className="demo-section">
        <h2>自定义属性</h2>
        <div className="card-grid">
          {/* 自定义圆角和阴影 */}
          <Card
            borderRadius={20}
            shadow={false}
            border="2px dashed #94a3b8"
            padding="24px"
          >
            <h3 className="card-title">自定义样式卡片</h3>
            <p>自定义圆角、边框和内边距的卡片示例</p>
            <ul>
              <li>border-radius: 20px</li>
              <li>dashed边框样式</li>
              <li>无阴影效果</li>
              <li>padding: 24px</li>
            </ul>
          </Card>

          {/* 无悬停效果卡片 */}
          <Card hoverEffect="none">
            <h3 className="card-title">无交互效果卡片</h3>
            <p>禁用悬停效果的卡片，适用于静态展示内容</p>
            <div style={{ height: '80px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              静态内容展示区域
            </div>
          </Card>

          {/* 图表卡片 */}
          <Card variant="chart">
            <h3 className="card-title">图表容器卡片</h3>
            <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              图表展示区域
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
              <span>数据更新时间: 2025-07-18</span>
              <button style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer' }}>查看详情</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CardDemo;