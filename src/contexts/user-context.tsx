'use client';

import * as React from 'react';
import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession: () => Promise<void>; // Remove optional
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<Omit<UserContextValue, 'checkSession'>>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await authClient.getUser();
      if ('error' in result && result.error) {
        throw new Error(result.error);
      }

      setState({ user: result.user, error: null, isLoading: false });
    } catch (err) {
      logger.error(err);
      setState({ user: null, error: 'Something went wrong', isLoading: false });
    }
  }, []);
  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  const contextValue = React.useMemo<UserContextValue>(
    () => ({ ...state, checkSession }),
    [state, checkSession]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
