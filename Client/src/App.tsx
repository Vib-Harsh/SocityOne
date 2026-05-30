import { Route, Routes } from "react-router-dom";
import "./App.css";
import { SuperAdminLogin } from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin_login" element={<SuperAdminLogin />} />
        <Route path="*" element={<SuperAdminLogin />} />
      </Routes>
    </>
  );
}

export default App;
