import { getState, setRecords, setSearch, setSettings, setSort } from './state.js';
import { validateRecord, normalizeDescription, isValidImport } from './validators.js';
import { applySettings, clearForm, fillForm, renderRecords, renderStats } from './ui.js';

const $ = (id) => document.getElementById(id);

function uid() {
  return `rec_${Math.random().toString(36).slice(2, 8)}`;
}

function rerender() {
  const state = getState();
  renderRecords(state, editRecord, deleteRecord);
  renderStats(state);
}

function editRecord(id) {
  const rec = getState().records.find((r) => r.id === id);
  if (rec) fillForm(rec);
}

function deleteRecord(id) {
  if (!window.confirm('Delete this record?')) return;
  setRecords(getState().records.filter((r) => r.id !== id));
  rerender();
}

function bindForm() {
  $('record-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = {
      id: $('record-id').value || uid(),
      description: $('description').value,
      amount: $('amount').value,
      category: $('category').value,
      date: $('date').value,
    };

    raw.description = normalizeDescription(raw.description);
    const result = validateRecord(raw);
    if (!result.valid) {
      $('form-errors').textContent = result.errors.join(' ');
      return;
    }

    $('form-errors').textContent = '';
    const now = new Date().toISOString();
    const existing = getState().records.find((r) => r.id === raw.id);
    const record = {
      ...raw,
      amount: Number(raw.amount),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    const next = existing
      ? getState().records.map((r) => (r.id === record.id ? record : r))
      : [...getState().records, record];

    setRecords(next);
    clearForm();
    rerender();
  });

  $('form-reset').addEventListener('click', () => {
    $('form-errors').textContent = '';
    clearForm();
  });
}

function bindSearchSort() {
  $('search-input').addEventListener('input', () => {
    setSearch($('search-input').value, $('search-case').checked);
    rerender();
  });
  $('search-case').addEventListener('change', () => {
    setSearch($('search-input').value, $('search-case').checked);
    rerender();
  });
  $('sort-key').addEventListener('change', () => {
    setSort($('sort-key').value);
    rerender();
  });
}

function bindSettings() {
  $('save-settings').addEventListener('click', () => {
    const cap = Number($('cap-amount').value);
    const eur = Number($('rate-eur').value);
    const gbp = Number($('rate-gbp').value);
    const categories = $('categories').value.split(',').map((c) => c.trim()).filter(Boolean);

    setSettings({
      baseCurrency: $('base-currency').value,
      rates: { EUR: eur, GBP: gbp },
      capAmount: Number.isFinite(cap) ? cap : 0,
      categories,
    });

    applySettings(getState().settings);
    $('settings-feedback').textContent = 'Settings saved.';
    rerender();
  });

  $('export-json').addEventListener('click', () => {
    const payload = JSON.stringify({ records: getState().records, settings: getState().settings }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = $('download-link');
    link.href = url;
    link.download = 'student-finance-export.json';
    link.click();
    URL.revokeObjectURL(url);
    $('settings-feedback').textContent = 'Export completed.';
  });

  $('import-json').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || !isValidImport(data.records || data)) {
        throw new Error('Invalid data structure.');
      }
      const records = data.records || data;
      setRecords(records);
      if (data.settings) setSettings(data.settings);
      applySettings(getState().settings);
      rerender();
      $('settings-feedback').textContent = 'Import successful.';
    } catch (err) {
      $('settings-feedback').textContent = `Import failed: ${err.message}`;
    }
  });
}

function init() {
  applySettings(getState().settings);
  bindForm();
  bindSearchSort();
  bindSettings();
  rerender();
}

init();
