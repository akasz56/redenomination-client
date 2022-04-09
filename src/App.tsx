import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Error404 from "./pages/errors/Error404";
import Login from "./pages/admin/Login";
import { getCurrentRole, ROLE } from "./common/utils/authHandler";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/asd" element={<Home />} />
        </Route>

        <Route element={<ParticipantProtectedRoute />}>
          <Route path="/qwe" element={<Home />} />
        </Route>

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
    <Navigate to="/login" />
  );
}
