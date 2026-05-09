import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './features/Auth/View/AuthView';
import Dashboard from './features/Dashboard/View/DashboardView';
import Profile from './features/Profile/View/ProfileView';
import Products from './features/Products/View/ProductsView';
import Services from './features/Services/View/ServicesView';
import About from './features/About/View/AboutView';
import CartView from './features/Cart/View/CartView';
import { CartProvider } from './features/Cart/Model/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<CartView />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
