import type { MouseEventHandler } from "react";


export type Section =
  | "overview"
  | "cities"
  | "vocabulary"
  | "media"
  | "users"
  | "settings";


type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "email"
  | "password"
  | "date"
  | "file"
  | "checkbox";

export interface FieldProps {
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  value?: string | number | boolean;
}


export interface DrawerProps {
  open: boolean;
  onClose: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  title: string;
  fields: readonly FieldProps[];
}