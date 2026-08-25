import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  importVocabularyFromSpreadSheet,
  type VocabularyItem,
  type VocabularyImportRow,
} from "../../data/api";

interface VocabularyProps {
  onCreate: () => void;
}

const IMPORT_COLUMNS = [
  {
    key: "germanWord",
    label: "German Word",
    required: true,
    example: "die Brücke",
  },
  {
    key: "englishMeaning",
    label: "English Meaning",
    required: false,
    example: "the bridge",
  },
  {
    key: "article",
    label: "Article",
    required: false,
    example: "die",
  },
  {
    key: "wordType",
    label: "Word Type",
    required: false,
    example: "noun",
  },
  {
    key: "difficulty",
    label: "Difficulty",
    required: false,
    example: "A1",
  },
  {
    key: "cityId",
    label: "City ID",
    required: false,
    example: "city-uuid",
  },
  {
    key: "categoryId",
    label: "Category ID",
    required: false,
    example: "category-uuid",
  },
  {
    key: "learningSetId",
    label: "Learning Set ID",
    required: false,
    example: "learning-set-uuid",
  },
  {
    key: "imageIdea",
    label: "Image Idea",
    required: false,
    example: "A bridge over a river",
  },
  {
    key: "imageUrl",
    label: "Image URL",
    required: false,
    example: "https://example.com/bridge.jpg",
  },
  {
    key: "audioUrl",
    label: "Audio URL",
    required: false,
    example: "https://example.com/bridge.mp3",
  },
] satisfies {
  key: keyof VocabularyImportRow;
  label: string;
  required: boolean;
  example: string;
}[];
export default function Vocabulary({ onCreate }: VocabularyProps) {
  const [bulkOpen, setBulkOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: vocab = [],
    isLoading,
    isError,
    error,
  } = useQuery<VocabularyItem[]>({
    queryKey: ["vocabulary"],
    queryFn: getVocabulary,
  });

const importMutation = useMutation({
  mutationFn: (file: File) =>
    importVocabularyFromSpreadSheet(file),

  onSuccess: (result) => {
    console.log(
      "Vocabulary import successful:",
      result,
    );

    queryClient.invalidateQueries({
      queryKey: ["vocabulary"],
    });

    setBulkOpen(false);
  },

  onError: (error) => {
    console.error(
      "Vocabulary import failed:",
      error,
    );
  },
});

const handleImport = (file: File) => {
  importMutation.mutate(file);
};



  return (
    <div>
      <SectionHeader
        title="Vocabulary"
        description="Words learners match to images and audio inside each city."
        action={
          <div className="flex gap-2">
            <SecondaryButton onClick={() => setBulkOpen(true)}>
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
                const hasImage = Boolean(vocabItem.imageUrl);

                const hasAudio = Boolean(vocabItem.audioUrl);

                const status = hasImage && hasAudio ? "Published" : "Draft";

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
                          vocabItem.difficulty === "Easy" ? "easy" : "medium"
                        }
                      >
                        {vocabItem.difficulty || "Easy"}
                      </Pill>
                    </Td>

                    <Td>
                      <span
                        className={
                          hasImage ? "text-neutral-700" : "text-neutral-300"
                        }
                      >
                        {hasImage ? "Attached" : "Missing"}
                      </span>
                    </Td>

                    <Td>
                      <span
                        className={
                          hasAudio ? "text-neutral-700" : "text-neutral-300"
                        }
                      >
                        {hasAudio ? "Attached" : "Missing"}
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
        isImporting={importMutation.isPending}
      />
    </div>
  );
}
