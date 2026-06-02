import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Menu, X, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FloatingRoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Only show on staff panels (admin, kitchen, waiter, cashier)
  const staffPages = ["/admin", "/kitchen", "/waiter", "/cashier"];
  const isStaffPage = staffPages.some(page => location.pathname.startsWith(page));

  if (!isStaffPage) {
    return null;
  }

  const roles = [
    { name: "Dashboard", path: "/admin" },
    { name: "Kitchen", path: "/kitchen" },
    { name: "Waiter", path: "/waiter" },
    { name: "Cashier", path: "/cashier" },
    { name: "Customer App", path: "/" },
    { name: "Logout", path: "/staff-login" },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 size-14 bg-coffee-brown text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="size-6" /> : <Coffee className="size-6" />}
      </motion.button>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 glass-strong rounded-2xl p-4 shadow-2xl min-w-[200px]"
          >
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.path}
                  onClick={() => {
                    navigate(role.path);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-coffee-brown hover:bg-coffee-brown/10 rounded-lg transition-colors font-medium"
                >
                  {role.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
