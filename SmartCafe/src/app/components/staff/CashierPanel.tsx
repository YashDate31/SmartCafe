import { useState } from "react";
import { Wallet, Search, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "../../store";

export function CashierPanel() {
  const { orders, completePayment } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const markAsPaid = (orderId: string, tableNumber: string) => {
    completePayment(orderId, tableNumber);
  };

  const deliveredOrders = orders.filter((o) => o.status === "delivered" && !o.paymentCompleted);

  const filteredOrders = deliveredOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.includes(searchQuery)
  );

  const pendingPayments = filteredOrders;
  const paidPayments = orders.filter((o) => o.paymentCompleted === true);

  const totalCollection = paidPayments.reduce((sum, o) => sum + o.total, 0);
  const pendingAmount = pendingPayments.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Wallet className="size-8 md:size-10 text-coffee-brown" />
          <h1 className="text-2xl md:text-4xl font-bold text-coffee-brown">Cashier Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <TrendingUp className="size-5 md:size-6 text-green-600" />
              <span className="text-xs md:text-sm text-muted-foreground">Total Collection</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-coffee-brown">₹{totalCollection.toLocaleString()}</p>
          </div>
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Clock className="size-5 md:size-6 text-orange-600" />
              <span className="text-xs md:text-sm text-muted-foreground">Pending Payments</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-coffee-brown">₹{pendingAmount.toLocaleString()}</p>
          </div>
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <CheckCircle className="size-5 md:size-6 text-blue-600" />
              <span className="text-xs md:text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-coffee-brown">{paidPayments.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 size-4 md:size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID or table..."
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
            Pending Payments ({pendingPayments.length})
          </h2>
          <div className="space-y-3 md:space-y-4">
            {pendingPayments.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-orange-500"
              >
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div>
                    <p className="font-mono text-xs md:text-sm text-muted-foreground mb-1">{order.id}</p>
                    <p className="text-xl md:text-2xl font-bold text-coffee-brown">Table {order.tableNumber}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{order.customerName}</p>
                    {order.customerMobile && (
                      <p className="text-xs md:text-sm text-muted-foreground">📱 {order.customerMobile}</p>
                    )}
                    <p className="text-xs md:text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm text-muted-foreground">{order.items.length} items</p>
                    <p className="text-2xl md:text-3xl font-bold text-coffee-brown">₹{order.total.toFixed(2)}</p>
                    {order.paymentMethod && (
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        order.paymentMethod === "cash" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {order.paymentMethod === "cash" ? "💵 Cash" : "💳 Online"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3 md:mb-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-white/30 rounded-lg p-2 flex justify-between text-xs md:text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => markAsPaid(order.id, order.tableNumber)}
                  className="w-full py-2.5 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg md:rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <CheckCircle className="size-4 md:size-5" />
                  Payment Received & Free Table
                </button>
              </motion.div>
            ))}
            {pendingPayments.length === 0 && (
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
            Completed Payments ({paidPayments.length})
          </h2>
          <div className="space-y-2 md:space-y-3 max-h-[600px] overflow-y-auto">
            {paidPayments.map((order) => (
              <div key={order.id} className="glass rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-mono text-xs md:text-sm text-muted-foreground">{order.id}</p>
                    <p className="font-semibold text-sm md:text-base text-coffee-brown">Table {order.tableNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    {order.customerMobile && (
                      <p className="text-xs text-muted-foreground">📱 {order.customerMobile}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm text-muted-foreground">{order.items.length} items</p>
                    <p className="text-lg md:text-xl font-bold text-coffee-brown">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    Paid & Table Freed
                  </span>
                  {order.paymentMethod && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.paymentMethod === "cash" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {order.paymentMethod === "cash" ? "💵 Cash" : "💳 Online"}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {paidPayments.length === 0 && (
              <div className="glass rounded-lg md:rounded-xl p-6 md:p-8 text-center">
                <p className="text-sm md:text-base text-muted-foreground">No completed payments yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
