import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Box,
} from '@mui/material';
import { Menu, Bell } from 'lucide-react';
import { palette } from '../../theme/tokens';

const Header = ({ drawerWidth, handleDrawerToggle }) => {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: palette.background,
        color: palette.text,
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: { xs: 64, sm: 72 }, px: { xs: 2, sm: 3 } }}>
        <IconButton
          aria-label="Open navigation"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' }, bgcolor: palette.surface, color: palette.text }}
        >
          <Menu size={20} strokeWidth={2} />
        </IconButton>

        {/* Search field removed until there is search logic behind it. */}
        <Box sx={{ flexGrow: 1 }} />

        <IconButton aria-label="Notifications, 4 unread" sx={{ bgcolor: palette.surface, color: palette.text, width: 44, height: 44 }}>
          <Badge badgeContent={4} color="warning" sx={{ '& .MuiBadge-badge': { bgcolor: palette.accent, color: palette.text, fontWeight: 800 } }}>
            <Bell size={20} strokeWidth={2} />
          </Badge>
        </IconButton>
        <Avatar
          src={user.profilePhoto}
          alt={user.name || 'Admin'}
          sx={{ width: 40, height: 40, bgcolor: palette.primary, color: palette.cream, fontWeight: 800, fontSize: 16 }}
        >
          {(user.name || 'A').charAt(0).toUpperCase()}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
