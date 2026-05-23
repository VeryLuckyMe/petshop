import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './features/Auth/View/AuthView';
import Dashboard from './features/Dashboard/View/DashboardView';
import Profile from './features/Profile/View/ProfileView';
import Products from './features/Products/View/ProductsView';
import ProductDetailView from './features/Products/View/ProductDetailView';
import Services from './features/Services/View/ServicesView';
import About from './features/About/View/AboutView';
import HelpSupportView from './features/About/View/HelpSupportView';
import CartView from './features/Cart/View/CartView';
import WishlistView from './features/Wishlist/View/WishlistView';
import RecentlyViewedView from './features/RecentlyViewed/View/RecentlyViewedView';
import AdminDashboardView from './features/Dashboard/View/AdminDashboardView';
import { CartProvider } from './features/Cart/Model/CartContext';
import { WishlistProvider } from './features/Wishlist/Model/WishlistContext';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailView />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<HelpSupportView />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/wishlist" element={<WishlistView />} />
            <Route path="/recently-viewed" element={<RecentlyViewedView />} />
            <Route path="/admin" element={<AdminDashboardView />} />
          </Routes>
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
