const DATA_KEY = 'sft:data';
const SETTINGS_KEY = 'sft:settings';

export const loadData = () => JSON.parse(localStorage.getItem(DATA_KEY) || '[]');
export const saveData = (records) => localStorage.setItem(DATA_KEY, JSON.stringify(records));

export const loadSettings = () => JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
export const saveSettings = (settings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
