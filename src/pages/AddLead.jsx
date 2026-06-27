import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LeadForm from '../components/LeadForm'
import { createLead } from '../services/leadService'

export default function AddLead() {
  const navigate = useNavigate()
  const [loading, setSaving] = useState(false)
  const [saved,   setSaved]  = useState(false)

  const handleSubmit = async (formData) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    createLead(formData)
    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate('/dashboard'), 1000)
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main">
        <div className="container add-lead-page">

          <div className="page-header">
            <Link to="/dashboard" className="details-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              חזרה ל-Dashboard
            </Link>
            <div className="page-header-title">הוספת ליד חדש</div>
            <div className="page-header-sub">מלא את הפרטים להוספת איש קשר חדש לצינור המכירות שלך.</div>
          </div>

          {saved && (
            <div className="alert alert-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              הליד נשמר בהצלחה! מעביר לדשבורד…
            </div>
          )}

          <div className="add-lead-layout">
            <div className="add-lead-form-card">
              <LeadForm onSubmit={handleSubmit} loading={loading} />
            </div>

            <div className="add-lead-sidebar">
              <div className="tip-card">
                <h4>💡 טיפים להוספת ליד</h4>
                <div className="tip-list">
                  <div className="tip-item">הוסף הערה ראשונה עם ההקשר של הפגישה/שיחה.</div>
                  <div className="tip-item">בחר מקור נכון כדי לעקוב אחר הערוצים הטובים ביותר.</div>
                  <div className="tip-item">הגדר תאריך מעקב — זה מה שמונע ממך לשכוח.</div>
                  <div className="tip-item">עדיפות High = ליד חם שצריך מגע ראשוני מהיר.</div>
                </div>
              </div>

              <div className="tip-card">
                <h4>🏷️ מדריך סטטוסים</h4>
                <div className="tip-list">
                  <div className="tip-item"><strong>New</strong> — נוסף, טרם פנינו.</div>
                  <div className="tip-item"><strong>Contacted</strong> — פנייה ראשונה בוצעה.</div>
                  <div className="tip-item"><strong>Follow Up</strong> — ממתין לתגובה.</div>
                  <div className="tip-item"><strong>Proposal Sent</strong> — הצעת מחיר נשלחה.</div>
                  <div className="tip-item"><strong>Closed Won</strong> — עסקה נסגרה! 🎉</div>
                  <div className="tip-item"><strong>Closed Lost</strong> — לא הצליח הפעם.</div>
                </div>
              </div>

              <div className="tip-card" style={{ background: 'var(--primary-light)', borderColor: 'rgba(37,99,235,0.2)' }}>
                <h4 style={{ color: 'var(--primary)' }}>🤖 AI מוכן</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  לאחר ההוספה, כנס לפרטי הליד וקבל המלצת AI מותאמת אישית לצעד הבא.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
