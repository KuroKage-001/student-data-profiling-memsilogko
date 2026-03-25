// Authentication Debug Utility
// Use this to debug authentication issues

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
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
};

export const testAuthEndpoint = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
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
    
    return data;
  } catch (error) {
    return null;
  }
};

// Debug utilities removed for production security