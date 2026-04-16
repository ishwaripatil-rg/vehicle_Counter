import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import ProcessPage from './pages/ProcessPage'
import ResultsPage from './pages/ResultsPage'
import DownloadsPage from './pages/DownloadsPage'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <BrowserRouter>
      <Layout onLogout={() => setIsLoggedIn(false)}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
