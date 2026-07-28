import { useState } from "react";
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

import { VOCAB, type VocabularyItem } from "../../data/mockData";


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


const truthy = (v?: string): boolean =>
  ["yes", "true", "1", "y"].includes(
    String(v).trim().toLowerCase()
  );


export default function Vocabulary({
  onCreate,
}: VocabularyProps) {

  const [vocab, setVocab] =
    useState<VocabularyItem[]>(VOCAB);

  const [bulkOpen, setBulkOpen] =
    useState(false);



  const handleImport = (
    rows: VocabularyImportRow[]
  ) => {

    const startId = vocab.length
      ? Math.max(...vocab.map((v) => v.id)) + 1
      : 1;


    const imported: VocabularyItem[] =
      rows.map((r, i) => ({
        id: startId + i,
        word: r.word,
        city: r.city,

        difficulty:
          r.difficulty === "Medium" ||
          r.difficulty === "Hard"
            ? r.difficulty
            : "Easy",

        image: truthy(r.image),
        audio: truthy(r.audio),

        status: "Draft",
      }));


    setVocab((prev) => [
      ...prev,
      ...imported,
    ]);
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


            <PrimaryButton
              onClick={onCreate}
            >
              <Plus size={14} />
              Add vocabulary
            </PrimaryButton>

          </div>
        }
      />


      <Card>

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

            {vocab.map((v) => (

              <Row key={v.id}>

                <Td className="font-medium text-neutral-900">
                  {v.word}
                </Td>


                <Td className="text-neutral-500">
                  {v.city}
                </Td>


                <Td>
                  <Pill
                    tone={
                      v.difficulty === "Easy"
                        ? "easy"
                        : "medium"
                    }
                  >
                    {v.difficulty}
                  </Pill>
                </Td>


                <Td>
                  <span
                    className={
                      v.image
                        ? "text-neutral-700"
                        : "text-neutral-300"
                    }
                  >
                    {v.image
                      ? "Attached"
                      : "Missing"}
                  </span>
                </Td>


                <Td>
                  <span
                    className={
                      v.audio
                        ? "text-neutral-700"
                        : "text-neutral-300"
                    }
                  >
                    {v.audio
                      ? "Attached"
                      : "Missing"}
                  </span>
                </Td>


                <Td>
                  <Dot status={v.status} />
                </Td>


                <Td>
                  <RowMenu />
                </Td>

              </Row>

            ))}

          </tbody>

        </table>

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