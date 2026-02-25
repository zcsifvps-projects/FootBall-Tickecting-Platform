import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter email and password",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: data.error || "Invalid email or password",
        });

        // If email not verified, offer to resend verification
        if (data.error?.includes("verify")) {
          setTimeout(() => {
            navigate(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
          }, 2000);
        }
        return;
      }

      // Store token
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Welcome Back!",
        description: "Successfully signed in to your account.",
      });
      
      // Redirect to home or checkout
      const redirectTo = sessionStorage.getItem("redirectTo") || "/";
      sessionStorage.removeItem("redirectTo");
      navigate(redirectTo);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sign in failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-background p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Sign In Card */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">FAZ</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your FAZ E-Tickets account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.banda@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Don't have an account yet?
              </p>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => navigate("/auth/register")}
              >
                Create New Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
