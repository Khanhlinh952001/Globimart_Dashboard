import { type IconType } from 'react-icons';
import {
  PieChart,
  Settings,
  Person,
  List,
  Add,
  Edit,
  Inventory,
  Cast,
  Search,
  Close,
  PowerSettingsNew,
  Group,
  AddBox
} from '@mui/icons-material';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

export const navIcons = {
  'chart-pie': PieChart,
  'gear-six': Settings,
  'plugs-connected': PowerSettingsNew,
  'x-square': Close,
  user: Person,
  users: Group,
  list: List,
  create: Add,
  flash:OfflineBoltIcon,
  add: AddBox,
  detail: Cast,
  edit: Edit,
  products: Inventory,
  order: List, // Note: There's no exact equivalent for FaBuromobelexperte in MUI
  setting: Settings,
} as Record<string, IconType>;
