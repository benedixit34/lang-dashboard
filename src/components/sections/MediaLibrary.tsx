import { useState } from "react";
import { Plus, UploadCloud, Music, FileImage } from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getImages,
  uploadImages,
  type MediaItem
} from "../../data/api";

import Card from "../ui/Card";
import {
  SectionHeader,
  PrimaryButton,
  SecondaryButton,
} from "../ui/SectionHeader";

import { Th, Td, Row, RowMenu } from "../ui/Table";
import MediaUploadModal from "../ui/MediaImportModal";



interface MediaLibraryProps {
  onCreate: () => void;
}


const today = (): string =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });



export default function MediaLibrary({
  onCreate,
}: MediaLibraryProps) {

  const queryClient = useQueryClient();

 

  const [bulkOpen, setBulkOpen] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);

   const {
    data: images = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["images"],
    queryFn: getImages,
  });

    const uploadMutation =
      useMutation({
        mutationFn: uploadImages,
  
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["images"],
          });
  
          setUploadOpen(false);
        },
  
        onError: (error) => {
          console.error(
            "Image upload failed:",
            error,
          );
        },
      });





  return (
    <div>

      <SectionHeader
        title="Media library"
        description="Images and audio used across cities and vocabulary."
        action={
          <div className="flex gap-2">

            <SecondaryButton
              onClick={() => setUploadOpen(true)}
            >
              <UploadCloud size={14} />
              Bulk import
            </SecondaryButton>


            <PrimaryButton
              onClick={onCreate}
            >
              <Plus size={14} />
              Upload media
            </PrimaryButton>

          </div>
        }
      />



      <Card>

        <table className="w-full border-collapse">

          <thead>
            <tr>
              <Th>File</Th>
              <Th>Type</Th>
              <Th>Used by</Th>
              <Th>Uploaded</Th>
              <Th className="w-10" />
            </tr>
          </thead>



          <tbody>

            {images.map((m) => (

              <Row key={m.key}>

                <Td className="flex items-center gap-2 font-medium text-neutral-900">

                  {m.url ? (

                    <img
                      src={m.url}
                      alt={m.name}
                      className="h-6 w-6 rounded object-cover"
                    />

                  ) : m.type === "Audio" ? (

                    <Music
                      size={14}
                      className="text-neutral-400"
                    />

                  ) : (

                    <FileImage
                      size={14}
                      className="text-neutral-400"
                    />

                  )}


                  <span className="truncate">
                    {m.name}
                  </span>

                </Td>



                <Td className="text-neutral-500">
                  {m.type}
                </Td>


                <Td className="text-neutral-500">
                  {m.usedBy}
                </Td>


                <Td className="text-neutral-500">
                  {m.date}
                </Td>


                <Td>
                  <RowMenu />
                </Td>


              </Row>

            ))}

          </tbody>

        </table>

      </Card>



      <MediaUploadModal
        open={uploadOpen}
        onClose={() =>
          setUploadOpen(false)
        }
        onImport={(files) =>
          uploadMutation.mutate(files)
        }
        isUploading={
          uploadMutation.isPending
        }
      />

    </div>
  );
}