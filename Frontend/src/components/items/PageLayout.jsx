import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();

  const hideLayoutForRoutes = ["/cart", "/payment", "/admin"];

  const hideLayout = hideLayoutForRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default PageLayout;
