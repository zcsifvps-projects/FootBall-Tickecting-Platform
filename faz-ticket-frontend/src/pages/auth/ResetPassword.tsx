import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Reset link is invalid or expired.",
      });
      navigate("/auth/signin");
      return;
    }

    if (!formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a new password",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to reset password",
        });
        return;
      }

      toast({
        title: "Password Reset Successfully!",
        description: "You can now sign in with your new password.",
      });

      setTimeout(() => {
        navigate("/auth/signin");
      }, 1500);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Server error. Please try again later.",
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
          onClick={() => navigate("/auth/signin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>

        {/* Card */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
            <CardDescription className="text-center">
              Create a strong password to secure your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {token ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-semibold">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="rounded-lg border-slate-200 h-12 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    At least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="rounded-lg border-slate-200 h-12 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#0e633d] hover:bg-[#0a4a2e] text-white font-bold rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-6">
                <p className="text-slate-600 font-medium text-red-600">
                  Reset link is invalid or expired.
                </p>
                <Button
                  onClick={() => navigate("/auth/forgot-password")}
                  className="w-full h-12 bg-[#0e633d] hover:bg-[#0a4a2e] text-white font-bold rounded-lg"
                >
                  Request New Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
