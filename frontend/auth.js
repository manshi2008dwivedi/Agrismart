const AUTH_KEY = 'agrismart-auth-token';
const authToken = () => localStorage.getItem(AUTH_KEY) || '';

function authHeaders(extra = {}) {
  const h = { 'Content-Type': 'application/json', ...extra };
  const t = authToken();
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: authHeaders(options.headers || {})
  });
  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) {
    if (response.status === 401 && !location.pathname.endsWith('auth.html')) {
      localStorage.removeItem(AUTH_KEY);
      const currentPage = location.pathname.split('/').pop() || 'index.html';
      sessionStorage.setItem('agrismart-auth-redirect', currentPage);
      location.href = 'auth.html?authRequired=1';
    }
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}

async function getMe() {
  const token = authToken();
  if (!token) throw new Error('No authentication token found.');
  return api('/api/auth/me');
}

async function requireAuth(role) {
  const token = authToken();
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  if (!token) {
    sessionStorage.setItem('agrismart-auth-redirect', currentPage);
    location.href = `auth.html?role=${encodeURIComponent(role || '')}&authRequired=1`;
    return null;
  }

  try {
    const data = await getMe();
    if (!data || !data.user) throw new Error('Invalid user session.');

    if (role && data.user.role !== role) {
      const isHi = window.currentLanguage === 'hi';
      const roleName = role === 'farmer' ? (isHi ? 'किसान' : 'Farmer') : (isHi ? 'व्यापारी' : 'Buyer');
      const userRoleName = data.user.role === 'farmer' ? (isHi ? 'किसान' : 'Farmer') : (isHi ? 'व्यापारी' : 'Buyer');
      const confirmSwitch = confirm(isHi
        ? `आप वर्तमान में ${userRoleName} के रूप में लॉगिन हैं। क्या आप ${roleName} डैशबोर्ड पर स्विच करना चाहते हैं?`
        : `You are currently logged in as a ${userRoleName}. Would you like to switch to the ${roleName} dashboard?`);
      if (confirmSwitch) {
        await switchRole(role);
        return null;
      } else {
        location.href = data.user.role === 'farmer' ? 'farmer.html' : 'buyer.html';
        return null;
      }
    }
    return data;
  } catch (err) {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.setItem('agrismart-auth-redirect', currentPage);
    location.href = `auth.html?role=${encodeURIComponent(role || '')}&authRequired=1`;
    return null;
  }
}

async function switchRole(targetRole) {
  try {
    const data = await api('/api/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role: targetRole })
    });
    if (data.token) saveAuth(data);
    const dest = targetRole === 'farmer' ? 'farmer.html' : 'buyer.html';
    location.href = dest;
  } catch (err) {
    alert(err.message || 'Failed to switch role.');
  }
}

async function logout() {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } catch {}
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem('agrismart-auth-redirect');
  location.href = 'auth.html';
}

function saveAuth(data) {
  if (data?.token) {
    localStorage.setItem(AUTH_KEY, data.token);
  }
  return data;
}

function addAuthNav(userRole) {
  const nav = document.querySelector('nav');
  if (!nav) return;

  if (!document.getElementById('navSwitchRoleBtn') && userRole) {
    const isFarmer = userRole === 'farmer';
    const switchLink = document.createElement('a');
    switchLink.id = 'navSwitchRoleBtn';
    switchLink.href = '#';
    switchLink.style.cssText = 'background:#2A7A4B;color:white;padding:5px 12px;border-radius:6px;font-weight:bold;font-size:13px;text-decoration:none;display:inline-flex;align-items:center;gap:4px;';
    switchLink.textContent = isFarmer
      ? (typeof window.t === 'function' ? ('🏢 ' + (window.t('switchToBuyer') || 'Switch to Buyer')) : '🏢 Switch to Buyer')
      : (typeof window.t === 'function' ? ('👨‍🌾 ' + (window.t('switchToFarmer') || 'Switch to Farmer')) : '👨‍🌾 Switch to Farmer');
    switchLink.addEventListener('click', e => {
      e.preventDefault();
      switchRole(isFarmer ? 'buyer' : 'farmer');
    });
    nav.append(switchLink);
  }

  // If logout link already present, don't duplicate
  if (document.getElementById('navLogoutLink')) return;

  const link = document.createElement('a');
  link.id = 'navLogoutLink';
  link.href = '#';
  link.style.color = '#c62828';
  link.textContent = typeof window.t === 'function' ? ('🚪 ' + window.t('logout')) : '🚪 Logout';
  link.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });
  nav.append(link);
}
