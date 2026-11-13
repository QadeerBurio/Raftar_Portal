import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  Car,
  Route,
  CreditCard,
  BarChart3,
  Tags,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Brand/Logo';
import { palette, radius } from '../../theme/tokens';

const ICON = { size: 20, strokeWidth: 2 };

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard {...ICON} />, path: '/' },
    { text: 'Passengers', icon: <Users {...ICON} />, path: '/users' },
    { text: 'Drivers', icon: <Car {...ICON} />, path: '/drivers' },
    { text: 'Trips', icon: <Route {...ICON} />, path: '/trips' },
    { text: 'Payments', icon: <CreditCard {...ICON} />, path: '/payments' },
    { text: 'Analytics', icon: <BarChart3 {...ICON} />, path: '/analytics' },
    { text: 'Pricing', icon: <Tags {...ICON} />, path: '/pricing' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const itemSx = (active) => ({
    minHeight: 44,
    mx: 1.5,
    my: 0.25,
    px: 1.5,
    borderRadius: `${radius.field}px`,
    color: active ? palette.text : palette.onPrimaryMuted,
    bgcolor: active ? palette.accent : 'transparent',
    '&:hover': { bgcolor: active ? palette.accentPressed : 'rgba(255,239,179,0.08)' },
    '&.Mui-focusVisible': { outline: `2px solid ${palette.cream}`, outlineOffset: 2 },
    '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 36 },
    '& .MuiListItemText-primary': { fontSize: 15, fontWeight: active ? 700 : 600 },
  });

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, pt: 3, pb: 3 }}>
        <Logo size={40} onDark subtitle="Admin" />
      </Box>

      <Typography sx={{ px: 3, pb: 1, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: palette.onPrimaryMuted, opacity: 0.8 }}>
        Menu
      </Typography>
      <List component="nav" aria-label="Main navigation" sx={{ py: 0 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              aria-current={active ? 'page' : undefined}
              sx={itemSx(active)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, mb: 1,
            borderRadius: `${radius.card - 4}px`, bgcolor: 'rgba(255,239,179,0.08)',
          }}
        >
          <Avatar
            src={user.profilePhoto}
            alt={user.name || 'Admin'}
            sx={{ width: 40, height: 40, bgcolor: palette.cream, color: palette.primary, fontWeight: 800 }}
          >
            {(user.name || 'A').charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, color: palette.cream }}>
              {user.name || 'Admin'}
            </Typography>
            <Typography noWrap sx={{ fontSize: 12, color: palette.onPrimaryMuted }}>
              {user.email || 'Administrator'}
            </Typography>
          </Box>
        </Box>
        <ListItemButton onClick={handleLogout} sx={{ ...itemSx(false), mx: 0 }}>
          <ListItemIcon><LogOut {...ICON} /></ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItemButton>
      </Box>
    </Box>
  );

  const paperSx = {
    boxSizing: 'border-box',
    width: drawerWidth,
    backgroundColor: palette.primary,
    color: palette.onPrimaryMuted,
    borderRight: 'none',
  };

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': paperSx }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': paperSx }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
