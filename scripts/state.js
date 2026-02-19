import { loadData, loadSettings, saveData, saveSettings } from './storage.js';

const defaultSettings = {
  baseCurrency: 'USD',
  rates: { EUR: 0.92, GBP: 0.79 },
  capAmount: 500,
  categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
};

const state = {
  records: loadData(),
  settings: { ...defaultSettings, ...loadSettings() },
  searchPattern: '',
  searchCaseInsensitive: true,
  sortKey: 'date_desc',
};

export function getState() { return state; }

export function setRecords(records) {
  state.records = records;
  saveData(records);
}

export function setSettings(settings) {
  state.settings = { ...state.settings, ...settings };
  saveSettings(state.settings);
}

export function setSearch(pattern, caseInsensitive) {
  state.searchPattern = pattern;
  state.searchCaseInsensitive = caseInsensitive;
}

export function setSort(sortKey) {
  state.sortKey = sortKey;
}
