import '../styles/Settings.css'
import Card from '../components/Common/Card.tsx';

const Settings = () => {
  return (
    <div className="settings">
      <div className="settings-header">
        <h2>系统设置</h2>
        <p>配置系统参数和安全设置</p>
      </div>

      <div className="settings-content">
        <Card variant="settings" className="settings-section">
          <h3>支付配置</h3>
          <div className="settings-content-wrapper">
            <div className="setting-item">
              <label>银行卡服务商</label>
              <input type="text" placeholder="请输入银行卡服务商" />
            </div>
            <div className="setting-item">
              <label>余额支付开关</label>
              <select>
                <option value="enabled">启用</option>
                <option value="disabled">禁用</option>
              </select>
            </div>
            <div className="setting-item">
              <label>最大单笔交易额度</label>
              <input type="number" placeholder="50000" />
              <span className="unit">元</span>
            </div>
            <div className="setting-item">
              <label>每日交易限额</label>
              <input type="number" placeholder="100000" />
              <span className="unit">元</span>
            </div>
          </div>
        </Card>



        <Card variant="settings" className="settings-section">
          <h3>安全设置</h3>
          <div className="setting-item">
            <label>密码最小长度</label>
            <input type="number" value="8" min="6" max="20" />
            <span className="unit">位</span>
          </div>
          <div className="setting-item">
            <label>登录失败锁定次数</label>
            <input type="number" value="5" min="3" max="10" />
            <span className="unit">次</span>
          </div>
          <div className="setting-item checkbox-item">
            <input type="checkbox" id="sms-verify" defaultChecked />
            <label htmlFor="sms-verify">启用短信验证</label>
          </div>
          <div className="setting-item checkbox-item">
            <input type="checkbox" id="email-verify" defaultChecked />
            <label htmlFor="email-verify">启用邮箱验证</label>
          </div>
        </Card>

        <Card variant="settings" className="settings-section">
          <h3>通知设置</h3>
          <div className="setting-item checkbox-item">
            <input type="checkbox" id="transaction-notify" defaultChecked />
            <label htmlFor="transaction-notify">交易成功通知</label>
          </div>
          <div className="setting-item checkbox-item">
            <input type="checkbox" id="failed-notify" defaultChecked />
            <label htmlFor="failed-notify">交易失败通知</label>
          </div>
          <div className="setting-item checkbox-item">
            <input type="checkbox" id="daily-report" />
            <label htmlFor="daily-report">每日报表推送</label>
          </div>
          <div className="setting-item">
            <label>通知邮箱</label>
            <input type="email" placeholder="admin@example.com" />
          </div>
        </Card>

        <Card variant="settings" className="settings-section">
          <h3>系统信息</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">系统版本</span>
              <span className="info-value">v2.1.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">数据库版本</span>
              <span className="info-value">MySQL 8.0.35</span>
            </div>
            <div className="info-item">
              <span className="info-label">服务器状态</span>
              <span className="info-value status-online">在线</span>
            </div>
            <div className="info-item">
              <span className="info-label">最后备份</span>
              <span className="info-value">2025-07-16 02:00</span>
            </div>
            <div className="info-item">
              <span className="info-label">存储使用</span>
              <span className="info-value">45.2GB / 100GB</span>
            </div>
            <div className="info-item">
              <span className="info-label">活跃连接</span>
              <span className="info-value">156</span>
            </div>
          </div>
        </Card>

          <div className="settings-actions">
          <button className="btn-primary">保存设置</button>
          <button className="btn-secondary">重置为默认</button>
          <button className="btn-danger">清空缓存</button>
          </div>
        </div>
    </div>
  )
}



export default Settings
