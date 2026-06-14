import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle2, Clock, ChefHat, Package, XCircle, Plus, ArrowLeft, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useStore, OrderStatus, Order } from "../../store";

const STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: "pending",   label: "Confirmed",  icon: CheckCircle2 },
  { status: "preparing", label: "Preparing",  icon: ChefHat      },
  { status: "ready",     label: "Ready",      icon: Package       },
  { status: "delivered", label: "Delivered",  icon: CheckCircle2 },
];

function MiniTimer({ order }: { order: Order }) {
  const [secs, setSecs] = useState(300);

  useEffect(() => {
    if (order.status === "delivered" || order.status === "ready") return;
    const base    = order.preparingStartedAt || order.createdAt;
    const elapsed = Math.floor((Date.now() - base) / 1000);
    setSecs(Math.max(0, 300 - elapsed));
    const t = setInterval(() => setSecs((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [order.status, order.preparingStartedAt, order.createdAt]);

  if (order.status === "delivered" || order.status === "ready") return null;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return (
    <span className="flex items-center gap-1 text-xs text-neon-highlight font-semibold">
      <Clock className="size-3" />
      {m}:{s.toString().padStart(2, "0")}
    </span>
  );
}

function OrderCard({ order, onCancel }: { order: Order; onCancel: () => void }) {
  const stepIdx     = STEPS.findIndex((s) => s.status === order.status);
  const timeElapsed = Math.floor((Date.now() - order.createdAt) / 1000);
  const canCancel   = order.status === "pending" && timeElapsed < 60;

  const statusColors: Record<OrderStatus, string> = {
    pending:   "border-yellow-400 bg-yellow-50/30",
    preparing: "border-orange-400 bg-orange-50/30",
    ready:     "border-green-500 bg-green-50/40",
    delivered: "border-gray-300 bg-white/20",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 p-4 ${statusColors[order.status]}`}
    >
      {/* Order header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
          <p className="font-semibold text-coffee-brown">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <p className="font-bold text-lg text-coffee-brown">₹{order.total.toFixed(2)}</p>
          <MiniTimer order={order} />
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center mb-3 gap-0">
        {STEPS.map((step, i) => {
          const done    = i <= stepIdx;
          const current = i === stepIdx;
          const Icon    = step.icon;
          return (
            <div key={step.status} className="flex items-center flex-1 last:flex-none">
              <div className={`relative flex flex-col items-center`}>
                <div className={`size-7 rounded-full flex items-center justify-center transition-all ${
                  done ? "bg-coffee-brown text-white" : "bg-white/60 border-2 border-border text-muted-foreground"
                } ${current ? "ring-2 ring-neon-highlight ring-offset-1" : ""}`}>
                  <Icon className="size-3.5" />
                </div>
                <span className={`text-[9px] mt-0.5 text-center leading-tight whitespace-nowrap ${done ? "text-coffee-brown font-semibold" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-0.5 mb-3.5 transition-all ${i < stepIdx ? "bg-coffee-brown" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 bg-white/40 rounded-lg px-2.5 py-1.5">
            <div className="flex items-center gap-2">
              <img src={item.image} alt={item.name} className="size-7 rounded object-cover flex-shrink-0" />
              <span className="text-sm text-coffee-brown">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
            </div>
            <span className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          order.status === "delivered" ? "bg-gray-100 text-gray-500" :
          order.status === "ready"     ? "bg-green-100 text-green-700" :
          order.status === "preparing" ? "bg-orange-100 text-orange-700" :
                                         "bg-yellow-100 text-yellow-700"
        }`}>
          {order.status === "pending"   ? "Waiting for kitchen…" :
           order.status === "preparing" ? "In the kitchen…" :
           order.status === "ready"     ? "🎉 Ready for pickup!" :
                                          "✓ Delivered"}
        </span>
        {canCancel && (
          <button onClick={onCancel} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold">
            <XCircle className="size-3.5" />
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function OrderTrackingPage() {
  const navigate    = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "0";

  const { orders, cancelOrder } = useStore();

  // All orders for this table, newest first
  const tableOrders = orders
    .filter((o) => o.tableNumber === tableNumber)
    .sort((a, b) => a.createdAt - b.createdAt); // oldest first so items stack in order

  const allDelivered = tableOrders.length > 0 && tableOrders.every((o) => o.status === "delivered");
  const activeOrders = tableOrders.filter((o) => o.status !== "delivered");

  const grandTotal   = tableOrders.reduce((s, o) => s + o.total, 0);
  const allItems     = tableOrders.flatMap((o) => o.items);

  // Merge items across all orders for the combined bill
  const mergedBillMap: Record<string, { name: string; image: string; price: number; qty: number }> = {};
  allItems.forEach((item) => {
    if (mergedBillMap[item.id]) {
      mergedBillMap[item.id].qty += item.quantity;
    } else {
      mergedBillMap[item.id] = { name: item.name, image: item.image, price: item.price, qty: item.quantity };
    }
  });
  const mergedBill = Object.values(mergedBillMap);

  useEffect(() => {
    if (allDelivered && tableOrders.length > 0) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  }, [allDelivered]);

  const handleCancel = (orderId: string) => {
    if (confirm("Cancel this order?")) cancelOrder(orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-lg">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(`/menu?table=${tableNumber}`)} className="text-coffee-brown hover:bg-coffee-brown/10 rounded-full p-2">
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-coffee-brown">My Orders</h1>
            <p className="text-xs text-muted-foreground">Table {tableNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Grand Total</p>
            <p className="font-bold text-coffee-brown">₹{grandTotal.toFixed(2)}</p>
          </div>
        </div>

        {tableOrders.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <Package className="size-14 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No orders yet for Table {tableNumber}</p>
            <button onClick={() => navigate(`/menu?table=${tableNumber}`)} className="px-6 py-3 bg-coffee-brown text-white rounded-full">
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* === MERGED BILL (when all delivered) === */}
            <AnimatePresence>
              {allDelivered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-strong rounded-2xl p-5 mb-5 border-2 border-green-500"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Receipt className="size-5 text-green-600" />
                    <h2 className="font-bold text-coffee-brown text-lg">Your Bill</h2>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">All Delivered ✓</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {mergedBill.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 bg-white/40 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.name} className="size-8 rounded object-cover" />
                          <span className="text-sm font-medium text-coffee-brown">{item.name}</span>
                        </div>
                        <div className="text-right text-sm">
                          <span className="text-muted-foreground">×{item.qty} </span>
                          <span className="font-bold text-coffee-brown">₹{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Subtotal ({tableOrders.length} order{tableOrders.length > 1 ? "s" : ""})</span>
                      <span>₹{(grandTotal / 1.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Tax (5%)</span>
                      <span>₹{(grandTotal - grandTotal / 1.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-coffee-brown text-lg">Total</span>
                      <span className="font-bold text-2xl text-coffee-brown">₹{grandTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-3 bg-white/40 rounded-lg py-2">
                      Please show this bill at the counter to pay
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* === ACTIVE ORDERS === */}
            {activeOrders.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Active ({activeOrders.length})</p>
                <div className="space-y-3">
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onCancel={() => handleCancel(order.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* === DELIVERED ORDERS === */}
            {!allDelivered && tableOrders.some((o) => o.status === "delivered") && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Delivered</p>
                <div className="space-y-3">
                  {tableOrders.filter((o) => o.status === "delivered").map((order) => (
                    <OrderCard key={order.id} order={order} onCancel={() => handleCancel(order.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Add More Items */}
            <button
              onClick={() => navigate(`/menu?table=${tableNumber}`)}
              className="w-full py-3 glass border-2 border-coffee-brown text-coffee-brown rounded-full font-semibold hover:bg-white/60 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="size-5" />
              Add More Items
            </button>
          </>
        )}
      </div>
    </div>
  );
}
