import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, screenLoading } = useSelector(
    (state) => state.userSlice
  );
  useEffect(() => {
    if (!screenLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [screenLoading, isAuthenticated]);
  return children;
};

export default ProtectedRoute;
