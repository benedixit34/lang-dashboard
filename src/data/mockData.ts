export interface City {
  id: number;
  name: string;
  country: string;
  level: number;
  words: number;
  status: "Published" | "Draft";
}

export interface VocabularyItem {
  id: number;
  word: string;
  city: string;
  difficulty: "Easy" | "Medium" | "Hard";
  image: boolean;
  audio: boolean;
  status: "Published" | "Draft";
}

export interface MediaItem {
  id: number;
  name: string;
  type: "Image" | "Audio";
  usedBy: string;
  date: string;
  url?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  completed: number;
  progress: number;
  joined: string;
}

export interface Activity {
  day: string;
  learners: number;
}

export const CITIES: City[] = [
  { id: 1, name: "Berlin", country: "Germany", level: 1, words: 42, status: "Published" },
  { id: 2, name: "Munich", country: "Germany", level: 2, words: 38, status: "Published" },
  { id: 3, name: "Hamburg", country: "Germany", level: 3, words: 25, status: "Draft" },
  { id: 4, name: "Vienna", country: "Austria", level: 4, words: 0, status: "Draft" },
];

export const VOCAB: VocabularyItem[] = [
  { id: 1, word: "der Zug", city: "Berlin", difficulty: "Easy", image: true, audio: true, status: "Published" },
  { id: 2, word: "der Bahnhof", city: "Berlin", difficulty: "Easy", image: true, audio: true, status: "Published" },
  { id: 3, word: "die Fahrkarte", city: "Berlin", difficulty: "Medium", image: true, audio: false, status: "Draft" },
  { id: 4, word: "das Brot", city: "Berlin", difficulty: "Easy", image: true, audio: true, status: "Published" },
  { id: 5, word: "die Straße", city: "Munich", difficulty: "Easy", image: false, audio: true, status: "Draft" },
  { id: 6, word: "das Rathaus", city: "Munich", difficulty: "Medium", image: true, audio: true, status: "Published" },
];

export const MEDIA: MediaItem[] = [
  { id: 1, name: "berlin-cover.jpg", type: "Image", usedBy: "Berlin (city)", date: "Jul 02, 2026" },
  { id: 2, name: "bahnhof.mp3", type: "Audio", usedBy: "der Bahnhof", date: "Jul 03, 2026" },
  { id: 3, name: "station.png", type: "Image", usedBy: "der Bahnhof", date: "Jul 03, 2026" },
  { id: 4, name: "zug.mp3", type: "Audio", usedBy: "der Zug", date: "Jul 04, 2026" },
  { id: 5, name: "munich-cover.jpg", type: "Image", usedBy: "Munich (city)", date: "Jul 10, 2026" },
];

export const USERS: User[] = [
  { id: 1, name: "Amara Chukwu", email: "amara@example.com", completed: 3, progress: 68, joined: "Jun 12, 2026" },
  { id: 2, name: "Leo Fischer", email: "leo.fischer@example.com", completed: 2, progress: 41, joined: "Jun 20, 2026" },
  { id: 3, name: "Priya Nair", email: "priya.nair@example.com", completed: 4, progress: 92, joined: "Jul 01, 2026" },
  { id: 4, name: "Tomás Rivera", email: "tomas.r@example.com", completed: 1, progress: 15, joined: "Jul 14, 2026" },
];

export const ACTIVITY: Activity[] = [
  { day: "Mon", learners: 1180 },
  { day: "Tue", learners: 1340 },
  { day: "Wed", learners: 1290 },
  { day: "Thu", learners: 1510 },
  { day: "Fri", learners: 1690 },
  { day: "Sat", learners: 1440 },
  { day: "Sun", learners: 1580 },
];
