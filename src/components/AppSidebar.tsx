import { LayoutDashboard, ArrowLeftRight, Lightbulb } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useStore } from "@/store/useStore";



const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Insights", url: "/insights", icon: Lightbulb },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { role } = useStore();
  const collapsed = state === "collapsed";

  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="capitalize font-bold text-primary">
            {!collapsed && `Artha | ${role}`}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-accent/50 transition-all duration-300"
                      activeClassName="premium-gradient text-white shadow-lg shadow-primary/20 scale-[1.02] font-semibold"
                    >
                      <item.icon className={`mr-2 h-4 w-4 ${location.pathname === item.url || (item.url === '/' && location.pathname === '/') ? 'text-white' : 'text-primary'}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
