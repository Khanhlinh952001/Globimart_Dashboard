"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import LayoutWithSidebar from '../LayoutWithSidebar';

function NotificationSettings() {
  const [emailProductUpdates, setEmailProductUpdates] = React.useState(true);
  const [emailSecurityUpdates, setEmailSecurityUpdates] = React.useState(false);
  const [phoneSecurityUpdates, setPhoneSecurityUpdates] = React.useState(false);

  const handleEmailProductUpdatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailProductUpdates(event.target.checked);
  };

  const handleEmailSecurityUpdatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailSecurityUpdates(event.target.checked);
  };

  const handlePhoneSecurityUpdatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneSecurityUpdates(event.target.checked);
  };

  return (
    <LayoutWithSidebar>
      <Box>
        <Typography variant="h4">Notifications</Typography>
        <Stack spacing={3} sx={{mt:4}}>
          <Card>
            <CardHeader
              avatar={
                <Avatar>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
                  </svg>
                </Avatar>
              }
              title="Email"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography variant="subtitle1">Product updates</Typography>
                    <Typography variant="body2">News, announcements, and product updates.</Typography>
                  </div>
                  <Switch
                    checked={emailProductUpdates}
                    onChange={handleEmailProductUpdatesChange}
                    color="primary"
                  />
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography variant="subtitle1">Security updates</Typography>
                    <Typography variant="body2">Important notifications about your account security.</Typography>
                  </div>
                  <Switch
                    checked={emailSecurityUpdates}
                    onChange={handleEmailSecurityUpdatesChange}
                    color="primary"
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              avatar={
                <Avatar>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
                  </svg>
                </Avatar>
              }
              title="Phone"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography variant="subtitle1">Security updates</Typography>
                    <Typography variant="body2">Important notifications about your account security.</Typography>
                  </div>
                  <Switch
                    checked={phoneSecurityUpdates}
                    onChange={handlePhoneSecurityUpdatesChange}
                    color="primary"
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </LayoutWithSidebar>
  );
}

export default NotificationSettings;
