import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from "./utils/ProtectedRoute";
import { ParticipantsProvider } from './contexts/ParticipantsContext';
import { AdminProvider } from './contexts/AdminContext';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/admin/Admin";
import Simulation from "./pages/admin/Simulation/Simulation";
import SimulationSummary from "./pages/admin/Simulation/Summary";
import SimulationCreate from "./pages/admin/Simulation/Create";
import SimulationEdit from "./pages/admin/Simulation/Edit";
import Session from "./pages/admin/Session/Session";
import SessionSummary from "./pages/admin/Session/Summary";
import Participants from "./pages/participants/Participants";
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
            <Route path="create" element={<SimulationCreate />} />
            <Route path=":id">
              <Route index element={<Simulation />} />
              <Route path="edit" element={<SimulationEdit />} />
              <Route path="summary" element={<SimulationSummary />} />
              <Route path="sessions/:id">
                <Route index element={<Session />} />
                <Route path="summary" element={<SessionSummary />} />
              </Route>
            </Route>
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
