import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  // State for the cart notification count
  const [cartCount, setCartCount] = useState(0);

  // --- CART NOTIFICATION LOGIC ---
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `text-[10px] font-bold uppercase tracking-widest transition-colors pb-1 border-b-2 ${
      isActive
        ? 'text-black border-black'
        : 'text-zinc-500 border-transparent hover:text-black hover:border-zinc-300'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-lg font-black tracking-tighter uppercase text-black shrink-0"
        >
          EFOY GEBYA
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={navLinkStyles}>
            HOME
          </NavLink>
          <NavLink to="/products" className={navLinkStyles}>
            SHOP
          </NavLink>
          <NavLink to="/about" className={navLinkStyles}>
            ABOUT
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Auth Links */}
          <NavLink to="/login" className={navLinkStyles}>
            LOG IN
          </NavLink>
          <NavLink to="/register" className={navLinkStyles}>
            SIGN UP
          </NavLink>

          {/* Profile Icon */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? 'text-black' : 'text-zinc-500 hover:text-black'
              }`
            }
          >
            <User className="h-5 w-5" />
          </NavLink>

          {/* Cart Icon with Live Notification Badge */}
          <Link
            to="/cart"
            className="relative text-black hover:text-zinc-500 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] font-bold text-white animate-in zoom-in duration-200">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;