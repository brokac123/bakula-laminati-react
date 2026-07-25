import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="o-nama" element={<About />} />
        <Route path="katalog" element={<Catalog />} />
        <Route path="proizvod/:slug" element={<ProductDetail />} />
        <Route path="kontakt" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
