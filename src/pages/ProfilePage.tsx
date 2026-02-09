import { User, Settings, Gift, LogOut, ChevronRight, Star, Bell, Shield, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: Bell, label: "Notifications", badge: "3" },
  { icon: Gift, label: "Promo Codes" },
  { icon: Star, label: "Favorites" },
  { icon: Shield, label: "Privacy & Security" },
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help & Support" },
];

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-4 pb-6 safe-top">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </header>

      {/* User card */}
      <div className="px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-card-foreground">Alex Johnson</h2>
            <p className="text-sm text-muted-foreground">alex@example.com</p>
          </div>
          <button className="p-2 bg-secondary rounded-full">
            <Settings className="w-4 h-4 text-secondary-foreground" />
          </button>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Bookings", value: "12" },
          { label: "Reviews", value: "8" },
          { label: "Favorites", value: "5" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl p-3 text-center shadow-card"
          >
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Menu */}
      <div className="px-4 mt-6">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {menuItems.map((item, i) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 text-left">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-card-foreground">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
