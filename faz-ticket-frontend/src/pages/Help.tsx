import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  Ticket,
  Clock,
} from "lucide-react";

/* ---------- DATA ---------- */

const faqCategories = [
  {
    category: "Buying Tickets",
    icon: Ticket,
    faqs: [
      {
        question: "How do I purchase tickets?",
        answer:
          "Browse available matches, select your seats, add them to your cart, and proceed to checkout. You'll need to sign in or create an account to complete payment.",
      },
      {
        question: "Can I buy tickets for multiple matches?",
        answer:
          "Yes. You can add tickets from different matches to your cart and complete everything in one transaction.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept MTN MoMo, Airtel Money, Zamtel Money. Payments are processed securely.",
      },
      {
        question: "Is there a ticket purchase limit?",
        answer:
          "Each customer may purchase up to 6 tickets per match to ensure fair access for all fans.",
      },
    ],
  },
  {
    category: "Account & Security",
    icon: ShieldCheck,
    faqs: [
      {
        question: "Do I need an account?",
        answer:
          "Yes. An account is required to secure your tickets and allow access anytime from any device.",
      },
      {
        question: "How do I verify my email?",
        answer:
          "After registration, we send a verification code to your email. Enter it to activate your account.",
      },
      {
        question: "I forgot my password",
        answer:
          "Use the 'Forgot Password' option on the sign-in page to reset your credentials.",
      },
      {
        question: "Can I update my profile?",
        answer:
          "Yes. You can edit your account details from your profile settings once logged in.",
      },
    ],
  },
  {
    category: "Payments & Refunds",
    icon: CreditCard,
    faqs: [
      {
        question: "How long do payments take?",
        answer:
          "Most payments are instant. Mobile money may take up to 5 minutes to confirm.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Refunds are available up to 48 hours before kickoff. After that, tickets are non-refundable unless a match is canceled.",
      },
      {
        question: "What if a match is canceled?",
        answer:
          "Canceled matches are automatically refunded within 5–7 business days.",
      },
      {
        question: "Is my payment data safe?",
        answer:
          "Yes. We use bank-grade encryption and never store your full payment details.",
      },
    ],
  },
  {
    category: "Ticket Access",
    icon: Clock,
    faqs: [
      {
        question: "How do I receive my ticket?",
        answer:
          "Tickets appear instantly in your account after payment under 'My Tickets'.",
      },
      {
        question: "Can I print my ticket?",
        answer:
          "Yes. You can download a PDF or show the QR code directly from your phone.",
      },
      {
        question: "What if I lose my ticket?",
        answer:
          "Your ticket is always available in your account. Just sign in again.",
      },
      {
        question: "Can I transfer a ticket?",
        answer:
          "Transfers are allowed up to 24 hours before the match. Contact support for help.",
      },
    ],
  },
];

const contactMethods = [
  {
    icon: Phone,
    title: "Phone Support",
    details: "+260 211 251 541",
    description: "Mon–Fri · 08:00–18:00",
    action: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Support",
    details: "support@fazetickets.zm",
    description: "Response within 48 hours",
    action: "Send Email",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    details: "Chat with our team",
    description: "Available on match days",
    action: "Start Chat",
  },
];

/* ---------- PAGE ---------- */

export default function Help() {
  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header />

      <main className="flex-2">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0e633d] text-white py-20">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <HelpCircle className="h-14 w-14 mx-auto mb-6 text-[#ef7d00]" />

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Help & Support
            </h1>

            <p className="text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              Everything you need to know before match day — tickets, payments,
              security, and stadium access.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <Input
                type="search"
                placeholder="Search help topics…"
                className="h-14 pl-12 bg-white text-slate-800"
              />
              <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className="container mx-auto px-4 -mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, i) => (
              <Card
                key={i}
                className="border-[#0e633d]/20 hover:shadow-xl transition"
              >
                <CardContent className="p-6 text-center">
                  <method.icon className="h-10 w-10 mx-auto mb-4 text-[#0e633d]" />
                  <h3 className="text-lg font-medium mb-1">{method.title}</h3>
                  <p className="text-sm text-slate-700">{method.details}</p>
                  <p className="text-xs text-slate-500 mb-4">
                    {method.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Clear answers to the most common match-day questions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {faqCategories.map((category, idx) => (
              <Card key={idx} className="border-[#0e633d]/15">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-[#0e633d]" />
                    <span className="font-medium">{category.category}</span>
                    <Badge className="ml-auto bg-[#ef7d00]/10 text-[#ef7d00]">
                      {category.faqs.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Accordion type="single" collapsible>
                    {category.faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${idx}-${i}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-500">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0e633d] text-white py-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Still need help?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Our support team is always ready to assist before, during, and after
            match day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#ef7d00] hover:bg-[#ef7d00]/90">
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </Button>

            <Button variant="outline" className="border-green-500 text-black">
              <MessageCircle className="h-5 w-5 mr-2" />
              Live Chat
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
