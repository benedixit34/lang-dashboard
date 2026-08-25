import type { ElementType } from "react";
import {
  LayoutGrid,
  Building2,
  BookOpen,
  Image as ImageIcon,
  Users,
  Settings,
} from "lucide-react";

import type { Section } from "../types";

interface NavItem {
  key: Section;
  label: string;
  icon: ElementType;
}

export const NAV: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "cities", label: "Cities", icon: Building2 },
  { key: "categories", label: "Categories", icon: BookOpen },
  { key: "vocabulary", label: "Vocabulary", icon: BookOpen },
  { key: "media", label: "Media Library", icon: ImageIcon },
  { key: "users", label: "Users", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
];