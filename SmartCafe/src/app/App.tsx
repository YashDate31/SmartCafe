import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { LandingPage } from "./components/customer/LandingPage";
import { MenuPage } from "./components/customer/MenuPage";
import { CartPage } from "./components/customer/CartPage";
import { OrderTrackingPage } from "./components/customer/OrderTrackingPage";
import { TableVerification } from "./components/customer/TableVerification";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { KitchenDashboard } from "./components/staff/KitchenDashboard";
import { WaiterPanel } from "./components/staff/WaiterPanel";
import { CashierPanel } from "./components/staff/CashierPanel";
import { MainLogin } from "./components/MainLogin";
import { RoleSwitcher } from "./components/RoleSwitcher";
import { FloatingRoleSwitcher } from "./components/FloatingRoleSwitcher";
import { CustomerLoginGate } from "./components/CustomerLoginGate";
import { useRealtimeSync } from "./useRealtimeSync";

function AppContent() {
  // Boot: load initial data + subscribe to realtime changes
  useRealtimeSync();

  return (
    <Routes>
      {/* Customer App Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/table/:tableNumber" element={<TableVerification />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-tracking" element={<OrderTrackingPage />} />

      {/* Staff Login Gate and Access */}
      <Route path="/staff-access" element={<CustomerLoginGate />} />
      <Route path="/staff-login" element={<MainLogin />} />

      {/* Admin & Staff Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/kitchen" element={<KitchenDashboard />} />
      <Route path="/waiter" element={<WaiterPanel />} />
      <Route path="/cashier" element={<CashierPanel />} />

      {/* Role Switcher */}
      <Route path="/switch" element={<RoleSwitcher />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      {/* Floating Role Switcher */}
      <FloatingRoleSwitcher />
    </BrowserRouter>
  );
}