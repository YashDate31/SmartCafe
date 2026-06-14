import { useState } from "react";
import { Search, Clock, CheckCircle, Package, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useStore, OrderStatus } from "../../store";

export function OrdersManagement() {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.includes(searchQuery) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => b.createdAt - a.createdAt);

  const statusStats = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "preparing":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "ready":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="size-4" />;
      case "preparing":
        return <Package className="size-4" />;
      case "ready":
        return <Truck className="size-4" />;
      case "delivered":
        return <CheckCircle className="size-4" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-coffee-brown mb-2">Orders Management</h2>
        <p className="text-muted-foreground">Track and manage all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {(["all", "pending", "preparing", "ready", "delivered"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`glass-strong rounded-xl p-4 transition-all ${
              statusFilter === status ? "ring-2 ring-coffee-brown" : ""
            }`}
          >
            <p className="text-sm text-muted-foreground mb-1 capitalize">{status}</p>
            <p className="text-3xl font-bold text-coffee-brown">{statusStats[status]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="glass-strong rounded-2xl p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID, table, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-mono text-lg font-bold text-coffee-brown">{order.id}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Table {order.tableNumber} • {order.customerName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">{order.items.length} items</p>
                <p className="text-2xl font-bold text-coffee-brown">₹{order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/30 rounded-xl p-4 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-coffee-brown">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-coffee-brown">
                      ×{item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {sortedOrders.length === 0 && (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <Package className="size-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )}
    </div>
  );
}
