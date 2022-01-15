import { Routes, Route } from "react-router-dom";
import ParticipantsRoutes from "./routes/ParticipantsRoutes";
import AdminRoutes from "./routes/AdminRoutes";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/admin/Admin";
import Participants from "./pages/participants/Participants";

export default function App() {
  return (
    <>
      <Header />
      <Routes>

        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<AdminRoutes />} >
            <Route index element={<Admin />} />
          </Route>

          <Route path="/participants" element={<ParticipantsRoutes />} >
            <Route index element={<Participants />} />
          </Route>
        </Route>

      </Routes>
      <Footer />
    </>
  )
}
