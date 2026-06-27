"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  LogOut, 
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const { setOpenMobile } = useSidebar();

  const handleLogout = async () => {
    await signOut(auth);
    setOpenMobile(false);
    router.push("/login");
  };

  const handleNavigation = (url: string) => {
    router.push(url);
    setOpenMobile(false);
  };

  if (!user || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    return null;
  }

  const navItems = [
    {
      title: "Painel Geral",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Resumo Anual",
      url: "/annual",
      icon: TrendingUp,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar className="border-r border-primary/10 shadow-xl bg-white dark:bg-zinc-950 opacity-100">
      <SidebarContent className="bg-white pt-10">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
            Navegação Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.url)}
                    isActive={pathname === item.url}
                    className={`
                      py-6 px-4 rounded-xl transition-all duration-200
                      ${pathname === item.url 
                        ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold" 
                        : "hover:bg-primary/5 text-muted-foreground hover:text-primary"}
                    `}
                  >
                    <item.icon className={`h-5 w-5 ${pathname === item.url ? "text-white" : ""}`} />
                    <span className="text-base">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 bg-white border-t">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-2 rounded-xl border border-primary/5 bg-muted/30">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-bold text-primary truncate leading-none">
                {user.displayName || "Usuário"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-bold group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              <span>Sair do sistema</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}