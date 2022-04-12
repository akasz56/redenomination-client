import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { getCurrentRole, ROLE } from "./common/utils/authHandler";

import Home from "./pages/Home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./pages/admin/Login";
import Admin from "./pages/admin/Admin";

import Simulation from "./pages/admin/Simulation/Simulation";
import SimulationEdit from "./pages/admin/Simulation/SimulationEdit";
import SimulationCreate from "./pages/admin/Simulation/SimulationCreate";

import Session from "./pages/admin/Session/Session";

import Error404 from "./pages/errors/Error404";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<HomeRoute />} />
        <Route path="login" element={<Login />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="admin">
            <Route index element={<Admin />} />
          </Route>
          <Route path="simulations">
            <Route index element={<Navigate to="/admin" />} />
            <Route path="create" element={<SimulationCreate />} />
            <Route path=":simulationID">
              <Route index element={<Simulation />} />
              <Route path="edit" element={<SimulationEdit />} />
            </Route>
          </Route>
          <Route path="sessions">
            <Route index element={<Navigate to="/admin" />} />
            <Route path=":sessionID">
              <Route index element={<Session />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ParticipantProtectedRoute />}></Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer />
    </>
  );
}

function HomeRoute() {
  return getCurrentRole() === ROLE.ADMIN ? <Navigate to="/admin" /> : <Home />;
}

function AdminProtectedRoute(props: any) {
  return getCurrentRole() === ROLE.ADMIN ? (
    <Outlet {...props} />
  ) : (
    <Navigate to="/login" />
  );
}

function ParticipantProtectedRoute(props: any) {
  return getCurrentRole() === ROLE.PARTICIPANT ? (
    <Outlet {...props} />
  ) : (
    <Navigate to="/" />
  );
}
