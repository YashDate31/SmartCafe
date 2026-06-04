import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Coffee, Shield, ChefHat, Wallet, Package, QrCode, KeyRound, User } from "lucide-react";
import { useStore } from "../store";

const roles = [
  {
    id: "admin",
    title: "Admin Dashboard",
    description: "Full system access and management",
    icon: Shield,
    color: "from-purple-500 to-purple-700",
    path: "/admin",
  },
  {
    id: "kitchen",
    title: "Kitchen Dashboard",
    description: "Manage and prepare orders",
    icon: ChefHat,
    color: "from-orange-500 to-orange-700",
    path: "/kitchen",
  },
  {
    id: "waiter",
    title: "Waiter Panel",
    description: "Deliver orders and manage tables",
    icon: Package,
    color: "from-blue-500 to-blue-700",
    path: "/waiter",
  },
  {
    id: "cashier",
    title: "Cashier Panel",
    description: "Process payments and billing",
    icon: Wallet,
    color: "from-green-500 to-green-700",
    path: "/cashier",
  },
  {
    id: "qr",
    title: "QR Generator",
    description: "Generate table QR codes",
    icon: QrCode,
    color: "from-coffee-brown to-secondary",
    path: "/admin",
  },
];

export function MainLogin() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdminRole = selectedRole === "admin" || selectedRole === "qr";
    if (isAdminRole) {
      if (username === "SmartCafe" && password === "SmartCafe@2026") {
        if (selectedRole === "qr") {
          login("admin");
          navigate("/admin", { state: { initialMenu: "tables" } });
        } else {
          login("admin");
          navigate("/admin");
        }
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    } else {
      if (pin === "1234") {
        if (selectedRole) {
          login(selectedRole as any);
          const role = roles.find((r) => r.id === selectedRole);
          navigate(role!.path);
        }
      } else {
        setError(true);
        setPin("");
        setTimeout(() => setError(false), 2000);
      }
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setPin("");
    setUsername("");
    setPassword("");
    setError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="size-16 md:size-24 bg-coffee-brown rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl">
            <Coffee className="size-9 md:size-14 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-coffee-brown mb-2 md:mb-3">SmartCafe</h1>
          <p className="text-base md:text-xl text-muted-foreground">Staff Access Portal</p>
        </motion.div>

        {!selectedRole ? (
          // Role Selection
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {roles.map((role, index) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedRole(role.id)}
                className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 hover:scale-105 transition-all duration-300 text-left group"
              >
                <div className={`size-14 md:size-16 bg-gradient-to-br ${role.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <role.icon className="size-7 md:size-9 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-coffee-brown mb-2">{role.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{role.description}</p>
                <div className="mt-4 md:mt-6 flex items-center gap-2 text-coffee-brown font-semibold text-sm md:text-base">
                  <span>Access Panel</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          // PIN Entry
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl">
              {/* Selected Role Display */}
              <div className="text-center mb-6 md:mb-8">
                <div className={`size-16 md:size-20 bg-gradient-to-br ${roles.find((r) => r.id === selectedRole)?.color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg`}>
                  {(() => {
                    const RoleIcon = roles.find((r) => r.id === selectedRole)?.icon || Shield;
                    return <RoleIcon className="size-9 md:size-11 text-white" />;
                  })()}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-coffee-brown mb-2">
                  {roles.find((r) => r.id === selectedRole)?.title}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {selectedRole === "admin" || selectedRole === "qr"
                    ? "Enter admin credentials to continue"
                    : "Enter your PIN to continue"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                {selectedRole === "admin" || selectedRole === "qr" ? (
                  // Admin Username/Password Form
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-5 md:size-6 text-muted-foreground" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(false); }}
                        placeholder="Username"
                        className={`w-full pl-12 md:pl-14 pr-4 py-4 md:py-5 glass bg-white/50 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-brown transition-all ${
                          error ? "border-2 border-red-500 focus:ring-red-500 shake" : ""
                        }`}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-5 md:size-6 text-muted-foreground" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(false); }}
                        placeholder="Password"
                        className={`w-full pl-12 md:pl-14 pr-4 py-4 md:py-5 glass bg-white/50 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-brown transition-all ${
                          error ? "border-2 border-red-500 focus:ring-red-500 shake" : ""
                        }`}
                        required
                      />
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-3 text-center font-semibold"
                      >
                        Invalid Username or Password.
                      </motion.p>
                    )}
                  </div>
                ) : (
                  // Staff PIN Form
                  <div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-5 md:size-6 text-muted-foreground" />
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => { setPin(e.target.value); setError(false); }}
                        placeholder="Enter 4-digit PIN"
                        maxLength={4}
                        className={`w-full pl-12 md:pl-14 pr-4 py-4 md:py-5 glass bg-white/50 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 text-center tracking-[0.5em] md:tracking-[1em] text-2xl md:text-3xl font-bold transition-all ${
                          error ? "border-2 border-red-500 focus:ring-red-500 shake" : "focus:ring-coffee-brown"
                        }`}
                        required
                        autoFocus
                      />
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-3 text-center font-semibold"
                      >
                        Invalid PIN. Please use 1234.
                      </motion.p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      Demo PIN: 1234
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={
                      selectedRole === "admin" || selectedRole === "qr"
                        ? !username || !password
                        : pin.length !== 4
                    }
                    className="w-full py-4 md:py-5 bg-coffee-brown text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-coffee-brown/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full py-2 md:py-3 text-muted-foreground hover:text-coffee-brown transition-colors text-sm font-medium"
                  >
                    ← Back to Role Selection
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 md:mt-12"
        >
          <p className="text-xs md:text-sm text-muted-foreground">
            Premium Cafe Management System • Secure Access Only
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}
