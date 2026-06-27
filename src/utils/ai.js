// AI suggestion engine — local, rule-based (no API)
// Future: POST /functions/v1/ai-suggest { status, priority, notes } → OpenAI via Supabase Edge Function

const rules = [
  ['New',           'High',   '🔥 התקשר לליד הזה בשעה הקרובה — עדיפות גבוהה! אל תמתין.'],
  ['New',           'Medium', '📞 צור קשר עוד היום עם שיחת היכרות קצרה.'],
  ['New',           'Low',    '📧 שלח הודעת פתיחה ב-WhatsApp עם קישור למידע נוסף.'],
  ['Contacted',     'High',   '⚡ עקוב מיד — שלח הצעת ערך ספציפית לעסק שלהם.'],
  ['Contacted',     'Medium', '📋 קבע שיחת Discovery של 15 דקות להבנת הצרכים.'],
  ['Contacted',     'Low',    '📅 שלח WhatsApp ידידותי ובדוק מתי נוח להם לדבר.'],
  ['Follow Up',     'High',   '💬 שלח WhatsApp קצר עכשיו — ההמתנה ארוכה מדי!'],
  ['Follow Up',     'Medium', '💬 שלח תזכורת WhatsApp — שאל אם יש שאלות פתוחות.'],
  ['Follow Up',     'Low',    '📩 שלח Follow-up קצר ואדיב עד סוף השבוע.'],
  ['Proposal Sent', 'High',   '📊 עקוב דחוף — שאל אם יש שאלות על ההצעה שקיבלו.'],
  ['Proposal Sent', 'Medium', '📄 שאל בנימוס מה דעתם על ההצעה ואם צריכים הבהרות.'],
  ['Proposal Sent', 'Low',    '⏳ המתן עוד 2–3 ימים ואז שלח פולואפ עדין.'],
  ['Closed Won',    null,     '🎉 מדהים! קבע שיחת Onboarding ובקש הפניות ממרוצים.'],
  ['Closed Lost',   null,     '📅 ארכב לעכשיו ותזכר לחזור תוך 60 יום עם עדכון חדש.'],
]

export const getAISuggestion = (lead) => {
  const match = rules.find(
    ([status, priority]) =>
      status === lead.status && (priority === null || priority === lead.priority)
  )
  return match ? match[2] : '📋 בדוק את הליד והחלט על הצעד הבא.'
}
