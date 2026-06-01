import { LucideIconData } from 'lucide-angular';

export interface MenuItem {
  label: string;
  icon: LucideIconData;
  route?: string;
  children?: MenuItem[];
  isOpen?: boolean;
}
