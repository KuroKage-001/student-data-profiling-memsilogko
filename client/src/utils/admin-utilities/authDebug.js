// Authentication Debug Utility
// Use this to debug authentication issues

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('=== Authentication Debug ===');
  console.log('Token exists:', !!token);
  console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('User exists:', !!user);
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('User data:', userData);
      console.log('User role:', userData.role);
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
  }
  
  console.log('=========================');
  
  return {
    hasToken: !!token,
    hasUser: !!user,
    token: token,
    user: user ? JSON.parse(user) : null
  };
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Authentication data cleared. Please log in again.');
};

export const testAuthEndpoint = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found. Please log in first.');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:8000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log('=== Auth Endpoint Test ===');
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('========================');
    
    return data;
  } catch (error) {
    console.error('Auth endpoint test failed:', error);
  }
};

// Add to window for easy access in console
if (typeof window !== 'undefined') {
  window.authDebug = {
    check: checkAuth,
    clear: clearAuth,
    test: testAuthEndpoint
  };
  
  console.log('Auth debug utilities loaded. Use:');
  console.log('  window.authDebug.check() - Check auth status');
  console.log('  window.authDebug.clear() - Clear auth data');
  console.log('  window.authDebug.test() - Test auth endpoint');
}