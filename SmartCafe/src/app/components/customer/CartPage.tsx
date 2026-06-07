import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Plus, Minus, Trash2, Clock, CreditCard, Wallet, Check } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "../../store";

export function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart: initialCart = {}, menuItems = [], tableNumber = null } = location.state || {};
  const { placeOrder, tables, settings } = useStore();

  const [cart, setCart] = useState<Record<string, number>>(initialCart);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cash">("razorpay");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false); // prevents double-submit

  const cartItems = Object.entries(cart).map(([itemId, quantity]) => {
    const item = menuItems.find((i: any) => i.id === itemId);
    return { ...item, quantity };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const taxRate = settings?.taxRate ?? 5;
  const tax = subtotal * (taxRate / 100);
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

  const sendOtp = () => {
    if (!customerName.trim() || !mobileNumber.trim()) {
      alert("Please enter your name and mobile number");
      return;
    }
    if (mobileNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    // Generate a 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);

    // In production, this would send SMS via API
    alert(`OTP sent to ${mobileNumber}: ${newOtp}\n\n(For demo purposes, OTP is shown here)`);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      alert("Mobile number verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
      setOtp("");
    }
  };

  const placeOrderHandler = async () => {
    // Prevent double-submit
    if (isPlacing) return;

    // Check if cash payment and verification required
    if (paymentMethod === "cash" && !otpVerified) {
      alert("Please verify your mobile number first");
      return;
    }

    setIsPlacing(true);
    const table = tables.find(t => t.number === tableNumber);
    const finalCustomerName = paymentMethod === "cash" ? customerName : (table?.customerName || "Guest");

    try {
      const orderId = await placeOrder({
        tableNumber: tableNumber || "0",
        customerName: finalCustomerName,
        items: cartItems as any,
        total,
        paymentMethod,
        customerMobile: paymentMethod === "cash" ? mobileNumber : undefined,
        paymentCompleted: paymentMethod === "razorpay",
      });

      navigate("/order-tracking", {
        state: {
          orderId,
          items: cartItems,
          total,
          paymentMethod,
          tableNumber,
          customerMobile: paymentMethod === "cash" ? mobileNumber : undefined,
        },
      });
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order: " + (err instanceof Error ? err.message : String(err)));
      setIsPlacing(false); // re-enable only on error so user can retry
    }
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
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base text-coffee-brown mb-1 truncate">{item.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1 md:line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm md:text-base text-coffee-brown">₹{item.price}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-coffee-brown rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-white hover:scale-110 transition-transform"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="text-white font-semibold min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-white hover:scale-110 transition-transform"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:bg-destructive/10 rounded-full p-2"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
              <span className="text-muted-foreground">Tax ({taxRate}%)</span>
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
            <span>Estimated preparation time: {settings?.defaultPrepTime ?? 20} minutes</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="font-semibold text-lg text-coffee-brown mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                paymentMethod === "razorpay" ? "bg-coffee-brown/10 border-2 border-coffee-brown" : "bg-white/30 border border-border"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value as any);
                  setOtpSent(false);
                  setOtpVerified(false);
                  setOtp("");
                }}
                className="size-4 text-coffee-brown"
              />
              <CreditCard className="size-5 text-coffee-brown" />
              <span className="font-medium">Online Payment (UPI / Card)</span>
            </label>
            <label
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                paymentMethod === "cash" ? "bg-coffee-brown/10 border-2 border-coffee-brown" : "bg-white/30 border border-border"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="size-4 text-coffee-brown"
              />
              <Wallet className="size-5 text-coffee-brown" />
              <span className="font-medium">Pay at Counter</span>
            </label>
          </div>

          {/* Cash Payment Details */}
          {paymentMethod === "cash" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4 border-t border-border pt-4"
            >
              <div>
                <label className="block text-sm font-medium text-coffee-brown mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                  required
                  disabled={otpVerified}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-brown mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) setMobileNumber(value);
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-2.5 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                  required
                  disabled={otpVerified}
                />
              </div>

              {!otpSent && !otpVerified && (
                <button
                  onClick={sendOtp}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Send OTP
                </button>
              )}

              {otpSent && !otpVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-coffee-brown mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 6) setOtp(value);
                      }}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-2.5 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown text-center tracking-widest font-mono text-lg"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={verifyOtp}
                      className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      Verify OTP
                    </button>
                    <button
                      onClick={sendOtp}
                      className="px-4 py-2.5 glass-strong rounded-xl hover:bg-white/50 transition-all text-sm"
                    >
                      Resend
                    </button>
                  </div>
                </motion.div>
              )}

              {otpVerified && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-100 border border-green-200 rounded-xl flex items-center gap-3"
                >
                  <div className="size-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Verified Successfully</p>
                    <p className="text-sm text-green-700">Mobile: {mobileNumber}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Place Order Button */}
        <button
          onClick={placeOrderHandler}
          disabled={isPlacing}
          className={`w-full py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all shadow-lg ${
            isPlacing
              ? "bg-coffee-brown/50 text-white cursor-not-allowed"
              : "bg-coffee-brown text-white hover:bg-coffee-brown/90 hover:shadow-xl"
          }`}
        >
          {isPlacing ? "Placing Order..." : `Place Order - ₹${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
