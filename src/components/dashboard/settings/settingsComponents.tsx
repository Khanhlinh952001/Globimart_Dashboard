import * as React from 'react';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, FormControlLabel, Radio, RadioGroup, Stack, Switch, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';



export const BasicDetails: React.FC = () => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar><PersonIcon /></Avatar>}
        title="Basic details"
      />
      <CardContent>
        <Stack spacing={3}>
          {/* Add form fields for basic details here */}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const ThemeOptions: React.FC = () => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar><SettingsBrightnessIcon /></Avatar>}
        title="Theme options"
      />
      <CardContent>
        <RadioGroup defaultValue="light">
          <FormControlLabel
            value="light"
            control={<Radio />}
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar><LightModeIcon /></Avatar>
                <Box>
                  <Typography variant="subtitle2">Light mode</Typography>
                  <Typography variant="caption">Best for bright environments</Typography>
                </Box>
              </Stack>
            }
          />
          <FormControlLabel
            value="dark"
            control={<Radio />}
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar><DarkModeIcon /></Avatar>
                <Box>
                  <Typography variant="subtitle2">Dark mode</Typography>
                  <Typography variant="caption">Recommended for dark rooms</Typography>
                </Box>
              </Stack>
            }
          />
          <FormControlLabel
            value="system"
            control={<Radio />}
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar><SettingsBrightnessIcon /></Avatar>
                <Box>
                  <Typography variant="subtitle2">System</Typography>
                  <Typography variant="caption">Adapts to your device's theme</Typography>
                </Box>
              </Stack>
            }
          />
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export const PrivacySettings: React.FC = () => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar><SecurityIcon /></Avatar>}
        title="Privacy"
      />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1">Make contact info public</Typography>
              <Typography variant="body2">Means that anyone viewing your profile will be able to see your contacts details.</Typography>
            </Box>
            <Switch />
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1">Available to hire</Typography>
              <Typography variant="body2">Toggling this will let your teammates know that you are available for acquiring new projects.</Typography>
            </Box>
            <Switch defaultChecked />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const DeleteAccount: React.FC = () => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar><WarningIcon /></Avatar>}
        title="Delete account"
      />
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1">
            Delete your account and all of your source data. This is irreversible.
          </Typography>
          <Button variant="outlined" color="error">
            Delete account
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
