module.exports = function(value, decimals) {
  if (value === null || value === undefined) {
    return '';
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    return value;
  }

  const decimalPlaces = decimals !== undefined ? parseInt(decimals) : 2;
  return num.toFixed(decimalPlaces) + '%';
};
