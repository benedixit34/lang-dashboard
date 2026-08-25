import { FieldProps } from "../types";


type DrawerConfig = {
  title: string;
  fields: FieldProps[];
};


export const DRAWER_CONFIG = {
  cities: {
    title: "Create City",
    fields: [
      {
        label: "Name",
        type: "text",
        placeholder: "e.g. Berlin",
      },
      {
        label: "Country",
        type: "text",
        placeholder: "e.g. Germany",
      },
      {
        label: "Level",
        type: "number",
        placeholder: "1",
      },
      {
        label: "Description",
        type: "textarea",
        placeholder: "Describe this city",
      },
      {
        label: "Cover Image",
        type: "file",
      },
    ],
  },
  categories: {
    title: "Create Category",
    fields: [
      {
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
        label: "Item ID",
        type: "text",
        placeholder: "GER001",
      },
      {
        label: "Category",
        type: "select",
        options: [], // Load from Categories table
      },
      {
        label: "Learning Set",
        type: "select",
        options: [], // Core, Travel, Food...
      },
      {
        label: "German Word",
        type: "text",
        placeholder: "Hallo",
      },
      {
        label: "English Meaning",
        type: "text",
        placeholder: "Hello",
      },
      {
        label: "Article",
        type: "select",
        options: ["der", "die", "das", "—"],
      },
      {
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
        label: "Difficulty",
        type: "select",
        options: ["Beginner", "Easy", "Medium", "Hard"],
      },
      {
        label: "Image Idea",
        type: "textarea",
        placeholder: "Describe the illustration",
      },
      {
        label: "Image",
        type: "file",
      },
      {
        label: "Audio",
        type: "file",
      },
    ],
  },

  media: {
    title: "Upload Media",
    fields: [
      {
        label: "Vocabulary",
        type: "select",
        options: [], // Existing vocabulary
      },
      {
        label: "Media Type",
        type: "select",
        options: ["Image", "Audio"],
      },
      {
        label: "File",
        type: "file",
      },
      {
        label: "Description",
        type: "textarea",
        placeholder: "Optional",
      },
    ],
  },
} satisfies Record<string, DrawerConfig>;