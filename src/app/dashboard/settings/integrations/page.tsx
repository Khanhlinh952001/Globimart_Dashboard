'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { connectToLazada, connectToTiki, connectToShopee } from '@/utils/integrations';
import LayoutWithSidebar from '../LayoutWithSidebar';

const integrations = [
  { name: 'Lazada', description: 'Connect and manage your Lazada store', icon: '/assets/lazada.jpg', connect: connectToLazada },
  { name: 'Tiki', description: 'Integrate with your Tiki marketplace', icon: '/assets/tiki.jpg', connect: connectToTiki },
  { name: 'Shopee', description: 'Link and sync your Shopee account', icon: '/assets/shoppe.jpg', connect: connectToShopee },
];

export default function IntegrationSettings() {
  const handleConnect = async (connectFunction: () => Promise<boolean>) => {
    try {
      const result = await connectFunction();
      if (result) {
        console.log('Connection successful');
      } else {
        console.log('Connection failed');
      }
    } catch (error) {
      console.error('Error during connection:', error);
    }
  };

  return (
    <LayoutWithSidebar>

    <Box >
      <Typography variant="h4" gutterBottom>Integrations</Typography>
      <Card sx={{mt:4}}>
        <CardHeader
          avatar={
            <Avatar>
              <SettingsIcon />
            </Avatar>
          }
          title="Integrations"
        />
        <CardContent>
          <Stack spacing={2}>
            {integrations.map((integration, index) => (
              <React.Fragment key={integration.name}>
                {index > 0 && <Divider />}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar src={integration.icon} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">{integration.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {integration.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    endIcon={<AddIcon />}
                    onClick={() => handleConnect(integration.connect)}
                  >
                    Install
                  </Button>
                </Stack>
              </React.Fragment>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
    </LayoutWithSidebar>
  );
}
