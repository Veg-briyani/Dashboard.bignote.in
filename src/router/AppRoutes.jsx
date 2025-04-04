// AppRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import { AuthorBooks } from "../pages/AuthorBooks";
import { AuthorDetails } from "../pages/AuthorDetails";
import { TablesPage } from "../pages/TablesPage";
import AuthRoutes from "./AuthRoutes";
import { useAuth } from "../contexts/AuthContext";
import PayoutRequest from "../components/PayoutRequest";
import AuthorBookPurchase from "../pages/AuthorBookPurchase";
import Layout from "../layouts/Layout";
import ResetPassword from "../pages/ResetPassword";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth/login" />;
};

const AppRoutes = () => {
  const routes = [
    { path: "/auth/*", element: <AuthRoutes />, isPrivate: false },
    { path: "/dashboard", element: <DashboardPage />, isPrivate: true },
    { path: "/books", element: <AuthorBooks />, isPrivate: true },
    { path: "/details", element: <AuthorDetails />, isPrivate: true },
    { path: "/tables", element: <TablesPage />, isPrivate: true },
    { path: "/payout-request", element: <PayoutRequest />, isPrivate: true },
    {
      path: "/author-book-purchase",
      element: <AuthorBookPurchase />,
      isPrivate: true,
    },
    // Direct route for reset password links from email
    { 
      path: "/reset-password", 
      element: <ResetPassword />, 
      isPrivate: false 
    },
    { path: "/", element: <Navigate to="/auth/login" />, isPrivate: false },
  ];

  return (
    <Routes>
      {routes.map((route, index) => {
        if (route.isPrivate) {
          return (
            <Route
              key={index}
              path={route.path}
              element={<PrivateRoute>{route.element}</PrivateRoute>}
            />
          );
        }
        return <Route key={index} path={route.path} element={route.element} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
