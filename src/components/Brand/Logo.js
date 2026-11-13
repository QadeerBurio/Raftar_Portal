import React from 'react';
import { Box, Typography } from '@mui/material';
import { palette } from '../../theme/tokens';

// Gold rounded square with teal italic "R" + "Raftar" wordmark.
// Placeholder until the real logo asset is available.
const Logo = ({ size = 40, onDark = false, subtitle }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }} role="img" aria-label="Raftar">
    <Box
      sx={{
        width: size, height: size, borderRadius: `${Math.round(size * 0.3)}px`,
        bgcolor: palette.accent, color: palette.primary,
        display: 'grid', placeItems: 'center', flexShrink: 0,
        fontWeight: 900, fontStyle: 'italic', fontSize: Math.round(size * 0.62), lineHeight: 1,
      }}
      aria-hidden="true"
    >
      R
    </Box>
    <Box>
      <Typography
        component="span"
        sx={{ display: 'block', fontWeight: 800, fontSize: Math.round(size * 0.55), lineHeight: 1.1, letterSpacing: '-0.01em', color: onDark ? palette.cream : palette.primary }}
      >
        Raftar
      </Typography>
      {subtitle ? (
        <Typography component="span" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: onDark ? palette.onPrimaryMuted : palette.textMuted }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  </Box>
);

export default Logo;
