import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  const email =
    searchParams.get("email") ||
    sessionStorage.getItem("register_email") ||
    localStorage.getItem("pendingEmail") ||
    "";

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();

    if (index === 5 && value && newOtp.every((digit) => digit)) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];

    pastedData.forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) newOtp[index] = char;
    });

    setOtp(newOtp);

    if (newOtp.every((digit) => digit)) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleVerify = async (code: string) => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email not found. Please register again.",
      });
      navigate("/auth/register");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: data.error || "Invalid or expired code",
        });
        return;
      }

      toast({
        title: "Email Verified!",
        description: "Your email has been verified. Redirecting...",
      });

      sessionStorage.removeItem("register_email");
      localStorage.removeItem("pendingEmail");

      setTimeout(() => navigate("/matches"), 1500);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Verification failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    toast({
      variant: "destructive",
      title: "Not Available",
      description: "Resend is not configured on the server yet.",
    });
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-background p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/auth/register")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code sent to your email.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <Button className="w-full" disabled={isLoading} onClick={() => handleVerify(otp.join(""))}>
                Verify Email
              </Button>

              <Button variant="ghost" className="w-full" disabled={resendTimer > 0} onClick={handleResend}>
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
