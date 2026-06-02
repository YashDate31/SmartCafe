import { useState } from "react";
import { Search, ShoppingCart, Plus, Minus, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router";
import { useStore } from "../../store";

export function MenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || null;
  const { menuItems } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showStaffMenu, setShowStaffMenu] = useState(false);

  // Get dynamic categories from menu items
  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const cartItemsCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [itemId, count]) => {
    const item = menuItems.find((i) => i.id === itemId);
    return sum + (item?.price || 0) * count;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary pb-24">
      {/* Welcome Banner for QR Scan */}
      {tableNumber && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong border-b border-coffee-brown/30 py-3 text-center"
        >
          <p className="text-sm">
            <span className="text-muted-foreground">Welcome to</span>{" "}
            <span className="font-semibold text-coffee-brown">Table {tableNumber}</span>
            <span className="text-muted-foreground"> • Browse and order from our menu below</span>
          </p>
        </motion.div>
      )}

      {/* Header */}
      <div className="glass sticky top-0 z-40 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <button
                onClick={() => setShowStaffMenu(!showStaffMenu)}
                className="flex items-center gap-2 hover:bg-coffee-brown/5 rounded-lg px-2 py-1 transition-colors"
              >
                <Coffee className="size-6 text-coffee-brown" />
                <span className="text-xl font-bold text-coffee-brown">SmartCafe</span>
              </button>

              <AnimatePresence>
                {showStaffMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full left-0 mt-2 glass-strong rounded-xl shadow-2xl p-2 min-w-[150px] z-50"
                  >
                    <button
                      onClick={() => {
                        setShowStaffMenu(false);
                        navigate("/staff-login");
                      }}
                      className="w-full px-4 py-2 text-left text-coffee-brown hover:bg-coffee-brown/10 rounded-lg transition-colors font-medium"
                    >
                      Staff Login
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {tableNumber && (
              <div className="px-4 py-2 glass-strong rounded-full border-2 border-coffee-brown">
                <span className="text-sm text-muted-foreground">Table: </span>
                <span className="text-xl font-bold text-coffee-brown">{tableNumber}</span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-strong rounded-full focus:outline-none focus:ring-2 focus:ring-coffee-brown"
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-[140px] z-30 glass border-b border-border/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-coffee-brown text-white shadow-lg"
                    : "bg-white/50 glass text-coffee-brown hover:bg-white/70"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-strong rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {item.popular && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-neon-highlight text-coffee-brown text-xs font-semibold rounded-full shadow-lg">
                    Popular
                  </span>
                )}
                <span
                  className={`absolute top-3 left-3 size-6 rounded-full border-2 ${
                    item.isVeg ? "border-green-600" : "border-red-600"
                  } flex items-center justify-center bg-white shadow-lg`}
                >
                  <span className={`size-3 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`}></span>
                </span>
              </div>

              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-sm md:text-lg text-coffee-brown mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-xl font-bold text-coffee-brown">₹{item.price}</span>
                  {cart[item.id] ? (
                    <div className="flex items-center gap-1 md:gap-2 bg-coffee-brown rounded-full px-2 md:px-3 py-1">
                      <button onClick={() => removeFromCart(item.id)} className="text-white hover:scale-110 transition-transform">
                        <Minus className="size-3 md:size-4" />
                      </button>
                      <span className="text-white font-semibold min-w-[16px] md:min-w-[20px] text-center text-sm md:text-base">{cart[item.id]}</span>
                      <button onClick={() => addToCart(item.id)} className="text-white hover:scale-110 transition-transform">
                        <Plus className="size-3 md:size-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="px-2 md:px-4 py-1.5 md:py-2 bg-coffee-brown text-white rounded-full hover:bg-coffee-brown/90 transition-colors flex items-center gap-1 text-xs md:text-sm"
                    >
                      <Plus className="size-3 md:size-4" />
                      <span className="hidden sm:inline">Add</span>
                      <span className="sm:hidden">+</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartItemsCount > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => navigate("/cart", { state: { cart, menuItems, tableNumber } })}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-coffee-brown text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center gap-4 z-50"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              <span className="font-semibold">{cartItemsCount} items</span>
            </div>
            <div className="h-6 w-px bg-white/30"></div>
            <span className="font-bold">₹{cartTotal}</span>
            <span className="text-sm">View Cart →</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
