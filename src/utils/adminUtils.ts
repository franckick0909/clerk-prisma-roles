export async function checkAdminStatus(): Promise<boolean> {
  const response = await fetch('/api/check-admin')
  const data = await response.json()
  return data.isAdmin
} 