import { create } from "zustand";
import { API_BASE_URL } from "./supabaseClient";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";
export type TableStatus = "available" | "occupied" | "cleaning";
export type UserRole = "admin" | "kitchen" | "waiter" | "cashier" | null;

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  popular?: boolean;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  paymentMethod?: "razorpay" | "cash";
  customerMobile?: string;
  paymentCompleted?: boolean;
}

export interface Table {
  id: string;
  number: string;
  status: TableStatus;
  customerName?: string;
  sessionId?: string;
}

export interface AuthState {
  role: UserRole;
  isAuthenticated: boolean;
}

interface CafeState {
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  auth: AuthState;
  loading: boolean;

  // Data Fetching
  fetchMenu: () => Promise<void>;
  fetchTables: () => Promise<void>;
  fetchOrders: () => Promise<void>;

  // Menu Actions
  addMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;

  // Table Actions
  occupyTable: (number: string, customerName: string) => Promise<void>;
  freeTable: (number: string) => Promise<void>;
  updateTableStatus: (number: string, status: TableStatus) => Promise<void>;

  // Order Actions
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Promise<string>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  completePayment: (orderId: string, tableNumber: string) => Promise<void>;

  // Auth Actions
  login: (role: UserRole) => void;
  logout: () => void;
}

// Helper to map snake_case DB row → camelCase Order
function mapOrder(row: any): Order {
  return {
    id: row.id,
    tableNumber: row.table_number,
    customerName: row.customer_name,
    customerMobile: row.customer_mobile,
    total: row.total,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
    paymentMethod: row.payment_method,
    paymentCompleted: row.payment_completed,
    items: (row.order_items || []).map((oi: any) => ({
      id: oi.menu_item_id,
      name: oi.name,
      price: oi.price,
      quantity: oi.quantity,
      description: "",
      category: "",
      image: "",
      isVeg: true,
    })),
  };
}

// Helper to map snake_case DB row → camelCase Table
function mapTable(row: any): Table {
  return {
    id: row.id,
    number: row.number,
    status: row.status,
    customerName: row.customer_name ?? undefined,
    sessionId: row.session_id ?? undefined,
  };
}

// Helper to map snake_case DB row → camelCase MenuItem
function mapMenuItem(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: row.image,
    isVeg: row.is_veg,
    popular: row.popular,
  };
}

export const useStore = create<CafeState>()((set, get) => ({
  menuItems: [],
  tables: [],
  orders: [],
  loading: false,
  auth: {
    role: null,
    isAuthenticated: false,
  },

  // ─── Fetchers ───────────────────────────────────────────────────────────────

  fetchMenu: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/menu`);
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ menuItems: data.map(mapMenuItem) });
      }
    } catch (err) {
      console.error("fetchMenu error:", err);
    }
  },

  fetchTables: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tables`);
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ tables: data.map(mapTable) });
      }
    } catch (err) {
      console.error("fetchTables error:", err);
    }
  },

  fetchOrders: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ orders: data.map(mapOrder) });
      }
    } catch (err) {
      console.error("fetchOrders error:", err);
    }
  },

  // ─── Menu Actions ────────────────────────────────────────────────────────────

  addMenuItem: async (item) => {
    await fetch(`${API_BASE_URL}/api/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "menu_" + Date.now(),
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        is_veg: item.isVeg,
        popular: item.popular ?? false,
      }),
    });
    await get().fetchMenu();
  },

  updateMenuItem: async (id, updatedItem) => {
    await fetch(`${API_BASE_URL}/api/menu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: updatedItem.name,
        description: updatedItem.description,
        price: updatedItem.price,
        category: updatedItem.category,
        image: updatedItem.image,
        is_veg: updatedItem.isVeg,
        popular: updatedItem.popular,
      }),
    });
    await get().fetchMenu();
  },

  deleteMenuItem: async (id) => {
    await fetch(`${API_BASE_URL}/api/menu/${id}`, { method: "DELETE" });
    await get().fetchMenu();
  },

  // ─── Table Actions ───────────────────────────────────────────────────────────

  occupyTable: async (number, customerName) => {
    await fetch(`${API_BASE_URL}/api/tables/occupy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, customerName }),
    });
    await get().fetchTables();
  },

  freeTable: async (number) => {
    await fetch(`${API_BASE_URL}/api/tables/free`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number }),
    });
    await get().fetchTables();
  },

  updateTableStatus: async (number, status) => {
    await fetch(`${API_BASE_URL}/api/tables/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, status }),
    });
    await get().fetchTables();
  },

  // ─── Order Actions ───────────────────────────────────────────────────────────

  placeOrder: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableNumber: orderData.tableNumber,
        customerName: orderData.customerName,
        customerMobile: orderData.customerMobile,
        total: orderData.total,
        items: orderData.items,
        paymentMethod: orderData.paymentMethod,
      }),
    });
    const data = await res.json();
    await get().fetchOrders();
    return data.orderId;
  },

  updateOrderStatus: async (id, status) => {
    await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await get().fetchOrders();
  },

  cancelOrder: async (id) => {
    await fetch(`${API_BASE_URL}/api/orders/${id}`, { method: "DELETE" });
    await get().fetchOrders();
  },

  completePayment: async (orderId, tableNumber) => {
    await fetch(`${API_BASE_URL}/api/orders/${orderId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNumber }),
    });
    await get().fetchOrders();
    await get().fetchTables();
  },

  // ─── Auth Actions ────────────────────────────────────────────────────────────

  login: (role) =>
    set(() => ({
      auth: { role, isAuthenticated: true },
    })),

  logout: () =>
    set(() => ({
      auth: { role: null, isAuthenticated: false },
    })),
}));
