const api = '';
const session = {
  token: sessionStorage.getItem('token'),
  username: sessionStorage.getItem('username'),
  role: sessionStorage.getItem('role')
};

if (
  (window.location.pathname.includes('dashboard.html') ||
   window.location.pathname.includes('resources.html')) &&
  (!session.token || !session.username)
) {
  window.location.href = 'login.html';
}

document.getElementById('login-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const username = e.target.username.value.trim();
  const password = e.target.password.value;
  const res = await fetch(`${api}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('role', data.role);
    window.location.href = 'dashboard.html';
  } else {
    alert(data.error);
  }
});

document.getElementById('register-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const username = e.target['new-username'].value.trim();
  const password = e.target['new-password'].value;
  const res = await fetch(`${api}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (res.ok) {
    alert('Registration successful! Please log in.');
    window.location.href = 'login.html';
  } else {
    const { error } = await res.json();
    alert(error || 'Registration failed.');
  }
});

document.getElementById('logout-btn')?.addEventListener('click', e => {
  e.preventDefault();
  sessionStorage.clear();
  window.location.href = 'login.html';
});

if (window.location.pathname.includes('dashboard.html')) {
  document.getElementById('user-display').textContent = session.username;

  fetch(`${api}/posts`, {
    headers: { Authorization: `Bearer ${session.token}` }
  })
    .then(r => r.json())
    .then(posts => {
      const mine = posts.filter(p => p.username === session.username);
      const container = document.getElementById('user-posts');
      if (container) {
        container.innerHTML =
          mine.map(p => `<p>${p.text}</p>`).join('') ||
          '<p>No posts yet.</p>';
      }
    });

  fetch(`${api}/resources`, {
    headers: { Authorization: `Bearer ${session.token}` }
  })
    .then(r => r.json())
    .then(resources => {
      const mine = resources.filter(r => r.username === session.username);
      const container = document.getElementById('user-resources');
      if (container) {
        container.innerHTML =
          mine
            .map(r => `<p><a href="${r.link}" target="_blank">${r.link}</a></p>`)
            .join('') ||
          '<p>No resources yet.</p>';
      }
    });
}

if (
  window.location.pathname.endsWith('index.html') ||
  window.location.pathname === '/' ||
  window.location.pathname.includes('resources.html')
) {
  const headers = session.token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }
    : { 'Content-Type': 'application/json' };

  fetch(`${api}/posts`, { headers })
    .then(r => r.json())
    .then(posts => {
      const container = document.getElementById('forum-posts');
      if (container) {
        container.innerHTML =
          posts.map(p => `<p><strong>${p.username}:</strong> ${p.text}</p>`).join('') ||
          '<p>No posts yet.</p>';
      }
    });

  fetch(`${api}/resources`, { headers })
    .then(r => r.json())
    .then(resources => {
      const container = document.getElementById('resources-list');
      if (container) {
        container.innerHTML =
          resources
            .map(r => `<p><strong>${r.username}:</strong> <a href="${r.link}" target="_blank">${r.link}</a></p>`)
            .join('') ||
          '<p>No resources yet.</p>';
      }
    });

  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('submit', async e => {
      e.preventDefault();
      const text = document.getElementById('new-post').value;
      await fetch(`${api}/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text })
      });
      window.location.reload();
    });
  }

  const resourceForm = document.getElementById('resource-form');
  if (resourceForm) {
    resourceForm.addEventListener('submit', async e => {
      e.preventDefault();
      const link = document.getElementById('resource-link').value;
      await fetch(`${api}/resources`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ link })
      });
      window.location.reload();
    });
  }
}
