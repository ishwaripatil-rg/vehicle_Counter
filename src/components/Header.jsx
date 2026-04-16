import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const pageMeta = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview of vehicle counting activity' },
  '/process': { title: 'Process Video', sub: 'Upload and configure vehicle detection' },
  '/results': { title: 'Results', sub: 'View detection results and statistics' },
  '/downloads': { title: 'Downloads', sub: 'Export data and output videos' },
}

const notifications = [
  { icon: '✅', color: 'green', title: 'Processing Complete', desc: 'highway_cam_01.mp4 finished', time: '2 min ago' },
  { icon: '⚠️', color: 'orange', title: 'Low Confidence Warning', desc: 'Confidence dropped below 0.4', time: '15 min ago' },
  { icon: '📥', color: 'blue', title: 'CSV Ready', desc: 'Your export is ready to download', time: '1 hr ago' },
]

export default function Header({ onLogout }) {
  const location = useLocation()
  const meta = pageMeta[location.pathname] || { title: 'Vehicle Counter', sub: '' }
  const [showNotif, setShowNotif] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <header className="header">
      {/* Title */}
      <div className="header-title">
        <div className="header-page-title">{meta.title}</div>
        <div className="header-page-sub">{meta.sub}</div>
      </div>

      {/* Search */}
      <div className="header-search">
        <span className="search-icon-wrap">🔍</span>
        <input
          type="text"
          placeholder="Search videos, results..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="header-actions">
        {/* Notification */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-btn"
            onClick={() => { setShowNotif(p => !p); setShowProfile(false) }}
          >
            🔔
            <span className="notif-dot" />
          </button>

          {showNotif && (
            <div className="notif-panel" style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
              width: '320px', zIndex: 999,
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', fontWeight: 700, fontSize: '14px' }}>
                Notifications
              </div>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', padding: '13px 16px',
                  borderBottom: i < notifications.length - 1 ? '1px solid var(--border-light)' : 'none',
                  cursor: 'pointer', transition: 'var(--transition)',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: n.color === 'green' ? '#dcfce7' : n.color === 'orange' ? '#fef3c7' : '#dbeafe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', flexShrink: 0,
                  }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{n.desc}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <div
            className="header-profile"
            onClick={() => { setShowProfile(p => !p); setShowNotif(false) }}
          >
            <div className="profile-avatar">A</div>
            <span className="profile-name">Admin</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
          </div>

          {showProfile && (
            <div className="dropdown-menu" style={{ display: 'block' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Admin User</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>admin@vehiclecounter.ai</div>
              </div>

              <div className="dropdown-item">⚙️ Settings</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item danger" onClick={() => { setShowProfile(false); setTimeout(() => onLogout(), 300) }}>🚪 Sign Out</div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(showNotif || showProfile) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 998 }}
          onClick={() => { setShowNotif(false); setShowProfile(false) }}
        />
      )}
    </header>
  )
}
