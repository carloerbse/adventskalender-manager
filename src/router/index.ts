// src/router/index.ts
// Vue Router Konfiguration mit Auth Guards

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Route-Definitionen mit Meta-Informationen
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard',
    meta: {
      title: 'Adventskalender-Manager',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: 'Login - Adventskalender-Manager',
      requiresAuth: false,
      hideForAuth: true // Bereits eingeloggte User sollen nicht auf Login-Seite
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: {
      title: 'Registrieren - Adventskalender-Manager',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      title: 'Dashboard - Adventskalender-Manager',
      requiresAuth: true
    }
  },
  // Weitere Routen werden in Phase 3 hinzugefügt:
  // - /calendar (Kalender-Liste)
  // - /calendar/:id (Kalender-Details)
  // - /calendar/:id/edit
  // - /admin (Admin-Panel)
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard für geschützte Routen
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Seitentitel setzen
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Session-Check beim ersten Laden (wenn noch nicht initialisiert)
  if (!authStore.isInitialized) {
    await authStore.checkSession()
  }

  // Route benötigt Authentifizierung
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔒 Route benötigt Auth, weiterleiten zu /login')
    next('/login')
    return
  }

  // Route sollte für authentifizierte User versteckt sein (z.B. Login/Register)
  if (to.meta.hideForAuth && authStore.isAuthenticated) {
    console.log('👤 Bereits eingeloggt, weiterleiten zu /dashboard')
    next('/dashboard')
    return
  }

  // Admin-Only Route (wird in späteren Phasen gebraucht)
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.log('⛔ Admin-Berechtigung erforderlich')
    next('/dashboard')
    return
  }

  next()
})

export default router
