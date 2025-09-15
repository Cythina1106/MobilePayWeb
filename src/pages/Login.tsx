import { useState, useEffect } from 'react'
import { authApi } from '../services/api.ts'
import { useFormSubmit } from '../hooks/useApi.ts'
import { LoginRequest } from '../types/api.ts'
import '../styles/Login.css'

interface LoginProps {
  onLogin: (userInfo: any) => void
}

const Login = ({ onLogin }: LoginProps) => {
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    username: '',
    password: '',
    captcha: '',
    remember_me: false  // 修正字段名
  })
  const [captchaKey, setCaptchaKey] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')

  // 使用API提交Hook
  const { submitting, error, submit } = useFormSubmit(authApi.login, {
    onSuccess: async (response) => {
      console.log('🔐 登录成功，Token已自动存储:', response)

      // authApi.login已经自动处理了token存储
      // Token格式：Bearer access_token，存储在localStorage的'token'键中

      try {
        // 登录成功后调用获取用户信息接口
        console.log('👤 登录成功后获取用户详细信息...')
        const profileResponse = await authApi.profile()
        console.log('profileResponse==>',profileResponse)
        if (profileResponse.success && profileResponse.data) {
          console.log('✅ 获取用户信息成功:', profileResponse.data)
          // 将接口返回的数据映射为前端期望的格式
          const apiData = profileResponse.data as any // 临时类型断言以访问API返回的字段
          const userInfo = {
            id: apiData.adminId?.toString() || '1',
            username: apiData.username,
            name: apiData.username, // 使用username作为显示名称
            role: apiData.role?.toLowerCase() || 'admin', // 转换为小写以匹配UserInfo类型
            roleName: apiData.roleName,
            status: apiData.status?.toLowerCase() || 'active', // 转换为小写以匹配UserInfo类型
            createTime: apiData.createdTime || new Date().toISOString(),
            lastLoginTime: apiData.lastLoginTime,
            permissions: apiData.permissions || ['dashboard', 'transactions', 'users', 'settings', 'permissions']
          }
          console.log('📝 映射后的用户信息:', userInfo)
          onLogin(userInfo)
        } else {
          console.warn('⚠️ 获取用户信息失败，使用登录返回的基本信息')
          // 如果获取用户信息失败，使用默认信息
          const userInfo = {
            id: '1',
            username: 'admin',
            name: 'admin',
            role: 'admin' as const,
            status: 'active' as const,
            createTime: new Date().toISOString(),
            permissions: ['dashboard', 'transactions', 'users', 'settings', 'permissions']
          }
          onLogin(userInfo)
        }
      } catch (error) {
        console.error('❌ 获取用户信息失败:', error)
        // 如果获取用户信息失败，使用默认信息
        const userInfo = {
          id: '1',
          username: 'admin',
          name: 'admin',
          role: 'admin' as const,
          status: 'active' as const,
          createTime: new Date().toISOString(),
          permissions: ['dashboard', 'transactions', 'users', 'settings', 'permissions']
        }
        onLogin(userInfo)
      }
    },
    onError: (error) => {
      console.error('❌ 登录失败:', error.message)
      // 登录失败后刷新验证码
      loadCaptcha()
    }
  })

  // 加载验证码
  const loadCaptcha = async () => {
    try {
      const response = await authApi.getCaptcha()
      if (response.success) {
        setCaptchaKey(response.data.key)
        setCaptchaImage(response.data.captcha)
      }
    } catch (error) {
      console.error('获取验证码失败:', error)
      // 如果API不可用，使用模拟验证码
      setCaptchaImage('8A5C')
    }
  }

  // 初始化时加载验证码
  useEffect(() => {
    loadCaptcha()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 基本验证
    if (!loginForm.username || !loginForm.password) {
      alert('请输入用户名和密码')
      return
    }

    if (!loginForm.captcha) {
      alert('请输入验证码')
      return
    }

    // 提交登录请求
    const loginData: LoginRequest = {
      ...loginForm,
      // 如果有验证码key，添加到请求中
      ...(captchaKey && { captchaKey })
    }

    await submit(loginData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <img src="/移动支付.svg" alt="logo" className="logo-icon" width={30} height={30} />
              <h1>移动支付管理系统</h1>
            </div>
            <p>请输入您的登录凭据</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error.message}</div>}

            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginForm.username}
                onChange={handleInputChange}
                placeholder="请输入用户名"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="captcha">验证码</label>
              <div className="captcha-group">
                <input
                  type="text"
                  id="captcha"
                  name="captcha"
                  value={loginForm.captcha}
                  onChange={handleInputChange}
                  placeholder="请输入验证码"
                  required
                />
                <div className="captcha-code" onClick={loadCaptcha} style={{ cursor: 'pointer' }}>
                  {captchaImage || '8A5C'}
                </div>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="remember_me"  // 修正字段名
                  checked={loginForm.remember_me}
                  onChange={handleInputChange}
                />
                <span>记住我</span>
              </label>
              <a href="#" className="forgot-password">忘记密码？</a>
            </div>

            <button
              type="submit"
              className={`login-button ${submitting ? 'loading' : ''}`}
              disabled={submitting}
            >
              {submitting ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="login-tips">
            <h4>测试账户：</h4>
            <div className="test-accounts">
              <div>超级管理员：admin / admin123</div>
              <div>操作员：operator / op123</div>
              <div>查看员：viewer / view123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
