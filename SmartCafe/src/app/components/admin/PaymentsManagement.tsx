import { useState } from "react";
import { DollarSign, Search, Calendar, TrendingUp, CreditCard, Wallet, Download } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "../../store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function PaymentsManagement() {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Calculate payment stats from actual payment methods
  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

  const cashOrders = deliveredOrders.filter((o) => o.paymentMethod === "cash");
  const onlineOrders = deliveredOrders.filter((o) => o.paymentMethod === "razorpay");

  const cashPayments = cashOrders.length;
  const onlinePayments = onlineOrders.length;

  const cashRevenue = cashOrders.reduce((sum, order) => sum + order.total, 0);
  const onlineRevenue = onlineOrders.reduce((sum, order) => sum + order.total, 0);

  // Payment methods data
  const paymentMethodsData = [
    { id: "payment-cash", name: "Cash", value: cashRevenue, color: "#10B981" },
    { id: "payment-online", name: "Card/UPI", value: onlineRevenue, color: "#3B82F6" },
  ];

  // Daily payments - using actual payment methods
  const getLast7DaysPayments = () => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(
        (o) => new Date(o.createdAt).toDateString() === date.toDateString() && o.status === "delivered"
      );

      const cashDayRevenue = dayOrders
        .filter((o) => o.paymentMethod === "cash")
        .reduce((sum, o) => sum + o.total, 0);

      const onlineDayRevenue = dayOrders
        .filter((o) => o.paymentMethod === "razorpay")
        .reduce((sum, o) => sum + o.total, 0);

      days.push({
        id: `payment-day-${i}`,
        name: dayNames[date.getDay()],
        cash: cashDayRevenue,
        online: onlineDayRevenue,
        total: cashDayRevenue + onlineDayRevenue,
      });
    }

    return days;
  };

  const dailyPayments = getLast7DaysPayments();

  // Filter payments
  const filteredOrders = orders
    .filter((order) => order.status === "delivered")
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.includes(searchQuery) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      const orderDate = new Date(order.createdAt);
      const today = new Date();

      if (dateFilter === "today") {
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = orderDate >= weekAgo;
      } else if (dateFilter === "month") {
        matchesDate = orderDate.getMonth() === today.getMonth();
      }

      return matchesSearch && matchesDate;
    });

  const exportPayments = () => {
    const csv = [
      ["Order ID", "Date", "Customer", "Table", "Amount", "Payment Method"].join(","),
      ...filteredOrders.map((order) =>
        [
          order.id,
          new Date(order.createdAt).toLocaleDateString(),
          order.customerName,
          order.tableNumber,
          order.total.toFixed(2),
          order.paymentMethod === "cash" ? "Cash" : "Online",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-coffee-brown mb-2">Payments Management</h2>
          <p className="text-muted-foreground">Track all transactions and payment methods</p>
        </div>
        <button
          onClick={exportPayments}
          className="flex items-center gap-2 px-6 py-3 bg-coffee-brown text-white rounded-xl hover:bg-coffee-brown/90 transition-all shadow-lg"
        >
          <Download className="size-5" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="size-6 text-coffee-brown" />
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-coffee-brown">₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="size-6 text-green-600" />
            <span className="text-sm text-muted-foreground">Cash Payments</span>
          </div>
          <p className="text-3xl font-bold text-green-600">₹{cashRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{cashPayments} transactions</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="size-6 text-blue-600" />
            <span className="text-sm text-muted-foreground">Online Payments</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">₹{onlineRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{onlinePayments} transactions</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="size-6 text-neon-highlight" />
            <span className="text-sm text-muted-foreground">Transactions</span>
          </div>
          <p className="text-3xl font-bold text-coffee-brown">{orders.filter((o) => o.status === "delivered").length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Revenue */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-coffee-brown mb-6">Payment Breakdown (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyPayments}>
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
              <Bar dataKey="cash" fill="#10B981" name="Cash" radius={[4, 4, 0, 0]} key="payment-cash-bar" />
              <Bar dataKey="online" fill="#3B82F6" name="Online" radius={[4, 4, 0, 0]} key="payment-online-bar" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Distribution */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-coffee-brown mb-6">Payment Methods</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-strong rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
            />
          </div>

          <div className="flex gap-2">
            {["all", "today", "week", "month"].map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-4 py-2 rounded-xl capitalize transition-all ${
                  dateFilter === filter
                    ? "bg-coffee-brown text-white"
                    : "glass hover:bg-white/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-strong rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-coffee-brown mb-6">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-coffee-brown">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-coffee-brown">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-coffee-brown">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-coffee-brown">Table</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-coffee-brown">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-coffee-brown">Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/30 hover:bg-white/20">
                  <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                  <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm">{order.customerName}</td>
                  <td className="py-3 px-4 text-sm">Table {order.tableNumber}</td>
                  <td className="py-3 px-4 font-bold text-coffee-brown">₹{order.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentMethod === "cash"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.paymentMethod === "cash" ? "Cash" : "Online"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payment records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
