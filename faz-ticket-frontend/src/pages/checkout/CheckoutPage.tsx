// faz-ticket-frontend/src/pages/checkout/CheckoutPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { CreditCard, Phone, Mail, MapPin, Users, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, user, accessToken } = useAuth();

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <AlertCircle className="h-16 w-16 mx-auto text-orange-600" />
            <h2 className="text-2xl font-bold">Sign in to Checkout</h2>
            <p className="text-slate-600">You must be signed in to purchase tickets.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/matches")}>
                Back to Matches
              </Button>
              <Button onClick={() => navigate("/auth/signin")}>
                Sign In
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zone, setZone] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch match details
  const { data: match, isLoading: matchLoading } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => api.matches.getById(matchId || ""),
    enabled: !!matchId,
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: any) => {
      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) throw new Error("Failed to create ticket");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: "Proceeding to payment..." });
      // Redirect to payment page with ticket ID
      navigate(`/checkout/payment/${data.ticketId}`, {
        state: { paymentMethod, totalPrice: data.totalPrice },
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to create ticket",
      });
    },
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !phone || !zone || !quantity) {
      toast({ variant: "destructive", title: "Error", description: "Please fill all fields" });
      return;
    }

    const selectedZone = match?.zones?.find((z: any) => z.name === zone);
    if (!selectedZone) {
      toast({ variant: "destructive", title: "Error", description: "Invalid zone selected" });
      return;
    }

    const ticketData = {
      matchId,
      quantity: parseInt(quantity),
      zone,
      customerEmail: email,
      customerPhone: phone,
      seats: [], // Assigned after payment
    };

    createTicketMutation.mutate(ticketData);
  };

  if (matchLoading) return <div className="text-center py-12">Loading match details...</div>;
  if (!match) return <div className="text-center py-12 text-red-500">Match not found</div>;

  const selectedZone = match?.zones?.find((z: any) => z.name === zone);
  const totalPrice = selectedZone ? selectedZone.price * parseInt(quantity) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black italic uppercase mb-8">
            Checkout <span className="text-[#0e633d]">Tickets</span>
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: Checkout Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Match Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg mb-6">
                    <h3 className="font-black uppercase">
                      {match.homeTeam} vs {match.awayTeam}
                    </h3>
                    <p className="text-sm text-slate-600">📍 {match.stadium || match.city}</p>
                    <p className="text-sm text-slate-600">📅 {match.date} at {match.time}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" /> Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+260 97 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Selection */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Select Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="zone">Zone</Label>
                    <Select value={zone} onValueChange={setZone}>
                      <SelectTrigger id="zone">
                        <SelectValue placeholder="Choose a zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {match.zones?.map((z: any) => (
                          <SelectItem key={z.name} value={z.name}>
                            {z.name} - K{z.price} per ticket
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> Number of Tickets
                    </Label>
                    <Select value={quantity} onValueChange={setQuantity}>
                      <SelectTrigger id="quantity">
                        <SelectValue placeholder="How many?" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} ticket{num > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">💳 Credit Card (Stripe)</SelectItem>
                      <SelectItem value="paypal">🅿️ PayPal</SelectItem>
                      <SelectItem value="mtn_mobile_money">📱 MTN Mobile Money</SelectItem>
                      <SelectItem value="zamtel">📞 Zamtel Money</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Zone</p>
                    <p className="font-bold">{zone || "Not selected"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Quantity</p>
                    <p className="font-bold">{quantity} ticket(s)</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Price per Ticket</p>
                    <p className="font-bold">K{selectedZone?.price || 0}</p>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-black text-2xl text-orange-600">K{totalPrice.toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={createTicketMutation.isPending || !zone}
                    className="w-full h-12 font-black uppercase bg-orange-600 hover:bg-orange-700"
                  >
                    {createTicketMutation.isPending ? "Processing..." : "Proceed to Payment"}
                  </Button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    Your reservation will be held for 10 minutes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
