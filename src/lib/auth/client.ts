import { doc, getDoc } from 'firebase/firestore'; // Import các hàm Firestore
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type UserCredential,
  onAuthStateChanged
} from 'firebase/auth';
import { type User } from '@/types/user';
import { auth } from '../firebase';
import { fireStore } from '../firebase'; // Import Firestore

// Định nghĩa interface cho kết quả xác thực
interface AuthResult {
  user: any;
  error: string | null;
}

// Định nghĩa interface cho thông tin đăng nhập
interface Credentials {
  email: string;
  password: string;
}

export const authClient = {
  getUser: async (): Promise<{ user: User | null; error?: string }> => {
    return new Promise((resolve) => { // Bỏ async ở đây
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = doc(fireStore, 'Shops', user.uid);
          const userSnapshot = await getDoc(userDoc);
            console.log(userSnapshot.data())
          if (userSnapshot.exists()) {
              resolve({ user: userSnapshot.data() as User, error: undefined });
          } else {
            resolve({ user: null, error: 'User data not found' });
          }
        } else {
          resolve({ user: null, error: 'No user logged in' });
        }
      });
    });
  },
  // Phương thức đăng ký tài khoản mới
  signUp: async ({ email, password }: Credentials): Promise<AuthResult> => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  },

  // Phương thức đăng nhập bằng email và mật khẩu
  signInWithPassword: async ({ email, password }: Credentials): Promise<AuthResult> => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  },

  // Phương thức đăng xuất
  signOut: async (): Promise<AuthResult> => {
    try {
      await signOut(auth);
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  },

  // Phương thức đặt lại mật khẩu
  resetPassword: async ({ email }: { email: string }): Promise<AuthResult> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: (error as Error).message };
    }
  },
};

