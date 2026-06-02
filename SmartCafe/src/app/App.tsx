import { BrowserRouter, Routes, Route, Navigate } from "react-router";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer App Routes - Default to Menu */}
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/table/:tableNumber" element={<TableVerification />} />

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
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>

      {/* Floating Role Switcher */}
      <FloatingRoleSwitcher />
    </BrowserRouter>
  );
}