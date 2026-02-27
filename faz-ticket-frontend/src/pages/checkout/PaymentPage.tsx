// faz-ticket-frontend/src/pages/checkout/PaymentPage.tsx
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface PaymentState {
  paymentMethod: string;
  totalPrice: number;
}

export default function PaymentPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const location = useLocation();
  const { toast } = useToast();

  const paymentState = location.state as PaymentState;
  const [cardNumber, setCardNumber] = useState(""); // Clear - let user enter
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  // Update ticket status to completed (after payment)
  const completePaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          paymentMethod: paymentState?.paymentMethod,
          paymentId: `${paymentState?.paymentMethod}-${ticketId}-${new Date().getTime()}`,
        }),
      });
      if (!response.ok) throw new Error("Payment confirmation failed");
      return response.json();
    },
    onSuccess: (data: any) => {
      setStatus("success");
      toast({ title: "Success!", description: "Payment completed. Your tickets are ready!" });

      // clear any leftover cart data
      clearCart();

      // build a simplified ticket item for the success page
      const ticket = data?.ticket;
      const item = ticket
        ? {
            matchName: ticket.matchId
              ? `${ticket.matchId.homeTeam} vs ${ticket.matchId.awayTeam}`
              : "",
            date: ticket.matchId?.date || "",
            stadium: ticket.matchId?.stadium || ticket.matchId?.city || "",
            zone: ticket.zone,
            gate: ticket.gate || "",
            row: ticket.row || "",
            seats: ticket.seats || [],
            price: ticket.pricePerTicket,
            quantity: ticket.quantity,
          }
        : null;

      setTimeout(() => {
        if (item) {
          navigate("/payment/success", {
            state: { items: [item], total: ticket.totalPrice, orderId: ticket._id },
          });
        } else {
          navigate("/cart");
        }
      }, 2000);
    },
    onError: (err: any) => {
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: err.message,
      });
    },
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");

    // Simulate payment processing (2 second delay)
    setTimeout(() => {
      completePaymentMutation.mutate();
    }, 2000);
  };

  if (!paymentState) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-red-500">Invalid payment session</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-black italic uppercase mb-8">
            Secure <span className="text-[#0e633d]">Payment</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Enter Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {status === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                    <p className="text-slate-600 mb-4">Your tickets have been confirmed.</p>
                    <p className="text-sm text-slate-500">Redirecting to your tickets...</p>
                  </div>
                ) : status === "error" ? (
                  <div className="text-center py-8">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
                    <p className="text-slate-600 mb-4">Please try again or use a different method.</p>
                    <Button onClick={() => setStatus("idle")}>Retry</Button>
                  </div>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-4">
                    {/* Payment Method Badge */}
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900">
                        💳 {paymentState.paymentMethod === "stripe"
                          ? "Credit Card via Stripe"
                          : paymentState.paymentMethod === "mtn_mobile_money"
                          ? "MTN Mobile Money"
                          : paymentState.paymentMethod}
                      </p>
                    </div>

                    {/* Card Number */}
                    <div>
                      <Label htmlFor="card">Card Number (Test: 4242 4242 4242 4242)</Label>
                      <Input
                        id="card"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        disabled={status === "processing"}
                      />
                      <p className="text-xs text-slate-500 mt-1">Use test card 4242 4242 4242 4242 for demo</p>
                    </div>

                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          disabled={status === "processing"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          disabled={status === "processing"}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={status === "processing"}
                      className="w-full h-12 font-black uppercase bg-orange-600 hover:bg-orange-700"
                    >
                      {status === "processing" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay K${(paymentState.totalPrice ?? 0).toFixed(2)}`
                      )}
                    </Button>

                    <p className="text-xs text-slate-500 text-center">
                      🔒 Your payment is encrypted and secure
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ticket ID:</span>
                    <code className="font-mono text-sm font-semibold">{ticketId?.slice(0, 12)}...</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Method:</span>
                    <span className="font-semibold">{paymentState.paymentMethod}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total Amount:</span>
                    <span className="font-black text-2xl text-orange-600">
                      K{(paymentState.totalPrice ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-2">✅ Order Details</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Payment will be processed securely</li>
                    <li>• Your tickets will be emailed immediately</li>
                    <li>• QR codes are valid for entry</li>
                    <li>• Tickets are non-refundable</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900">ℹ️ Test Environment</p>
                  <p className="text-xs text-blue-800 mt-1">
                    This is a demo. In production, real payments via Stripe, PayPal, or MTN Mobile Money would be processed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
