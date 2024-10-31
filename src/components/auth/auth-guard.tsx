'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    // Nếu đang tải dữ liệu người dùng, không làm gì cả
    if (isLoading) {
      return;
    }

    // Nếu có lỗi, dừng kiểm tra
    if (error) {
      setIsChecking(false);
      return;
    }

    // Nếu không có người dùng đăng nhập, chuyển hướng đến trang đăng nhập
    if (!user) {
      logger.debug('[AuthGuard]: Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập');
      router.replace(paths.auth.signIn);
      return;
    }

    // Người dùng đã xác thực, cho phép truy cập
    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // không làm gì cả
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  // Nếu đang kiểm tra, không hiển thị gì cả
  if (isChecking) {
    return null;
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  // Hiển thị nội dung được bảo vệ
  return <React.Fragment>{children}</React.Fragment>;
}
