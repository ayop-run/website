/**
 * @param {string} username normalized Instagram username (no @)
 */
export function instagramProfileUrl(username) {
  return `https://www.instagram.com/${encodeURIComponent(username)}/`;
}

/**
 * @param {string | null | undefined} displayName
 * @param {string | null | undefined} instagramUsername normalized, no @
 * @returns {string | null}
 */
export function formatPhotographerCredit(displayName, instagramUsername) {
  if (instagramUsername) {
    const handle = `@${instagramUsername}`;
    if (displayName) return `${displayName} (${handle})`;
    return handle;
  }
  if (displayName) return displayName;
  return null;
}
