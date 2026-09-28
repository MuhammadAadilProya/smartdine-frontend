import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuItems from "./pages/admin/MenuItems";
import Orders from "./pages/admin/Orders";
import MenuPage from './pages/customer/MenuPage';
import QRCodePage from "./pages/admin/QRCode";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<MenuItems />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/qr" element={<QRCodePage />} />
        <Route path="/menu/:restaurantId" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;