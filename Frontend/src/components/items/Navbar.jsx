import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getBulkProductsThunk,
  getUserCartThunk,
  logoutUserThunk,
} from "../../store/thunk/userThunk";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { cartItems, isAuthenticated } = useSelector(
    (state) => state.userSlice
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItemsCount = Array.isArray(cartItems) ? cartItems.length : 0;

  // Hamburger menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Desktop user menu
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef();

  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

  const handleLogout = () => {
    dispatch(logoutUserThunk());
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Hide dropdown when clicking outside user menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserCartThunk());
    } else {
      dispatch(getBulkProductsThunk());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <header className="bg-white shadow-sm border-b border-amber-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1
            className="text-2xl font-extrabold text-amber-800 select-none"
            aria-label="Artisan Craft - Handcrafted Wooden Items"
          >
            🪵 Artisan Craft
          </h1>
        </Link>
        {/* Desktop navigation (md+) */}
        <nav className="hidden md:flex gap-10 text-amber-800 font-semibold tracking-wide">
          <Link
            to="/"
            className="hover:text-amber-950 transition-colors duration-150"
          >
            Home
          </Link>
          <Link
            to="#"
            className="hover:text-amber-950 transition-colors duration-150"
          >
            Kitchenware
          </Link>
          <Link
            to="#"
            className="hover:text-amber-950 transition-colors duration-150"
          >
            Storage
          </Link>
          <Link
            to="#"
            className="hover:text-amber-950 transition-colors duration-150"
          >
            Decor
          </Link>
          <Link
            to="/about"
            className="hover:text-amber-950 transition-colors duration-150"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="User menu"
              className="text-amber-900 hover:text-amber-700 transition-colors duration-150"
              onClick={toggleUserMenu}
            >
              <User className="h-5 w-5" />
            </Button>
            {showUserMenu && (
              <div className="absolute right-0 mt-4 min-w-36 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-md flex flex-col overflow-hidden text-sm z-50 animate-slide-down ">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-amber-900 hover:bg-amber-200 focus:bg-amber-200 focus:outline-none transition-colors duration-150 text-center rounded-sm mb-2"
                      role="menuitem"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-sm px-4 py-2 bg-amber-500 text-center hover:bg-amber-600 text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/auth");
                      setShowUserMenu(false);
                    }}
                    className="w-full rounded-sm px-4 py-2 bg-amber-500 text-center hover:bg-amber-600 text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    role="menuitem"
                  >
                    Log In
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cart (always visible) */}
          <Link to="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Go to cart"
              className="text-amber-900 hover:text-amber-700"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-amber-600 text-white">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
          {/* Hamburger Button (mobile only) */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-amber-900 hover:text-amber-700"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Hamburger Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-amber-50 border-t border-amber-200 shadow-inner px-4 py-4 space-y-2 text-amber-900 font-semibold z-40">
          <Link
            to="/"
            className="block py-2 hover:bg-amber-200 rounded"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="#"
            className="block py-2 hover:bg-amber-200 rounded"
            onClick={() => setMobileMenuOpen(false)}
          >
            Kitchenware
          </Link>
          <Link
            to="#"
            className="block py-2 hover:bg-amber-200 rounded"
            onClick={() => setMobileMenuOpen(false)}
          >
            Storage
          </Link>
          <Link
            to="#"
            className="block py-2 hover:bg-amber-200 rounded"
            onClick={() => setMobileMenuOpen(false)}
          >
            Decor
          </Link>
          <Link
            to="/about"
            className="block py-2 hover:bg-amber-200 rounded"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <hr className="border-amber-200 my-2" />
          {/* User-related actions for mobile */}
          <div className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-orders"
                  className="block py-2 hover:bg-amber-200 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-white rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/auth");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-white rounded"
              >
                Log In
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
