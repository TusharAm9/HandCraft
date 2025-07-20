import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getUserCartThunk, logoutUserThunk } from "../../store/thunk/userThunk";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

export default function Navbar() {
  const { cartItems, isAuthenticated } = useSelector(
    (state) => state.userSlice
  );

  const cartItemsCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef();
  const toggleMenu = () => setShowUserMenu((prev) => !prev);

  const handleLogout = () => {
    dispatch(logoutUserThunk());
    setShowUserMenu(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(getUserCartThunk());
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/">
              <h1 className="text-2xl font-bold text-amber-800">
                🪵Artisan Craft
              </h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-amber-700">
                Home
              </Link>
              <Link to="#" className="text-gray-700 hover:text-amber-700">
                Furniture
              </Link>
              <Link to="#" className="text-gray-700 hover:text-amber-700">
                Kitchenware
              </Link>
              <Link to="#" className="text-gray-700 hover:text-amber-700">
                Decor
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-amber-700">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="hidden md:flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search products..."
                className="w-64 border-amber-200 focus:border-amber-400"
              />
            </div> */}
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="relative"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Dropdown Panel */}
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-1 w-40 z-50 rounded-lg shadow-md border bg-white
                     flex flex-col animate-slide-down"
                >
                  {isAuthenticated ? (
                    <div className="flex flex-col px-4 py-2 items-center justify-center gap-2">
                      <Link
                        to="/my-orders"
                        className=" hover:bg-amber-100 rounded-xl cursor-pointer "
                      >
                        <Button
                          variant="ghost"
                          className="justify-start px-4 py-2 text-left text-sm  hover:bg-amber-200 cursor-pointer"
                        >
                          Orders
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="justify-start px-4 py-2 text-center text-sm text-white bg-amber-400 hover:bg-amber-300 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col px-1 py-2 items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start px-4 py-2 text-center text-sm bg-amber-400 hover:bg-amber-300 cursor-pointer"
                        onClick={() => {
                          navigate("/auth");
                          setShowUserMenu(false);
                        }}
                      >
                        Log in
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-amber-600">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
