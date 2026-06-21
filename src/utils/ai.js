const suggestionsByStatus = {
  New: [
    'Reach out within 24 hours with a personalized intro email highlighting your top 2 features.',
    'Send a short intro message and attach a one-pager. Strike while interest is fresh.',
    'Call this lead today — response rates drop 80% after the first day of contact.',
  ],
  Contacted: [
    'Follow up with a short video walkthrough tailored to their industry.',
    'Send a case study from a similar company. Social proof will help move them forward.',
    'Schedule a 15-minute discovery call to understand their pain points in detail.',
  ],
  'In Progress': [
    'Share a ROI calculator or comparison doc to address any lingering objections.',
    'Offer a limited-time trial extension to reduce commitment friction.',
    'Loop in a decision-maker — ask your contact if their manager should join the next call.',
  ],
  Closed: [
    'Schedule a 30-day check-in call to ensure they are seeing value and onboarding smoothly.',
    'Ask for a referral or testimonial now while the excitement is highest.',
    'Introduce them to your customer success team to start the expansion conversation early.',
  ],
  Lost: [
    'Wait 60 days then reconnect with a relevant industry insight or product update.',
    'Send a brief "we improved X based on feedback like yours" email to re-spark interest.',
    'Add to a nurture sequence and revisit next quarter with a fresh angle.',
  ],
}

export const getAISuggestion = (lead) => {
  const options = suggestionsByStatus[lead.status] || suggestionsByStatus['New']
  const index = lead.id.charCodeAt(0) % options.length
  return options[index]
}
