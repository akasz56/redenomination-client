import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Participants from "./pages/Participants";


export default function App() {
  return (
    <>
      <Header />
      <Routes>

        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute auth="admin" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route element={<ProtectedRoute auth="participant" />}>
            <Route path="/participant" element={<Participants />} />
          </Route>
        </Route>

      </Routes>
      <Footer />
    </>
  )
}
