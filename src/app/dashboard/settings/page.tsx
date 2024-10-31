import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { config } from '@/config';
import { SettingsSidebar } from '@/components/dashboard/settings/settingSidebar';
import LayoutWithSidebar from './LayoutWithSidebar';

export const metadata = { title: `Settings | Dashboard | ${config.site.name}` } satisfies Metadata;

export default async function SettingsPage(): Promise<React.JSX.Element> {
  return (
    <LayoutWithSidebar>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper>
              <Box p={2}>
                <SettingsSidebar />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper>
              <Box p={3}>
                <Stack spacing={3}>
                  {/* Content will be inserted here by nested routes */}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LayoutWithSidebar>
  );
}
