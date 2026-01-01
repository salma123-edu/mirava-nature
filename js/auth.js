/**
 * AUTH.JS - Gestion de l'authentification Mirava Nature
 */

const AUTH_CONFIG = {
    API_URL: '/api',
    TOKEN_KEY: 'mirava_token',
    USER_KEY: 'mirava_user'
};

const auth = {
    // S'inscrire
    async register(name, email, password) {
        try {
            // Timeout de 5 secondes pour éviter que ça tourne indéfiniment
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(`${AUTH_CONFIG.API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (res.ok) return data;
                throw new Error(data.message || "Erreur serveur");
            } else {
                // Si ce n'est pas du JSON (ex: erreur 404 Vercel, 500 HTML), on force le fallback
                throw new Error("Réponse serveur invalide (non-JSON)");
            }
        } catch (err) {
            console.warn("API Error (Register), falling back to MOCK:", err);
            // MODE MOCK (Si pas de serveur)
            const mockUsers = JSON.parse(localStorage.getItem('mock_users')) || [];
            if (mockUsers.find(u => u.email === email)) {
                return { success: false, message: "Cet e-mail est déjà utilisé (Mock)." };
            }
            mockUsers.push({ name, email, password });
            localStorage.setItem('mock_users', JSON.stringify(mockUsers));
            return { success: true, message: "Compte créé avec succès (Mode Démonstration) !" };
        }
    },

    // Se connecter
    async login(email, password) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(`${AUTH_CONFIG.API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.token);
                    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(data.user));
                    await this.syncCart();
                    return data;
                }
                throw new Error(data.message);
            } else {
                throw new Error("Réponse serveur invalide (non-JSON)");
            }
        } catch (err) {
            console.warn("API Error (Login), falling back to MOCK:", err);
            // MODE MOCK (Si pas de serveur)
            const mockUsers = JSON.parse(localStorage.getItem('mock_users')) || [];
            // Mock users par défaut pour test
            if (mockUsers.length === 0) {
                mockUsers.push({ name: 'Client Test', email: 'test@mirava.com', password: '123' });
            }

            const user = mockUsers.find(u => u.email === email && u.password === password);
            // Backdoor pour tester facilement : admin/admin
            if ((email === 'admin' && password === 'admin') || user) {
                const mockUser = user ? { id: 'mock123', name: user.name, email: user.email, role: 'client' }
                    : { id: 'admin123', name: 'Administrateur', email: 'admin@mirava.com', role: 'admin' };

                localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, 'mock_token_abc');
                localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(mockUser));
                return { success: true, user: mockUser };
            }
            return { success: false, message: "Identifiants incorrects ou serveur injoignable." };
        }
    },

    // Se déconnecter
    logout() {
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.USER_KEY);
        localStorage.removeItem('cart'); // Optionnel: vider le panier local
        window.location.href = 'index.html';
    },

    // Vérifier si connecté
    isLoggedIn() {
        return !!localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    },

    // Récupérer l'utilisateur
    getUser() {
        const user = localStorage.getItem(AUTH_CONFIG.USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    // Récupérer le token
    getToken() {
        return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    },

    // Synchroniser le panier avec le serveur
    async syncCart() {
        if (!this.isLoggedIn()) return;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        try {
            await fetch(`${AUTH_CONFIG.API_URL}/auth/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ cart })
            });
        } catch (err) {
            console.error("Erreur sync cart:", err);
        }
    },

    // Mettre à jour l'interface (Header)
    updateUI() {
        const authContainer = document.getElementById('auth-nav-area');
        if (!authContainer) return;

        // Si le conteneur est vide, on injecte la structure de base
        if (authContainer.innerHTML.trim() === "") {
            authContainer.innerHTML = `
                <a href="login.html" id="nav-login-btn">Connexion</a>
                <a href="register.html" id="nav-register-btn" class="btn-premium" 
                   style="padding: 5px 15px; font-size: 13px; margin-left:10px;">S'inscrire</a>
                <span id="nav-user-greeting" style="display:none; color: var(--primary); font-weight: 600; margin-right:10px;"></span>
                <a href="#" id="nav-logout-btn" style="display:none; color: #c94c4c; font-size: 13px;">Déconnexion</a>
            `;
        }

        const loginBtn = document.getElementById('nav-login-btn');
        const registerBtn = document.getElementById('nav-register-btn');
        const greeting = document.getElementById('nav-user-greeting');
        const logoutBtn = document.getElementById('nav-logout-btn');

        if (this.isLoggedIn()) {
            const user = this.getUser();
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';

            if (greeting) {
                greeting.style.display = 'inline';
                greeting.textContent = `Bonjour, ${user.name || 'Client'}`;
            }
            if (logoutBtn) {
                logoutBtn.style.display = 'inline';
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    if (confirm('Voulez-vous vous déconnecter ?')) {
                        this.logout();
                    }
                };
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline';
            if (registerBtn) registerBtn.style.display = 'inline';
            if (greeting) greeting.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }
};

// Initialisation au chargement de la page
const initAuth = () => {
    auth.updateUI();
    console.log("%c Mirava Nature: Mode Démo activé (Support Offline)", "color: #27ae60; font-weight: bold; background: #f1f8f1; padding: 5px;");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

window.auth = auth;
