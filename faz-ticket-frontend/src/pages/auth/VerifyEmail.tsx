import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
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
      if (index < 6 && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    if (newOtp.every((digit) => digit)) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleVerify = (code: string) => {
    const email = localStorage.getItem("pendingEmail");
    if (!email) {
      toast({ variant: "destructive", title: "Missing email", description: "No pending email found." });
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        toast({ title: "Email Verified!", description: "Your email has been verified successfully." });
        // clear pending
        localStorage.removeItem("pendingEmail");
        navigate("/profile/wizard");
      })
      .catch((err) => {
        toast({ variant: "destructive", title: "Error", description: err.message || "Verification failed" });
      });
  };

  const handleResend = () => {
    const email = localStorage.getItem("pendingEmail");
    if (!email) {
      toast({ variant: "destructive", title: "Missing email", description: "No pending email found." });
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Resend failed");
        toast({ title: "Code Resent", description: "A new verification code has been sent to your email." });
        setResendTimer(60);
      })
      .catch((err) => {
        toast({ variant: "destructive", title: "Error", description: err.message || "Resend failed" });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-background p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/auth/register")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Verify Email Card */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a 6-digit code to your email address. Enter it below to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* OTP Input */}
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

              {/* Verify Button */}
              <Button
                variant="hero"
                className="w-full"
                size="lg"
                onClick={() => handleVerify(otp.join(""))}
                disabled={otp.some((digit) => !digit)}
              >
                Verify Email
              </Button>

              {/* Resend Code */}
              <div className="text-center text-sm">
                {resendTimer > 0 ? (
                  <p className="text-muted-foreground">
                    Resend code in{" "}
                    <span className="font-semibold text-foreground">{resendTimer}s</span>
                  </p>
                ) : (
                  <Button variant="link" onClick={handleResend} className="p-0 h-auto">
                    Resend verification code
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
