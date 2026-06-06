import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Grid3x3,
  CreditCard,
  BarChart3,
  Users,
  Settings,
  Menu as MenuIcon,
  X,
  TrendingUp,
  Clock,
  Package,
  Tag,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TableManagement } from "./TableManagement";
import { MenuManagement } from "./MenuManagement";
import { OrdersManagement } from "./OrdersManagement";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { CustomerManagement } from "./CustomerManagement";
import { SettingsPanel } from "./SettingsPanel";
import { PaymentsManagement } from "./PaymentsManagement";
import { useStore } from "../../store";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "dashboard" },
  { icon: ShoppingBag, label: "Orders", path: "orders" },
  { icon: Coffee, label: "Menu", path: "menu" },
  { icon: Grid3x3, label: "Tables", path: "tables" },
  { icon: CreditCard, label: "Payments", path: "payments" },
  { icon: BarChart3, label: "Analytics", path: "analytics" },
  { icon: Users, label: "Customers", path: "customers" },
  { icon: Settings, label: "Settings", path: "settings" },
];


export function AdminDashboard() {
  const { orders, tables, menuItems: storeMenuItems, logout } = useStore();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if there's an initial menu from navigation state
  useEffect(() => {
    if (location.state?.initialMenu) {
      setSelectedMenu(location.state.initialMenu);
    }
  }, [location.state]);

  // Real-time stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const activeTables = tables.filter((t) => t.status === "occupied").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  // Real revenue data - Last 7 days
  const getLast7Days = () => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        name: dayNames[date.getDay()],
        date: date.toDateString(),
      });
    }
    return days;
  };

  const revenueData = getLast7Days().map((day, index) => {
    const dayOrders = orders.filter(
      (order) => new Date(order.createdAt).toDateString() === day.date
    );
    const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
    return { id: `day-${index}`, name: day.name, revenue };
  });

  // Real monthly revenue data - Last 12 months
  const getLast12Months = () => {
    const months = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        name: monthNames[date.getMonth()],
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    }
    return months;
  };

  const monthlyRevenueData = getLast12Months().map((month, index) => {
    const monthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === month.month && orderDate.getFullYear() === month.year;
    });
    const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    return { id: `month-${month.year}-${month.month}`, name: month.name, revenue };
  });

  // Top selling items from real data
  const itemSales = storeMenuItems.map((item) => {
    const sold = orders.reduce((sum, order) => {
      const orderItem = order.items.find((i) => i.id === item.id);
      return sum + (orderItem?.quantity || 0);
    }, 0);
    const revenue = orders.reduce((sum, order) => {
      const orderItem = order.items.find((i) => i.id === item.id);
      return sum + (orderItem ? orderItem.quantity * orderItem.price : 0);
    }, 0);
    return { ...item, sold, revenue };
  });

  const topSellingItems = itemSales
    .filter((item) => item.sold > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  // Recent orders from real data
  const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-64 glass-strong border-r border-border/50 fixed lg:sticky top-0 h-screen z-50 overflow-y-auto"
          >
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="size-8 text-coffee-brown" />
                <span className="text-xl font-bold text-coffee-brown">SmartCafe</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-coffee-brown">
                <X className="size-6" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    setSelectedMenu(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    selectedMenu === item.path
                      ? "bg-coffee-brown text-white shadow-lg"
                      : "text-coffee-brown hover:bg-coffee-brown/10"
                  }`}
                >
                  <item.icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="glass sticky top-0 z-40 border-b border-border/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className="text-coffee-brown">
                  <MenuIcon className="size-6" />
                </button>
              )}
              <h1 className="text-2xl font-bold text-coffee-brown">
                {menuItems.find((item) => item.path === selectedMenu)?.label || "Dashboard"}
              </h1>
            </div>
          <div className="flex items-center gap-3">
              <div className="px-4 py-2 glass-strong rounded-full">
                <span className="text-sm text-muted-foreground">Today: </span>
                <span className="font-semibold text-coffee-brown">{new Date().toLocaleDateString()}</span>
              </div>
              <button
                onClick={() => { logout(); window.location.href = "/staff-login"; }}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors font-semibold text-sm"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {selectedMenu === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  key="stat-revenue"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-strong rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-coffee-brown/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="size-6 text-coffee-brown" />
                    </div>
                    <span className="text-xs text-green-600 font-semibold">+12.5%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-coffee-brown">₹{totalRevenue.toLocaleString()}</p>
                </motion.div>

                <motion.div
                  key="stat-orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-strong rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-neon-highlight/10 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="size-6 text-neon-highlight" />
                    </div>
                    <span className="text-xs text-green-600 font-semibold">+8.2%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Orders Today</p>
                  <p className="text-3xl font-bold text-coffee-brown">{todayOrders}</p>
                </motion.div>

                <motion.div
                  key="stat-tables"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-strong rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-green-600/10 rounded-xl flex items-center justify-center">
                      <Grid3x3 className="size-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Active Tables</p>
                  <p className="text-3xl font-bold text-coffee-brown">{activeTables}/25</p>
                </motion.div>

                <motion.div
                  key="stat-pending"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-strong rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 bg-orange-600/10 rounded-xl flex items-center justify-center">
                      <Clock className="size-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
                  <p className="text-3xl font-bold text-coffee-brown">{pendingOrders}</p>
                </motion.div>
              </div>

              {/* Revenue Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Revenue */}
                <div className="glass-strong rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-coffee-brown mb-6">Weekly Revenue</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(111, 78, 55, 0.1)" />
                      <XAxis dataKey="name" stroke="#6F4E37" />
                      <YAxis stroke="#6F4E37" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid rgba(111, 78, 55, 0.2)",
                          borderRadius: "12px"
                        }}
                      />
                      <Bar dataKey="revenue" fill="#6F4E37" radius={[8, 8, 0, 0]} key="weekly-revenue-bar" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Revenue */}
                <div className="glass-strong rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-coffee-brown mb-6">Monthly Revenue (12 Months)</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(111, 78, 55, 0.1)" />
                      <XAxis dataKey="name" stroke="#6F4E37" />
                      <YAxis stroke="#6F4E37" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid rgba(111, 78, 55, 0.2)",
                          borderRadius: "12px"
                        }}
                      />
                      <Bar dataKey="revenue" fill="#8B6F47" radius={[8, 8, 0, 0]} key="monthly-revenue-bar" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Selling Items */}
                <div className="glass-strong rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-coffee-brown mb-6">Top Selling Items</h2>
                  <div className="space-y-4">
                    {topSellingItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="size-10 bg-coffee-brown/10 rounded-lg flex items-center justify-center font-bold text-coffee-brown">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-coffee-brown">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sold} sold</p>
                        </div>
                        <p className="font-semibold text-coffee-brown">₹{item.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="glass-strong rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-coffee-brown mb-6">Recent Orders</h2>
                  <div className="space-y-3">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                          <div>
                            <p className="font-mono text-sm font-semibold text-coffee-brown">{order.id}</p>
                            <p className="text-xs text-muted-foreground">Table {order.tableNumber} • {order.items.length} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-coffee-brown">₹{order.total.toFixed(2)}</p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "ready"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "preparing"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-6">No recent orders</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedMenu === "tables" && <TableManagement />}
          {selectedMenu === "menu" && <MenuManagement />}
          {selectedMenu === "orders" && <OrdersManagement />}
          {selectedMenu === "analytics" && <AnalyticsDashboard />}
          {selectedMenu === "customers" && <CustomerManagement />}
          {selectedMenu === "payments" && <PaymentsManagement />}
          {selectedMenu === "settings" && <SettingsPanel />}

          {!["dashboard", "tables", "menu", "orders", "analytics", "customers", "payments", "settings"].includes(selectedMenu) && (
            <div className="glass-strong rounded-2xl p-12 text-center">
              <Package className="size-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-coffee-brown mb-2">
                {menuItems.find((item) => item.path === selectedMenu)?.label}
              </h2>
              <p className="text-muted-foreground">This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
