// src/types/router.d.ts
// TypeScript-Erweiterung für Vue Router Meta-Felder

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // Seitentitel für document.title
    title?: string
    // Route benötigt Authentifizierung
    requiresAuth?: boolean
    // Route sollte für eingeloggte User versteckt sein (z.B. Login/Register)
    hideForAuth?: boolean
    // Route benötigt Admin-Berechtigung
    requiresAdmin?: boolean
  }
}
