// Raftar design tokens (admin web).
// Keep in sync with Raftar/app/src/theme/tokens.js: same values, same names.

export const palette = {
  primary: '#013E37',
  primaryPressed: '#012C27',
  accent: '#F4B400',
  accentPressed: '#DCA200',
  cream: '#FFEFB3',
  onAccent: '#FFEFB3', // text/icons on theme colors.accent (= Deep Teal). Not for gold: use text on gold.
  text: '#0F1F1C',
  textMuted: '#4F6964',
  placeholder: '#5E7A74',
  surface: '#EAF2EF',
  background: '#FBFAF5',
  card: '#FFFFFF',
  border: '#E3ECE8',
  warning: '#5B6B68',
  success: '#0F7B3E',
  successBg: '#E6F4EA',
  onPrimaryMuted: '#B7D3CB',
  disabledBg: '#E3ECE8',
  disabledText: '#5E7A74',
  white: '#FFFFFF',
  overlay: 'rgba(15,31,28,0.45)',
  primaryBorder: 'rgba(1,62,55,0.35)',
  primaryShadow: 'rgba(1,62,55,0.28)',
  goldDark: '#8A5A00',
};

export const serviceTints = {
  ride: { bg: '#013E37', icon: '#F4B400' },
  carpool: { bg: '#E6F4EA', icon: '#0F7B3E' },
  monthly: { bg: '#E2EFEA', icon: '#0B5C52' },
  parcel: { bg: '#FFF4D1', icon: '#8A5A00' },
  intercity: { bg: '#EAF6DC', icon: '#3F6F14' },
};

// Status tag colors for tables: { bg, fg }
export const statusTints = {
  active: { bg: '#E6F4EA', fg: '#0F7B3E' },
  completed: { bg: '#E6F4EA', fg: '#0F7B3E' },
  pending: { bg: '#FFF4D1', fg: '#8A5A00' },
  inProgress: { bg: '#E2EFEA', fg: '#0B5C52' },
  inactive: { bg: '#EAF2EF', fg: '#5B6B68' },
  cancelled: { bg: '#EAF2EF', fg: '#5B6B68' },
};

export const fontFamily = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

export const typography = {
  display: { fontSize: 30, fontWeight: 800 },
  pageTitle: { fontSize: 28, fontWeight: 800 },
  amount: { fontSize: 40, fontWeight: 900 },
  kpi: { fontSize: 28, fontWeight: 800 },
  title: { fontSize: 22, fontWeight: 800 },
  cardTitle: { fontSize: 17, fontWeight: 700 },
  body: { fontSize: 15, fontWeight: 400, lineHeight: 1.5 },
  small: { fontSize: 13, fontWeight: 500 },
  overline: { fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' },
  tableHead: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' },
  button: { fontSize: 16, fontWeight: 700 },
};

export const radius = {
  field: 14,
  button: 18,
  card: 20,
  cardLarge: 24,
  sheet: 28,
  chip: 999,
};

export const spacing = { xs: 4, s: 8, m: 10, l: 12, xl: 16, xxl: 24, screen: 20 };

export const shadows = {
  soft: '0 4px 12px rgba(15,31,28,0.06)',
  primary: '0 8px 16px rgba(1,62,55,0.22)',
};

export const formatRs = (amount) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `Rs ${amount ?? 0}`;
  return `Rs ${n.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
};
