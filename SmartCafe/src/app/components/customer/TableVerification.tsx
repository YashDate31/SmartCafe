import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { Coffee, User } from "lucide-react";
import { useStore } from "../../store";

export function TableVerification() {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { tables, occupyTable } = useStore();

  const table = tables.find((t) => t.number === tableNumber);

  if (!table) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex items-center justify-center p-4">
        <div className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold text-red-600 mb-2">Invalid Table</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">This table number does not exist.</p>
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-2 bg-coffee-brown text-white rounded-full text-sm md:text-base"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  // If already occupied, maybe we can just let them in to see the menu
  // Or tell them it's occupied by someone else. For simplicity, let's just let them in.
  if (table.status === "occupied" && table.customerName) {
    // Automatically redirect to menu if already occupied
    setTimeout(() => {
      navigate(`/menu?table=${tableNumber}`);
    }, 1500);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex items-center justify-center p-4">
        <div className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full text-center">
          <Coffee className="size-12 md:size-16 text-coffee-brown mx-auto mb-4 animate-pulse" />
          <h1 className="text-xl md:text-2xl font-bold text-coffee-brown mb-2">Welcome Back!</h1>
          <p className="text-sm md:text-base text-muted-foreground">Redirecting you to the menu...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && tableNumber) {
      occupyTable(tableNumber, name.trim());
      navigate(`/menu?table=${tableNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-6 md:mb-8">
          <div className="size-16 md:size-20 bg-coffee-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="size-8 md:size-10 text-coffee-brown" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-coffee-brown mb-2">Table {tableNumber}</h1>
          <p className="text-sm md:text-base text-muted-foreground">Please enter your name to start ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <div className="relative">
              <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-4 md:size-5 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 glass bg-white/50 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-brown text-base md:text-lg font-medium"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 md:py-4 bg-coffee-brown text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-coffee-brown/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Start Ordering
          </button>
        </form>
      </motion.div>
    </div>
  );
}