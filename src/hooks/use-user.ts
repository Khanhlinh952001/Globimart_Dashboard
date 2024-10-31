"use client"
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { type User } from '@/types/user';
import { auth , fireStore } from '@/lib/firebase';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(fireStore, 'Shops', userId)); // Use doc() to get document reference
      if (userDoc.exists()) {
        return userDoc.data();
      }
        

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Handle fetch errors
      } else {
        setError('An unknown error occurred');
      }
      throw err; // Re-throw to handle in onAuthStateChanged
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      async (user) => {
        if (user) {
          try {
            const userData = await fetchUserData(user.uid);
            setUser({ id: user.uid, ...user, ...userData, exchange: userData?.exchange ?? '' });

          } catch (err) {
            // Error already handled in fetchUserData
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => { unsubscribe(); };
  }, []);

  const checkSession = async () => {
    // Không cần làm gì vì Firebase tự động quản lý phiên
  };

  return { user, error, isLoading, checkSession };
}
