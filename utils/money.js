/**
 * Format a number with thousands separator
 * @param {number} value - The number to format
 * @returns {string} Formatted number with dot separator
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  // Convert to number in case the input is a string
  const num = typeof value === "string" ? parseFloat(value) : value;

  // Format with dot separators for thousands
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
