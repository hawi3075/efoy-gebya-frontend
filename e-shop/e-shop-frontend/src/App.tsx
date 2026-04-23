import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail'; 
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile'; 

// Admin Pages
import Admin from './pages/admin/Admin'; 
import ProductCatalogue from './pages/admin/ProductCatalogue';
import Orders from './pages/admin/Orders';
import Guests from './pages/admin/Guests';
import Analytics from './pages/admin/Analytics';
import AdminProfile from './pages/admin/Profile'; // <--- NEW IMPORT

import './App.css';

const AppContent = () => {
  const location = useLocation();
  
  // Logic to detect if we are in the admin panel
  const isAdminPage = location.pathname.startsWith('/admin');
  const isProductsPage = location.pathname === '/products';
  const isDetailPage = location.pathname.startsWith('/product/');

  // Configuration for visibility
  const hideNavbarPaths = ['/login', '/register'];
  const hideFooterPaths = ['/cart', '/login', '/register', '/about', '/profile'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide Navbar on Admin and Auth pages */}
      {!isAdminPage && !hideNavbarPaths.includes(location.pathname) && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} /> 
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/admin/products" element={<ProductCatalogue />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/guests" element={<Guests />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/profile" element={<AdminProfile />} /> {/* <--- NEW ROUTE */}

          {/* Fallback for undefined routes */}
          <Route path="*" element={<div className="flex items-center justify-center h-screen">404 - Page Not Found</div>} />
        </Routes>
      </main>

      {/* Footer logic: Hide on Admin, Product lists, and Auth pages */}
      {!isAdminPage && 
       !isProductsPage && 
       !isDetailPage && 
       !hideFooterPaths.includes(location.pathname) && (
        <Footer />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;