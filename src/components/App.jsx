import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Main from "./Main";
import Espera from "./Espera";
import Admin from "./Admin";
import Footer from "./Footer";
import Login from "./Login";
import Splash from "./Splash";

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/espera" element={<Espera />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {location.pathname === "/" && <Footer />}
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Splash />;
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;