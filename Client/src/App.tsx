import { Route, Routes } from "react-router-dom";
import "./App.css";
import {
  SuperAdminLogin,
  AdminDashboard,
  UserMaster,
  RoleMaster,
  ModuleMaster,
  SubmoduleMaster,
} from "./pages";
import Layout from "./components/Layout";
import { SUPERUSER_NAVIGATION } from "./constant/superuser.constant";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin_login" element={<SuperAdminLogin />} />
        <Route
          path="/admin"
          element={<Layout navigation={SUPERUSER_NAVIGATION} />}
        >
          <Route path="" element={<AdminDashboard />} />
          <Route path="users" element={<UserMaster />} />
          <Route path="roles" element={<RoleMaster />} />
          <Route path="module" element={<ModuleMaster />} />
          <Route path="sub-module" element={<SubmoduleMaster />} />
        </Route>
        <Route path="*" element={<SuperAdminLogin />} />
      </Routes>
    </>
  );
}

export default App;
