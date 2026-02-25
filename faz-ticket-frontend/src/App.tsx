import { useEffect } from "react";
import { useLocation, BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Register from "./pages/auth/Register";
import SignIn from "./pages/auth/SignIn";
import VerifyEmail from "./pages/auth/VerifyEmail";
import MatchDetails from "./pages/match/MatchDetails";
import Matches from "./pages/match/Matches";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import { default as CheckoutPage } from "./pages/checkout/CheckoutPage";
import { default as PaymentPage } from "./pages/checkout/PaymentPage";
import PaymentProcessing from "./pages/payment/PaymentProcessing";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import MyTickets from "./pages/account/MyTickets";
import Teams from "./pages/Teams";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import SecurityArchitecture from "./pages/SecurityArchitecture";

/**
 * ScrollToTop Component
 * Ensures the window scrolls back to the top on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {/* Global Scroll Fix */}
            <ScrollToTop />

            <Routes>
              <Route path="/" element={<Index />} />
              {/* Existing landing route that lists a few matches */}
              <Route path="/matches" element={<Index />} />

              {/* Your full list page */}
              <Route path="/All-Matches" element={<Matches />} />
              {/* Typo safety: /All-Maches -> /All-Matches */}
              <Route path="/All-Maches" element={<Navigate to="/All-Matches" replace />} />

              {/* Single match (details + seat selection handled inside this page) */}
              <Route path="/match/:id" element={<MatchDetails />} />

              {/* Compatibility redirects if anything links to REST-style paths */}
              <Route path="/matches/:id" element={<Navigate to="/match/:id" replace />} />
              <Route path="/matches/:id/seats" element={<Navigate to="/match/:id" replace />} />

              {/* Auth routes: redirect if already signed in */}
              <Route
                path="/auth/register"
                element={
                  <ProtectedRoute redirectIfAuthenticated>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth/signin"
                element={
                  <ProtectedRoute redirectIfAuthenticated>
                    <SignIn />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth/verify-email" element={<VerifyEmail />} />

              {/* Cart and checkout: require auth */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute requireAuth>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute requireAuth>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/page"
                element={
                  <ProtectedRoute requireAuth>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/page/:matchId"
                element={
                  <ProtectedRoute requireAuth>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/payment/:ticketId"
                element={
                  <ProtectedRoute requireAuth>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/payment/processing" element={<PaymentProcessing />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />

              {/* Account: require auth */}
              <Route
                path="/account/tickets"
                element={
                  <ProtectedRoute requireAuth>
                    <MyTickets />
                  </ProtectedRoute>
                }
              />
              <Route path="/teams" element={<Teams />} />
              <Route path="/help" element={<Help />} />
              <Route path="/security-architecture" element={<SecurityArchitecture />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;