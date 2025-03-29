import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import { AuthorBooks } from "../pages/AuthorBooks";
import { AuthorDetails } from "../pages/AuthorDetails";
import { TablesPage } from "../pages/TablesPage";
import AuthRoutes from "./AuthRoutes";
import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "../components/admin/AdminDashboard";
import PayoutRequest from "../components/PayoutRequest";
import AuthorBookPurchase from '../pages/AuthorBookPurchase';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("PrivateRoute user:", user); // Debugging log
  return user ? children : <Navigate to="/auth/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("AdminRoute user:", user); // Debugging log
  return user?.role === "admin" ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  const routes = [
    { path: "/auth/*", element: <AuthRoutes /> },
    { path: "/admin", element: <AdminDashboard />, isAdmin: true },
    { path: "/dashboard", element: <DashboardPage />, isPrivate: true },
    { path: "/books", element: <AuthorBooks />, isPrivate: true },
    { path: "/Details", element: <AuthorDetails />, isPrivate: true },
    { path: "/tables", element: <TablesPage />, isPrivate: true },
    { path: "/PayoutRequest", element: <PayoutRequest />, isPrivate: true },
    { path: "/AuthorBookPurchase", element: <AuthorBookPurchase />, isPrivate: true },
    { path: "/", element: <Navigate to="/auth/login" /> }
  ];

  return (
    <Routes>
      {routes.map((route, index) => {
        if (route.isAdmin) {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <AdminRoute>
                  {route.element}
                </AdminRoute>
              }
            />
          );
        }
        if (route.isPrivate) {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRoute>
                  {route.element}
                </PrivateRoute>
              }
            />
          );
        }
        return <Route key={index} path={route.path} element={route.element} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
