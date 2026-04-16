import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'ROI Mask' },
  { id: 3, label: 'Count Line' },
  { id: 4, label: 'Configure' },
  { id: 5, label: 'Results' },
]

const VEHICLE_TYPES = [
  { id: 'car',        emoji: '🚗', label: 'Car' },
  { id: 'bus',        emoji: '🚌', label: 'Bus' },
  { id: 'truck',      emoji: '🚚', label: 'Truck' },
  { id: 'bike',       emoji: '🏍️', label: 'Bike' },
  { id: 'auto',       emoji: '🛺', label: 'Auto-rickshaw' },
  { id: 'van',        emoji: '🚐', label: 'Van' },
]

const INIT_COUNTS = { car: 0, bus: 0, truck: 0, bike: 0, auto: 0, van: 0 }

const LOG_COLORS = { info: 'log-info', success: 'log-success', warning: 'log-warning', error: 'log-error', default: 'log-line' }

export default function ProcessPage() {
  const navigate = useNavigate()
  const [step, setStep]           = useState(1)
  const [videoFile, setVideoFile] = useState(null)
  const [videoURL,  setVideoURL]  = useState(null)
  const [dragOver,  setDragOver]  = useState(false)

  // ROI
  const roiCanvasRef  = useRef(null)
  const [roiPoints,   setRoiPoints]   = useState([])
  const [roiConfirmed, setRoiConfirmed] = useState(false)

  // Line
  const lineCanvasRef = useRef(null)
  const [linePoints,  setLinePoints]  = useState([])
  const [lineConfirmed, setLineConfirmed] = useState(false)

  // Config
  const [startTime,   setStartTime]   = useState('00:00:00')
  const [confidence,  setConfidence]  = useState(0.5)
  const [selTypes,    setSelTypes]    = useState(['car','bus','truck','bike','auto','van'])

  // Processing
  const [processing,  setProcessing]  = useState(false)
  const [progress,    setProgress]    = useState(0)
  const [fps,         setFps]         = useState(0)
  const [eta,         setEta]         = useState('—')
  const [counts,      setCounts]      = useState(INIT_COUNTS)
  const [logs,        setLogs]        = useState([])
  const intervalRef   = useRef(null)
  const logRef        = useRef(null)

  /* ---------- helpers ---------- */
  const addLog = (msg, type = 'default') => {
    const ts = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { ts, msg, type }])
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  /* ---------- upload ---------- */
  const handleFile = (file) => {
    if (!file) return
    setVideoFile(file)
    setVideoURL(URL.createObjectURL(file))
    setRoiPoints([]); setRoiConfirmed(false)
    setLinePoints([]); setLineConfirmed(false)
    setCounts(INIT_COUNTS); setProgress(0)
    setLogs([])
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('video/')) handleFile(f)
  }

  /* ---------- ROI canvas ---------- */
  const drawROI = useCallback(() => {
    const canvas = roiCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (roiPoints.length === 0) return

    ctx.strokeStyle = '#2563eb'
    ctx.fillStyle   = 'rgba(37,99,235,0.15)'
    ctx.lineWidth   = 2
    ctx.setLineDash([6, 3])
    ctx.beginPath()
    ctx.moveTo(roiPoints[0].x, roiPoints[0].y)
    roiPoints.forEach(p => ctx.lineTo(p.x, p.y))
    if (roiConfirmed) { ctx.closePath(); ctx.fill() }
    ctx.stroke()

    roiPoints.forEach((p, i) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = i === 0 ? '#10b981' : '#2563eb'
      ctx.setLineDash([])
      ctx.fill()
    })
  }, [roiPoints, roiConfirmed])

  useEffect(() => { drawROI() }, [drawROI])

  const handleROIClick = (e) => {
    if (roiConfirmed) return
    const canvas = roiCanvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top)  * scaleY
    setRoiPoints(prev => [...prev, { x, y }])
  }

  /* ---------- Line canvas ---------- */
  const drawLine = useCallback(() => {
    const canvas = lineCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (linePoints.length === 0) return

    if (linePoints.length >= 2) {
      // Draw angled line
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth   = 3
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(linePoints[0].x, linePoints[0].y)
      ctx.lineTo(linePoints[1].x, linePoints[1].y)
      ctx.stroke()

      // Arrow
      const dx = linePoints[1].x - linePoints[0].x
      const dy = linePoints[1].y - linePoints[0].y
      const angle = Math.atan2(dy, dx)
      const mx = (linePoints[0].x + linePoints[1].x) / 2
      const my = (linePoints[0].y + linePoints[1].y) / 2
      ctx.beginPath()
      ctx.moveTo(mx, my)
      ctx.lineTo(mx - 12 * Math.cos(angle - 0.4), my - 12 * Math.sin(angle - 0.4))
      ctx.lineTo(mx - 12 * Math.cos(angle + 0.4), my - 12 * Math.sin(angle + 0.4))
      ctx.closePath()
      ctx.fillStyle = '#ef4444'
      ctx.fill()

      // Label
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 13px Inter, sans-serif'
      ctx.fillText('COUNT LINE', mx + 8, my - 8)
    }

    linePoints.forEach((p, i) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
      ctx.fillStyle = i === 0 ? '#10b981' : '#ef4444'
      ctx.setLineDash([])
      ctx.fill()
    })
  }, [linePoints])

  useEffect(() => { drawLine() }, [drawLine])

  const handleLineClick = (e) => {
    if (lineConfirmed || linePoints.length >= 2) return
    const canvas = lineCanvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top)  * scaleY
    setLinePoints(prev => [...prev, { x, y }])
  }

  /* ---------- processing ---------- */
  const startProcessing = () => {
    setProcessing(true)
    setProgress(0)
    setCounts(INIT_COUNTS)
    setLogs([])
    addLog('🚀 Initializing YOLO model...', 'info')

    let prog = 0
    intervalRef.current = setInterval(() => {
      prog += Math.random() * 3 + 0.5
      if (prog >= 100) { prog = 100; clearInterval(intervalRef.current); setProcessing(false); addLog('✅ Processing complete!', 'success') }

      setProgress(Math.min(prog, 100))
      setFps(Math.floor(Math.random() * 10 + 24))
      const elapsed = prog / 100 * 120
      const rem = Math.max(0, 120 - elapsed)
      setEta(`${Math.floor(rem / 60)}m ${Math.floor(rem % 60)}s`)

      setCounts(prev => ({
        car:   prev.car   + Math.floor(Math.random() * 3),
        bus:   prev.bus   + (Math.random() > 0.85 ? 1 : 0),
        truck: prev.truck + (Math.random() > 0.88 ? 1 : 0),
        bike:  prev.bike  + (Math.random() > 0.75 ? 1 : 0),
        auto:  prev.auto  + (Math.random() > 0.80 ? 1 : 0),
        van:   prev.van   + (Math.random() > 0.92 ? 1 : 0),
      }))

      if (Math.random() > 0.85) {
        const msgs = [
          ['Vehicle detected crossing line', 'success'],
          ['Frame processed', 'info'],
          ['Applying confidence filter', 'info'],
          ['Bounding box updated', 'info'],
        ]
        const [msg, type] = msgs[Math.floor(Math.random() * msgs.length)]
        addLog(msg, type)
      }
    }, 300)
  }

  const stopProcessing = () => {
    clearInterval(intervalRef.current)
    setProcessing(false)
    addLog('⛔ Processing stopped by user.', 'warning')
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  const toggleType = (id) => {
    setSelTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  /* ---------- render ---------- */
  return (
    <div>
      <div className="section-header">
        <div className="section-title">Process Video</div>
        <div className="section-subtitle">Follow the steps to configure and run vehicle detection</div>
      </div>

      {/* Wizard Steps */}
      <div className="wizard-steps">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`wizard-step ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}
            onClick={() => { if (step > s.id) setStep(s.id) }}
          >
            <div className="step-circle">
              {step > s.id ? '✓' : s.id}
            </div>
            <div className="step-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ===== STEP 1: UPLOAD ===== */}
      {step === 1 && (
        <div className="card card-body">
          <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>📂 Upload Video</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Drag &amp; drop a video file or click to browse. Supported: MP4, AVI, MOV, MKV
          </p>

          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('videoInput').click()}
          >
            <div className="upload-icon">🎬</div>
            <div className="upload-title">Drag &amp; drop your video here</div>
            <div className="upload-sub">or <span>click to browse</span> from your computer</div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>Max file size: 2GB • MP4, AVI, MOV, MKV</p>
            <input id="videoInput" type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          </div>

          {videoFile && (
            <div className="file-info-bar">
              <span className="file-icon">🎬</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{videoFile.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</div>
              </div>
              <button className="file-remove" onClick={e => { e.stopPropagation(); setVideoFile(null); setVideoURL(null) }}>✕</button>
            </div>
          )}

          <div className="step-nav">
            <div />
            <button className="btn btn-primary" disabled={!videoFile} onClick={() => setStep(2)}>
              Next: Draw ROI →
            </button>
          </div>
        </div>
      )}

      {/* ===== STEP 2: ROI MASK ===== */}
      {step === 2 && (
        <div className="card card-body">
          <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>🖊️ Draw ROI Mask</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
            Click on the preview to place polygon points. The ROI defines the active detection zone.
          </p>

          <div className="canvas-wrap" style={{ position: 'relative' }}>
            {videoURL
              ? <video src={videoURL} style={{ width: '100%', display: 'block', borderRadius: 'var(--radius)' }} muted />
              : <div className="canvas-placeholder"><p>🎥</p><p>Video preview will appear here</p></div>
            }
            <canvas
              ref={roiCanvasRef}
              width={800} height={450}
              onClick={handleROIClick}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: roiConfirmed ? 'default' : 'crosshair' }}
            />
          </div>

          <div className="canvas-controls mt-12">
            <button className="btn btn-outline" onClick={() => setRoiPoints(prev => prev.slice(0, -1))}>↩ Undo</button>
            <button className="btn btn-danger" onClick={() => { setRoiPoints([]); setRoiConfirmed(false) }}>🗑 Clear ROI</button>
            <button className="btn btn-success" disabled={roiPoints.length < 3 || roiConfirmed} onClick={() => setRoiConfirmed(true)}>✓ Confirm ROI</button>
            {roiConfirmed && <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '13px' }}>✅ ROI Confirmed ({roiPoints.length} points)</span>}
          </div>

          <div className="step-nav">
            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Draw Line →</button>
          </div>
        </div>
      )}

      {/* ===== STEP 3: COUNT LINE ===== */}
      {step === 3 && (
        <div className="card card-body">
          <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>📏 Draw Count Line</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
            Click two points on the preview to define the angled counting line. Vehicles crossing this line will be counted.
          </p>

          <div className="canvas-wrap" style={{ position: 'relative' }}>
            {videoURL
              ? <video src={videoURL} style={{ width: '100%', display: 'block', borderRadius: 'var(--radius)' }} muted />
              : <div className="canvas-placeholder"><p>🎥</p><p>Video preview will appear here</p></div>
            }
            <canvas
              ref={lineCanvasRef}
              width={800} height={450}
              onClick={handleLineClick}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: (lineConfirmed || linePoints.length >= 2) ? 'default' : 'crosshair' }}
            />
          </div>

          <div className="canvas-controls mt-12">
            <button className="btn btn-danger" onClick={() => { setLinePoints([]); setLineConfirmed(false) }}>🔄 Reset Line</button>
            <button className="btn btn-success" disabled={linePoints.length < 2 || lineConfirmed} onClick={() => setLineConfirmed(true)}>✓ Confirm Line</button>
            {lineConfirmed && <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '13px' }}>✅ Count Line Confirmed</span>}
          </div>

          {linePoints.length === 1 && (
            <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--primary)' }}>📍 Point 1 placed — click to place Point 2</p>
          )}

          <div className="step-nav">
            <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>Next: Configure →</button>
          </div>
        </div>
      )}

      {/* ===== STEP 4: CONFIGURE ===== */}
      {step === 4 && (
        <div>
          <div className="config-grid">
            {/* Left config */}
            <div className="config-card">
              <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '15px' }}>⚙️ Detection Settings</h4>

              <div className="config-field">
                <label>Manual Start Time (HH:MM:SS)</label>
                <input type="text" className="config-input" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="00:00:00" />
              </div>

              <div className="config-field">
                <label>Confidence Threshold — <strong style={{ color: 'var(--primary)' }}>{confidence.toFixed(2)}</strong></label>
                <div className="slider-row">
                  <input type="range" min="0.1" max="1" step="0.01" value={confidence} onChange={e => setConfidence(parseFloat(e.target.value))} />
                  <span className="slider-val">{confidence.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {confidence < 0.4 ? '⚠️ Low confidence — more false positives' : confidence > 0.7 ? '🎯 High confidence — stricter detection' : '✅ Balanced confidence level'}
                </p>
              </div>
            </div>

            {/* Right config */}
            <div className="config-card">
              <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '15px' }}>🚦 Vehicle Type Selection</h4>
              <div className="type-grid">
                {VEHICLE_TYPES.map(t => (
                  <div
                    key={t.id}
                    className={`type-chip ${selTypes.includes(t.id) ? 'selected' : ''}`}
                    onClick={() => toggleType(t.id)}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                    {selTypes.includes(t.id) && <span style={{ marginLeft: 'auto', fontSize: '11px' }}>✓</span>}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '14px' }}>
                {selTypes.length} of {VEHICLE_TYPES.length} types selected
              </p>
            </div>
          </div>

          {/* Processing Controls */}
          <div className="card card-body mt-20">
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button className="btn btn-primary" disabled={processing} onClick={startProcessing} style={{ flex: 1 }}>
                {processing ? '⏳ Processing...' : '🚀 Start Processing'}
              </button>
              <button className="btn btn-danger" disabled={!processing} onClick={stopProcessing}>
                ⛔ Stop
              </button>
            </div>

            {/* Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Progress</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{progress.toFixed(1)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="proc-stats">
                <div className="proc-stat"><div className="ps-val">{fps}</div><div className="ps-lbl">FPS</div></div>
                <div className="proc-stat"><div className="ps-val">{eta}</div><div className="ps-lbl">ETA</div></div>
                <div className="proc-stat"><div className="ps-val">{total}</div><div className="ps-lbl">Vehicles</div></div>
                <div className="proc-stat"><div className="ps-val">{progress.toFixed(0)}%</div><div className="ps-lbl">Complete</div></div>
              </div>
            </div>
          </div>

          {/* Live Preview + Count Cards */}
          <div className="process-cols mt-20">
            <div>
              <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '15px' }}>📹 Live Preview</div>
              <div className="live-preview-box">
                {processing
                  ? <div className="live-placeholder"><div className="live-icon">📡</div><p>Processing live feed...</p></div>
                  : <div className="live-placeholder"><div className="live-icon">📺</div><p>Start processing to see live preview</p></div>
                }
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '15px' }}>🔢 Vehicle Counts</div>
              <div className="count-cards">
                {VEHICLE_TYPES.map(t => (
                  <div className="count-card" key={t.id}>
                    <div className="count-emoji">{t.emoji}</div>
                    <div className="count-num">{counts[t.id]}</div>
                    <div className="count-label">{t.label}</div>
                  </div>
                ))}
                <div className="count-card total-card">
                  <div className="count-emoji">🚦</div>
                  <div className="count-num">{total}</div>
                  <div className="count-label">Total Vehicles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontWeight: 700, marginBottom: '10px', fontSize: '15px' }}>📋 Processing Logs</div>
            <div className="log-panel" ref={logRef}>
              {logs.length === 0
                ? <div className="log-line">// Logs will appear here when processing starts...</div>
                : logs.map((l, i) => (
                    <div key={i} className={`log-line ${LOG_COLORS[l.type] || ''}`}>
                      <span style={{ color: '#475569' }}>[{l.ts}]</span> {l.msg}
                    </div>
                  ))
              }
            </div>
          </div>

          <div className="step-nav">
            <button className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
            <button className="btn btn-primary" disabled={progress < 100} onClick={() => setStep(5)}>
              View Results →
            </button>
          </div>
        </div>
      )}

      {/* ===== STEP 5: RESULTS PREVIEW ===== */}
      {step === 5 && (
        <div className="card card-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ fontWeight: 800, fontSize: '24px', marginBottom: '8px' }}>Processing Complete!</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
            All {total} vehicles have been counted and logged successfully.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/results')}>📈 View Full Results</button>
            <button className="btn btn-success" onClick={() => navigate('/downloads')}>⬇️ Download Data</button>
            <button className="btn btn-outline" onClick={() => { setStep(1); setVideoFile(null); setVideoURL(null); setCounts(INIT_COUNTS); setProgress(0); setLogs([]); }}>
              🔄 Process Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
