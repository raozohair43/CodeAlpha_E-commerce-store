import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '../src/styles/theme.css';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CartPage from './pages/CartPage/CartPage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import AdminRoute from './components/AdminRoute/AdminRoute';
import AdminPage from './pages/AdminPage/AdminPage';
import Toast from './components/Toast/Toast';
import ProfilePage from './pages/ProfilePgae/ProfilePage';

const App = () => {
  const token = useAuthStore((s) => s.token);

  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={!token ? <LoginPage />    : <Navigate to="/products" replace />} />
          <Route path="/register"  element={!token ? <RegisterPage /> : <Navigate to="/products" replace />} />
          <Route path="/products"  element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart"    element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/orders"  element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route path="*"        element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </BrowserRouter>
  );
};

export default App;