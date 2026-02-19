export const patterns = {
  description: /^\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/i,
};

export function normalizeDescription(input) {
  return input.trim().replace(/\s{2,}/g, ' ');
}

export function validateRecord(record) {
  const errors = [];
  const description = normalizeDescription(record.description || '');
  if (!patterns.description.test(description)) errors.push('Description cannot have leading/trailing spaces.');
  if (patterns.duplicateWord.test(description)) errors.push('Description contains duplicate consecutive word (advanced regex rule).');
  if (!patterns.amount.test(String(record.amount))) errors.push('Amount must be a valid positive number with up to 2 decimals.');
  if (!patterns.date.test(record.date || '')) errors.push('Date must be valid YYYY-MM-DD format.');
  if (!patterns.category.test(record.category || '')) errors.push('Category must use letters, spaces, or hyphens only.');
  return { valid: errors.length === 0, errors, description };
}

export function isValidImport(data) {
  return Array.isArray(data) && data.every((r) => (
    r && typeof r.id === 'string' && typeof r.description === 'string' &&
    typeof r.amount === 'number' && typeof r.category === 'string' &&
    typeof r.date === 'string' && typeof r.createdAt === 'string' && typeof r.updatedAt === 'string'
  ));
}
