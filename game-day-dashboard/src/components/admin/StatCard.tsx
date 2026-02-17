import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // This is a standard shadcn utility for merging classes

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  className?: string; // Add this line to fix the error
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  className 
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-black uppercase tracking-[0.15em] opacity-80">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 opacity-70" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tracking-tighter italic">{value}</div>
        {subtitle && (
          <p className="text-[10px] font-bold uppercase mt-1 opacity-60">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}