<template>
  <div class="pouch-item" :class="{ packed: pouch.is_packed, editing: isEditing }">
    <!-- Säckchen Nummer Badge -->
    <div class="pouch-number">
      <span>{{ pouch.number }}</span>
    </div>

    <!-- Nicht-Bearbeitungs-Modus -->
    <div v-if="!isEditing" class="pouch-content">
      <div class="content-section">
        <label>Inhalt:</label>
        <p class="content-text" :class="{ empty: !pouch.content }">
          {{ pouch.content || 'Noch kein Inhalt' }}
        </p>
      </div>

      <div class="notes-section" v-if="pouch.notes">
        <label>Notizen:</label>
        <p class="notes-text">{{ pouch.notes }}</p>
      </div>

      <div class="actions">
        <button @click="togglePacked" class="btn-toggle" :class="{ packed: pouch.is_packed }">
          <span class="checkbox">{{ pouch.is_packed ? '✓' : '' }}</span>
          {{ pouch.is_packed ? 'Gepackt' : 'Nicht gepackt' }}
        </button>
        <button @click="startEdit" class="btn-edit">
          ✏️ Bearbeiten
        </button>
      </div>
    </div>

    <!-- Bearbeitungs-Modus -->
    <div v-else class="pouch-edit">
      <div class="form-group">
        <label for="content">Inhalt: <span class="char-count">{{ editContent.length }}/200</span></label>
        <textarea
          id="content"
          v-model="editContent"
          maxlength="200"
          rows="3"
          placeholder="Was kommt in dieses Säckchen?"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="notes">Notizen: <span class="char-count">{{ editNotes.length }}/500</span></label>
        <textarea
          id="notes"
          v-model="editNotes"
          maxlength="500"
          rows="2"
          placeholder="Optionale Notizen (z.B. wo gekauft, Preis, etc.)"
        ></textarea>
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" v-model="editIsPacked" />
          Als gepackt markieren
        </label>
      </div>

      <div class="actions">
        <button @click="saveEdit" class="btn-save">
          💾 Speichern
        </button>
        <button @click="cancelEdit" class="btn-cancel">
          ❌ Abbrechen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Pouch } from '../../types';

// Props
const props = defineProps<{
  pouch: Pouch;
}>();

// Emits
const emit = defineEmits<{
  update: [pouchId: number, content: string, notes: string, is_packed: boolean];
  toggle: [pouchId: number];
}>();

// State
const isEditing = ref(false);
const editContent = ref('');
const editNotes = ref('');
const editIsPacked = ref(false);

// Start Edit Mode
function startEdit() {
  editContent.value = props.pouch.content;
  editNotes.value = props.pouch.notes;
  editIsPacked.value = props.pouch.is_packed;
  isEditing.value = true;
}

// Cancel Edit
function cancelEdit() {
  isEditing.value = false;
  editContent.value = '';
  editNotes.value = '';
  editIsPacked.value = false;
}

// Save Edit
function saveEdit() {
  emit('update', props.pouch.id, editContent.value, editNotes.value, editIsPacked.value);
  isEditing.value = false;
}

// Toggle Packed Status (nur im Ansichtsmodus)
function togglePacked() {
  emit('toggle', props.pouch.id);
}
</script>

<style scoped>
.pouch-item {
  background-color: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 1.2rem;
  position: relative;
  transition: all 0.3s ease;
}

.pouch-item:hover {
  border-color: #42b983;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.1);
}

.pouch-item.packed {
  background-color: rgba(66, 185, 131, 0.05);
  border-color: #42b983;
}

.pouch-item.editing {
  border-color: #ffa500;
}

/* Säckchen Nummer */
.pouch-number {
  position: absolute;
  top: -10px;
  right: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.pouch-item.packed .pouch-number {
  background: linear-gradient(135deg, #42b983 0%, #2d8659 100%);
}

/* Content */
.pouch-content,
.pouch-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-section,
.notes-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.content-section label,
.notes-section label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content-text,
.notes-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text);
  word-wrap: break-word;
}

.content-text.empty {
  color: var(--color-text-muted);
  font-style: italic;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

/* Toggle Button */
.btn-toggle {
  flex: 1;
  padding: 0.7rem 1rem;
  background-color: #f0f0f0;
  border: 2px solid #d0d0d0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-toggle:hover {
  background-color: #e0e0e0;
  border-color: #42b983;
}

.btn-toggle.packed {
  background-color: #42b983;
  border-color: #42b983;
  color: white;
}

.checkbox {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

/* Edit Button */
.btn-edit {
  padding: 0.7rem 1rem;
  background-color: #ffa500;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background-color: #ff8c00;
}

/* Form Fields */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-weight: normal;
}

.form-group textarea {
  padding: 0.7rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
}

/* Checkbox Group */
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
}

.checkbox-group input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Save/Cancel Buttons */
.btn-save {
  flex: 1;
  padding: 0.7rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-save:hover {
  background-color: #2d8659;
}

.btn-cancel {
  padding: 0.7rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #c82333;
}

/* Responsive */
@media (max-width: 480px) {
  .pouch-item {
    padding: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-toggle,
  .btn-edit,
  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>
