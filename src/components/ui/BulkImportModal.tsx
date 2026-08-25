import { ChangeEvent, useRef, useState } from "react";
import {
  UploadCloud,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

import {
  parseCSV,
  buildTemplateCSV,
  downloadCSV,
  type CSVColumn,
  type ParseCSVResult,
} from "../../lib/csv";

import { PrimaryButton } from "./SectionHeader";

interface BulkImportModalProps<T extends object> {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  columns: CSVColumn<T>[];

  onImport: (file: File) => void;

  isImporting?: boolean;
}

export default function BulkImportModal<T extends object>({
  open,
  onClose,
  title,
  description,
  columns,
  onImport,
  isImporting = false,
}: BulkImportModalProps<T>) {
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] =
    useState<ParseCSVResult<T> | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  if (!open) return null;

  const reset = () => {
    setRaw("");
    setParsed(null);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isImporting) return;

    reset();
    onClose();
  };

  const handleParse = (text: string) => {
    setRaw(text);

    if (!text.trim()) {
      setParsed(null);
      return;
    }

    setParsed(
      parseCSV<T>(
        text,
        columns,
      ),
    );
  };

  const handleFile = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const fileName =
      file.name.toLowerCase();

    const isExcel =
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls");

    const isCSV =
      fileName.endsWith(".csv");

    // Excel files are sent directly
    // to the backend.
    if (isExcel) {
      setRaw("");
      setParsed(null);
      return;
    }

    // CSV files can be previewed
    // in the frontend.
    if (isCSV) {
      const reader = new FileReader();

      reader.onload = () => {
        handleParse(
          String(reader.result ?? ""),
        );
      };

      reader.onerror = () => {
        setRaw("");
        setParsed(null);
      };

      reader.readAsText(file);

      return;
    }

    // Unsupported file
    setSelectedFile(null);
    setRaw("");
    setParsed(null);
  };

  const validRows =
    parsed?.rows.filter(
      (row) => row.valid,
    ) ?? [];

  const invalidRows =
    parsed?.rows.filter(
      (row) => !row.valid,
    ) ?? [];

  const isExcelFile =
    selectedFile?.name
      .toLowerCase()
      .endsWith(".xlsx") ||
    selectedFile?.name
      .toLowerCase()
      .endsWith(".xls");

  const isCSVFile =
    selectedFile?.name
      .toLowerCase()
      .endsWith(".csv");

  const canImport =
    Boolean(selectedFile) &&
    !isImporting &&
    (
      isExcelFile ||
      (isCSVFile && validRows.length > 0)
    );

  const handleImport = () => {
    if (!selectedFile || !canImport) {
      return;
    }

    onImport(selectedFile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/30"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="text-[14px] font-semibold text-neutral-900">
              {title}
            </h2>

            {description && (
              <p className="mt-0.5 text-[12px] text-neutral-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isImporting}
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* Columns + template */}
          <div className="mb-3 flex items-start justify-between gap-4">

            <div className="flex flex-wrap gap-1.5">
              {columns.map((column) => (
                <span
                  key={String(column.key)}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    column.required
                      ? "bg-neutral-100 text-neutral-700"
                      : "bg-neutral-50 text-neutral-400"
                  }`}
                >
                  {column.label}

                  {!column.required &&
                    " (optional)"}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                downloadCSV(
                  "import-template.csv",
                  buildTemplateCSV(columns),
                )
              }
              disabled={isImporting}
              className="flex shrink-0 items-center gap-1 text-[12px] text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
            >
              <Download size={12} />
              CSV Template
            </button>
          </div>

          {/* CSV paste */}
          <textarea
            value={raw}
            onChange={(e) =>
              handleParse(e.target.value)
            }
            disabled={
              Boolean(selectedFile) ||
              isImporting
            }
            rows={6}
            placeholder="Paste CSV rows here"
            className="w-full resize-none rounded-md border border-neutral-200 px-3 py-2 text-[12px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100 disabled:bg-neutral-50"
          />

          {/* File upload */}
          <div className="mt-2 flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={isImporting}
              className="flex items-center gap-1.5 rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-[12px] font-medium text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UploadCloud size={13} />

              Upload CSV or Excel
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="
                .csv,
                .xlsx,
                .xls,
                text/csv,
                application/vnd.ms-excel,
                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
              "
              onChange={handleFile}
              className="hidden"
            />

            {(raw || selectedFile) &&
              !isImporting && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-[12px] text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
          </div>

          {/* Selected Excel/CSV file */}
          {selectedFile && (
            <div className="mt-4 flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5">

              <div className="flex items-center gap-2">

                <FileSpreadsheet
                  size={18}
                  className="text-neutral-500"
                />

                <div>
                  <p className="text-[12px] font-medium text-neutral-800">
                    {selectedFile.name}
                  </p>

                  <p className="text-[11px] text-neutral-400">
                    {(
                      selectedFile.size /
                      1024
                    ).toFixed(1)}{" "}
                    KB

                    {isExcelFile &&
                      " • Excel spreadsheet"}

                    {isCSVFile &&
                      " • CSV file"}
                  </p>
                </div>

              </div>

              {!isImporting && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-md p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* CSV preview */}
          {parsed && (
            <div className="mt-4">

              <div className="mb-2 flex gap-3 text-[12px]">

                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={13} />
                  {validRows.length} ready
                </span>

                {invalidRows.length > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <AlertCircle size={13} />
                    {invalidRows.length} need review
                  </span>
                )}

              </div>

              <div className="overflow-auto rounded-md border border-neutral-200">

                <table className="w-full">

                  <tbody>
                    {parsed.rows.map(
                      (row, index) => (
                        <tr
                          key={index}
                          className={
                            row.valid
                              ? ""
                              : "bg-amber-50"
                          }
                        >
                          {columns.map(
                            (column) => (
                              <td
                                key={String(
                                  column.key,
                                )}
                                className="px-2 py-1 text-[12px]"
                              >
                                {String(
                                  row.data[
                                    column.key
                                  ] ?? "—",
                                )}
                              </td>
                            ),
                          )}
                        </tr>
                      ),
                    )}
                  </tbody>

                </table>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">

          <span className="text-[12px] text-neutral-400">
            {isImporting
              ? "Importing spreadsheet..."
              : selectedFile
                ? "File ready to import"
                : "Select a CSV or Excel file"}
          </span>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={handleClose}
              disabled={isImporting}
              className="rounded-md border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <PrimaryButton
              onClick={handleImport}
              disabled={!canImport}
            >
              {isImporting
                ? "Importing..."
                : isExcelFile
                  ? "Import Excel"
                  : `Import ${validRows.length} rows`}
            </PrimaryButton>

          </div>

        </div>
      </div>
    </div>
  );
}