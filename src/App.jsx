import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFoundPage from "./pages/misc/ErrorPage";
import DashboardPage from "./pages/DashboardPage";
import { AuthorBooks } from "./pages/AuthorBooks";
import { AuthorDetails } from "./pages/AuthorDetails";
import { TablesPage } from "./pages/TablesPage";
import PayoutRequest from "./components/PayoutRequest";
import AuthorBookPurchase from "./pages/AuthorBookPurchase";

// Private route wrapper component
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// App routes component that decides whether to show Layout or not
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Auth Routes - No Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Not Found - No Layout */}
      <Route path="*" element={<NotFoundPage />} />
      
      {/* Protected Routes - With Layout */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/books" element={
        <PrivateRoute>
          <Layout>
            <AuthorBooks />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/details" element={
        <PrivateRoute>
          <Layout>
            <AuthorDetails />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/tables" element={
        <PrivateRoute>
          <Layout>
            <TablesPage />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/payout-request" element={
        <PrivateRoute>
          <Layout>
            <PayoutRequest />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/author-book-purchase" element={
        <PrivateRoute>
          <Layout>
            <AuthorBookPurchase />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Root redirect */}
      <Route path="/" element={
        user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      } />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;