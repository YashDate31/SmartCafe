import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, Clock, ChefHat, Package, Check, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useStore, OrderStatus } from "../../store";

const statusSteps: { status: OrderStatus | "accepted"; label: string; icon: any }[] = [
  { status: "pending", label: "Order Placed", icon: CheckCircle2 },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready", icon: Package },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export function OrderTrackingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId = "ORD12345", items = [], total = 0, paymentMethod = "razorpay", tableNumber = null } = location.state || {};

  const { orders, cancelOrder } = useStore();
  const order = orders.find(o => o.id === orderId);

  const currentStatus = order?.status || "pending";
  const [timeRemaining, setTimeRemaining] = useState(300);

  // Calculate time elapsed since order was placed
  const timeElapsed = order ? Math.floor((Date.now() - order.createdAt) / 1000) : 0;
  // Can only cancel if order is still pending (not accepted by kitchen) and within 1 minute
  const canCancel = order && order.status === "pending" && timeElapsed < 60; // 1 minute = 60 seconds

  const handleCancelOrder = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrder(orderId);
      navigate("/menu" + (tableNumber ? `?table=${tableNumber}` : ""));
    }
  };

  useEffect(() => {
    if (currentStatus === "delivered") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [currentStatus]);

  useEffect(() => {
    // Stop timer when order is delivered or ready
    if (currentStatus === "delivered" || currentStatus === "ready") {
      return;
    }

    // Calculate time remaining based on when order was placed (timer starts immediately)
    let initialTime = 300;
    if (order?.preparingStartedAt) {
      const elapsedSincePrep = Math.floor((Date.now() - order.preparingStartedAt) / 1000);
      initialTime = Math.max(0, 300 - elapsedSincePrep);
    }
    setTimeRemaining(initialTime);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStatus, order?.preparingStartedAt]);

  const currentStepIndex = statusSteps.findIndex((step) => step.status === currentStatus);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Order ID Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4 md:p-6 mb-4 md:mb-8 text-center"
        >
          <h1 className="text-xl md:text-2xl font-bold text-coffee-brown mb-2">Order Confirmed!</h1>
          <div className="mb-4">
            <p className="text-muted-foreground">Order ID: <span className="font-mono font-semibold text-coffee-brown">{orderId}</span></p>
            {tableNumber && (
              <p className="text-muted-foreground">Table: <span className="font-semibold text-coffee-brown">{tableNumber}</span></p>
            )}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-highlight/20 rounded-full">
            <Clock className="size-5 text-neon-highlight" />
            <span className="font-semibold text-coffee-brown">Est. Time: {formatTime(timeRemaining)}</span>
          </div>

          {/* Cancel Order Button - Only show within 2 minutes and if pending */}
          {canCancel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <button
                onClick={handleCancelOrder}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors flex items-center gap-2 mx-auto"
              >
                <XCircle className="size-5" />
                Cancel Order
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                You can cancel within 1 minute of placing the order
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Progress Tracker */}
        <div className="glass-strong rounded-2xl p-8 mb-8">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-border"></div>
            <motion.div
              className="absolute left-8 top-8 w-1 bg-coffee-brown"
              initial={{ height: 0 }}
              animate={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>

            {/* Steps */}
            <div className="relative space-y-8">
              {statusSteps.map((step, index) => {
                const isComplete = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <motion.div
                    key={step.status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`relative z-10 size-16 rounded-full flex items-center justify-center transition-all ${
                        isComplete ? "bg-coffee-brown text-white shadow-lg" : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-neon-highlight ring-offset-2" : ""}`}
                    >
                      <AnimatePresence mode="wait">
                        {isComplete ? (
                          <motion.div
                            key="complete"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <step.icon className="size-8" />
                          </motion.div>
                        ) : (
                          <step.icon className="size-8" />
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          isComplete ? "text-coffee-brown" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </h3>
                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-neon-highlight"
                        >
                          In progress...
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="glass-strong rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-lg text-coffee-brown mb-4">Order Items</h2>
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="size-12 md:size-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-coffee-brown">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-border my-4"></div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-coffee-brown">Total</span>
            <span className="font-bold text-xl text-coffee-brown">₹{total.toFixed(2)}</span>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            Payment: <span className="font-semibold">{paymentMethod === "razorpay" ? "Online Payment" : "Pay at Counter"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {currentStatus === "delivered" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="glass-strong rounded-2xl p-6 text-center">
              <CheckCircle2 className="size-16 text-green-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-coffee-brown mb-2">Order Delivered!</h2>
              <p className="text-muted-foreground">Thank you for dining with SmartCafe</p>
            </div>
            <button
              onClick={() => navigate("/menu")}
              className="w-full py-4 bg-coffee-brown text-white rounded-full font-semibold hover:bg-coffee-brown/90 transition-all"
            >
              Order Again
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="w-full py-4 bg-white/50 glass border border-coffee-brown text-coffee-brown rounded-full font-semibold hover:bg-white/70 transition-all"
            >
              Back to Menu
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => navigate("/menu")}
            className="w-full py-4 bg-white/50 glass border border-coffee-brown text-coffee-brown rounded-full font-semibold hover:bg-white/70 transition-all"
          >
            Add More Items
          </button>
        )}
      </div>
    </div>
  );
}
