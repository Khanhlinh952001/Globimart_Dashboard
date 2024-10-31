"use client"
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import IntegrationIcon from '@mui/icons-material/IntegrationInstructions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useUser } from '@/hooks/use-user';

const menuItems = [
  { text: 'Tài khoản', icon: <AccountCircleIcon />, href: '/dashboard/settings/account' },
  { text: 'Thông báo', icon: <NotificationsIcon />, href: '/dashboard/settings/notifications' },
  { text: 'Bảo mật', icon: <SecurityIcon />, href: '/dashboard/settings/security' },
  { text: 'Thanh toán & Gói', icon: <PaymentIcon />, href: '/dashboard/settings/billing' },
  { text: 'Tích hợp', icon: <IntegrationIcon />, href: '/dashboard/settings/integrations' },
];

export function SettingsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const {user}= useUser()
  return (
    <List sx={{ width: '100%', maxWidth: 280, bgcolor: 'background.paper', p: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => { router.push(item.href); }}
            sx={{
              backgroundColor: pathname === item.href ? '#635BFF' : 'transparent',
              cursor:'pointer',
              color: pathname === item.href ? 'white' : 'text.primary',
              borderRadius: 2,
              mb: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: pathname === item.href ? '#4F46E5' : 'rgba(99, 91, 255, 0.08)',
                transform: 'translateX(5px)',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
              },
              padding: '12px 16px',
            }}
          >
            <ListItemIcon
              sx={{
               color: pathname === item.href ? 'white' : '#635BFF',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            mt: 4,
            backgroundColor: '#F3F4F6',
            border: '1px solid #E5E7EB',
            p: 2,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#EBEDF0',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
            },
          }}
        >
          <Avatar src={user?.logoUrl} sx={{ width: 48, height: 48 }} />
          <div>
            <Typography variant="subtitle1" fontWeight="bold">{user?.displayName}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </div>
        </Stack>
      </List>
  );
}
