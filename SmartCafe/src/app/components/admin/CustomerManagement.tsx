import { useState } from "react";
import { Users, Search, MapPin, Clock, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "../../store";

export function CustomerManagement() {
  const { tables, orders } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique customers from tables and orders
  const customers = tables
    .filter((t) => t.customerName && t.status === "occupied")
    .map((table) => {
      const customerOrders = orders.filter((o) => o.tableNumber === table.number);
      const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        name: table.customerName!,
        tableNumber: table.number,
        sessionId: table.sessionId!,
        orders: customerOrders.length,
        totalSpent,
        currentOrder: customerOrders.find((o) => o.status !== "delivered"),
      };
    });

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCustomers = filteredCustomers.length;
  const totalSpending = filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpending = activeCustomers > 0 ? totalSpending / activeCustomers : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-coffee-brown mb-2">Customer Management</h2>
        <p className="text-muted-foreground">Track active customers and their orders</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="size-6 text-coffee-brown" />
            <span className="text-sm text-muted-foreground">Active Customers</span>
          </div>
          <p className="text-3xl font-bold text-coffee-brown">{activeCustomers}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="size-6 text-neon-highlight" />
            <span className="text-sm text-muted-foreground">Total Spending</span>
          </div>
          <p className="text-3xl font-bold text-coffee-brown">₹{totalSpending.toLocaleString()}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="size-6 text-green-600" />
            <span className="text-sm text-muted-foreground">Avg Spending</span>
          </div>
          <p className="text-3xl font-bold text-coffee-brown">₹{avgSpending.toFixed(0)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="glass-strong rounded-2xl p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <motion.div
            key={customer.sessionId}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 bg-coffee-brown/10 rounded-full flex items-center justify-center">
                <Users className="size-6 text-coffee-brown" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>

            <h3 className="font-semibold text-lg text-coffee-brown mb-1">{customer.name}</h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>Table {customer.tableNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingBag className="size-4" />
                <span>{customer.orders} order{customer.orders !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <div className="p-3 bg-white/30 rounded-xl">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-bold text-coffee-brown">₹{customer.totalSpent.toFixed(2)}</span>
              </div>
              {customer.currentOrder && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Current Order</span>
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${
                        customer.currentOrder.status === "pending"
                          ? "bg-gray-100 text-gray-700"
                          : customer.currentOrder.status === "preparing"
                          ? "bg-orange-100 text-orange-700"
                          : customer.currentOrder.status === "ready"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {customer.currentOrder.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <Users className="size-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No active customers at the moment</p>
        </div>
      )}
    </div>
  );
}
