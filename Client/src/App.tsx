import { Route, Routes } from "react-router-dom";
import "./App.css";
import {
  SuperAdminLogin,
  AdminDashboard,
  UserMaster,
  RoleMaster,
  ModuleMaster,
  SubmoduleMaster,
  RouteNotFound,
  AccessDenied,
  ServerError,
} from "./pages";
import Layout from "@/components/Layout";
import { SUPERUSER_NAVIGATION } from "./constant/superuser.constant";
import { url } from "./constant";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin_login" element={<SuperAdminLogin />} />
        <Route
          path={url.SUPERUSER.dashboard}
          element={
            <ProtectedRoute>
              <Layout navigation={SUPERUSER_NAVIGATION} />
            </ProtectedRoute>
          }
        >
          <Route path={url.SUPERUSER.dashboard} element={<AdminDashboard />} />
          <Route path={url.SUPERUSER.users} element={<UserMaster />} />
          <Route path={url.SUPERUSER.roles} element={<RoleMaster />} />
          <Route path={url.SUPERUSER.module} element={<ModuleMaster />} />
          <Route path={url.SUPERUSER.submodule} element={<SubmoduleMaster />} />
        </Route>
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </>
  );
}

export default App;
