import { useNavigate } from "react-router";
import { Coffee, UserCircle, ChefHat, Package, Wallet, LayoutDashboard, QrCode } from "lucide-react";
import { motion } from "motion/react";

const roles = [
  {
    name: "Customer App",
    path: "/",
    icon: UserCircle,
    color: "bg-coffee-brown",
    description: "Browse menu and place orders"
  },
  {
    name: "Staff Login",
    path: "/staff-login",
    icon: LayoutDashboard,
    color: "bg-blue-600",
    description: "Access admin, kitchen, waiter, cashier panels"
  },
  {
    name: "QR Code Demo",
    path: "/qr-demo",
    icon: QrCode,
    color: "bg-indigo-600",
    description: "View table QR codes"
  },
];

export function RoleSwitcher() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coffee className="size-12 text-coffee-brown" />
            <h1 className="text-5xl font-bold text-coffee-brown">SmartCafe</h1>
          </div>
          <p className="text-xl text-muted-foreground">Select a role to continue</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.button
              key={role.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(role.path)}
              className="glass-strong rounded-2xl p-8 text-left hover:shadow-2xl transition-all group"
            >
              <div className={`size-16 ${role.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <role.icon className="size-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-coffee-brown mb-2 group-hover:text-neon-highlight transition-colors">
                {role.name}
              </h2>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            SmartCafe QR Ordering System • Premium SaaS Experience
          </p>
        </div>
      </div>
    </div>
  );
}
