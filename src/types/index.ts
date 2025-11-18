// src/types/index.ts
// TypeScript Interfaces für den Adventskalender-Manager

/**
 * Benutzer-Interface
 */
export interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
  created_at: string;
  calendar_count?: number; // Für Admin-Übersicht
}

/**
 * Kalender-Interface
 */
export interface Calendar {
  id: number;
  user_id: number;
  name: string;
  description: string;
  created_at: string;
  packed_count: number; // Anzahl gepackte Säckchen
  total_pouches: number; // Gesamtanzahl Säckchen (immer 24)
  pouches?: Pouch[];
  progress?: CalendarProgress;
}

/**
 * Säckchen-Interface
 */
export interface Pouch {
  id: number;
  calendar_id: number;
  number: number; // 1-24
  content: string;
  notes: string;
  is_packed: boolean;
  created_at: string;
}

/**
 * Fortschritts-Interface
 */
export interface CalendarProgress {
  total: number; // Immer 24
  packed: number; // Anzahl gepackte Säckchen
  percentage: number; // Prozent (0-100)
}

/**
 * Session-Interface
 */
export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

/**
 * API Response Interfaces
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Login Request/Response
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  session: Session;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  username: string;
  password: string;
}
