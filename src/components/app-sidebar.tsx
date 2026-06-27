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
  ChevronRight,
  AlertTriangle,
  User as UserIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProfileModal } from "./profile-modal";
import Image from "next/image";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [pendingUrl, setPendingUrl] = React.useState<string | null>(null);

  const handleLogout = async () => {
    if (typeof window !== 'undefined' && (window as any).__SETTINGS_DIRTY__ && pathname === "/settings") {
      setPendingUrl("/login-after-logout");
      setShowExitConfirm(true);
      return;
    }
    
    await signOut(auth);
    setOpenMobile(false);
    router.push("/login");
  };

  const handleNavigation = (url: string) => {
    if (pathname === url) {
      setOpenMobile(false);
      return;
    }

    if (typeof window !== 'undefined' && (window as any).__SETTINGS_DIRTY__ && pathname === "/settings") {
      setPendingUrl(url);
      setShowExitConfirm(true);
      return;
    }

    router.push(url);
    setOpenMobile(false);
  };

  const confirmNavigation = async () => {
    if (!pendingUrl) return;

    if (typeof window !== 'undefined') {
      (window as any).__SETTINGS_DIRTY__ = false;
    }

    if (pendingUrl === "/login-after-logout") {
      await signOut(auth);
      router.push("/login");
    } else {
      router.push(pendingUrl);
    }

    setPendingUrl(null);
    setShowExitConfirm(false);
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
    <>
      <Sidebar className="border-r border-primary/10 shadow-xl bg-white dark:bg-zinc-950 opacity-100">
        <SidebarContent className="bg-white pt-16">
          {isMobile && (
            <div className="flex items-center gap-3 px-6 py-4 border-b mb-2">
              <div className="relative h-6 w-6 overflow-hidden rounded shadow-sm">
                <Image 
                  src="/Ico.png" 
                  alt="Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <span className="font-headline font-bold text-primary tracking-tight">Donativos</span>
            </div>
          )}
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
            <div 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 p-2 rounded-xl border border-primary/5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors group/avatar"
            >
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm transition-transform group-hover/avatar:scale-105">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-bold text-primary truncate leading-none mb-1">
                  {user.displayName || "Usuário"}
                </p>
                <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  <UserIcon className="h-2.5 w-2.5" />
                  Perfil
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-30 group-hover/avatar:opacity-100 transition-opacity" />
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

      <ProfileModal 
        user={user} 
        open={showProfileModal} 
        onOpenChange={setShowProfileModal} 
      />

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Alterações não salvas
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você fez alterações nas configurações que ainda não foram salvas. Se sair agora, as mudanças serão perdidas. Deseja sair mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingUrl(null)}>Permanecer e Salvar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmNavigation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
