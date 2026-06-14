import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Coffee, Lock, ArrowLeft } from "lucide-react";

export function CustomerLoginGate() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple username/password check - in production, this would be more secure
    if (username === "admin" && password === "staff2024") {
      navigate("/staff-login");
    } else {
      setError(true);
      setUsername("");
      setPassword("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-coffee-brown hover:bg-coffee-brown/10 rounded-lg px-3 py-2 mb-6 transition-colors"
        >
          <ArrowLeft className="size-5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-6 md:mb-8">
          <div className="size-16 md:size-20 bg-coffee-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="size-8 md:size-10 text-coffee-brown" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-coffee-brown mb-2">Staff Access Only</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            This area is restricted to authorized staff members
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-coffee-brown mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              placeholder="Enter username"
              className={`w-full px-4 py-3 md:py-4 glass bg-white/50 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 text-base md:text-lg font-medium transition-all ${
                error ? "border-2 border-red-500 focus:ring-red-500 shake" : "focus:ring-coffee-brown"
              }`}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-coffee-brown mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className={`w-full px-4 py-3 md:py-4 glass bg-white/50 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 text-base md:text-lg font-medium transition-all ${
                error ? "border-2 border-red-500 focus:ring-red-500 shake" : "focus:ring-coffee-brown"
              }`}
              required
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 font-semibold"
              >
                Invalid username or password. Please try again.
              </motion.p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              For demonstration - Username: <span className="font-mono font-semibold">admin</span>, Password: <span className="font-mono font-semibold">staff2024</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={!username.trim() || !password.trim()}
            className="w-full py-3 md:py-4 bg-coffee-brown text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-coffee-brown/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Continue to Staff Login
          </button>
        </form>

        <div className="mt-6 p-4 bg-orange-100 border border-orange-200 rounded-xl">
          <p className="text-sm text-orange-800">
            <strong>Notice:</strong> This area is for staff members only. Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>

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
