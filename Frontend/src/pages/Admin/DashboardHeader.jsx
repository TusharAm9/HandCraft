import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { logoutUserThunk } from "../../store/thunk/userThunk";

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUserThunk());
    navigate("/home");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-amber-800">
            🪵Craft Admin
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/admin" className="text-amber-700 font-medium">
              Dashboard
            </Link>
            <Link
              to="/add-new-product"
              className="text-gray-700 hover:text-amber-700"
            >
              Add Product
            </Link>
            <Link to="/home" className="text-gray-700 hover:text-amber-700">
              View Store
            </Link>
          </nav>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
