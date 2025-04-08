import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import { AuthorBooks } from "../pages/AuthorBooks";
import { AuthorDetails } from "../pages/AuthorDetails";
import { TablesPage } from "../pages/TablesPage";
import AuthRoutes from "./AuthRoutes";
import { useAuth } from "../contexts/AuthContext";
import PayoutRequest from "../components/PayoutRequest";
import AuthorBookPurchase from "../pages/AuthorBookPurchase";
import ResetPassword from "../pages/ResetPassword";
import NotFoundPage from "../pages/misc/ErrorPage";  // Import the ErrorPage component for 404

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

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
    {
      path: "/reset-password",
      element: <ResetPassword />,
      isPrivate: false
    },
    {
      path: "/",
      element: user ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />,
      isPrivate: false
    },
    { path: "*", element: <NotFoundPage />, isPrivate: false },
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
