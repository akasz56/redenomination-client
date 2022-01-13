import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Admin from "./routes/Admin";
import Participants from "./routes/Participants";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/participant" element={<Participants />} />
        </Route>
      </Routes>
      <Footer />
    </>
  )
}
