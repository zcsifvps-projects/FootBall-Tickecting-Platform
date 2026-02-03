import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import Register from "./pages/auth/Register";
import SignIn from "./pages/auth/SignIn";
import VerifyEmail from "./pages/auth/VerifyEmail";
import MatchDetails from "./pages/match/MatchDetails";
import Matches from "./pages/match/Matches";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import PaymentProcessing from "./pages/payment/PaymentProcessing";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import MyTickets from "./pages/account/MyTickets";
import Teams from "./pages/Teams";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route
              path="/matches/:id"
              element={<Navigate to="/match/:id" replace />}
            />
            <Route
              path="/matches/:id/seats"
              element={<Navigate to="/match/:id" replace />}
            />

            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/processing" element={<PaymentProcessing />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/account/tickets" element={<MyTickets />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/help" element={<Help />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
