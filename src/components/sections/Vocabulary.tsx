import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, UploadCloud } from "lucide-react";

import Card from "../ui/Card";
import {
  SectionHeader,
  PrimaryButton,
  SecondaryButton,
} from "../ui/SectionHeader";
import { Th, Td, Row, RowMenu } from "../ui/Table";
import { Dot, Pill } from "../ui/Badges";
import BulkImportModal from "../ui/BulkImportModal";

import {
  getVocabulary,
  type VocabularyItem,
} from "../../data/api";

interface VocabularyProps {
  onCreate: () => void;
}

interface VocabularyImportRow {
  word: string;
  city: string;
  difficulty?: string;
  image?: string;
  audio?: string;
}

const IMPORT_COLUMNS = [
  {
    key: "word",
    label: "Word",
    required: true,
    example: "die Brücke",
  },
  {
    key: "city",
    label: "City",
    required: true,
    example: "Hamburg",
  },
  {
    key: "difficulty",
    label: "Difficulty",
    required: false,
    example: "Medium",
  },
  {
    key: "image",
    label: "Image attached",
    required: false,
    example: "yes",
  },
  {
    key: "audio",
    label: "Audio attached",
    required: false,
    example: "no",
  },
] satisfies {
  key: keyof VocabularyImportRow;
  label: string;
  required: boolean;
  example: string;
}[];

export default function Vocabulary({
  onCreate,
}: VocabularyProps) {
  const [bulkOpen, setBulkOpen] = useState(false);

  const {
    data: vocab = [],
    isLoading,
    isError,
    error,
  } = useQuery<VocabularyItem[]>({
    queryKey: ["vocabulary"],
    queryFn: getVocabulary,
  });

  const handleImport = (
    rows: VocabularyImportRow[],
  ) => {
    console.log("Import rows:", rows);

    // We will connect this to the API bulk-import
    // endpoint after the backend endpoint is ready.

    setBulkOpen(false);
  };

  return (
    <div>
      <SectionHeader
        title="Vocabulary"
        description="Words learners match to images and audio inside each city."
        action={
          <div className="flex gap-2">
            <SecondaryButton
              onClick={() => setBulkOpen(true)}
            >
              <UploadCloud size={14} />
              Bulk import
            </SecondaryButton>

            <PrimaryButton onClick={onCreate}>
              <Plus size={14} />
              Add vocabulary
            </PrimaryButton>
          </div>
        }
      />

      <Card>
        {isLoading && (
          <div className="p-6 text-sm text-neutral-500">
            Loading vocabulary...
          </div>
        )}

        {isError && (
          <div className="p-6 text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : "Failed to load vocabulary."}
          </div>
        )}

        {!isLoading && !isError && vocab.length === 0 && (
          <div className="p-6 text-sm text-neutral-500">
            No vocabulary found.
          </div>
        )}

        {!isLoading && !isError && vocab.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>Word</Th>
                <Th>City</Th>
                <Th>Difficulty</Th>
                <Th>Image</Th>
                <Th>Audio</Th>
                <Th>Status</Th>
                <Th className="w-10" />
              </tr>
            </thead>

            <tbody>
              {vocab.map((vocabItem) => {
                const hasImage = Boolean(
                  vocabItem.imageUrl,
                );

                const hasAudio = Boolean(
                  vocabItem.audioUrl,
                );

                const status =
                  hasImage && hasAudio
                    ? "Published"
                    : "Draft";

                return (
                  <Row key={vocabItem.id}>
                    <Td className="font-medium text-neutral-900">
                      {vocabItem.germanWord}
                    </Td>

                    <Td className="text-neutral-500">
                      {vocabItem.cityId || "—"}
                    </Td>

                    <Td>
                      <Pill
                        tone={
                          vocabItem.difficulty ===
                          "Easy"
                            ? "easy"
                            : "medium"
                        }
                      >
                        {vocabItem.difficulty ||
                          "Easy"}
                      </Pill>
                    </Td>

                    <Td>
                      <span
                        className={
                          hasImage
                            ? "text-neutral-700"
                            : "text-neutral-300"
                        }
                      >
                        {hasImage
                          ? "Attached"
                          : "Missing"}
                      </span>
                    </Td>

                    <Td>
                      <span
                        className={
                          hasAudio
                            ? "text-neutral-700"
                            : "text-neutral-300"
                        }
                      >
                        {hasAudio
                          ? "Attached"
                          : "Missing"}
                      </span>
                    </Td>

                    <Td>
                      <Dot status={status} />
                    </Td>

                    <Td>
                      <RowMenu />
                    </Td>
                  </Row>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <BulkImportModal<VocabularyImportRow>
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk import vocabulary"
        description="Paste rows or upload a CSV to add multiple words at once. New words start as Draft until media is attached."
        columns={IMPORT_COLUMNS}
        onImport={handleImport}
      />
    </div>
  );
}
