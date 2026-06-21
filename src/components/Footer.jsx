import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          LeadFlow <span>AI</span>
        </div>
        <p className="footer-copy">© {year} LeadFlow AI. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add-lead">Add Lead</Link>
        </div>
      </div>
    </footer>
  )
}
