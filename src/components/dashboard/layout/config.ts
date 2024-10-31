import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems: NavItemConfig[] = [
  { key: 'overview', title: 'Tổng quan', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Khách hàng', href: paths.dashboard.customers, icon: 'users' },
  {
    key: 'products',
    title: 'Sản phẩm',
    icon: 'products',
    items: [
      { key: 'productList', title: 'Danh sách', href: paths.dashboard.productList, icon: 'list' },
      { key: 'addProduct', title: 'Thêm', href: paths.dashboard.addProduct, icon: 'add' },
      { key: 'createProduct', title: 'Tạo', href: paths.dashboard.createProduct, icon: 'create' },
    ],
  },

  {
    key: 'orders',
    title: 'Đơn hàng',
    icon: 'order',
    items: [
      { key: 'orderList', title: 'Danh sách', href: paths.dashboard.orderList, icon: 'list' },
      // { key: 'OrderCreate', title: 'Tạo', href: paths.dashboard.orderCreate,icon:'create' },
    ],
  },
{
    key: 'flashSales', title: 'Khuyến mãi', href: paths.dashboard.flashSales, icon: 'flash'
  },
  { key: 'settings', title: 'Cài đặt', href: paths.dashboard.settings, icon: 'setting' },

];
