// Shared "origin" categories used to filter both the Blog and Projects pages.
// Distinct from the fine-grained tech tags shown on individual posts/cards —
// this is the coarser "where did this come from" axis (college coursework vs.
// self-directed work vs. dedicated security research).
export const CATEGORIES = ["College", "Personal", "Security Research"];

const CATEGORY_STYLES = {
  College: "bg-blue-900/50 text-blue-300 border-blue-700",
  Personal: "bg-indigo-900/50 text-indigo-300 border-indigo-700",
  "Security Research": "bg-red-900/50 text-red-300 border-red-700",
};

export const categoryBadgeClass = (category) =>
  `px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
    CATEGORY_STYLES[category] || "bg-gray-800 text-gray-300 border-gray-700"
  }`;
