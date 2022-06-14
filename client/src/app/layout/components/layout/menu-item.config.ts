import { MenuItem } from '../../types/menu-item.interface';

export const menuItems: MenuItem[] = [
  {
    id: 'tasks',
    title: 'Tasks',
    route: '/tasks',
    icon: 'check_box',
  },
  {
    id: 'projects',
    title: 'Projects',
    route: '/projects',
    icon: 'assignment',
  },
];
