import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const exportHistory = [
  { name: 'highway_cam_01_results.csv', size: '48 KB', date: '2026-04-15 18:32', type: 'csv' },
  { name: 'highway_cam_01_output.mp4',  size: '142 MB', date: '2026-04-15 18:32', type: 'video' },
  { name: 'junction_north_results.csv', size: '32 KB', date: '2026-04-14 14:10', type: 'csv' },
  { name: 'bridge_east_4k_output.mp4',  size: '280 MB', date: '2026-04-14 14:10', type: 'video' },
]

export default function DownloadsPage() {
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(null)

  const handleDownload = (type) => {
    setDownloading(type)
    setTimeout(() => setDownloading(null), 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div className="section-title">Downloads</div>
        <div className="section-subtitle">Export your vehicle count data and annotated output videos</div>
      </div>

      {/* Main Download Cards */}
      <div className="download-cards mb-24">
        {/* CSV */}
        <div className="download-card" onClick={() => handleDownload('csv')}>
          <div className="download-card-icon">📊</div>
          <div className="download-card-title">Download CSV Report</div>
          <div className="download-card-desc">
            Export complete vehicle count data including timestamps, vehicle types, and crossing events.
          </div>
          <button
            className="btn btn-success"
            style={{ width: '100%' }}
            disabled={downloading === 'csv'}
          >
            {downloading === 'csv' ? '⏳ Preparing...' : '⬇️ Download CSV'}
          </button>
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Last export: highway_cam_01_results.csv · 48 KB
          </div>
        </div>

        {/* Video */}
        <div className="download-card" onClick={() => handleDownload('video')}>
          <div className="download-card-icon">🎬</div>
          <div className="download-card-title">Download Output Video</div>
          <div className="download-card-desc">
            Download the annotated video with bounding boxes, vehicle labels, and count overlay.
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={downloading === 'video'}
          >
            {downloading === 'video' ? '⏳ Preparing...' : '⬇️ Download Video'}
          </button>
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Last export: highway_cam_01_output.mp4 · 142 MB
          </div>
        </div>

        {/* Restart */}
        <div className="download-card" onClick={() => navigate('/process')}>
          <div className="download-card-icon">🔄</div>
          <div className="download-card-title">Process New Video</div>
          <div className="download-card-desc">
            Start a fresh processing session with a new video file and new ROI/line configuration.
          </div>
          <button
            className="btn btn-danger"
            style={{ width: '100%' }}
            onClick={(e) => { e.stopPropagation(); navigate('/process') }}
          >
            🔄 Start New Session
          </button>
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Clears current session data
          </div>
        </div>
      </div>

      {/* Export summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card card-body">
          <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>📋 Latest Results Summary</div>
          {[
            { label: 'Video File', value: 'highway_cam_01.mp4' },
            { label: 'Processed On', value: '2026-04-15 18:28' },
            { label: 'Duration', value: '4m 32s' },
            { label: 'Total Vehicles', value: '48,291' },
            { label: 'Confidence', value: '0.50' },
            { label: 'Avg FPS', value: '28.4 fps' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
              <span style={{ fontWeight: 600 }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div className="card card-body">
          <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>🚗 Vehicle Counts</div>
          {[
            { emoji: '🚗', label: 'Car',           count: '18,420' },
            { emoji: '🏍️', label: 'Bike',           count: '12,800' },
            { emoji: '🚚', label: 'Truck',          count: '6,380'  },
            { emoji: '🛺', label: 'Auto-rickshaw',  count: '5,180'  },
            { emoji: '🚌', label: 'Bus',            count: '4,210'  },
            { emoji: '🚐', label: 'Van',            count: '1,301'  },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span>{r.emoji}</span> {r.label}
              </span>
              <span style={{ fontWeight: 700, color: 'var(--primary)'}}>{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export History Table */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <div className="card-title">Export History</div>
            <div className="card-subtitle">Previously generated files</div>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exportHistory.map((f, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{f.type === 'csv' ? '📊' : '🎬'}</span>
                    <span style={{ fontWeight: 500 }}>{f.name}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${f.type === 'csv' ? 'success' : 'info'}`}>
                    {f.type === 'csv' ? 'CSV' : 'Video'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{f.size}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{f.date}</td>
                <td>
                  <button className="btn btn-primary btn-sm">⬇️ Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
