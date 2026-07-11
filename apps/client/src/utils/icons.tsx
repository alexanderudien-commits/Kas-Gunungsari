import React from 'react';
import {
  Ticket, ShoppingBag, ShoppingCart, Droplet, HeartHandshake,
  Heart, Home, Car, Wrench, Zap, Users, Truck, Package,
  MoreHorizontal, Coffee, Utensils, Landmark, Leaf, Star,
  Gift, BookOpen, Briefcase, Smartphone, Wifi, Fuel,
  Pill, Stethoscope, GraduationCap, type LucideProps,
} from 'lucide-react';
import { CATEGORY_ICONS, type CustomCategory } from '../types';

type IconComponent = React.FC<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  Ticket, ShoppingBag, ShoppingCart, Droplet, HeartHandshake,
  Heart, Home, Car, Wrench, Zap, Users, Truck, Package,
  MoreHorizontal, Coffee, Utensils, Landmark, Leaf, Star,
  Gift, BookOpen, Briefcase, Smartphone, Wifi, Fuel,
  Pill, Stethoscope, GraduationCap,
};

export function getIconComponent(iconName: string): IconComponent {
  return ICON_MAP[iconName] || MoreHorizontal;
}

export function renderCategoryIcon(category: string, size: number = 20, customCategories: CustomCategory[] = []): React.ReactNode {
  const custom = customCategories.find(c => c.name === category);
  const iconName = custom?.icon || CATEGORY_ICONS[category] || 'MoreHorizontal';
  const IconComp = getIconComponent(iconName);
  return <IconComp size={size} />;
}

export { ICON_MAP };
