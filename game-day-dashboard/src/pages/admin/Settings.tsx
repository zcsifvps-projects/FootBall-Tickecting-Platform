import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Mail, 
  Save, 
  Lock,
  Zap,
  Settings2
} from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 font-['Times_New_Roman',serif]">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-100 pb-8">
        <div>
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 uppercase">
            System <span className="text-[#0e633d]">Settings</span>
          </h2>
          <p className="text-xl text-slate-500 italic mt-2">Official Administrative Portal Configuration</p>
        </div>
        <div className="flex items-center gap-4 bg-[#0e633d]/5 px-6 py-3 rounded-2xl border border-[#0e633d]/20">
           <ShieldCheck className="h-8 w-8 text-[#0e633d]" />
           <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#0e633d] leading-none">Access Level</p>
              <p className="text-lg font-bold text-slate-800">Super Administrator</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Profile & Platform */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Admin Profile */}
          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
            <div className="h-3 bg-[#0e633d] w-full" />
            <CardHeader className="pb-4 pt-10 px-10">
              <CardTitle className="text-2xl font-bold uppercase tracking-tight text-slate-800 flex items-center gap-4">
                <User className="h-7 w-7 text-[#ef7d00]" />
                Admin Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-10">
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-sm font-bold uppercase text-[#0e633d] tracking-wider">Full Name</Label>
                  <Input 
                    defaultValue="Admin User" 
                    className="h-16 rounded-xl border-slate-200 bg-slate-50 font-bold text-xl px-6 focus:ring-2 focus:ring-[#0e633d] transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold uppercase text-[#0e633d] tracking-wider">Email Address</Label>
                  <div className="relative">
                    <Input 
                      type="email" 
                      defaultValue="admin@faz.co.zm" 
                      className="h-16 rounded-xl border-slate-200 bg-slate-50 font-bold text-xl pl-14 focus:ring-2 focus:ring-[#0e633d] transition-all"
                    />
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="h-14 px-10 bg-[#0e633d] hover:bg-emerald-900 text-white rounded-xl shadow-xl shadow-emerald-900/20 transition-all font-bold uppercase italic text-lg tracking-widest">
                  <Save className="mr-3 h-5 w-5" /> Save Profile Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="border-2 border-slate-100 shadow-sm bg-white rounded-[2rem]">
            <CardHeader className="pb-2 pt-10 px-10">
              <CardTitle className="text-xl font-bold uppercase tracking-widest text-slate-400 flex items-center gap-4">
                <Globe className="h-6 w-6 text-[#0e633d]" /> Regional Defaults
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8 sm:grid-cols-2 p-10">
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase text-slate-400 italic">Default Currency</Label>
                <div className="h-16 flex items-center px-8 rounded-xl bg-slate-50 border border-slate-100 font-bold text-[#0e633d] text-2xl">
                  ZMW (K)
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase text-slate-400 italic">System Timezone</Label>
                <div className="h-16 flex items-center px-8 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-600 text-xl">
                  Africa/Lusaka
                </div>
              </div>
              <div className="sm:col-span-2 p-6 bg-orange-50 rounded-2xl border border-[#ef7d00]/20 flex items-center gap-4">
                <Lock className="h-6 w-6 text-[#ef7d00]" />
                <p className="text-sm text-orange-900 font-bold leading-relaxed">
                  Currency and Timezone settings are locked. Contact system provider to adjust financial localization.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Notifications */}
        <div className="lg:col-span-5">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white border-t-8 border-[#ef7d00] sticky top-8">
            <CardHeader className="pb-8 pt-12 px-10 text-center">
              <div className="mx-auto bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-10 w-10 text-[#ef7d00]" />
              </div>
              <CardTitle className="text-3xl font-bold uppercase tracking-tighter text-slate-900">
                Notifications
              </CardTitle>
              <p className="text-slate-500 text-lg italic mt-2">Manage System Dispatch Alerts</p>
            </CardHeader>
            <CardContent className="px-10 pb-12 space-y-4">
              
              {/* Notification Item */}
              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#0e633d] transition-all group">
                <div className="space-y-1">
                  <Label className="text-xl font-bold text-slate-800 cursor-pointer">Order Alerts</Label>
                  <p className="text-xs text-[#0e633d] uppercase tracking-widest font-bold">Email on new order</p>
                </div>
                <Switch defaultChecked className="scale-125 data-[state=checked]:bg-[#0e633d]" />
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#0e633d] transition-all group">
                <div className="space-y-1">
                  <Label className="text-xl font-bold text-slate-800 cursor-pointer">Inventory Alerts</Label>
                  <p className="text-xs text-[#0e633d] uppercase tracking-widest font-bold">Email on sell-out</p>
                </div>
                <Switch defaultChecked className="scale-125 data-[state=checked]:bg-[#0e633d]" />
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#0e633d] transition-all group">
                <div className="space-y-1">
                  <Label className="text-xl font-bold text-slate-800 cursor-pointer">Sales Reports</Label>
                  <p className="text-xs text-[#0e633d] uppercase tracking-widest font-bold">Daily summary report</p>
                </div>
                <Switch className="scale-125 data-[state=checked]:bg-[#0e633d]" />
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-100/50">
                  <Zap className="h-5 w-5 text-[#ef7d00] mt-1 shrink-0" />
                  <p className="text-sm text-slate-500 font-bold leading-tight italic">
                    Push notifications are currently active for this session. Ensure your browser allows alerts.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}