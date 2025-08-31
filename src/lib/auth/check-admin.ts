// Client-side admin session check
export function checkAdminSession() {
  if (typeof window === 'undefined') return false;
  
  const sessionStr = localStorage.getItem('adminSession');
  if (!sessionStr) return false;
  
  try {
    const session = JSON.parse(sessionStr);
    // Check if session is valid (e.g., not expired - 24 hours)
    const loginTime = new Date(session.loginAt).getTime();
    const now = new Date().getTime();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > 24) {
      localStorage.removeItem('adminSession');
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function getAdminSession() {
  if (typeof window === 'undefined') return null;
  
  const sessionStr = localStorage.getItem('adminSession');
  if (!sessionStr) return null;
  
  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('adminSession');
}