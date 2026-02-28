import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText, Users, CreditCard, ArrowLeft } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AdminTransactions from "@/components/admin/AdminTransactions";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBusinessCards from "@/components/admin/AdminBusinessCards";

type Tab = "transactions" | "users" | "cards";

const tabs = [
  { id: "transactions" as Tab, label: "Transactions", icon: ReceiptText },
  { id: "users" as Tab, label: "Users", icon: Users },
  { id: "cards" as Tab, label: "Business Cards", icon: CreditCard },
];

const AdminSidebar = ({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tabs.map((tab) => (
                <SidebarMenuItem key={tab.id}>
                  <SidebarMenuButton
                    onClick={() => onSelect(tab.id)}
                    className={active === tab.id ? "bg-muted text-primary font-medium" : ""}
                  >
                    <tab.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{tab.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState<Tab>("transactions");

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate("/profile", { replace: true });
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar active={activeTab} onSelect={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {activeTab === "transactions" && <AdminTransactions />}
            {activeTab === "users" && <AdminUsers />}
            {activeTab === "cards" && <AdminBusinessCards />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
