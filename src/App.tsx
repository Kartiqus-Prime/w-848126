
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/SupabaseAuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
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
          <div className="min-h-screen bg-background flex flex-col">
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
                  <main className="flex-1">
                    <Home />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <About />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/recettes" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Recipes />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/produits" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Products />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/videos" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Videos />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/favoris" element={
                <ProtectedRoute>
                  <Header />
                  <main className="flex-1">
                    <Favorites />
                  </main>
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/login" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Login />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/signup" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Signup />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/forgot-password" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <ForgotPassword />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/reset-password" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <ResetPassword />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/verify-email" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <VerifyEmail />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/phone-auth" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <PhoneAuth />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/mobile-redirect" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <MobileRedirect />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/download-app" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <DownloadApp />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Header />
                  <main className="flex-1">
                    <Profile />
                  </main>
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/panier" element={
                <ProtectedRoute>
                  <Header />
                  <main className="flex-1">
                    <Cart />
                  </main>
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <NotFound />
                  </main>
                  <Footer />
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
