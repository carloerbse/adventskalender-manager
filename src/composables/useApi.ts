// src/composables/useApi.ts
// API-Funktionen für Backend-Kommunikation

import type { Calendar } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Holt alle Kalender des aktuellen Users
 */
export async function fetchCalendars(): Promise<Calendar[]> {
  const response = await fetch(`${API_BASE_URL}/calendars`, {
    method: 'GET',
    credentials: 'include', // Session-Cookie mitsenden
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Fehler beim Laden der Kalender');
  }

  const data = await response.json();
  return data.calendars;
}

/**
 * Holt einen einzelnen Kalender nach ID
 */
export async function fetchCalendar(id: number): Promise<Calendar> {
  const response = await fetch(`${API_BASE_URL}/calendars/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Fehler beim Laden des Kalenders');
  }

  const data = await response.json();
  return data.calendar;
}

/**
 * Erstellt einen neuen Kalender
 */
export async function createCalendar(
  name: string,
  description: string = ''
): Promise<Calendar> {
  const response = await fetch(`${API_BASE_URL}/calendars`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Fehler beim Erstellen des Kalenders');
  }

  const data = await response.json();
  return data.calendar;
}

/**
 * Aktualisiert einen bestehenden Kalender
 */
export async function updateCalendar(
  id: number,
  name: string,
  description: string = ''
): Promise<Calendar> {
  const response = await fetch(`${API_BASE_URL}/calendars/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Fehler beim Aktualisieren des Kalenders');
  }

  const data = await response.json();
  return data.calendar;
}

/**
 * Löscht einen Kalender
 */
export async function deleteCalendar(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/calendars/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Fehler beim Löschen des Kalenders');
  }
}
