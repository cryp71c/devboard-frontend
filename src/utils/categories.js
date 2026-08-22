// Shared "origin" categories used to filter both the Blog and Projects pages.
// Distinct from the fine-grained tech tags shown on individual posts/cards —
// this is the coarser "where did this come from" axis (college coursework vs.
// self-directed work vs. dedicated security research).
export const CATEGORIES = ["College", "Personal", "Security Research"];

// Kept inside the black/red/metal palette: chrome for structured coursework,
// red as the dominant accent for personal work, amber (hazard-tape pairing
// with black/red) for security research — distinct from the red/green/chrome
// used by status badges so the two badge types never collide on one card.
const CATEGORY_STYLES = {
  College: "bg-zinc-800 text-zinc-300 border-zinc-500",
  Personal: "bg-red-950/60 text-red-400 border-red-700",
  "Security Research": "bg-amber-950/60 text-amber-400 border-amber-700",
};

export const categoryBadgeClass = (category) =>
  `px-3 py-1 rounded-sm text-xs font-semibold border whitespace-nowrap ${
    CATEGORY_STYLES[category] || "bg-zinc-800 text-zinc-300 border-zinc-600"
  }`;
