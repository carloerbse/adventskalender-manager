// src/stores/auth.ts
// Pinia Store für Authentifizierung

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '../types'

const API_BASE = 'http://localhost:8000'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false) // Tracker, ob Session-Check bereits erfolgt ist

  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Actions
  async function register(data: RegisterRequest): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // Wichtig für Cookies
      })

      const result = await response.json()

      if (!response.ok) {
        error.value = result.error || 'Registrierung fehlgeschlagen'
        return false
      }

      console.log('✅ Registrierung erfolgreich:', result.user.username)
      return true
    } catch (err) {
      error.value = 'Netzwerkfehler bei der Registrierung'
      console.error('❌ Registrierungsfehler:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function login(data: LoginRequest): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // Wichtig für Cookies
      })

      const result = await response.json()

      if (!response.ok) {
        error.value = result.error || 'Login fehlgeschlagen'
        return false
      }

      user.value = result.user
      console.log('✅ Login erfolgreich:', result.user.username)
      return true
    } catch (err) {
      error.value = 'Netzwerkfehler beim Login'
      console.error('❌ Login-Fehler:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        console.warn('⚠️ Logout-Request fehlgeschlagen, aber lokaler State wird zurückgesetzt')
      }

      user.value = null
      console.log('✅ Logout erfolgreich')
    } catch (err) {
      console.error('❌ Logout-Fehler:', err)
      // Lokalen State trotzdem zurücksetzen
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function checkSession(): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE}/api/auth/session`, {
        method: 'GET',
        credentials: 'include',
      })

      const result = await response.json()

      if (result.authenticated && result.user) {
        user.value = result.user
        console.log('✅ Session gültig:', result.user.username)
        isInitialized.value = true
        return true
      } else {
        user.value = null
        isInitialized.value = true
        return false
      }
    } catch (err) {
      console.error('❌ Session-Check-Fehler:', err)
      user.value = null
      isInitialized.value = true
      return false
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    isInitialized,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    register,
    login,
    logout,
    checkSession,
    clearError,
  }
})
