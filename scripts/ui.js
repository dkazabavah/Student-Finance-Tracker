import { compileRegex, highlight } from './search.js';

const $ = (id) => document.getElementById(id);

export function bindCategoryList(categories) {
  $('category-list').innerHTML = categories.map((c) => `<option value="${c}"></option>`).join('');
  $('categories').value = categories.join(', ');
}

export function applySettings(settings) {
  $('base-currency').value = settings.baseCurrency;
  $('rate-eur').value = settings.rates.EUR;
  $('rate-gbp').value = settings.rates.GBP;
  $('cap-amount').value = settings.capAmount;
  $('base-currency-label').textContent = settings.baseCurrency;
  bindCategoryList(settings.categories);
}

function sortRecords(records, sortKey) {
  const arr = [...records];
  const [key, dir] = sortKey.split('_');
  const sign = dir === 'desc' ? -1 : 1;
  arr.sort((a, b) => {
    if (key === 'amount') return (a.amount - b.amount) * sign;
    if (key === 'description') return a.description.localeCompare(b.description) * sign;
    return (new Date(a.date) - new Date(b.date)) * sign;
  });
  return arr;
}

export function renderRecords(state, onEdit, onDelete) {
  const regex = compileRegex(state.searchPattern, state.searchCaseInsensitive);
  const tbody = $('records-body');
  const cards = $('records-cards');
  const feedback = $('search-feedback');

  if (state.searchPattern && !regex) feedback.textContent = 'Invalid regex pattern.';
  else feedback.textContent = regex ? 'Regex compiled successfully.' : 'Showing all records.';

  const visible = sortRecords(state.records, state.sortKey).filter((r) => {
    if (!regex) return true;
    regex.lastIndex = 0;
    return regex.test(`${r.description} ${r.category} ${r.amount.toFixed(2)} ${r.date}`);
  });

  tbody.innerHTML = visible.map((r) => `
    <tr>
      <td>${highlight(r.description, regex)}</td>
      <td>${r.amount.toFixed(2)}</td>
      <td>${highlight(r.category, regex)}</td>
      <td>${r.date}</td>
      <td>
        <button data-edit="${r.id}">Edit</button>
        <button data-delete="${r.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  cards.innerHTML = visible.map((r) => `
    <article class="record-card">
      <h3>${highlight(r.description, regex)}</h3>
      <p><strong>Amount:</strong> ${r.amount.toFixed(2)}</p>
      <p><strong>Category:</strong> ${highlight(r.category, regex)}</p>
      <p><strong>Date:</strong> ${r.date}</p>
      <p>
        <button data-edit="${r.id}">Edit</button>
        <button data-delete="${r.id}">Delete</button>
      </p>
    </article>
  `).join('');

  document.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => onEdit(btn.dataset.edit)));
  document.querySelectorAll('[data-delete]').forEach((btn) => btn.addEventListener('click', () => onDelete(btn.dataset.delete)));
}

export function renderStats(state) {
  $('stat-total').textContent = state.records.length;
  const sum = state.records.reduce((acc, r) => acc + Number(r.amount), 0);
  $('stat-sum').textContent = sum.toFixed(2);

  const countByCategory = state.records.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(countByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  $('stat-top-category').textContent = top;

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  const trendRecords = state.records.filter((r) => new Date(r.date) >= sevenDaysAgo);
  const trendSum = trendRecords.reduce((acc, r) => acc + r.amount, 0);
  $('stat-trend').textContent = trendSum.toFixed(2);

  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sevenDaysAgo);
    d.setDate(sevenDaysAgo.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return trendRecords.filter((r) => r.date === key).reduce((acc, r) => acc + r.amount, 0);
  });
  const max = Math.max(...daily, 1);
  $('trend-chart').innerHTML = daily.map((v, idx) => `<div class="trend-bar" style="height:${Math.max(8, (v / max) * 100)}%" aria-label="day-${idx + 1}: ${v.toFixed(2)}"></div>`).join('');

  const capMsg = $('cap-live');
  if (sum > Number(state.settings.capAmount)) {
    capMsg.setAttribute('aria-live', 'assertive');
    capMsg.textContent = `Cap exceeded by ${(sum - state.settings.capAmount).toFixed(2)}.`;
  } else {
    capMsg.setAttribute('aria-live', 'polite');
    capMsg.textContent = `Remaining before cap: ${(state.settings.capAmount - sum).toFixed(2)}.`;
  }
}

export function fillForm(record) {
  $('record-id').value = record.id;
  $('description').value = record.description;
  $('amount').value = record.amount;
  $('category').value = record.category;
  $('date').value = record.date;
}

export function clearForm() {
  $('record-id').value = '';
  $('record-form').reset();
}
