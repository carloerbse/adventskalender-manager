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
  background-color: var(--background);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 1.2rem;
  position: relative;
  transition: all 0.3s ease;
}

.pouch-item:hover {
  border-color: #A60B08;
  box-shadow: 0 4px 12px rgba(166, 11, 8, 0.15);
}

.pouch-item.packed {
  background-color: rgba(16, 46, 25, 0.05);
  border-color: #102E19;
}

.pouch-item.editing {
  border-color: #76584C;
}

/* Säckchen Nummer */
.pouch-number {
  position: absolute;
  top: -10px;
  right: 12px;
  background: linear-gradient(135deg, #A60B08 0%, #5E0D01 100%);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.pouch-item.packed .pouch-number {
  background: linear-gradient(135deg, #102E19 0%, #1a4525 100%);
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
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content-text,
.notes-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text);
  word-wrap: break-word;
  font-weight: 500;
}

.content-text.empty {
  color: var(--text-secondary);
  font-style: italic;
  font-weight: 400;
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
  background-color: var(--surface);
  border: 2px solid #A60B08;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #A60B08;
  box-shadow: 0 2px 4px rgba(166, 11, 8, 0.15);
}

.btn-toggle:hover {
  background-color: #fff5f5;
  border-color: #5E0D01;
  color: #5E0D01;
  box-shadow: 0 2px 8px rgba(166, 11, 8, 0.2);
}

.btn-toggle.packed {
  background-color: #102E19;
  border-color: #102E19;
  color: white;
  box-shadow: 0 2px 4px rgba(16, 46, 25, 0.2);
}

.btn-toggle.packed:hover {
  background-color: #1a4525;
  border-color: #1a4525;
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
  background-color: #76584C;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background-color: #5d4439;
}

/* Form Fields */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.form-group textarea {
  padding: 0.7rem;
  border: 2px solid var(--border);
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  background-color: var(--background);
  color: var(--text);
  transition: border-color 0.2s;
  font-weight: 500;
}

.form-group textarea:focus {
  outline: none;
  border-color: #102E19;
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
  background-color: #102E19;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-save:hover {
  background-color: #1a4525;
}

.btn-cancel {
  padding: 0.7rem 1rem;
  background-color: #A60B08;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #5E0D01;
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
