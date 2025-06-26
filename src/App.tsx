
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Products from "./pages/Products";
import Videos from "./pages/Videos";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PhoneAuth from "./pages/PhoneAuth";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import MobileRedirect from "./pages/MobileRedirect";
import DownloadApp from "./pages/DownloadApp";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RecipeManagement from "./pages/admin/RecipeManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import VideoManagement from "./pages/admin/VideoManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/recipes" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <RecipeManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ProductManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/videos" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <VideoManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <main>
                    <Home />
                  </main>
                </>
              } />
              <Route path="/recettes" element={
                <>
                  <Header />
                  <main>
                    <Recipes />
                  </main>
                </>
              } />
              <Route path="/produits" element={
                <>
                  <Header />
                  <main>
                    <Products />
                  </main>
                </>
              } />
              <Route path="/videos" element={
                <>
                  <Header />
                  <main>
                    <Videos />
                  </main>
                </>
              } />
              <Route path="/favoris" element={
                <ProtectedRoute>
                  <Header />
                  <main>
                    <Favorites />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/login" element={
                <>
                  <Header />
                  <main>
                    <Login />
                  </main>
                </>
              } />
              <Route path="/signup" element={
                <>
                  <Header />
                  <main>
                    <Signup />
                  </main>
                </>
              } />
              <Route path="/forgot-password" element={
                <>
                  <Header />
                  <main>
                    <ForgotPassword />
                  </main>
                </>
              } />
              <Route path="/reset-password" element={
                <>
                  <Header />
                  <main>
                    <ResetPassword />
                  </main>
                </>
              } />
              <Route path="/verify-email" element={
                <>
                  <Header />
                  <main>
                    <VerifyEmail />
                  </main>
                </>
              } />
              <Route path="/phone-auth" element={
                <>
                  <Header />
                  <main>
                    <PhoneAuth />
                  </main>
                </>
              } />
              <Route path="/mobile-redirect" element={
                <>
                  <Header />
                  <main>
                    <MobileRedirect />
                  </main>
                </>
              } />
              <Route path="/download-app" element={
                <>
                  <Header />
                  <main>
                    <DownloadApp />
                  </main>
                </>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Header />
                  <main>
                    <Profile />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/panier" element={
                <ProtectedRoute>
                  <Header />
                  <main>
                    <Cart />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <>
                  <Header />
                  <main>
                    <NotFound />
                  </main>
                </>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
