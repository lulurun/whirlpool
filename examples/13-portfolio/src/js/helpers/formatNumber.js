module.exports = function(value, decimals) {
  if (value === null || value === undefined) {
    return '';
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    return value;
  }

  const decimalPlaces = decimals !== undefined ? parseInt(decimals) : 0;
  const fixed = num.toFixed(decimalPlaces);

  // Add thousand separators
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
};
