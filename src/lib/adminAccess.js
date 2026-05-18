export const allowedAdminEmails = ['orevaorior@gmail.com', 'jovisamblue@gmail.com']

export function isAllowedAdminEmail(email) {
  if (!email) return false
  return allowedAdminEmails.includes(email.trim().toLowerCase())
}
