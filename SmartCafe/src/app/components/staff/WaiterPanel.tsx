import { useState } from "react";
import { Package, Check, Grid3x3, Search, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "../../store";

export function WaiterPanel() {
  const { orders, updateOrderStatus, tables, freeTable } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const markAsDelivered = (orderId: string) => {
    updateOrderStatus(orderId, "delivered");
  };

  const makeTableAvailable = (tableNumber: string) => {
    if (confirm(`Make Table ${tableNumber} available? This will free up the table.`)) {
      freeTable(tableNumber);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.includes(searchQuery)
  );

  const readyOrders = filteredOrders.filter((o) => o.status === "ready");
  const deliveredOrders = filteredOrders.filter((o) => o.status === "delivered");

  const tableStatus = tables.map((t) => {
    const hasReadyOrder = orders.some((o) => o.tableNumber === t.number && o.status === "ready");
    return {
      number: t.number,
      status: hasReadyOrder ? "ready" : t.status,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Package className="size-8 md:size-10 text-coffee-brown" />
          <h1 className="text-2xl md:text-4xl font-bold text-coffee-brown">Waiter Panel</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Ready Orders */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold text-coffee-brown mb-3 md:mb-4">
            Ready for Delivery ({readyOrders.length})
          </h2>
          {readyOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-green-500"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div>
                  <p className="font-mono text-xs md:text-sm text-muted-foreground">{order.id}</p>
                  <p className="text-2xl md:text-3xl font-bold text-coffee-brown">Table {order.tableNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-muted-foreground">{order.items.length} items</p>
                  <p className="text-xl md:text-2xl font-bold text-coffee-brown">₹{order.total}</p>
                </div>
              </div>
              <button
                onClick={() => markAsDelivered(order.id)}
                className="w-full py-2.5 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg md:rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Check className="size-4 md:size-5" />
                Mark as Delivered
              </button>
            </motion.div>
          ))}
          {readyOrders.length === 0 && (
            <div className="glass-strong rounded-xl md:rounded-2xl p-8 md:p-12 text-center">
              <Package className="size-12 md:size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm md:text-base text-muted-foreground">No orders ready for delivery</p>
            </div>
          )}

          {/* Delivered Orders */}
          <h2 className="text-xl md:text-2xl font-semibold text-coffee-brown mb-3 md:mb-4 mt-6 md:mt-8">
            Recently Delivered ({deliveredOrders.length})
          </h2>
          <div className="space-y-2 md:space-y-3">
            {deliveredOrders.map((order) => (
              <div
                key={order.id}
                className="glass rounded-lg md:rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 opacity-60"
              >
                <div>
                  <p className="font-mono text-xs md:text-sm text-muted-foreground">{order.id}</p>
                  <p className="font-semibold text-sm md:text-base text-coffee-brown">Table {order.tableNumber}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs md:text-sm text-muted-foreground">{order.items.length} items</p>
                  <p className="font-semibold text-sm md:text-base text-coffee-brown">₹{order.total}</p>
                </div>
                <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs md:text-sm font-semibold">
                  Delivered
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Table Status */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-coffee-brown mb-3 md:mb-4">Table Management</h2>
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 mb-3 md:mb-4">
            <div className="grid grid-cols-5 gap-2 md:gap-3">
              {tableStatus.map((table) => (
                <div
                  key={table.number}
                  className={`aspect-square rounded-lg md:rounded-xl flex items-center justify-center font-bold text-sm md:text-lg ${
                    table.status === "ready"
                      ? "bg-green-500 text-white ring-2 md:ring-4 ring-green-300 animate-pulse"
                      : table.status === "occupied"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {table.number}
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-6 space-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 bg-green-500 rounded"></div>
                <span>Ready for Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 bg-orange-500 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 md:size-4 bg-gray-200 rounded"></div>
                <span>Available</span>
              </div>
            </div>
          </div>

          {/* Occupied Tables - Free Table Action */}
          <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6">
            <h3 className="font-semibold text-base md:text-lg text-coffee-brown mb-3 md:mb-4">Occupied Tables</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {tables
                .filter((t) => t.status === "occupied")
                .map((table) => (
                  <div key={table.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 bg-white/30 rounded-lg md:rounded-xl">
                    <div>
                      <p className="font-semibold text-sm md:text-base text-coffee-brown">Table {table.number}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{table.customerName}</p>
                    </div>
                    <button
                      onClick={() => makeTableAvailable(table.number)}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-xs md:text-sm"
                    >
                      <CheckCircle className="size-3 md:size-4" />
                      Free Table
                    </button>
                  </div>
                ))}
              {tables.filter((t) => t.status === "occupied").length === 0 && (
                <p className="text-center text-sm md:text-base text-muted-foreground py-4 md:py-6">No occupied tables</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
