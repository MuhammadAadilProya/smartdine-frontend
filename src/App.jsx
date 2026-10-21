import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MenuItems from './pages/admin/MenuItems';
import Orders from './pages/admin/Orders';
import QRCodePage from './pages/admin/QRCode';
import MenuPage from './pages/customer/MenuPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer */}
        <Route path="/" element={<MenuPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:restaurantId" element={<MenuPage />} />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<MenuItems />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/qr" element={<QRCodePage />} />

        {/* Koi galat URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;