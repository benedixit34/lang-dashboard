import { useState } from "react";
import { Plus, UploadCloud, Music, FileImage } from "lucide-react";

import Card from "../ui/Card";
import {
  SectionHeader,
  PrimaryButton,
  SecondaryButton,
} from "../ui/SectionHeader";

import { Th, Td, Row, RowMenu } from "../ui/Table";
import MediaUploadModal from "../ui/MediaImportModal";

import { MEDIA, type MediaItem } from "../../data/mockData";
import type { UploadedMedia } from "../../types/media";


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

  const [media, setMedia] = useState<MediaItem[]>(MEDIA);

  const [bulkOpen, setBulkOpen] = useState(false);



  const handleImport = (images: UploadedMedia[]) => {

    const startId = media.length
      ? Math.max(...media.map((m) => m.id)) + 1
      : 1;


    const imported: MediaItem[] = images.map(
      (img, i) => ({
        id: startId + i,
        name: img.name,
        type: "Image",
        usedBy: "Unassigned",
        date: today(),
        url: img.url,
      })
    );


    setMedia((prev) => [
      ...prev,
      ...imported,
    ]);
  };



  return (
    <div>

      <SectionHeader
        title="Media library"
        description="Images and audio used across cities and vocabulary."
        action={
          <div className="flex gap-2">

            <SecondaryButton
              onClick={() => setBulkOpen(true)}
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

            {media.map((m) => (

              <Row key={m.id}>

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
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onImport={handleImport}
      />

    </div>
  );
}