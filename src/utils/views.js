// Client for the backend's view/interaction counters (/views/... — see
// devboard-backend/app/routers/views.py). Counting always happens; whether
// visitors *see* the numbers is a separate, deliberate switch below.
//
// Every call here is best-effort: a counter is a statistic, so a failed
// request resolves to null and callers render nothing rather than showing an
// error on a page that otherwise loaded fine.

const API_URL = import.meta.env.VITE_API_URL;

// Public display is opt-in per deploy (VITE_SHOW_VIEW_COUNTS=true), so the
// counters can quietly accumulate real numbers first — a fresh "2 views" on a
// post says nothing useful and makes good writing look unread.
export const SHOW_VIEW_COUNTS = import.meta.env.VITE_SHOW_VIEW_COUNTS === "true";

// Minimum views inside the API's trailing window before anything earns a
// "trending" badge, so one visitor (or one bored author hitting refresh)
// can't crown a post.
export const TRENDING_MIN_RECENT_VIEWS = 5;

// One count per item per page load. The API already de-duplicates by visitor
// for hours, so this is really about not firing redundant requests — notably
// under React StrictMode, which mounts effects twice in development.
const alreadyCounted = new Set();

const countUrl = (type, id) => `https://${API_URL}/views/${type}/${encodeURIComponent(id)}`;

/**
 * Count one view/interaction and resolve to that item's current counts
 * ({ content_type, content_id, total_views, recent_views }), or null if the
 * counter is unavailable. Repeat calls for the same item in one page load
 * just read the count back instead of posting again.
 */
export function recordView(type, id) {
  if (!id) return Promise.resolve(null);

  const key = `${type}:${id}`;
  const isRepeat = alreadyCounted.has(key);
  alreadyCounted.add(key);

  return fetch(countUrl(type, id), isRepeat ? undefined : { method: "POST" })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
}

/** Counts for every viewed item of one type, keyed by content id. */
export function fetchViewCounts(type) {
  return fetch(`https://${API_URL}/views/${type}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((list) =>
      list
        ? Object.fromEntries(list.map((entry) => [entry.content_id, entry]))
        : null
    )
    .catch(() => null);
}

/**
 * The content id to badge as trending: most-viewed in the API's trailing
 * window, provided it clears TRENDING_MIN_RECENT_VIEWS. Null when nothing
 * does — no badge is better than a meaningless one.
 */
export function findTrendingId(counts) {
  if (!counts) return null;

  const leader = Object.values(counts).reduce(
    (best, entry) => (!best || entry.recent_views > best.recent_views ? entry : best),
    null
  );

  return leader && leader.recent_views >= TRENDING_MIN_RECENT_VIEWS
    ? leader.content_id
    : null;
}
