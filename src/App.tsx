import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import CategoryPage from "./pages/CategoryPage";
import PlaceDetail from "./pages/PlaceDetail";
import ShoppingItemsPage from "./pages/ShoppingItemsPage";
import BookingFlow from "./pages/BookingFlow";
import BookingsPage from "./pages/BookingsPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBusinessCardDetail from "./pages/AdminBusinessCardDetail";
import NotFound from "./pages/NotFound";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/:id" element={<ProtectedRoute><AdminBusinessCardDetail /></ProtectedRoute>} />
            <Route path="*" element={
              <div className="max-w-lg mx-auto relative min-h-screen">
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/place/:id" element={<PlaceDetail />} />
                  <Route path="/shop/:id" element={<ShoppingItemsPage />} />
                  <Route path="/book/:id" element={<ProtectedRoute><BookingFlow /></ProtectedRoute>} />
                  <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
                  <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                   <Route path="/payment-canceled" element={<PaymentCanceled />} />
                   <Route path="/privacy" element={<PrivacyPolicyPage />} />
                   <Route path="*" element={<NotFound />} />
                </Routes>
                <BottomNav />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
