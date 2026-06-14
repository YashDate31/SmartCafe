import { useState } from "react";
import { DollarSign, Search, TrendingUp, CreditCard, Wallet, Download, SplitSquareVertical, Banknote } from "lucide-react";
import { useStore } from "../../store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function PaymentsManagement() {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const paidOrders = orders.filter((o) => o.paymentCompleted === true);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const cashOrders = paidOrders.filter((o) => o.paymentMethod === "cash");
  const upiOrders = paidOrders.filter((o) => o.paymentMethod === "upi");
  const splitOrders = paidOrders.filter((o) => o.paymentMethod === "split");

  const cashRevenue = cashOrders.reduce((sum, o) => sum + o.total, 0);
  const upiRevenue = upiOrders.reduce((sum, o) => sum + o.total, 0);
  const splitRevenue = splitOrders.reduce((sum, o) => sum + o.total, 0);

  // For actual cash in hand (cash + split cash portions)
  const cashInHand =
    cashRevenue +
    splitOrders.reduce((sum, o) => sum + (o.splitCash || 0), 0);
  const upiReceived =
    upiRevenue +
    splitOrders.reduce((sum, o) => sum + (o.splitUpi || 0), 0);

  const paymentMethodsData = [
    { name: "Cash", value: cashRevenue, color: "#10B981" },
    { name: "UPI", value: upiRevenue, color: "#3B82F6" },
    { name: "Split", value: splitRevenue, color: "#8B5CF6" },
  ].filter((d) => d.value > 0);

  const getLast7DaysPayments = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayOrders = paidOrders.filter(
        (o) => new Date(o.createdAt).toDateString() === date.toDateString()
      );
      return {
        id: `day-${i}`,
        name: dayNames[date.getDay()],
        cash: dayOrders.filter((o) => o.paymentMethod === "cash").reduce((s, o) => s + o.total, 0),
        upi: dayOrders.filter((o) => o.paymentMethod === "upi").reduce((s, o) => s + o.total, 0),
        split: dayOrders.filter((o) => o.paymentMethod === "split").reduce((s, o) => s + o.total, 0),
      };
    });
  };

  const dailyPayments = getLast7DaysPayments();

  const filteredOrders = paidOrders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.includes(searchQuery) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      if (dateFilter === "today") matchesDate = orderDate.toDateString() === today.toDateString();
      else if (dateFilter === "week") matchesDate = orderDate >= new Date(today.getTime() - 7 * 86400000);
      else if (dateFilter === "month") matchesDate = orderDate.getMonth() === today.getMonth();

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const exportPayments = () => {
    const csv = [
      ["Order ID", "Date", "Customer", "Table", "Amount", "Method", "Split Cash", "Split UPI"].join(","),
      ...filteredOrders.map((o) =>
        [
          o.id,
          new Date(o.createdAt).toLocaleDateString(),
          o.customerName,
          o.tableNumber,
          o.total.toFixed(2),
          o.paymentMethod || "N/A",
          o.splitCash?.toFixed(2) || "",
          o.splitUpi?.toFixed(2) || "",
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

  const methodLabel = (method?: string) => {
    if (method === "cash") return { label: "Cash", cls: "bg-green-100 text-green-700" };
    if (method === "upi") return { label: "UPI", cls: "bg-blue-100 text-blue-700" };
    if (method === "split") return { label: "Split", cls: "bg-purple-100 text-purple-700" };
    return { label: "—", cls: "bg-gray-100 text-gray-600" };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-coffee-brown mb-2">Payments Management</h2>
          <p className="text-muted-foreground">Track all transactions collected by cashier</p>
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
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="size-6 text-coffee-brown" />
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-coffee-brown">₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Banknote className="size-6 text-green-600" />
            <span className="text-sm text-muted-foreground">Cash in Hand</span>
          </div>
          <p className="text-3xl font-bold text-green-600">₹{cashInHand.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Cash + split cash portions</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="size-6 text-blue-600" />
            <span className="text-sm text-muted-foreground">UPI Received</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">₹{upiReceived.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">UPI + split UPI portions</p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <SplitSquareVertical className="size-6 text-purple-600" />
            <span className="text-sm text-muted-foreground">Split Payments</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{splitOrders.length}</p>
          <p className="text-xs text-muted-foreground mt-1">₹{splitRevenue.toLocaleString()} total</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-coffee-brown mb-6">Daily Breakdown (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyPayments}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(111, 78, 55, 0.1)" />
              <XAxis dataKey="name" stroke="#6F4E37" />
              <YAxis stroke="#6F4E37" />
              <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid rgba(111,78,55,0.2)", borderRadius: "12px" }} />
              <Bar dataKey="cash" fill="#10B981" name="Cash" radius={[4,4,0,0]} key="bar-cash" />
              <Bar dataKey="upi" fill="#3B82F6" name="UPI" radius={[4,4,0,0]} key="bar-upi" />
              <Bar dataKey="split" fill="#8B5CF6" name="Split" radius={[4,4,0,0]} key="bar-split" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-coffee-brown mb-6">Payment Methods</h3>
          {paymentMethodsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
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
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">No paid orders yet</div>
          )}
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
                  dateFilter === filter ? "bg-coffee-brown text-white" : "glass hover:bg-white/50"
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-coffee-brown">Split Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const { label, cls } = methodLabel(order.paymentMethod);
                return (
                  <tr key={order.id} className="border-b border-border/30 hover:bg-white/20">
                    <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                    <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">{order.customerName}</td>
                    <td className="py-3 px-4 text-sm">Table {order.tableNumber}</td>
                    <td className="py-3 px-4 font-bold text-coffee-brown">₹{order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {order.paymentMethod === "split"
                        ? `₹${order.splitCash?.toFixed(0)} Cash + ₹${order.splitUpi?.toFixed(0)} UPI`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payment records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
