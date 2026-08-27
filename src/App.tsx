import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardRoutes from "./components/ui/DashBoardRoutes";
import TopBar from "./components/layout/TopBar";
import Sidebar from "./components/layout/Sidebar";
import Drawer from "./components/ui/Drawer";
import { DRAWER_CONFIG } from "./lib/drawerConfig";
import LoginPage from "./pages/LoginPage";
import {
  getCurrentUser,
  getToken,
  setToken,
  createCity,
  createVocabulary,
  createCategory,
} from "./data/api";

type DrawerType = keyof typeof DRAWER_CONFIG;

interface DrawerSubmitData {
  name?: string;
  country?: string;
  levelId?: string;
  imageUrl?: string;
  description?: string;
  germanWord?: string;
  englishMeaning?: string;
  article?: string;
  wordType?: string;
  difficulty?: string;
  categoryId?: string;
  learningSetId?: string;
  cityId?: string;
  imageIdea?: string;
  audioUrl?: string;
}

function DashboardLayout() {
  const [drawer, setDrawer] = useState<DrawerType | null>(null);
  const queryClient = useQueryClient();
  const token = getToken();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  const createCityMutation = useMutation({
    mutationFn: (data: {
      name: string;
      country: string;
      levelId: string;
      imageUrl?: string;
    }) => createCity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      setDrawer(null);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: { name: string }) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDrawer(null);
    },
   
  });

  const createVocabularyMutation = useMutation({
    mutationFn: (data: {
      germanWord: string;
      englishMeaning?: string;
      article?: string;
      wordType?: string;
      difficulty?: string;
      categoryId?: string;
      learningSetId?: string;
      cityId?: string;
      imageIdea?: string;
      imageUrl?: string;
      audioUrl?: string;
    }) => createVocabulary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary"] });
      setDrawer(null);
    },
  });

  if (token && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!token || isError || !user) {
    return (
      <LoginPage
        onSuccess={(result) => {
          setToken(result.token);
          queryClient.setQueryData(["current-user"], result.user);
        }}
        onSwitchToSignup={() => {}}
      />
    );
  }

  const handleDrawerSubmit = (data: DrawerSubmitData) => {
    if (!drawer) return;

    switch (drawer) {
      case "cities":
        if (!data.name || !data.country || !data.levelId) return;

        createCityMutation.mutate({
          name: data.name,
          country: data.country,
          levelId: data.levelId,
          imageUrl: data.imageUrl,
        });
        break;

      case "categories":
        if (!data.name) return;

        createCategoryMutation.mutate({
          name: data.name,
        });
        console.log("Creating category:", data.name);
        break;

      case "vocabulary":
        if (!data.germanWord) return;

        createVocabularyMutation.mutate({
          germanWord: data.germanWord,
          englishMeaning: data.englishMeaning,
          article: data.article,
          wordType: data.wordType,
          difficulty: data.difficulty,
          categoryId: data.categoryId,
          learningSetId: data.learningSetId,
          cityId: data.cityId,
          imageIdea: data.imageIdea,
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
        });
        break;

      default:
        break;
    }
  };

  const isDrawerSubmitting =
    createCityMutation.isPending ||
    createCategoryMutation.isPending ||
    createVocabularyMutation.isPending;

  const currentDrawer = drawer ? DRAWER_CONFIG[drawer] : null;

  return (
    <div className="flex h-screen w-full flex-col bg-white font-sans text-neutral-900 antialiased">
      <TopBar />

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-5xl">
            <DashboardRoutes
              onCreate={(drawerType) => setDrawer(drawerType)}
            />
          </div>
        </div>
      </div>

      {currentDrawer && (
        <Drawer
          open={drawer !== null}
          onClose={() => {
            if (!isDrawerSubmitting) {
              setDrawer(null);
            }
          }}
          title={currentDrawer.title}
          fields={currentDrawer.fields}
          onSubmit={handleDrawerSubmit}
          isSubmitting={isDrawerSubmitting}
        />
      )}
    </div>
  );
}

function ProtectedRoute() {
  const token = getToken();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  if (token && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!token || isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
}

export default function App() {
  const queryClient = useQueryClient();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              onSuccess={(result) => {
                setToken(result.token);
                queryClient.setQueryData(
                  ["current-user"],
                  result.user
                );
              }}
              onSwitchToSignup={() => {}}
            />
          }
        />

        <Route
          path="/dashboard/*"
          element={<ProtectedRoute />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard/overview"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}