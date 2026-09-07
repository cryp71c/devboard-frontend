import { SHOW_VIEW_COUNTS } from "../utils/views";

/**
 * A view/interaction count, styled to sit in the muted meta rows next to
 * dates and read times. `withSeparator` prepends the same "•" those rows use.
 *
 * Renders nothing at all — separator included — when public counts are
 * switched off, when the counter didn't load, or when the number is still
 * zero. Callers can therefore drop it in unconditionally instead of repeating
 * that check (and forgetting the separator half of it).
 */
function ViewCount({ count, label = "view", className = "", withSeparator = false }) {
  if (!SHOW_VIEW_COUNTS || !count) return null;

  return (
    <>
      {withSeparator && <span>•</span>}
      <span className={className}>
        {count.toLocaleString()} {label}
        {count === 1 ? "" : "s"}
      </span>
    </>
  );
}

export default ViewCount;
