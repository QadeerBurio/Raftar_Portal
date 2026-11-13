import { createTheme, alpha } from '@mui/material/styles';
import { palette, fontFamily, radius, shadows, typography } from './tokens';

// Single source of admin styling. Pages should rely on these overrides
// instead of per-page colors.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.primary, dark: palette.primaryPressed, contrastText: palette.cream },
    secondary: { main: palette.cream, contrastText: palette.primary },
    warning: { main: palette.accent, contrastText: palette.text },
    // No red in the product: "error" renders in Slate.
    error: { main: palette.warning, contrastText: palette.white },
    success: { main: palette.success, light: palette.successBg, contrastText: palette.white },
    info: { main: '#0B5C52', contrastText: palette.white },
    text: { primary: palette.text, secondary: palette.textMuted, disabled: palette.disabledText },
    background: { default: palette.background, paper: palette.card },
    divider: palette.border,
    action: {
      hover: alpha(palette.primary, 0.04),
      selected: alpha(palette.primary, 0.08),
      disabledBackground: palette.disabledBg,
      disabled: palette.disabledText,
    },
    brand: palette,
  },
  shape: { borderRadius: radius.field },
  typography: {
    fontFamily,
    h1: { ...typography.display },
    h2: { ...typography.display },
    h3: { ...typography.pageTitle },
    h4: { ...typography.pageTitle },
    h5: { ...typography.title },
    h6: { ...typography.cardTitle },
    subtitle1: { fontSize: 15, fontWeight: 600 },
    subtitle2: { fontSize: 13, fontWeight: 600, color: palette.textMuted },
    body1: { ...typography.body },
    body2: { fontSize: 14, lineHeight: 1.5 },
    caption: { fontSize: 12, fontWeight: 500, color: palette.textMuted },
    overline: { ...typography.overline, lineHeight: 1.5 },
    button: { ...typography.button, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: palette.background, color: palette.text },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius.button,
          minHeight: 44,
          paddingInline: 20,
          fontWeight: 700,
        },
        sizeLarge: { minHeight: 56 },
        containedPrimary: {
          backgroundColor: palette.primary,
          color: palette.cream,
          boxShadow: shadows.primary,
          '&:hover': { backgroundColor: palette.primaryPressed, boxShadow: shadows.primary },
        },
        containedSecondary: {
          backgroundColor: palette.cream,
          color: palette.primary,
          border: `1.5px solid ${palette.primaryBorder}`,
          '&:hover': { backgroundColor: '#FFE89A' },
        },
        // "money" variant: use color="warning" variant="contained"
        containedWarning: {
          backgroundColor: palette.accent,
          color: palette.text,
          '&:hover': { backgroundColor: palette.accentPressed },
        },
        outlined: {
          backgroundColor: palette.cream,
          color: palette.primary,
          borderColor: palette.primaryBorder,
          borderWidth: 1.5,
          '&:hover': { backgroundColor: '#FFE89A', borderColor: palette.primary, borderWidth: 1.5 },
        },
        text: { color: palette.primary },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { width: 40, height: 40, borderRadius: 12, color: palette.textMuted },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: radius.card },
        outlined: { borderColor: palette.border },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: radius.card,
          border: `1px solid ${palette.border}`,
          boxShadow: shadows.soft,
        },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.field,
          backgroundColor: palette.surface,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: palette.border },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.primary, borderWidth: 1.5 },
        },
        input: { '&::placeholder': { color: palette.placeholder, opacity: 1 } },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { color: palette.textMuted, '&.Mui-focused': { color: palette.primary } } },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { marginLeft: 2, fontSize: 12.5 } },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radius.chip, fontWeight: 600 },
        colorSuccess: { backgroundColor: palette.successBg, color: palette.success },
        colorWarning: { backgroundColor: '#FFF4D1', color: palette.goldDark },
        colorError: { backgroundColor: palette.surface, color: palette.warning },
        colorInfo: { backgroundColor: '#E2EFEA', color: '#0B5C52' },
        colorPrimary: { backgroundColor: palette.primary, color: palette.cream },
        colorSecondary: { backgroundColor: palette.cream, color: palette.primary },
        colorDefault: { backgroundColor: palette.surface, color: palette.textMuted },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { fontWeight: 700 },
        colorError: { backgroundColor: palette.accent, color: palette.text },
        colorPrimary: { backgroundColor: palette.accent, color: palette.text },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${palette.border}`, minHeight: 44 },
        indicator: { backgroundColor: palette.primary, height: 3, borderRadius: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 15,
          minHeight: 44,
          color: palette.textMuted,
          '&.Mui-selected': { color: palette.primary, fontWeight: 700 },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${palette.border}`, fontSize: 14, color: palette.text },
        head: {
          ...typography.tableHead,
          color: palette.textMuted,
          backgroundColor: palette.card,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&.MuiTableRow-hover:hover': { backgroundColor: alpha(palette.primary, 0.03) } },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: radius.cardLarge } },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radius.field, alignItems: 'center' },
        standardError: { backgroundColor: palette.surface, color: palette.warning },
        standardWarning: { backgroundColor: '#FFF4D1', color: palette.goldDark },
        standardSuccess: { backgroundColor: palette.successBg, color: palette.success },
        standardInfo: { backgroundColor: '#E2EFEA', color: '#0B5C52' },
        filledError: { backgroundColor: palette.warning },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { backgroundColor: palette.surface, borderRadius: radius.field, padding: 4, gap: 4 },
        grouped: { border: 0, borderRadius: '10px !important' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: palette.textMuted,
          border: 0,
          '&.Mui-selected': {
            backgroundColor: palette.card,
            color: palette.primary,
            boxShadow: shadows.soft,
            '&:hover': { backgroundColor: palette.card },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 999, backgroundColor: palette.surface },
        bar: { borderRadius: 999, backgroundColor: palette.primary },
      },
    },
    MuiCircularProgress: { defaultProps: { color: 'primary' } },
    MuiSwitch: {
      styleOverrides: {
        switchBase: { '&.Mui-checked': { color: palette.primary }, '&.Mui-checked + .MuiSwitch-track': { backgroundColor: palette.primary } },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: { border: `1px solid ${palette.border}`, borderRadius: radius.card, backgroundColor: palette.card },
        columnHeaderTitle: { ...typography.tableHead, color: palette.textMuted },
        cell: { fontSize: 14 },
      },
    },
  },
});

export default theme;
