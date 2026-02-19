export function compileRegex(input, caseInsensitive = true) {
  if (!input) return null;
  try {
    return new RegExp(input, caseInsensitive ? 'gi' : 'g');
  } catch {
    return null;
  }
}

export function highlight(text, regex) {
  if (!regex) return escapeHtml(text);
  regex.lastIndex = 0;
  return escapeHtml(text).replace(regex, (m) => `<mark>${m}</mark>`);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
