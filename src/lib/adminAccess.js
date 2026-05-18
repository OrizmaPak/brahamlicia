const allowedAdminEmails = [
  'orevaorior@gmail.com',
  'jovisamblue@gmail.com',
]

export const ADMIN_ALLOWLIST = new Set(allowedAdminEmails)

export function isAllowlistedAdminEmail(email) {
  if (typeof email !== 'string') return false
  return ADMIN_ALLOWLIST.has(email.trim().toLowerCase())
}
