import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { motion } from "motion/react";
import { Coffee, KeyRound, ShieldAlert } from "lucide-react";
import { useStore, UserRole } from "../../store";

export function StaffLogin() {
  const { role } = useParams(); // admin, kitchen, cashier, waiter
  const navigate = useNavigate();
  const { login } = useStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // In a real app, we'd verify the JWT with backend. Here we use a simple pin: 1234
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      login(role as UserRole);
      navigate(`/${role}`);
    } else {
      setError(true);
      setPin("");
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case "admin": return "Admin Dashboard";
      case "kitchen": return "Kitchen Portal";
      case "cashier": return "Cashier System";
      case "waiter": return "Waiter Panel";
      default: return "Staff Login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-coffee-brown"></div>
        
        <div className="text-center mb-8 mt-4">
          <div className="size-16 bg-coffee-brown/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="size-8 text-coffee-brown" />
          </div>
          <h1 className="text-2xl font-bold text-coffee-brown mb-1">{getRoleTitle()}</h1>
          <p className="text-muted-foreground">Enter PIN to access (Use 1234)</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false); }}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className={`w-full pl-12 pr-4 py-4 glass bg-white/50 rounded-2xl focus:outline-none focus:ring-2 text-center tracking-[1em] text-2xl font-bold transition-all ${
                  error ? "border-2 border-red-500 focus:ring-red-500" : "focus:ring-coffee-brown"
                }`}
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">Invalid PIN. Please use 1234.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={pin.length !== 4}
            className="w-full py-4 bg-coffee-brown text-white rounded-2xl font-bold text-lg hover:bg-coffee-brown/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Login
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/switch")}
            className="w-full py-2 text-muted-foreground hover:text-coffee-brown transition-colors text-sm font-medium"
          >
            ← Back to Role Switcher
          </button>
        </form>
      </motion.div>
    </div>
  );
}