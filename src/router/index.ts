// src/router/index.ts
// Vue Router Konfiguration

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Views werden später erstellt
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../App.vue'),
    meta: {
      title: 'Adventskalender-Manager',
      requiresAuth: false
    }
  },
  // Weitere Routen werden in Phase 2 & 3 hinzugefügt:
  // - /login
  // - /register
  // - /dashboard
  // - /calendar/:id
  // - /calendar/:id/edit
  // - /admin
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard für geschützte Routen (wird in Phase 2 implementiert)
router.beforeEach((to, _from, next) => {
  // TODO: Auth-Check implementieren
  // const isAuthenticated = checkAuth()
  // if (to.meta.requiresAuth && !isAuthenticated) {
  //   next('/login')
  // } else {
  //   next()
  // }
  
  // Seitentitel setzen
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  next()
})

export default router
