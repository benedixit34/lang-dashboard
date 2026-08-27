import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { PrimaryButton } from "./SectionHeader";
import type {
  FieldProps,
  DrawerProps,
  DrawerFieldValue,
} from "../../types";

export function Field({
  name,
  label,
  type = "text",
  placeholder,
  options = [],
  value,
  onChange
}: FieldProps & {
  onChange?: (value: string | number | boolean | File) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="mb-1.5 block text-[12px] font-medium text-neutral-600"
      >
        {label}
      </label>

      {type === "textarea" && (
        <textarea
          id={name}
          value={typeof value === "string" ? value : ""}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
        />
      )}

      {type === "select" && (
        <select
          id={name}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
        >
          <option value="">Select...</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {type === "file" && (
        <input
          id={name}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              onChange?.(file.name);
            }
          }}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800"
        />
      )}

      {type === "checkbox" && (
        <input
          id={name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange?.(e.target.checked)}
          className="h-4 w-4"
        />
      )}

      {type === "number" && (
        <input
          id={name}
          type="number"
          value={typeof value === "number" ? value : ""}
          placeholder={placeholder}
          onChange={(e) =>
            onChange?.(
              e.target.value === ""
                ? ""
                : Number(e.target.value)
            )
          }
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
        />
      )}

      {(type === "text" ||
        type === "email" ||
        type === "password" ||
        type === "date") && (
        <input
          id={name}
          type={type}
          value={typeof value === "string" ? value : ""}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
        />
      )}
    </div>
  );
}

export default function Drawer({
  open,
  onClose,
  title,
  fields,
  onSubmit,
  isSubmitting = false,
}: DrawerProps) {
  const [formData, setFormData] =
    useState<DrawerFieldValue>({});

  /*
   * Reset the form whenever a new drawer
   * is opened.
   */
  useEffect(() => {
    if (open) {
      setFormData({});
    }
  }, [open, title]);

  if (!open) {
    return null;
  }

  const handleChange = (
    name: string,
    value: string | number | boolean | File,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-neutral-900/20"
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
      />

      <div className="relative flex h-full w-95 flex-col border-l border-neutral-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-neutral-900">
            {title}
          </h2>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {fields.map((field) => (
  <Field
    key={field.name}
    {...field}
    value={field.name ? formData[field.name] : undefined}
    onChange={(value) => {
      if (field.name) {
        handleChange(field.name, value);
      }
    }}
  />
))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <PrimaryButton
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}