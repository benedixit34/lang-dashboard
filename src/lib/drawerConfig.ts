import type { FieldProps } from "../types";

type DrawerConfig = {
  title: string;
  fields: FieldProps[];
};

export const DRAWER_CONFIG = {
  cities: {
    title: "Create City",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "e.g. Berlin",
      },
      {
        name: "country",
        label: "Country",
        type: "text",
        placeholder: "e.g. Germany",
      },
      {
        name: "levelId",
        label: "Level",
        type: "number",
        placeholder: "1",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe this city",
      },
      {
        name: "imageUrl",
        label: "Cover Image",
        type: "file",
      },
    ],
  },

  categories: {
    title: "Create Category",
    fields: [
      {
        name: "name",
        label: "Category name",
        type: "text",
        placeholder: "e.g. Food & Drinks",
      },
    ],
  },

  vocabulary: {
    title: "Add Vocabulary",
    fields: [
      {
        name: "itemId",
        label: "Item ID",
        type: "text",
        placeholder: "GER001",
      },
      {
        name: "categoryId",
        label: "Category",
        type: "select",
        options: [],
      },
      {
        name: "learningSetId",
        label: "Learning Set",
        type: "select",
        options: [],
      },
      {
        name: "germanWord",
        label: "German Word",
        type: "text",
        placeholder: "Hallo",
      },
      {
        name: "englishMeaning",
        label: "English Meaning",
        type: "text",
        placeholder: "Hello",
      },
      {
        name: "article",
        label: "Article",
        type: "select",
        options: ["der", "die", "das", "—"],
      },
      {
        name: "wordType",
        label: "Word Type",
        type: "select",
        options: [
          "Noun",
          "Verb",
          "Adjective",
          "Adverb",
          "Pronoun",
          "Preposition",
          "Conjunction",
          "Interjection",
          "Phrase",
        ],
      },
      {
        name: "difficulty",
        label: "Difficulty",
        type: "select",
        options: [
          "Beginner",
          "Easy",
          "Medium",
          "Hard",
        ],
      },
      {
        name: "imageIdea",
        label: "Image Idea",
        type: "textarea",
        placeholder: "Describe the illustration",
      },
      {
        name: "imageUrl",
        label: "Image",
        type: "file",
      },
      {
        name: "audioUrl",
        label: "Audio",
        type: "file",
      },
    ],
  },

  media: {
    title: "Upload Media",
    fields: [
      {
        name: "vocabularyId",
        label: "Vocabulary",
        type: "select",
        options: [],
      },
      {
        name: "mediaType",
        label: "Media Type",
        type: "select",
        options: ["Image", "Audio"],
      },
      {
        name: "file",
        label: "File",
        type: "file",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Optional",
      },
    ],
  },
} satisfies Record<string, DrawerConfig>;