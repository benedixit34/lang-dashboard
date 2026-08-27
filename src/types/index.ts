//Additional types for the project
import type { MouseEventHandler } from "react";


export type Section =
  | "overview"
  | "cities"
  | "categories"
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
  name?: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  value?: string | number | boolean | File;
}


export interface DrawerFieldValue {
  [key: string]: string | boolean | number |  File | undefined;
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FieldProps[];
  onSubmit: (data: DrawerFieldValue) => void;
  isSubmitting?: boolean;
}