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

/**
 * Mischt die Inhalte aller 24 Säckchen eines Kalenders zufällig neu
 */
export async function shuffleCalendar(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/calendars/${id}/shuffle`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Fehler beim Mischen der Säckchen');
  }
}

/**
 * Exportiert einen Kalender als JSON oder CSV
 * Triggert automatisch einen Download im Browser
 */
export async function exportCalendar(id: number, format: 'json' | 'csv'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/calendars/${id}/export?format=${format}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Fehler beim Exportieren des Kalenders');
  }

  // Blob aus Response erstellen
  const blob = await response.blob();
  
  // Dateiname aus Content-Disposition Header extrahieren (falls vorhanden)
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `kalender_export_${Date.now()}.${format}`;
  
  if (contentDisposition) {
    // Versuche zuerst quoted filename zu matchen: filename="..."
    let filenameMatch = contentDisposition.match(/filename="([^"]+)"/i);
    if (!filenameMatch) {
      // Falls nicht quoted, versuche ohne Quotes: filename=...
      filenameMatch = contentDisposition.match(/filename=([^;]+)/i);
    }
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].trim();
    }
  }

  // Download-Link erstellen und triggern
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
