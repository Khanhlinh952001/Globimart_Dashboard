"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Đảm bảo rằng bạn đã cấu hình Firebase

const AuthContext = createContext<User | null>(null); // Định nghĩa kiểu User

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // Sử dụng kiểu User

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Cập nhật thông tin người dùng
        });
        return () => { unsubscribe(); }; // Dọn dẹp khi component bị hủy
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); // Xuất khẩu hook
