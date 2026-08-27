const API_BASE_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}


async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...options?.headers,
      },
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.message ||
        `API request failed: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export interface Level {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  levelId: string;
  level?: Level;
  imageUrl?: string | null;
  words: number;
  status: "Published" | "Draft";
}

export interface Category {
  id: string;
  name: string;
}

export interface LearningSet {
  id: string;
  name: string;
}

export interface VocabularyItem {
  id: string;
  itemId: string;
  word: string;
  germanWord: string;
  englishMeaning?: string | null;
  article?: string | null;
  wordType?: string | null;
  difficulty?: string | null;
  categoryId?: string | null;
  learningSetId?: string | null;
  cityId?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
}

export interface MediaItem {
  key?: string;
  name: string;
  type: "Image" | "Audio";
  url: string;
  usedBy?: string;
  date?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Activity {
  day: string;
  learners: number;
}

export interface AuthUser {
  id: string | number;
  email: string;
  username: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// LEVELS
export async function getLevels(): Promise<Level[]> {
  const response = await apiFetch<{
    success: boolean;
    data: Level[];
  }>("/levels");

  return response.data;
}




// AUTHENTICATION
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiFetch<{
    success: boolean;
    message: string;
    data: AuthResponse;
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  setToken(response.data.token);

  return response.data;
}


export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiFetch<{
    success: boolean;
    data: AuthResponse;
  }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  setToken(response.data.token);

  return response.data;
}


export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiFetch<{
    success: boolean;
    data: AuthUser;
  }>("/auth/me");

  return response.data;
}


export function logout(): void {
  clearToken();
}

// CITIES
export async function getCities(): Promise<City[]> {
  const response = await apiFetch<{
    success: boolean;
    data: City[];
  }>("/cities");

  return response.data;
}

export async function getCity(
  id: string,
): Promise<City> {
  const response = await apiFetch<{
    success: boolean;
    data: City;
  }>(`/cities/${id}`);

  return response.data;
}

export async function createCity(
  data: {
    name: string;
    country: string;
    levelId: string;
    imageUrl?: string;
  },
): Promise<City> {
  const response = await apiFetch<{
    success: boolean;
    data: City;
  }>("/cities", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function updateCity(
  id: string,
  data: Partial<{
    name: string;
    country: string;
    levelId: string;
    imageUrl: string;
  }>,
): Promise<City> {
  const response = await apiFetch<{
    success: boolean;
    data: City;
  }>(`/cities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function deleteCity(
  id: string,
): Promise<void> {
  await apiFetch(`/cities/${id}`, {
    method: "DELETE",
  });
}

// VOCABULARY
export async function getVocabulary(): Promise<
  VocabularyItem[]
> {
  const response = await apiFetch<{
    success: boolean;
    data: VocabularyItem[];
  }>("/vocabulary");

  return response.data;
}

export async function getVocabularyItem(
  id: string,
): Promise<VocabularyItem> {
  const response = await apiFetch<{
    success: boolean;
    data: VocabularyItem;
  }>(`/vocabulary/${id}`);

  return response.data;
}

export async function createVocabulary(
  data: {
    itemId?: string;
    categoryId?: string;
    learningSetId?: string;
    cityId?: string;
    germanWord: string;
    englishMeaning?: string;
    article?: string;
    wordType?: string;
    difficulty?: string;
    imageIdea?: string;
    imageUrl?: string;
    audioUrl?: string;
  },
): Promise<VocabularyItem> {
  const response = await apiFetch<{
    success: boolean;
    data: VocabularyItem;
  }>("/vocabulary", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function updateVocabulary(
  id: string,
  data: Partial<{
    categoryId: string;
    learningSetId: string;
    cityId: string;
    germanWord: string;
    englishMeaning: string;
    article: string;
    wordType: string;
    difficulty: string;
    imageIdea: string;
    imageUrl: string;
    audioUrl: string;
  }>,
): Promise<VocabularyItem> {
  const response = await apiFetch<{
    success: boolean;
    data: VocabularyItem;
  }>(`/vocabulary/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return response.data;
}

export async function deleteVocabulary(
  id: string,
): Promise<void> {
  await apiFetch(`/vocabulary/${id}`, {
    method: "DELETE",
  });
}


// BULK IMPORT VOCABULARY
export interface VocabularyImportRow {
  itemId?: string;
  categoryId?: string;
  learningSetId?: string;
  cityId?: string;
  germanWord: string;
  englishMeaning?: string;
  article?: string;
  wordType?: string;
  difficulty?: string;
  imageIdea?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface VocabularyImportResult {
  imported: number;
  skipped: number;
  errors: number;
  details?: {
    row: number;
    germanWord?: string;
    reason: string;
  }[];
}

export async function importVocabularyFromSpreadSheet(
  file: File,
) {
  const token = getToken();

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/vocabulary/import`,
    {
      method: "POST",
      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.message ||
        `Import failed: ${response.status}`,
    );
  }

  return response.json();
}


// CATEGORIES
export async function getCategories(): Promise<
  Category[]
> {
  const response = await apiFetch<{
    success: boolean;
    data: Category[];
  }>("/categories");

  return response.data;
}


export async function createCategory(
  data: { name: string }
): Promise<Category> {
  const response = await apiFetch<{
    success: boolean;
    data: Category;
  }>("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.data;
}


// LEARNING SETS
export async function getLearningSets(): Promise<
  LearningSet[]
> {
  const response = await apiFetch<{
    success: boolean;
    data: LearningSet[];
  }>("/learning-sets");

  return response.data;
}



// MEDIA
export async function getImages(): Promise<MediaItem[]> {
  const response = await apiFetch<{
    success: boolean;
    data: {
      key: string;
      url: string;
      date: string | undefined;
    }[];
    count: number;
  }>("/media/images");

  return response.data.map((image) => ({
    key: image.key,
    name: image.key.split("/").pop() || image.key,
    type: "Image",
    url: image.url,
    ...(image.date
      ? { date: image.date }
      : {}),
  }));
}

export async function deleteImage(
  key: string,
): Promise<void> {
  await apiFetch("/media/images", {
    method: "DELETE",
    body: JSON.stringify({ key }),
  });
}


// USERS
export async function getUsers(): Promise<User[]> {
  const response = await apiFetch<{
    success: boolean;
    data: User[];
  }>("/users");

  return response.data;
}


//UPLOAD IMAGES
export async function uploadImages(
  files: File[],
): Promise<MediaItem[]> {
  const token = getToken();

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(
    `${API_BASE_URL}/media/upload/multiple`,
    {
      method: "POST",
      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.message ||
        error?.error ||
        `Image upload failed: ${response.status}`,
    );
  }

  const result = await response.json();

  return result.data;
}