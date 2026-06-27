// WhatsApp utility helpers
// Future: replace openWhatsApp with WhatsApp Business API call

export const formatPhoneForWhatsApp = (phone) => {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) return digits
  if (digits.startsWith('0')) return '972' + digits.slice(1)
  return '972' + digits
}

export const buildWhatsAppUrl = (phone, message = '') => {
  const formatted = formatPhoneForWhatsApp(phone)
  const base = `https://wa.me/${formatted}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const openWhatsApp = (phone, message = '') => {
  window.open(buildWhatsAppUrl(phone, message), '_blank', 'noopener,noreferrer')
}

export const applyTemplate = (template, lead) => {
  const firstName = lead.fullName.split(' ')[0]
  return template.content.replace(/\{name\}/g, firstName)
}
