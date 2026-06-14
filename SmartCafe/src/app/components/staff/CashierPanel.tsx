import { useState } from "react";
import { Wallet, Search, CheckCircle, Clock, TrendingUp, CreditCard, Banknote, SplitSquareVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../../store";

type PaymentMode = "cash" | "upi" | "split";

interface SplitModal {
  orderId: string;
  tableNumber: string;
  total: number;
}

export function CashierPanel() {
  const { orders, completePayment } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [splitModal, setSplitModal] = useState<SplitModal | null>(null);
  const [splitCash, setSplitCash] = useState("");
  const [splitUpi, setSplitUpi] = useState("");

  const handlePayment = (orderId: string, tableNumber: string, method: PaymentMode, total?: number) => {
    if (method === "split") {
      setSplitModal({ orderId, tableNumber, total: total || 0 });
      setSplitCash("");
      setSplitUpi("");
    } else {
      completePayment(orderId, tableNumber, method);
    }
  };

  const confirmSplit = () => {
    if (!splitModal) return;
    const cash = parseFloat(splitCash) || 0;
    const upi = parseFloat(splitUpi) || 0;
    if (Math.abs(cash + upi - splitModal.total) > 1) {
      alert(`Split amounts must add up to ₹${splitModal.total.toFixed(2)}`);
      return;
    }
    completePayment(splitModal.orderId, splitModal.tableNumber, "split", cash, upi);
    setSplitModal(null);
  };

  const pendingOrders = orders.filter((o) => o.status === "delivered" && !o.paymentCompleted);

  const filteredOrders = pendingOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.includes(searchQuery) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paidOrders = orders.filter((o) => o.paymentCompleted === true);
  const totalCollection = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.total, 0);

  const cashCollected = paidOrders.filter((o) => o.paymentMethod === "cash").reduce((sum, o) => sum + o.total, 0);
  const upiCollected = paidOrders.filter((o) => o.paymentMethod === "upi").reduce((sum, o) => sum + o.total, 0);
  const splitCollected = paidOrders.filter((o) => o.paymentMethod === "split");
  const splitCashTotal = splitCollected.reduce((sum, o) => sum + (o.splitCash || 0), 0);
  const splitUpiTotal = splitCollected.reduce((sum, o) => sum + (o.splitUpi || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Wallet className="size-8 md:size-10 text-coffee-brown" />
          <h1 className="text-2xl md:text-4xl font-bold text-coffee-brown">Cashier Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-5 text-green-600" />
              <span className="text-xs text-muted-foreground">Total Collected</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-coffee-brown">₹{totalCollection.toLocaleString()}</p>
          </div>
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-5 text-orange-600" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-orange-600">₹{pendingAmount.toLocaleString()}</p>
          </div>
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="size-5 text-green-600" />
              <span className="text-xs text-muted-foreground">Cash + Split Cash</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-green-600">₹{(cashCollected + splitCashTotal).toLocaleString()}</p>
          </div>
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="size-5 text-blue-600" />
              <span className="text-xs text-muted-foreground">UPI + Split UPI</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-blue-600">₹{(upiCollected + splitUpiTotal).toLocaleString()}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-4 md:size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID, name, or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 glass-strong rounded-full focus:outline-none focus:ring-2 focus:ring-coffee-brown text-sm md:text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Pending Payments */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-coffee-brown mb-3 md:mb-4">
            Collect Payment ({filteredOrders.length})
          </h2>
          <div className="space-y-3 md:space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-orange-500"
              >
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground mb-1">{order.id}</p>
                    <p className="text-xl md:text-2xl font-bold text-coffee-brown">Table {order.tableNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    {order.customerMobile && (
                      <p className="text-xs text-muted-foreground">📱 {order.customerMobile}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                    <p className="text-2xl md:text-3xl font-bold text-coffee-brown">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mb-4 space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-white/30 rounded-lg p-2 flex justify-between text-xs md:text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Payment Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handlePayment(order.id, order.tableNumber, "cash")}
                    className="py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex flex-col items-center gap-1 text-xs md:text-sm"
                  >
                    <Banknote className="size-4 md:size-5" />
                    Cash
                  </button>
                  <button
                    onClick={() => handlePayment(order.id, order.tableNumber, "upi")}
                    className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex flex-col items-center gap-1 text-xs md:text-sm"
                  >
                    <CreditCard className="size-4 md:size-5" />
                    UPI
                  </button>
                  <button
                    onClick={() => handlePayment(order.id, order.tableNumber, "split", order.total)}
                    className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors flex flex-col items-center gap-1 text-xs md:text-sm"
                  >
                    <SplitSquareVertical className="size-4 md:size-5" />
                    Split
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="glass-strong rounded-xl md:rounded-2xl p-8 md:p-12 text-center">
                <CheckCircle className="size-12 md:size-16 text-green-600 mx-auto mb-4" />
                <p className="text-sm md:text-base text-muted-foreground">All payments cleared!</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Payments */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-coffee-brown mb-3 md:mb-4">
            Completed ({paidOrders.length})
          </h2>
          <div className="space-y-2 md:space-y-3 max-h-[600px] overflow-y-auto">
            {paidOrders.map((order) => (
              <div key={order.id} className="glass rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                    <p className="font-semibold text-sm md:text-base text-coffee-brown">Table {order.tableNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg md:text-xl font-bold text-coffee-brown">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    Paid
                  </span>
                  {order.paymentMethod === "cash" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">💵 Cash</span>
                  )}
                  {order.paymentMethod === "upi" && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">📱 UPI</span>
                  )}
                  {order.paymentMethod === "split" && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      Split: ₹{order.splitCash?.toFixed(0)} Cash + ₹{order.splitUpi?.toFixed(0)} UPI
                    </span>
                  )}
                </div>
              </div>
            ))}
            {paidOrders.length === 0 && (
              <div className="glass rounded-lg md:rounded-xl p-6 md:p-8 text-center">
                <p className="text-sm md:text-base text-muted-foreground">No completed payments yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Split Payment Modal */}
      <AnimatePresence>
        {splitModal && (() => {
          const cashVal = parseFloat(splitCash) || 0;
          const upiVal  = parseFloat(splitUpi)  || 0;
          const sum     = cashVal + upiVal;
          const isValid = Math.abs(sum - splitModal.total) <= 0.5;
          const cashPct = splitModal.total > 0 ? Math.min(100, (cashVal / splitModal.total) * 100) : 0;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setSplitModal(null)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                className="glass-strong rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-coffee-brown">Split Payment</h3>
                    <p className="text-xs text-muted-foreground">Table {splitModal.tableNumber}</p>
                  </div>
                  <button onClick={() => setSplitModal(null)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/10 text-muted-foreground">
                    <X className="size-4" />
                  </button>
                </div>

                {/* Total */}
                <div className="text-center mb-5 py-3 bg-coffee-brown/10 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-0.5">Order Total</p>
                  <p className="text-3xl font-bold text-coffee-brown">₹{splitModal.total.toFixed(2)}</p>
                </div>

                {/* Visual split bar */}
                <div className="mb-5">
                  <div className="h-4 rounded-full overflow-hidden bg-gray-200 flex mb-1">
                    <motion.div
                      animate={{ width: `${cashPct}%` }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="h-full bg-green-500 rounded-l-full"
                    />
                    <motion.div
                      animate={{ width: `${100 - cashPct}%` }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="h-full bg-blue-500 rounded-r-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600 font-semibold">💵 Cash {cashPct.toFixed(0)}%</span>
                    <span className="text-blue-600 font-semibold">📱 UPI {(100 - cashPct).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-green-700 mb-1.5">
                      <Banknote className="size-3.5" /> Cash (₹)
                    </label>
                    <input
                      type="number"
                      value={splitCash}
                      onChange={(e) => {
                        setSplitCash(e.target.value);
                        const c = parseFloat(e.target.value) || 0;
                        setSplitUpi(Math.max(0, splitModal.total - c).toFixed(2));
                      }}
                      placeholder="0.00"
                      min="0"
                      max={splitModal.total}
                      className="w-full px-3 py-2.5 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center font-bold text-lg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-blue-700 mb-1.5">
                      <CreditCard className="size-3.5" /> UPI (₹)
                    </label>
                    <input
                      type="number"
                      value={splitUpi}
                      onChange={(e) => {
                        setSplitUpi(e.target.value);
                        const u = parseFloat(e.target.value) || 0;
                        setSplitCash(Math.max(0, splitModal.total - u).toFixed(2));
                      }}
                      placeholder="0.00"
                      min="0"
                      max={splitModal.total}
                      className="w-full px-3 py-2.5 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold text-lg"
                    />
                  </div>
                </div>

                {/* Validation */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-5 text-sm font-medium ${
                  isValid ? "bg-green-100 text-green-700" : sum > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                }`}>
                  <span>Entered: ₹{sum.toFixed(2)}</span>
                  {isValid
                    ? <span className="flex items-center gap-1"><CheckCircle className="size-4" /> Balanced</span>
                    : <span>Need: ₹{splitModal.total.toFixed(2)}</span>
                  }
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSplitModal(null)} className="py-2.5 glass rounded-xl font-semibold text-coffee-brown hover:bg-white/60 transition-all">
                    Cancel
                  </button>
                  <button
                    onClick={confirmSplit}
                    disabled={!isValid}
                    className={`py-2.5 rounded-xl font-semibold text-white transition-colors ${
                      isValid ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Confirm Split
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
