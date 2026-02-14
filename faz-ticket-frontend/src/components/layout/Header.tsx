import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { itemCount } = useCart();
  
  // Mock auth state - will be replaced with real auth
  const isAuthenticated = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
      <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <div className="h-12 w-12 flex items-center justify-center">
        <img 
        src="https://res.cloudinary.com/dceqpo559/image/upload/v1769602379/faz_logo_cl3wx5.png" 
        alt="FAZ Logo" 
        className="h-full w-full object-contain"
          />
          </div>
          <div className="flex flex-col -space-y-1">
          <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase italic">
            FAZ<span className="text-[#0e633d]">TICKETING</span>
          </span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-0.5">
            Official Platform
          </span>
        </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/matches" className="text-sm font-medium hover:text-primary transition-colors">
              Matches
            </Link>
            <Link to="/teams" className="text-sm font-medium hover:text-primary transition-colors">
              Teams
            </Link>
            <Link to="/help" className="text-sm font-medium hover:text-primary transition-colors">
              Help
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account/tickets")}>
                    My Tickets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account/orders")}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth/signin")}>
                  Sign In
                </Button>
                <Button variant="accent" size="sm" onClick={() => navigate("/auth/register")}>
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teams, stadiums, or cities..."
                className="pl-10 h-11"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-slide-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link
              to="/matches"
              className="px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Matches
            </Link>
            <Link
              to="/teams"
              className="px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Teams
            </Link>
            <Link
              to="/help"
              className="px-3 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            {!isAuthenticated && (
              <div className="pt-3 border-t space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate("/auth/signin");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => {
                    navigate("/auth/register");
                    setMobileMenuOpen(false);
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
