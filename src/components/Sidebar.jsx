import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard', badge: null },
  { icon: '⚙️', label: 'Process', path: '/process', badge: 'NEW' },
  { icon: '📈', label: 'Results', path: '/results', badge: null },
  { icon: '⬇️', label: 'Downloads', path: '/downloads', badge: null },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🚗</div>
        <div>
          <div className="sidebar-logo-title">Vehicle Counter</div>
          <div className="sidebar-logo-sub">Angled Line Edition</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="nav-icon">{item.icon}</div>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">Admin User</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>⚙️</span>
        </div>
      </div>
    </aside>
  )
}
