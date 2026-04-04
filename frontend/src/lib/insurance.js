export const SUPPORTED_CITIES = [
  'Mumbai',
  'Delhi',
  'Jaipur',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Gurgaon',
  'Noida',
  'Lucknow',
  'Chandigarh',
  'Indore',
];

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function getRiskTone(riskLevel = '') {
  const normalized = riskLevel.toLowerCase();
  if (normalized === 'high') {
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  }
  if (normalized === 'medium') {
    return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
  }
  return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
}
