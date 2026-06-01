import { useState, useEffect } from "react";
import { Clock, AlertCircle, Check, ChefHat, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore, OrderStatus } from "../../store";

export function KitchenDashboard() {
  const { orders, updateOrderStatus } = useStore();
  // Filter out delivered orders from kitchen
  const activeOrders = orders.filter(o => o.status !== "delivered");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setLoadingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
    } finally {
      setLoadingId(null);
    }
  };

  const formatTime = (createdAt: number) => {
    const seconds = Math.floor((Date.now() - createdAt) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // We need local state to trigger re-renders for the timer
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "border-red-500 bg-red-50 dark:bg-red-950";
      case "preparing":
        return "border-orange-500 bg-orange-50 dark:bg-orange-950";
      case "ready":
        return "border-green-500 bg-green-50 dark:bg-green-950";
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-900";
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <ChefHat className="size-8 md:size-10 text-neon-highlight" />
            <h1 className="text-2xl md:text-4xl font-bold text-neon-highlight">Kitchen Dashboard</h1>
          </div>
          <div className="px-4 md:px-6 py-2 md:py-3 glass-strong rounded-full border border-neon-highlight">
            <span className="text-sm md:text-lg font-semibold">{activeOrders.filter((o) => o.status !== "ready").length} Active Orders</span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
          {activeOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 border-2 ${getStatusColor(order.status)} ${
                order.status === "pending" ? "ring-2 md:ring-4 ring-red-500 ring-opacity-50 animate-pulse" : ""
              }`}
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <p className="font-mono text-xs md:text-sm text-muted-foreground mb-1">{order.id}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-3xl font-bold text-neon-highlight">Table {order.tableNumber}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Clock className="size-5 md:size-6 inline-block mb-1 text-neon-highlight" />
                  <p className={`text-xl md:text-2xl font-mono font-bold ${Date.now() - order.createdAt > 300000 ? "text-red-500" : "text-neon-highlight"}`}>
                    {formatTime(order.createdAt)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4 md:mb-6 space-y-2 md:space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-base md:text-lg">{item.name}</span>
                      <span className="text-lg md:text-xl font-bold text-neon-highlight">×{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, "preparing")}
                    disabled={loadingId === order.id}
                    className="w-full py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg md:rounded-xl font-semibold transition-colors text-sm md:text-base disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loadingId === order.id ? <><Loader2 className="size-4 animate-spin" /> Processing...</> : "Accept & Prepare"}
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, "ready")}
                    disabled={loadingId === order.id}
                    className="w-full py-2.5 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg md:rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-70"
                  >
                    {loadingId === order.id ? <><Loader2 className="size-4 animate-spin" /> Processing...</> : <><Check className="size-4 md:size-5" />Mark as Ready</>}
                  </button>
                )}
                {order.status === "ready" && (
                  <div className="w-full py-2.5 md:py-3 bg-green-600/20 border-2 border-green-600 text-green-400 rounded-lg md:rounded-xl font-semibold text-center flex items-center justify-center gap-2 text-sm md:text-base">
                    <Check className="size-4 md:size-5" />
                    Waiting for Waiter
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-3 md:mt-4 text-center">
                <span className="px-3 md:px-4 py-1.5 md:py-2 bg-white/10 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wide">
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activeOrders.length === 0 && (
        <div className="text-center py-12 md:py-20">
          <ChefHat className="size-16 md:size-20 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl md:text-2xl text-muted-foreground">No orders at the moment</p>
        </div>
      )}
    </div>
  );
}
