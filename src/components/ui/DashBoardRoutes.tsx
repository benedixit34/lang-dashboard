import { Routes, Route, Navigate } from "react-router-dom";
import Overview from "../sections/Overview";
import Cities from "../sections/Cities";
import MediaLibrary from "../sections/MediaLibrary";
import Vocabulary from "../sections/Vocabulary";
import UsersSection from "../sections/Users";
import SettingsSection from "../sections/Settings";
import Categories from "../sections/Categories";
import { DRAWER_CONFIG } from "../../lib/drawerConfig";

type DrawerType = keyof typeof DRAWER_CONFIG;

export default function DashboardRoutes({
  onCreate,
}: {
  onCreate: (drawer: DrawerType) => void;
}) {
  return (
    <Routes>
      <Route path="overview" element={<Overview />} />

      <Route
        path="cities"
        element={<Cities onCreate={() => onCreate("cities")} />}
      />

      <Route
        path="categories"
        element={<Categories onCreate={() => onCreate("categories")} />}
      />

      <Route
        path="vocabulary"
        element={<Vocabulary onCreate={() => onCreate("vocabulary")} />}
      />

      <Route
        path="media"
        element={<MediaLibrary onCreate={() => onCreate("media")} />}
      />

      <Route path="users" element={<UsersSection />} />

      <Route path="settings" element={<SettingsSection />} />

      <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
    </Routes>
  );
}
