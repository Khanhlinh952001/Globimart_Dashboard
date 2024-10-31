'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import { getAvatarByName } from '@/utils/avatarUrl';

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'Tên là bắt buộc' }),
  lastName: zod.string().min(1, { message: 'Họ là bắt buộc' }),
  email: zod.string().min(1, { message: 'Email là bắt buộc' }).email(),
  password: zod.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  terms: zod.boolean().refine((value) => value, 'Bạn phải chấp nhận các điều khoản và điều kiện'),
  storeName: zod.string().min(1, { message: 'Tên cửa hàng là bắt buộc' }),
  address: zod.string().min(1, { message: 'Địa chỉ là bắt buộc' }),
  phone: zod.string().min(1, { message: 'Số điện thoại là bắt buộc' }),
  description: zod.string().optional(),
  productCategory: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  terms: false,
  storeName: '',
  address: '',
  phone: '',
  description: '',
  productCategory: '',
} satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        const { error } = await authClient.signUp({ email: values.email, password: values.password });

        if (error) {
          throw new Error(error);
        }

        const user = auth.currentUser;
        if (!user) {
          throw new Error('Không tìm thấy người dùng sau khi đăng ký');
        }

        await updateProfile(user, {
          displayName: `${values.firstName} ${values.lastName}`,
        });

        await setDoc(doc(db, 'Shops', user.uid), {
          logoUrl: getAvatarByName(values.storeName),
          role: 'SHOP',
          firstName: values.firstName,
          lastName: values.lastName,
          uid: user.uid,
          storeName:values.storeName ,
          email: values.email,
          createdAt: new Date(),
          address: values.address,
          phone: values.phone,
          description: values.description,
          productCategory: values.productCategory,
        });

        await checkSession?.();

        router.push(paths.dashboard.overview);
      } catch (error) {
        setError('root', { type: 'server', message: (error as Error).message });
      } finally {
        setIsPending(false);
      }
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Đăng ký</Typography>
        <Typography color="text.secondary" variant="body2">
          Bạn đã có tài khoản?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Đăng nhập
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstName)}>
                <InputLabel>Tên</InputLabel>
                <OutlinedInput {...field} label="Tên" />
                {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lastName)}>
                <InputLabel>Họ</InputLabel>
                <OutlinedInput {...field} label="Họ" />
                {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Địa chỉ email</InputLabel>
                <OutlinedInput {...field} label="Địa chỉ email" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="storeName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.storeName)}>
                <InputLabel>Tên cửa hàng</InputLabel>
                <OutlinedInput {...field} label="Tên cửa hàng" />
                {errors.storeName ? <FormHelperText>{errors.storeName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <FormControl error={Boolean(errors.address)}>
                <InputLabel>Địa chỉ</InputLabel>
                <OutlinedInput {...field} label="Địa chỉ" />
                {errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <FormControl error={Boolean(errors.phone)}>
                <InputLabel>Số điện thoại</InputLabel>
                <OutlinedInput {...field} label="Số điện thoại" />
                {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <FormControl>
                <InputLabel>Mô tả</InputLabel>
                <OutlinedInput {...field} label="Mô tả" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="productCategory"
            render={({ field }) => (
              <FormControl error={Boolean(errors.productCategory)}>
                <InputLabel>Danh mục sản phẩm</InputLabel>
                <Select {...field} label="Danh mục sản phẩm">
                  <MenuItem value="electronics">Điện tử</MenuItem>
                  <MenuItem value="clothing">Thời trang</MenuItem>
                  <MenuItem value="home">Nhà cửa</MenuItem>
                  <MenuItem value="toys">Đồ chơi</MenuItem>
                  <MenuItem value="books">Sách</MenuItem>
                </Select>
                {errors.productCategory ? <FormHelperText>{errors.productCategory.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Mật khẩu</InputLabel>
                <OutlinedInput {...field} label="Mật khẩu" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      Tôi đã đọc <Link>các điều khoản và điều kiện</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Đăng ký
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
