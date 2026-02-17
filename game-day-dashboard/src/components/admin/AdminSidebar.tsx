import {
  LayoutDashboard, Trophy, Ticket, BarChart3, Settings, ExternalLink,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarHeader, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Matches", url: "/admin/matches", icon: Trophy },
  { title: "Orders", url: "/admin/orders", icon: Ticket },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-card">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-1">
          {/* THE LOGO UPGRADE */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <img 
              src="https://res.cloudinary.com/dceqpo559/image/upload/v1769602379/faz_logo_cl3wx5.png" 
              alt="FAZ Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-base leading-none tracking-tight text-foreground">
              FAZ Admin
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Ticketing Panel
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-2 opacity-50" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-accent transition-colors">
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md transition-all group/link"
                      activeClassName="bg-primary/10 text-primary font-semibold shadow-sm ring-1 ring-primary/20"
                    >
                      <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover/link:scale-110" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to Site">
              <NavLink 
                to="/" 
                className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">View Live Site</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}