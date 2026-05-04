const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

const getAuthUser = () => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const setAuthUser = (user, token) => {
    if (!user) return;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
};

const clearAuth = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

const displayFeedback = (elementId, message, success = false) => {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.textContent = message;
    container.style.color = success ? '#2e7d32' : '#d32f2f';
};

const createAuthMenu = (firstName) => {
    const menu = document.createElement('div');
    menu.className = 'auth-user-menu';
    menu.innerHTML = `
        <div class="auth-user-menu-content">
            <span class="auth-user-menu-title">Hi, ${firstName}</span>
            <a href="#" class="auth-logout">Logout</a>
        </div>
    `;
    return menu;
};

const updateAuthUI = () => {
    const user = getAuthUser();
    document.querySelectorAll('.header_wishlist').forEach((container) => {
        const anchor = container.querySelector('a');
        if (!anchor) return;

        const existingMenu = container.querySelector('.auth-user-menu');
        if (user) {
            anchor.href = '#';
            anchor.innerHTML = `<img src="assets/img/user.png" alt="Profile">`;
            anchor.classList.add('auth-user-link');
            anchor.setAttribute('title', `Signed in as ${user.first_name}`);

            if (!existingMenu) {
                const menu = createAuthMenu(user.first_name);
                container.appendChild(menu);
            } else {
                const title = existingMenu.querySelector('.auth-user-menu-title');
                if (title) title.textContent = `Hi, ${user.first_name}`;
            }
        } else {
            anchor.href = 'login.html';
            anchor.textContent = 'Login';
            anchor.classList.remove('auth-user-link');
            anchor.removeAttribute('title');
            if (existingMenu) {
                existingMenu.remove();
            }
        }
    });
};

const logout = () => {
    clearAuth();
    updateAuthUI();
    window.location.href = 'index-2.html';
};

const handleLoginForm = () => {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
            displayFeedback('loginFeedback', 'Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                displayFeedback('loginFeedback', data.message || 'Unable to login.');
                return;
            }

            setAuthUser(data.user, data.token);
            updateAuthUI();
            window.location.href = 'index-2.html';
        } catch (error) {
            displayFeedback('loginFeedback', 'Unable to login. Please try again later.');
            console.error('Login error:', error);
        }
    });
};

const handleRegisterForm = () => {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const first_name = document.getElementById('registerFirstName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();

        if (!first_name || !email || !password) {
            displayFeedback('registerFeedback', 'Please fill all fields.');
            return;
        }

        if (password.length < 6) {
            displayFeedback('registerFeedback', 'Password must be at least 6 characters.');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ first_name, email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                displayFeedback('registerFeedback', data.message || 'Unable to register.');
                return;
            }

            displayFeedback('registerFeedback', 'Registration successful. Redirecting to login...', true);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);
        } catch (error) {
            displayFeedback('registerFeedback', 'Unable to register. Please try again later.');
            console.error('Register error:', error);
        }
    });
};

const initAuthPage = () => {
    updateAuthUI();
    handleLoginForm();
    handleRegisterForm();
};

window.addEventListener('DOMContentLoaded', initAuthPage);

document.body.addEventListener('click', (event) => {
    const logoutButton = event.target.closest('.auth-logout');
    if (logoutButton) {
        event.preventDefault();
        logout();
        return;
    }

    const profileButton = event.target.closest('.auth-user-link');
    if (profileButton) {
        event.preventDefault();
        const container = profileButton.closest('.header_wishlist');
        if (!container) return;
        const menu = container.querySelector('.auth-user-menu');
        if (!menu) return;
        menu.classList.toggle('open');
        return;
    }

    document.querySelectorAll('.auth-user-menu.open').forEach(menu => {
        menu.classList.remove('open');
    });
});
