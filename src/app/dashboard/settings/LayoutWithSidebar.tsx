import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { AccountCircle, Settings, Security } from '@mui/icons-material';
import { SettingsSidebar } from '@/components/dashboard/settings/settingSidebar';

const drawerWidth = 240;

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

const LayoutWithSidebar: React.FC<LayoutWithSidebarProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex'} }> {/* Thêm height: '100vh' */}

      <SettingsSidebar/>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', px: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default LayoutWithSidebar;
