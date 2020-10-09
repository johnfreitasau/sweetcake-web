export const { format: formatPrice } = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});
