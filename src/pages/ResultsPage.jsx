import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useNavigate } from 'react-router-dom'

const vehicleCounts = [
  { id: 'car',   emoji: '🚗', label: 'Car',           count: 18420, color: '#2563eb' },
  { id: 'bus',   emoji: '🚌', label: 'Bus',           count: 4210,  color: '#0d9488' },
  { id: 'truck', emoji: '🚚', label: 'Truck',         count: 6380,  color: '#f59e0b' },
  { id: 'bike',  emoji: '🏍️', label: 'Bike',          count: 12800, color: '#10b981' },
  { id: 'auto',  emoji: '🛺', label: 'Auto-rickshaw', count: 5180,  color: '#8b5cf6' },
  { id: 'van',   emoji: '🚐', label: 'Van',           count: 1301,  color: '#94a3b8' },
]

const total = vehicleCounts.reduce((a, b) => a + b.count, 0)

const pieData = vehicleCounts.map(v => ({ name: v.label, value: v.count, color: v.color }))

const hourlyData = [
  { hour: '6am',  count: 320 },
  { hour: '7am',  count: 890 },
  { hour: '8am',  count: 1820 },
  { hour: '9am',  count: 2340 },
  { hour: '10am', count: 1980 },
  { hour: '11am', count: 1560 },
  { hour: '12pm', count: 2100 },
  { hour: '1pm',  count: 2400 },
  { hour: '2pm',  count: 2180 },
  { hour: '3pm',  count: 1950 },
  { hour: '4pm',  count: 2620 },
  { hour: '5pm',  count: 3100 },
  { hour: '6pm',  count: 2800 },
  { hour: '7pm',  count: 1900 },
  { hour: '8pm',  count: 980  },
]

export default function ResultsPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="section-title">Detection Results</div>
          <div className="section-subtitle">highway_cam_01.mp4 · Processed on 2026-04-15 · Duration: 4m 32s</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-success" onClick={() => navigate('/downloads')}>⬇️ Export CSV</button>
          <button className="btn btn-primary">📹 Download Video</button>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon blue">🚗</div>
          <div>
            <div className="stat-label">Total Vehicles</div>
            <div className="stat-value">{total.toLocaleString()}</div>
            <div className="stat-change up">↑ Detection complete</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">🎯</div>
          <div>
            <div className="stat-label">Accuracy</div>
            <div className="stat-value">98.7%</div>
            <div className="stat-change up">↑ High confidence</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏱️</div>
          <div>
            <div className="stat-label">Processing Time</div>
            <div className="stat-value">4m 32s</div>
            <div className="stat-change up">↑ 60 FPS avg</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📏</div>
          <div>
            <div className="stat-label">Line Crossings</div>
            <div className="stat-value">{total.toLocaleString()}</div>
            <div className="stat-change up">↑ Angled line</div>
          </div>
        </div>
      </div>

      {/* Main results grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '24px' }}>
        {/* Count breakdowns */}
        <div className="chart-card">
          <div className="card-header-row">
            <div>
              <div className="card-title">Vehicle Breakdown</div>
              <div className="card-subtitle">Count per type</div>
            </div>
          </div>
          <div>
            {vehicleCounts.map(v => (
              <div className="results-count-row" key={v.id}>
                <div className="rc-left">
                  <span style={{ fontSize: '20px' }}>{v.emoji}</span>
                  <span>{v.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Mini bar */}
                  <div style={{ width: '80px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(v.count / total * 100)}%`, height: '100%', background: v.color, borderRadius: '3px' }} />
                  </div>
                  <span className="rc-val">{v.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {/* Total row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: 'linear-gradient(135deg, #eff6ff, #f0fdfa)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)', marginTop: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>🚦 Total</span>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Pie chart */}
        <div className="chart-card">
          <div className="card-header-row">
            <div>
              <div className="card-title">Distribution Chart</div>
              <div className="card-subtitle">Percentage breakdown by type</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                labelLine={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly bar chart */}
      <div className="chart-card mb-24">
        <div className="card-header-row">
          <div>
            <div className="card-title">Hourly Vehicle Count</div>
            <div className="card-subtitle">Vehicles detected per hour throughout the day</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={hourlyData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="count" name="Vehicles" radius={[5, 5, 0, 0]}
              fill="url(#barGrad)" />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Output video preview placeholder */}
      <div className="chart-card">
        <div className="card-header-row">
          <div>
            <div className="card-title">Output Video Preview</div>
            <div className="card-subtitle">Annotated video with bounding boxes and count overlay</div>
          </div>
          <button className="btn btn-primary btn-sm">📹 Download</button>
        </div>
        <div className="live-preview-box" style={{ margin: '0 20px 20px' }}>
          <div className="live-placeholder">
            <div className="live-icon">🎬</div>
            <p>Output video ready — click Download to save</p>
            <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={() => navigate('/downloads')}>
              ⬇️ Go to Downloads
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
