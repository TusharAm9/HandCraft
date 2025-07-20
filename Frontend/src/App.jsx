import WoodenCraftsHomePage from "./pages/WoodenCraftsHomePage";
import AuthPage from "./pages/AuthPage";
import ProductDetails from "./pages/ProductDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import AuthRedirectRoute from "./pages/routs/AuthRedirectRoute";
import { useEffect } from "react";
import { getUserThunk } from "./store/thunk/userThunk";
import PageLayout from "./components/items/PageLayout";
import CartPage from "./pages/CartPage";
import ScrollToTop from "./pages/routs/ScrollToTop";
import AddProduct from "./pages/AddProduct";
import ViewAllProducts from "./pages/ViewAllProducts";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import About from "./pages/About";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserThunk());
  }, []);

  return (
    <div className="flex min-h-svh flex-col ">
      <Toaster position="top-center" reverseOrder={true} />
      <Router>
        <ScrollToTop />
        <PageLayout>
          <Routes>
            <Route
              path="/auth"
              element={
                <AuthRedirectRoute>
                  <AuthPage />
                </AuthRedirectRoute>
              }
            />
            <Route path="/" element={<WoodenCraftsHomePage />} />
            <Route path="/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/all-products" element={<ViewAllProducts />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/my-orders" element={<OrderHistoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/add-new-product" element={<AddProduct />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </PageLayout>
      </Router>
    </div>
  );
}

export default App;
