import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { getCurrentRole, ROLE } from "./common/utils/authHandler";
import Home from "./pages/Home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Error404 from "./pages/errors/Error404";
import Login from "./pages/admin/Login";
import Admin from "./pages/admin/Admin";
import Simulation from "./pages/admin/Simulation/Simulation";
import Create from "./pages/admin/Simulation/Create";
import Edit from "./pages/admin/Simulation/Edit";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="admin">
            <Route index element={<Admin />} />
          </Route>
          <Route path="simulations">
            <Route index element={<Navigate to="/admin" />} />
            <Route path="create" element={<Create />} />
            <Route path=":id">
              <Route index element={<Simulation />} />
              <Route path="edit" element={<Edit />} />
            </Route>
          </Route>
          <Route path="sessions">
            <Route index element={<Navigate to="/admin" />} />
            {/* <Route path=":id">
              <Route index element={<Session />} />
            </Route> */}
          </Route>
        </Route>

        <Route element={<ParticipantProtectedRoute />}></Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer />
    </>
  );
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
