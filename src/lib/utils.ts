/*
 * Deterministic color palette for categories
 */
const categoryColors: Record<string, string> = {
  Coding: 'bg-blue-100 text-blue-800',
  Productivity: 'bg-green-100 text-green-800',
  Writing: 'bg-purple-100 text-purple-800',
  Design: 'bg-pink-100 text-pink-800',
  'Video & Audio': 'bg-orange-100 text-orange-800',
  Marketing: 'bg-yellow-100 text-yellow-800',
  Research: 'bg-indigo-100 text-indigo-800',
  Other: 'bg-gray-100 text-gray-800',
};

export function getCategoryColor(category: string): string {
  return categoryColors[category] || 'bg-gray-100 text-gray-800';
}

/*
 * Rating badge color
 */
export function getRatingColor(rating: number): string {
  if (rating >= 9) return 'bg-green-600';
  if (rating >= 8) return 'bg-blue-600';
  if (rating >= 7) return 'bg-yellow-500';
  return 'bg-red-500';
}

/*
 * Dimension labels
 */
export const dimensionLabels: Record<string, string> = {
  'ease-of-use': 'Ease of Use',
  features: 'Features',
  value: 'Value for Money',
  performance: 'Performance',
  ecosystem: 'Support & Ecosystem',
};

/*
 * Format date
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
