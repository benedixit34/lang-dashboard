import { useMemo, useState } from "react";
import TopBar from "./components/layout/TopBar";
import Sidebar from "./components/layout/Sidebar";
import Drawer from "./components/ui/Drawer";
import Overview from "./components/sections/Overview";
import Cities from "./components/sections/Cities";
import Vocabulary from "./components/sections/Vocabulary";
import MediaLibrary from "./components/sections/MediaLibrary";
import UsersSection from "./components/sections/Users";
import SettingsSection from "./components/sections/Settings";

const DRAWER_CONFIG = {
  cities: {
    title: "Create city",
    fields: [
      "Name",
      "Country",
      "Level number",
      "Description",
      "Cover image",
    ],
  },
  vocabulary: {
    title: "Add vocabulary",
    fields: [
      "City",
      "Word",
      "Pronunciation",
      "Image",
      "Audio",
    ],
  },
  media: {
    title: "Upload media",
    fields: [
      "File",
      "Type",
      "Description",
    ],
  },
} as const;

type Section =
  | "overview"
  | "cities"
  | "vocabulary"
  | "media"
  | "users"
  | "settings";

type DrawerType = keyof typeof DRAWER_CONFIG;

export default function App() {
  const [active, setActive] = useState<Section>("overview");
  const [drawer, setDrawer] = useState<DrawerType | null>(null);

  const drawerConfig = useMemo(() => DRAWER_CONFIG, []);

  return (
    <div className="flex h-screen w-full flex-col bg-white font-sans text-neutral-900 antialiased">
      <TopBar />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          active={active}
          onSelect={setActive}
        />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-5xl">
            {active === "overview" && <Overview />}

            {active === "cities" && (
              <Cities onCreate={() => setDrawer("cities")} />
            )}

            {active === "vocabulary" && (
              <Vocabulary onCreate={() => setDrawer("vocabulary")} />
            )}

            {active === "media" && (
              <MediaLibrary onCreate={() => setDrawer("media")} />
            )}

            {active === "users" && <UsersSection />}

            {active === "settings" && <SettingsSection />}
          </div>
        </div>
      </div>

      <Drawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        title={drawer ? drawerConfig[drawer].title : ""}
        fields={drawer ? [...drawerConfig[drawer].fields] : []}
      />
    </div>
  );
}