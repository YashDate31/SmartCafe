import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Plus, Minus, Trash2, Clock, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "../../store";

export function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart: initialCart = {}, menuItems = [], tableNumber = null } = location.state || {};
  const { placeOrder } = useStore();

  const [cart, setCart] = useState<Record<string, number>>(initialCart);
  const [customerName, setCustomerName] = useState("");

  const cartItems = Object.entries(cart).map(([itemId, quantity]) => {
    const item = menuItems.find((i: any) => i.id === itemId);
    return { ...item, quantity };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const newQuantity = (newCart[itemId] || 0) + delta;
      if (newQuantity <= 0) {
        delete newCart[itemId];
      } else {
        newCart[itemId] = newQuantity;
      }
      return newCart;
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });
  };

  const placeOrderHandler = () => {
    if (!customerName.trim()) {
      alert("Please enter your name to place the order");
      return;
    }

    const orderId = placeOrder({
      tableNumber: tableNumber || "0",
      customerName: customerName.trim(),
      items: cartItems as any,
      total,
    });

    navigate(`/order-tracking?table=${tableNumber || "0"}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-3 bg-coffee-brown text-white rounded-full hover:bg-coffee-brown/90"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary pb-24 md:pb-8">
      {/* Header */}
      <div className="glass sticky top-0 z-40 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => navigate(-1)} className="text-coffee-brown hover:bg-coffee-brown/10 rounded-full p-2">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-coffee-brown">Your Cart</h1>
          </div>
          {tableNumber && (
            <div className="ml-14">
              <span className="text-sm text-muted-foreground">Table: </span>
              <span className="font-semibold text-coffee-brown">{tableNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-2xl">
        {/* Cart Items */}
        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-strong rounded-xl md:rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4"
            >
              <div className="size-16 md:size-20 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base text-coffee-brown mb-1 truncate">{item.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1 md:line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm md:text-base text-coffee-brown">₹{item.price}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-coffee-brown rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-white hover:scale-110 transition-transform">
                        <Minus className="size-4" />
                      </button>
                      <span className="text-white font-semibold min-w-[20px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-white hover:scale-110 transition-transform">
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-destructive hover:bg-destructive/10 rounded-full p-2">
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Customer Name */}
        <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="font-semibold text-lg text-coffee-brown mb-4">Your Name</h2>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2.5 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
          />
          <p className="text-xs text-muted-foreground mt-2">Your name helps staff identify your order</p>
        </div>

        {/* Order Summary */}
        <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="font-semibold text-lg text-coffee-brown mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span className="font-semibold">₹{tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex justify-between">
              <span className="font-semibold text-coffee-brown">Total</span>
              <span className="font-bold text-xl text-coffee-brown">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>Estimated preparation time: 5 minutes</span>
          </div>

          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">
              <ShoppingBag className="size-4 inline mr-1" />
              Payment will be collected at the counter after delivery (Cash / UPI / Split)
            </p>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={placeOrderHandler}
          className="w-full py-3 md:py-4 bg-coffee-brown text-white rounded-full font-semibold text-base md:text-lg hover:bg-coffee-brown/90 transition-all shadow-lg hover:shadow-xl"
        >
          Place Order — ₹{total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
