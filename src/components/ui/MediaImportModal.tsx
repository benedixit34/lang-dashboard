import { useRef, useState, ChangeEvent } from "react";
import { ImagePlus, Folder, X } from "lucide-react";
import { PrimaryButton } from "./SectionHeader";
import type { UploadedMedia } from "../../types/media";


interface MediaUploadModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (files: UploadedMedia[]) => void;
}

interface UploadFile {
  id: string;
  name: string;
  size: number;
  url: string;
}


function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


export default function MediaUploadModal({
  open,
  onClose,
  onImport,
}: MediaUploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);


  if (!open) return null;


  const addFiles = (fileList: FileList) => {
    const imageFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );


    const mapped: UploadFile[] = imageFiles.map((file) => ({
      id: `${file.webkitRelativePath || file.name}-${file.size}-${file.lastModified}`,
      name: file.webkitRelativePath || file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));


    setFiles((prev) => {
      const existingIds = new Set(
        prev.map((item) => item.id)
      );

      return [
        ...prev,
        ...mapped.filter(
          (item) => !existingIds.has(item.id)
        ),
      ];
    });
  };


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
    }

    e.target.value = "";
  };


  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find(
        (file) => file.id === id
      );

      if (target) {
        URL.revokeObjectURL(target.url);
      }

      return prev.filter(
        (file) => file.id !== id
      );
    });
  };


  const reset = () => {
    files.forEach((file) =>
      URL.revokeObjectURL(file.url)
    );

    setFiles([]);
  };


  const handleClose = () => {
    reset();
    onClose();
  };


const handleImport = () => {
  if (!files.length) return;

  onImport(
    files.map(({ name, url, size }) => ({
      name,
      url,
      size,
      type: "Image",
    }))
  );

  setFiles([]);
  onClose();
};


  const totalSize = files.reduce(
    (sum, file) => sum + file.size,
    0
  );


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-neutral-900/30"
        onClick={handleClose}
      />


      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-5 py-4">

          <div>
            <h2 className="text-[14px] font-semibold text-neutral-900">
              Bulk upload images
            </h2>

            <p className="mt-0.5 text-[12px] text-neutral-500">
              Select multiple image files, or an entire folder.
              Non-image files are skipped automatically.
            </p>
          </div>


          <button
            onClick={handleClose}
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={16} />
          </button>

        </div>



        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          <div className="flex gap-2">

            <button
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="flex items-center gap-1.5 rounded-md border border-dashed border-neutral-300 px-3 py-2 text-[12px] font-medium text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50"
            >
              <ImagePlus size={14} />
              Choose images
            </button>


            <button
              onClick={() =>
                folderInputRef.current?.click()
              }
              className="flex items-center gap-1.5 rounded-md border border-dashed border-neutral-300 px-3 py-2 text-[12px] font-medium text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50"
            >
              <Folder size={14} />
              Choose folder
            </button>


            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />


            <input
              ref={folderInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleInputChange}
              {...({
                webkitdirectory: "",
                directory: "",
              } as React.InputHTMLAttributes<HTMLInputElement>)}
            />

          </div>



          {files.length > 0 ? (

            <div className="mt-4">

              <div className="mb-2 flex items-center justify-between text-[12px]">

                <span className="font-medium text-neutral-700">
                  {files.length} image
                  {files.length === 1 ? "" : "s"} selected
                </span>


                <span className="text-neutral-400">
                  {formatSize(totalSize)}
                </span>

              </div>



              <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">

                {files.map((file) => (

                  <div
                    key={file.id}
                    className="group relative overflow-hidden rounded-md border border-neutral-200"
                  >

                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-20 w-full object-cover"
                    />


                    <button
                      onClick={() =>
                        removeFile(file.id)
                      }
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={11}/>
                    </button>


                    <div className="truncate bg-white px-1.5 py-1 text-[10px] text-neutral-500">
                      {file.name}
                    </div>

                  </div>

                ))}

              </div>

            </div>

          ) : (

            <div className="mt-4 flex flex-col items-center justify-center rounded-md border border-dashed border-neutral-200 py-10 text-center">

              <ImagePlus
                size={20}
                className="text-neutral-300"
              />

              <p className="mt-2 text-[12px] text-neutral-400">
                No images selected yet
              </p>

            </div>

          )}

        </div>



        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">

          <span className="text-[12px] text-neutral-400">
            {files.length > 0
              ? `${files.length} ready to import`
              : "Select images to continue"}
          </span>


          <div className="flex gap-2">

            <button
              onClick={handleClose}
              className="rounded-md border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>


            <PrimaryButton
              onClick={handleImport}
              disabled={files.length === 0}
            >
              Import {files.length || ""} image
              {files.length === 1 ? "" : "s"}
            </PrimaryButton>

          </div>

        </div>


      </div>

    </div>
  );
}