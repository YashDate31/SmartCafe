import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  preparingStartedAt?: number;
  paymentMethod?: "cash" | "upi" | "split";
  splitCash?: number;
  splitUpi?: number;
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

  // Menu Actions
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;

  // Table Actions
  occupyTable: (number: string, customerName: string) => void;
  freeTable: (number: string) => void;
  updateTableStatus: (number: string, status: TableStatus) => void;

  // Order Actions
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => string;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => void;
  completePayment: (orderId: string, tableNumber: string, paymentMethod: "cash" | "upi" | "split", splitCash?: number, splitUpi?: number) => void;

  // Auth Actions
  login: (role: UserRole) => void;
  logout: () => void;
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Cappuccino",
    description: "Rich espresso with steamed milk foam",
    price: 180,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop",
    isVeg: true,
    popular: true
  },
  {
    id: "2",
    name: "Latte",
    description: "Smooth espresso with steamed milk",
    price: 160,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
    isVeg: true
  },
  {
    id: "3",
    name: "Espresso",
    description: "Strong and bold Italian coffee",
    price: 120,
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop",
    isVeg: true
  },
  {
    id: "4",
    name: "Green Tea",
    description: "Refreshing and healthy green tea",
    price: 100,
    category: "Tea",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
    isVeg: true
  },
  {
    id: "5",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea",
    price: 80,
    category: "Tea",
    image: "https://images.unsplash.com/photo-1597318113554-2f9475b3b98e?w=400&h=400&fit=crop",
    isVeg: true,
    popular: true
  },
  {
    id: "6",
    name: "Croissant",
    description: "Buttery, flaky French pastry",
    price: 120,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
    isVeg: true
  },
  {
    id: "7",
    name: "Sandwich",
    description: "Grilled veggie sandwich with cheese",
    price: 220,
    category: "Meals",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop",
    isVeg: true,
    popular: true
  },
  {
    id: "8",
    name: "Brownie",
    description: "Rich chocolate brownie with nuts",
    price: 150,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop",
    isVeg: true
  },
];

const initialTables: Table[] = Array.from({ length: 25 }, (_, i) => ({
  id: `t${i + 1}`,
  number: `${i + 1}`,
  status: "available",
}));

export const useStore = create<CafeState>()(
  persist(
    (set) => ({
      menuItems: initialMenuItems,
      tables: initialTables,
      orders: [],
      auth: {
        role: null,
        isAuthenticated: false,
      },

      addMenuItem: (item) =>
        set((state) => ({ menuItems: [...state.menuItems, item] })),
      updateMenuItem: (id, updatedItem) =>
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === id ? { ...item, ...updatedItem } : item
          ),
        })),
      deleteMenuItem: (id) =>
        set((state) => ({
          menuItems: state.menuItems.filter((item) => item.id !== id),
        })),

      occupyTable: (number, customerName) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.number === number
              ? { ...t, status: "occupied", customerName, sessionId: Date.now().toString() }
              : t
          ),
        })),
      freeTable: (number) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.number === number
              ? { ...t, status: "available", customerName: undefined, sessionId: undefined }
              : t
          ),
          orders: state.orders.map((o) =>
            o.tableNumber === number && o.status !== "delivered"
              ? { ...o, status: "delivered" }
              : o
          )
        })),
      updateTableStatus: (number, status) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.number === number ? { ...t, status } : t
          ),
        })),

      placeOrder: (orderData) => {
        const id = "ORD" + Math.floor(Math.random() * 100000);
        set((state) => ({
          orders: [
            ...state.orders,
            { ...orderData, id, status: "pending", createdAt: Date.now(), preparingStartedAt: Date.now(), paymentCompleted: false },
          ],
        }));
        return id;
      },
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? { ...o, status, preparingStartedAt: status === "preparing" ? Date.now() : o.preparingStartedAt }
              : o
          ),
        })),
      cancelOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),
      completePayment: (orderId, tableNumber, paymentMethod, splitCash, splitUpi) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, paymentCompleted: true, paymentMethod, splitCash, splitUpi } : o
          ),
          tables: state.tables.map((t) =>
            t.number === tableNumber
              ? { ...t, status: "available", customerName: undefined, sessionId: undefined }
              : t
          ),
        })),

      login: (role) =>
        set(() => ({
          auth: {
            role,
            isAuthenticated: true,
          },
        })),
      logout: () =>
        set(() => ({
          auth: {
            role: null,
            isAuthenticated: false,
          },
        })),
    }),
    {
      name: "smartcafe-storage",
    }
  )
);
