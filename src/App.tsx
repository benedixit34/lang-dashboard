import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TopBar from "./components/layout/TopBar";
import Sidebar from "./components/layout/Sidebar";
import Drawer from "./components/ui/Drawer";
import Overview from "./components/sections/Overview";
import Cities from "./components/sections/Cities";
import Vocabulary from "./components/sections/Vocabulary";
import MediaLibrary from "./components/sections/MediaLibrary";
import UsersSection from "./components/sections/Users";
import SettingsSection from "./components/sections/Settings";
import Categories from "./components/sections/Categories";

import { DRAWER_CONFIG } from "./lib/drawerConfig";
import { Section } from "./types";
import LoginPage from "./pages/LoginPage";

import { getCurrentUser, getToken, setToken } from "./data/api";

type DrawerType = keyof typeof DRAWER_CONFIG;

function DashboardLayout() {
  const [active, setActive] = useState<Section>("overview");

  const [drawer, setDrawer] = useState<DrawerType | null>(null);

  const queryClient = useQueryClient();

  const token = getToken();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  /*
   * We have a token but haven't finished
   * checking it with the backend.
   */
  if (token && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  /*
   * No token, or the token is invalid/expired.
   */
  if (!token || isError || !user) {
    return (
      <LoginPage
        onSuccess={(result) => {
          console.log("Logged in:", result);

          // Store the JWT using the same key
          // used by getToken().
          setToken(result.token);

          // Update the current-user query immediately.
          queryClient.setQueryData(["current-user"], result.user);
        }}
        onSwitchToSignup={() => {
          console.log("Switch to signup");
        }}
      />
    );
  }

  const currentDrawer = drawer ? DRAWER_CONFIG[drawer] : null;

  return (
    <div className="flex h-screen w-full flex-col bg-white font-sans text-neutral-900 antialiased">
      <TopBar />

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-5xl">
            <Routes>
              <Route path="overview" element={<Overview />} />

              {/* Cities */}
              <Route
                path="cities"
                element={<Cities onCreate={() => setDrawer("cities")} />}
              />
              {/* Categories */}
              <Route
                path="/dashboard/categories"
                element={
                  <Categories onCreate={() => setDrawer("categories")} />
                }
              />

              {/* Vocabulary */}
              <Route
                path="vocabulary"
                element={
                  <Vocabulary onCreate={() => setDrawer("vocabulary")} />
                }
              />

              {/* Media */}
              <Route
                path="media"
                element={<MediaLibrary onCreate={() => setDrawer("media")} />}
              />

              {/* Users */}
              <Route path="users" element={<UsersSection />} />

              {/* Settings */}
              <Route path="settings" element={<SettingsSection />} />
            </Routes>
          </div>
        </div>
      </div>

      <Drawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        title={currentDrawer?.title ?? ""}
        fields={currentDrawer?.fields ?? []}
      />
    </div>
  );
}
function ProtectedRoute() {
  const token = getToken();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  /*
   * Token exists but authentication
   * has not been verified yet.
   */
  if (token && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  /*
   * No token or invalid/expired token.
   */
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
        {/* Public login route */}
        <Route
          path="/login"
          element={
            <LoginPage
              onSuccess={(result) => {
                console.log("Logged in:", result);

                // Persist JWT
                setToken(result.token);

                // Immediately populate
                // authenticated user
                queryClient.setQueryData(["current-user"], result.user);
              }}
              onSwitchToSignup={() => {
                console.log("Switch to signup");
              }}
            />
          }
        />

        {/* Protected dashboard */}
        <Route path="/dashboard/*" element={<ProtectedRoute />} />

        {/* Anything else */}
        <Route
          path="*"
          element={<Navigate to="/dashboard/overview" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
