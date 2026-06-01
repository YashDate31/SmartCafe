import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();
const api = new Hono();

// Enable middlewares on the main app
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

// Supabase client instantiation inside the Edge Function
const getSupabaseClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Health check
api.get("/health", (c) => c.json({ status: "ok" }));

// 1. Menu Endpoints
api.get("/api/menu", async (c) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("menu_items").select("*").order("name");
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

api.post("/api/menu", async (c) => {
  const supabase = getSupabaseClient();
  const body = await c.req.json();
  const { data, error } = await supabase.from("menu_items").insert(body).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

api.put("/api/menu/:id", async (c) => {
  const supabase = getSupabaseClient();
  const id = c.req.param("id");
  const body = await c.req.json();
  const { data, error } = await supabase.from("menu_items").update(body).eq("id", id).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

api.delete("/api/menu/:id", async (c) => {
  const supabase = getSupabaseClient();
  const id = c.req.param("id");
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

// 2. Table Endpoints
api.get("/api/tables", async (c) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("tables").select("*").order("number");
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

api.post("/api/tables/occupy", async (c) => {
  const supabase = getSupabaseClient();
  const { number, customerName } = await c.req.json();
  const { data, error } = await supabase.from("tables")
    .update({ status: "occupied", customer_name: customerName, session_id: Date.now().toString() })
    .eq("number", number)
    .select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

api.post("/api/tables/free", async (c) => {
  const supabase = getSupabaseClient();
  const { number } = await c.req.json();
  const { data, error } = await supabase.from("tables")
    .update({ status: "available", customer_name: null, session_id: null })
    .eq("number", number)
    .select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

api.post("/api/tables/status", async (c) => {
  const supabase = getSupabaseClient();
  const { number, status } = await c.req.json();
  const { data, error } = await supabase.from("tables").update({ status }).eq("number", number).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// 3. Order Endpoints
api.post("/api/orders", async (c) => {
  const supabase = getSupabaseClient();
  const { tableNumber, customerName, customerMobile, total, items, paymentMethod } = await c.req.json();
  const orderId = "ORD" + Math.floor(Math.random() * 100000);

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    table_number: tableNumber,
    customer_name: customerName,
    customer_mobile: customerMobile,
    total,
    payment_method: paymentMethod,
    status: 'pending',
  });
  if (orderError) return c.json({ error: orderError.message }, 500);

  const orderItemsData = items.map((item: any) => ({
    order_id: orderId,
    menu_item_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));
  const { error: itemsError } = await supabase.from("order_items").insert(orderItemsData);
  if (itemsError) return c.json({ error: itemsError.message }, 500);

  return c.json({ orderId });
});

api.get("/api/orders", async (c) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

api.patch("/api/orders/:id/status", async (c) => {
  const supabase = getSupabaseClient();
  const id = c.req.param("id");
  const { status } = await c.req.json();
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

api.delete("/api/orders/:id", async (c) => {
  const supabase = getSupabaseClient();
  const id = c.req.param("id");
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

api.post("/api/orders/:id/pay", async (c) => {
  const supabase = getSupabaseClient();
  const id = c.req.param("id");
  const { tableNumber } = await c.req.json();

  await supabase.from("orders").update({ payment_completed: true }).eq("id", id);
  await supabase.from("tables").update({ status: "available", customer_name: null, session_id: null }).eq("number", tableNumber);

  return c.json({ status: "success" });
});

// Mount the API sub-app under different potential path prefixes
app.route("/functions/v1/server", api);
app.route("/server", api);
app.route("/", api);

Deno.serve(app.fetch);
