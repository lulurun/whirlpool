export const getSegments = (hash = window.location.hash) => {
  if (!hash || hash.length <= 1) return [];
  return hash.replace(/^#/, '').split('/').filter(Boolean);
};

export const getPrimaryRoute = (hash = window.location.hash) => {
  const [first = ''] = getSegments(hash);
  return first || 'overview';
};

export const getUserRoute = (hash = window.location.hash) => {
  const segments = getSegments(hash);
  if (segments[0] !== 'users') {
    return { userId: null, section: null };
  }
  const userId = segments[1] ? parseInt(segments[1], 10) : null;
  const section = segments[2] || 'profile';
  return { userId: Number.isFinite(userId) ? userId : null, section };
};
