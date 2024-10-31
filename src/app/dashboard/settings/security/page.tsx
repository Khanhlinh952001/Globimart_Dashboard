"use client"
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LayoutWithSidebar from '../LayoutWithSidebar';

// Add this interface at the top of the file
interface LoginEntry {
  type: string;
  time: string;
  ip: string;
  userAgent: string;
}

// Giả lập API calls
const api = {
  changePassword: async (oldPassword: string, newPassword: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (oldPassword === 'wrongpassword') {
      throw new Error('Incorrect old password');
    }
    return { success: true };
  },
  toggleMFA: async (method: 'app' | 'sms', enabled: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, enabled };
  },
  getLoginHistory: async (): Promise<LoginEntry[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { type: 'Credential login', time: '12:08 AM Sep 6, 2024', ip: '95.130.17.84', userAgent: 'Chrome, Mac OS 10.15.7' },
      { type: 'Credential login', time: '11:48 PM Sep 5, 2024', ip: '95.130.17.84', userAgent: 'Chrome, Mac OS 10.15.7' },
    ];
  },
};

export default function SecuritySettings() {
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [mfaApp, setMfaApp] = useState(false);
  const [mfaSms, setMfaSms] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>([]);

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    try {
      await api.changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      alert('Password changed successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError('An unknown error occurred');
      }
    }
  };

  const handleMFAToggle = async (method: 'app' | 'sms') => {
    try {
      const newState = method === 'app' ? !mfaApp : !mfaSms;
      const result = await api.toggleMFA(method, newState);
      if (method === 'app') {
        setMfaApp(result.enabled);
      } else {
        setMfaSms(result.enabled);
      }
    } catch (error) {
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError('An unknown error occurred');
      }
      // alert(`Failed to toggle MFA: ${error.message}`);
    }
  };

  const fetchLoginHistory = async () => {
    try {
      const history = await api.getLoginHistory();
      setLoginHistory(history);
    } catch (error) {
      console.error('Failed to fetch login history:', error);
    }
  };

  return (
    <LayoutWithSidebar>
      <Box >
        <Typography  variant="h4" gutterBottom>Security</Typography>

        <Stack spacing={3} sx={{mt:4}}>
          <Card>
            <CardHeader
              avatar={<Avatar><LockIcon /></Avatar>}
              title="Change password"
            />
            <CardContent>
              <form onSubmit={handlePasswordSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Old password"
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                  />
                  <TextField
                    fullWidth
                    label="New password"
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <TextField
                    fullWidth
                    label="Re-type new password"
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {passwordError ? <Alert severity="error">{passwordError}</Alert> : null}
                  <Box>
                    <Button type="submit" variant="contained" color="primary">Update</Button>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              avatar={<Avatar><KeyIcon /></Avatar>}
              title="Multi factor authentication"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2">Authenticator app</Typography>
                          <Switch
                            checked={mfaApp}
                            onChange={() => handleMFAToggle('app')}
                          />
                        </Stack>
                        <Typography variant="body2">Use an authenticator app to generate one time security codes.</Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleMFAToggle('app')}
                        >
                          {mfaApp ? 'Manage' : 'Set up'} authenticator
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} xl={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2">Text message</Typography>
                          <Switch
                            checked={mfaSms}
                            onChange={() => handleMFAToggle('sms')}
                          />
                        </Stack>
                        <Typography variant="body2">Use your mobile phone to receive security codes via SMS.</Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleMFAToggle('sms')}
                        >
                          {mfaSms ? 'Manage' : 'Set up'} phone
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Alert severity="success" sx={{ mt: 2 }}>
                87% of the technology industry has already implemented MFA and it is the top sector with the highest MFA adoption rate.
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              avatar={<Avatar><AccessTimeIcon /></Avatar>}
              title="Login history"
            />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Login type</TableCell>
                    <TableCell>IP address</TableCell>
                    <TableCell>User agent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loginHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="subtitle2">{entry.type}</Typography>
                        <Typography variant="body2" color="textSecondary">{entry.time}</Typography>
                      </TableCell>
                      <TableCell>{entry.ip}</TableCell>
                      <TableCell>{entry.userAgent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </LayoutWithSidebar>
  );
}
