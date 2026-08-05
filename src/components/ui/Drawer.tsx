"use client"

import { useRef, useState } from "react"
import { X } from "lucide-react";
import { PrimaryButton } from "./SectionHeader";
import { FieldProps, DrawerProps } from "../../types";

export function Field({
  label,
  type = "text",
  placeholder,
  options = [],
}: FieldProps) {


  
  return (
    <div className="space-y-2">
      <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">
        {label}
      </label>

      {type === "textarea" && (
        <textarea
          placeholder={placeholder}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
        />
      )}

      {type === "select" && (
        <select className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100">
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
          type="file"
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
        />
      )}

      {type === "checkbox" && <input type="checkbox" className="h-4 w-4" />}

      {type === "text" && (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
        />
      )}
    </div>
  );
}

export default function Drawer({ open, onClose, title, fields }: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20" onClick={onClose} />

      <div className="relative flex h-full w-[380px] flex-col border-l border-neutral-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-neutral-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {fields.map((field) => (
            <Field
              key={field.label}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              options={field.options}
              value={field.value}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>

          <PrimaryButton onClick={onClose}>Save</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
