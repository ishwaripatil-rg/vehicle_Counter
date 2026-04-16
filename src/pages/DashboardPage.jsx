import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart,
} from 'recharts'

const statCards = [
  { icon: '🎬', label: 'Total Videos Processed', value: '128', change: '+12 this week', dir: 'up', color: 'blue' },
  { icon: '🚗', label: 'Total Vehicles Counted', value: '48,291', change: '+3,420 today', dir: 'up', color: 'teal' },
  { icon: '⏱️', label: 'Avg Processing Time', value: '4m 32s', change: '-18s faster', dir: 'up', color: 'orange' },
  { icon: '📅', label: "Today's Activity", value: '9 Videos', change: '3 in progress', dir: 'up', color: 'green' },
]

const pieData = [
  { name: 'Car', value: 18420, color: '#2563eb' },
  { name: 'Bus', value: 4210, color: '#0d9488' },
  { name: 'Truck', value: 6380, color: '#f59e0b' },
  { name: 'Bike', value: 12800, color: '#10b981' },
  { name: 'Auto', value: 5180, color: '#8b5cf6' },
  { name: 'Other', value: 1301, color: '#94a3b8' },
]

const barData = [
  { day: 'Mon', car: 2400, bus: 400, truck: 600, bike: 1200 },
  { day: 'Tue', car: 3200, bus: 520, truck: 800, bike: 1800 },
  { day: 'Wed', car: 2800, bus: 480, truck: 650, bike: 1500 },
  { day: 'Thu', car: 3600, bus: 610, truck: 900, bike: 2100 },
  { day: 'Fri', car: 4100, bus: 720, truck: 1050, bike: 2400 },
  { day: 'Sat', car: 2900, bus: 350, truck: 450, bike: 1100 },
  { day: 'Sun', car: 1800, bus: 200, truck: 280, bike: 800 },
]

const lineData = [
  { time: '6am', fps: 12 }, { time: '8am', fps: 28 }, { time: '10am', fps: 45 },
  { time: '12pm', fps: 58 }, { time: '2pm', fps: 52 }, { time: '4pm', fps: 61 },
  { time: '6pm', fps: 48 }, { time: '8pm', fps: 30 }, { time: '10pm', fps: 14 },
]

const tableRows = [
  { name: 'highway_cam_01.mp4', date: '2026-04-15', status: 'success', count: 1842, statusText: 'Completed' },
  { name: 'junction_north.mp4', date: '2026-04-15', status: 'info', count: 963, statusText: 'Processing' },
  { name: 'bridge_east_4k.mp4', date: '2026-04-14', status: 'success', count: 2401, statusText: 'Completed' },
  { name: 'tollbooth_main.mp4', date: '2026-04-14', status: 'warning', count: 0, statusText: 'Queued' },
  { name: 'overpass_cam2.mp4', date: '2026-04-13', status: 'success', count: 3120, statusText: 'Completed' },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Section Header */}
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="section-title">Dashboard Overview</div>
          <div className="section-subtitle">Real-time statistics and vehicle detection analytics</div>
        </div>
        <button className="btn btn-primary">
          ➕ New Process
        </button>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        {statCards.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-change ${s.dir}`}>
                {s.dir === 'up' ? '↑' : '↓'} {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Pie Chart */}
        <div className="chart-card">
          <div className="card-header-row">
            <div>
              <div className="card-title">Vehicle Distribution</div>
              <div className="card-subtitle">By vehicle type</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <div className="card-header-row">
            <div>
              <div className="card-title">Weekly Vehicle Trend</div>
              <div className="card-subtitle">Count breakdown by day</div>
            </div>
            <select style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--surface-2)' }}>
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={12} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="car" fill="#2563eb" radius={[4,4,0,0]} name="Car" />
              <Bar dataKey="bus" fill="#0d9488" radius={[4,4,0,0]} name="Bus" />
              <Bar dataKey="truck" fill="#f59e0b" radius={[4,4,0,0]} name="Truck" />
              <Bar dataKey="bike" fill="#10b981" radius={[4,4,0,0]} name="Bike" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart - Full Width */}
      <div className="chart-card mb-24">
        <div className="card-header-row">
          <div>
            <div className="card-title">Processing Activity</div>
            <div className="card-subtitle">FPS throughput over time today</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={lineData}>
            <defs>
              <linearGradient id="fpsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="fps" stroke="#2563eb" strokeWidth={2.5} fill="url(#fpsGrad)" name="FPS" dot={{ fill: '#2563eb', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Table */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <div className="card-title">Recent Activity</div>
            <div className="card-subtitle">Latest processed videos</div>
          </div>
          <button className="btn btn-outline btn-sm">View All →</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Video Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Vehicle Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🎬</span>
                    <span style={{ fontWeight: 500 }}>{row.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{row.date}</td>
                <td><span className={`badge ${row.status}`}>{row.statusText}</span></td>
                <td><strong>{row.count > 0 ? row.count.toLocaleString() : '—'}</strong></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary btn-sm">View</button>
                    <button className="btn btn-outline btn-sm">⬇️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
