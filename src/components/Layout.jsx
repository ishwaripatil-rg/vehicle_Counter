import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children, onLogout }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header onLogout={onLogout} />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  )
}
