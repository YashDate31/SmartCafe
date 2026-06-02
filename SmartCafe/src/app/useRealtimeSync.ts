import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useStore } from "./store";

/**
 * useRealtimeSync
 * Subscribes to Supabase Realtime changes for the `orders` and `tables` tables.
 * When any INSERT/UPDATE/DELETE happens, it refreshes local Zustand state so that
 * all open tabs/devices (Kitchen, Waiter, Customer, Cashier) stay in sync
 * without requiring a page refresh.
 */
export function useRealtimeSync() {
  const fetchOrders = useStore((s) => s.fetchOrders);
  const fetchTables = useStore((s) => s.fetchTables);
  const fetchMenu   = useStore((s) => s.fetchMenu);

  useEffect(() => {
    // Initial load
    fetchMenu();
    fetchTables();
    fetchOrders();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("smartcafe-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tables" },
        () => fetchTables()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => fetchMenu()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
