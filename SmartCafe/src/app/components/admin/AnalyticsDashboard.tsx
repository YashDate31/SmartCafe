import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useStore } from "../../store";

export function AnalyticsDashboard() {
  const { orders, menuItems, tables } = useStore();

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const occupiedTables = tables.filter((t) => t.status === "occupied").length;

  // Revenue by day (last 7 days)
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
    return { id: `analytics-day-${index}`, name: day.name, revenue };
  });

  // Top selling items
  const itemSales = menuItems.map((item) => {
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

  const topItems = itemSales
    .filter((item) => item.sold > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Orders by status
  const statusData = [
    { id: "status-pending", name: "Pending", value: orders.filter((o) => o.status === "pending").length, color: "#9CA3AF" },
    { id: "status-preparing", name: "Preparing", value: orders.filter((o) => o.status === "preparing").length, color: "#F97316" },
    { id: "status-ready", name: "Ready", value: orders.filter((o) => o.status === "ready").length, color: "#3B82F6" },
    { id: "status-delivered", name: "Delivered", value: orders.filter((o) => o.status === "delivered").length, color: "#10B981" },
  ].filter((d) => d.value > 0);

  // Category revenue
  const categoryRevenue = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    const itemRevenue = orders.reduce((sum, order) => {
      const orderItem = order.items.find((i) => i.id === item.id);
      return sum + (orderItem ? orderItem.quantity * orderItem.price : 0);
    }, 0);
    acc[item.category] += itemRevenue;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryRevenue).map(([name, revenue], index) => ({
    id: `category-${index}`,
    name,
    revenue,
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-coffee-brown mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Business insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-coffee-brown/10 rounded-xl flex items-center justify-center">
              <DollarSign className="size-6 text-coffee-brown" />
            </div>
            <span className="text-xs text-green-600 font-semibold">+12.5%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-coffee-brown">₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-neon-highlight/10 rounded-xl flex items-center justify-center">
              <ShoppingCart className="size-6 text-neon-highlight" />
            </div>
            <span className="text-xs text-green-600 font-semibold">+8.2%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-coffee-brown">{totalOrders}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-green-600/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="size-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold text-coffee-brown">₹{averageOrderValue.toFixed(0)}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 bg-orange-600/10 rounded-xl flex items-center justify-center">
              <Users className="size-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Table Occupancy</p>
          <p className="text-3xl font-bold text-coffee-brown">{occupiedTables}/25</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-coffee-brown mb-6">Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(111, 78, 55, 0.1)" />
              <XAxis dataKey="name" stroke="#6F4E37" />
              <YAxis stroke="#6F4E37" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(111, 78, 55, 0.2)",
                  borderRadius: "12px",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#6F4E37" strokeWidth={3} dot={{ r: 6 }} key="analytics-revenue-line" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Revenue */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-coffee-brown mb-6">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(111, 78, 55, 0.1)" />
              <XAxis dataKey="name" stroke="#6F4E37" />
              <YAxis stroke="#6F4E37" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(111, 78, 55, 0.2)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="revenue" fill="#6F4E37" radius={[8, 8, 0, 0]} key="category-revenue-bar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-coffee-brown mb-6">Top Selling Items</h3>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="size-10 bg-coffee-brown/10 rounded-lg flex items-center justify-center font-bold text-coffee-brown flex-shrink-0">
                  {index + 1}
                </div>
                <div className="size-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-coffee-brown truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.sold} sold</p>
                </div>
                <p className="font-semibold text-coffee-brown whitespace-nowrap">₹{item.revenue.toLocaleString()}</p>
              </div>
            ))}
            {topItems.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No sales data available</p>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-coffee-brown mb-6">Order Status Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {statusData.length === 0 && (
            <p className="text-center text-muted-foreground">No order data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
