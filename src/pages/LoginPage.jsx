import { useState } from 'react'
import img1 from '../assets/img1.png'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin()
    }, 1200)
  }

  return (
    <div className="login-page">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">🚗</div>
          <span className="login-brand-name">Vehicle Counter</span>
        </div>

        <img
          src={img1}
          alt="Vehicle detection illustration"
          className="login-illustration"
        />

        <div className="login-tagline">
          <h2>Vehicle Counter System</h2>
          <p>AI-powered vehicle detection &amp; counting with precision angled line technology</p>
        </div>

        {/* <div className="login-stats">
          <div style={{ textAlign: 'center' }}>
            <div className="login-stat-num">99.2%</div>
            <div className="login-stat-lbl">Accuracy</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="login-stat-num">6+</div>
            <div className="login-stat-lbl">Vehicle Types</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="login-stat-num">60fps</div>
            <div className="login-stat-lbl">Processing</div>
          </div>
        </div> */}
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome back 👋</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="admin@vehiclecounter.ai"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <span className="forgot-link">Forgot password?</span>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Vehicle Counter — Angled Line Edition v2.0
          </p>
        </div>
      </div>
    </div>
  )
}
