import { ChangeEvent, useRef, useState } from "react";
import {
  UploadCloud,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const reset = () => {
    setRaw("");
    setParsed(null);

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

    setParsed(parseCSV<T>(text, columns));
  };

  const handleFile = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const isExcel =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls");

    if (isExcel) {
      setRaw("");
      setParsed(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      handleParse(
        String(reader.result ?? ""),
      );
    };

    reader.readAsText(file);
  };

  const validRows =
    parsed?.rows.filter((r) => r.valid) ?? [];

  const invalidRows =
    parsed?.rows.filter((r) => !r.valid) ?? [];

  const handleImport = () => {
    if (
      !selectedFile ||
      isImporting
    ) {
      return;
    }

    // CSV files must have at least one valid row.
    // Excel files are sent directly to the backend
    // because the frontend does not parse XLSX.
    const isExcel =
      selectedFile.name.endsWith(".xlsx") ||
      selectedFile.name.endsWith(".xls");

    if (!isExcel && !validRows.length) {
      return;
    }

    onImport(selectedFile);
  };

  const isExcelFile =
    selectedFile?.name.endsWith(".xlsx") ||
    selectedFile?.name.endsWith(".xls");

  const canImport =
    Boolean(selectedFile) &&
    (isExcelFile || validRows.length > 0) &&
    !isImporting;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-900/30"
        onClick={handleClose}
      />

      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl">

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
            onClick={handleClose}
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100"
          >
            <X size={16} />
          </button>
        </div>


        <div className="flex-1 overflow-y-auto px-5 py-4">

          <div className="mb-3 flex items-center justify-between">

            <div className="flex flex-wrap gap-1.5">
              {columns.map((c) => (
                <span
                  key={String(c.key)}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    c.required
                      ? "bg-neutral-100 text-neutral-700"
                      : "bg-neutral-50 text-neutral-400"
                  }`}
                >
                  {c.label}
                  {!c.required && " (optional)"}
                </span>
              ))}
            </div>


            <button
              onClick={() =>
                downloadCSV(
                  "import-template.csv",
                  buildTemplateCSV(columns)
                )
              }
              className="flex items-center gap-1 text-[12px] text-neutral-600"
            >
              <Download size={12} />
              Template
            </button>

          </div>


          <textarea
            value={raw}
            onChange={(e) => handleParse(e.target.value)}
            rows={6}
            placeholder="Paste CSV rows here"
            className="w-full resize-none rounded-md border border-neutral-200 px-3 py-2 text-[12px]"
          />


          <div className="mt-2 flex items-center gap-3">

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-[12px]"
            >
              <UploadCloud size={13}/>
              Upload .csv file
            </button>


            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="hidden"
            />

            {raw && (
              <button
                onClick={reset}
                className="text-[12px] text-neutral-400"
              >
                Clear
              </button>
            )}

          </div>


          {parsed && (
            <div className="mt-4">

              <div className="mb-2 flex gap-3 text-[12px]">

                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={13}/>
                  {validRows.length} ready
                </span>


                {invalidRows.length > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <AlertCircle size={13}/>
                    {invalidRows.length} need review
                  </span>
                )}

              </div>


              <div className="rounded-md border border-neutral-200 overflow-auto">

                <table className="w-full">

                  <tbody>
                    {parsed.rows.map((row, index) => (
                      <tr key={index}>

                        {columns.map((column) => (
                          <td
                            key={String(column.key)}
                            className="px-2 py-1 text-[12px]"
                          >
                            {String(
                              row.data[column.key] ?? "—"
                            )}
                          </td>
                        ))}

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </div>


        <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">

          <button
            onClick={handleClose}
            className="rounded-md border px-3 py-1.5 text-[13px]"
          >
            Cancel
          </button>


          <PrimaryButton
            onClick={handleImport}
            disabled={validRows.length === 0 || isImporting}
          >
            {isImporting
    ? "Importing..."
    : `Import ${validRows.length} rows`}
          </PrimaryButton>

        </div>

      </div>

    </div>
  );
}