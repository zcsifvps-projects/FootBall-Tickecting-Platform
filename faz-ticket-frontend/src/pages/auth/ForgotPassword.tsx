import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to send reset email",
        });
        return;
      }

      // Store email for reset page
      sessionStorage.setItem("resetEmail", email);
      setEmailSent(true);

      toast({
        title: "Email Sent!",
        description: "Check your email for password reset instructions.",
      });

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
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
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Lock className="h-8 w-8 text-[#ef7d00]" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Forgot Password?</CardTitle>
            <CardDescription className="text-center">
              {emailSent
                ? "Check your email for reset instructions"
                : "Enter your email and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border-slate-200 h-12"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-500">
                    We'll send a reset link to this email address
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#0e633d] hover:bg-[#0a4a2e] text-white font-bold rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <p className="text-center text-sm text-slate-600">
                  Remember your password?{" "}
                  <Link to="/auth/signin" className="text-[#0e633d] font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            ) : (
              <div className="space-y-4 text-center py-6">
                <div className="flex justify-center mb-4">
                  <Mail className="h-12 w-12 text-green-500" />
                </div>
                <p className="text-slate-600 font-medium">
                  Check your email <strong>{email}</strong> for reset instructions.
                </p>
                <p className="text-xs text-slate-500">
                  The link will expire in 1 hour. If you don't see it, check your spam folder.
                </p>
                <Button
                  onClick={() => navigate("/auth/signin")}
                  className="w-full h-12 bg-[#0e633d] hover:bg-[#0a4a2e] text-white font-bold rounded-lg"
                >
                  Back to Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
