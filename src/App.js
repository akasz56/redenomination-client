import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from "./utils/ProtectedRoute";
import { ParticipantsProvider } from './contexts/ParticipantsContext';
import { AdminProvider } from './contexts/AdminContext';

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/admin/Admin";
import Participants from "./pages/participants/Participants";
import Simulation from "./pages/admin/Simulation";
import Error404 from './pages/errors/Error404';

export default function App() {
  return (
    <>
      <Header />
      <Routes>

        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />

          <Route path="simulations" element={<AdminRoutes />} >
            <Route index element={<Admin />} />
            <Route path=":id" element={<Simulation />} />
          </Route>

          <Route path="participants" element={<ParticipantsRoutes />} >
            <Route index element={<Participants />} />
          </Route>
        </Route>

        <Route path="*" element={<Error404 />} />

      </Routes>
      <Footer />
    </>
  )
}


function AdminRoutes() {
  return (
    <ProtectedRoute auth='admin'>
      <AdminProvider>
        <Outlet />
      </AdminProvider>
    </ProtectedRoute>
  );
}

function ParticipantsRoutes() {
  return (
    <ProtectedRoute auth='participant'>
      <ParticipantsProvider>
        <Outlet />
      </ParticipantsProvider>
    </ProtectedRoute>
  );
}
