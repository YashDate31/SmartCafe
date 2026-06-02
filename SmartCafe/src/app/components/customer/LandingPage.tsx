import { Coffee, QrCode, Clock, Star } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: QrCode, title: "Scan & Order", description: "Each table has a unique QR code - scan to auto-detect your table number" },
    { icon: Clock, title: "Quick Service", description: "Real-time order tracking from kitchen to your table" },
    { icon: Star, title: "Premium Quality", description: "Fresh ingredients, expertly crafted daily" },
  ];

  const featuredItems = [
    { name: "Cappuccino", price: "₹180", image: "☕", badge: "Popular" },
    { name: "Croissant", price: "₹120", image: "🥐", badge: "Fresh" },
    { name: "Sandwich", price: "₹220", image: "🥪", badge: "Hot" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 md:size-8 text-coffee-brown" />
            <span className="text-lg md:text-2xl font-bold text-coffee-brown">SmartCafe</span>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="px-4 md:px-6 py-2 bg-coffee-brown text-white rounded-full hover:bg-coffee-brown/90 transition-colors text-sm md:text-base"
          >
            Order Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-coffee-brown mb-4 md:mb-6">
            Premium Cafe
            <br />
            <span className="text-neon-highlight">Ordering Made Simple</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Scan, browse, order, and enjoy. Experience seamless dining with our QR-based ordering system.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <button
              onClick={() => navigate("/menu?table=12")}
              className="px-6 md:px-8 py-3 md:py-4 bg-coffee-brown text-white rounded-full text-base md:text-lg font-semibold hover:bg-coffee-brown/90 transition-all shadow-lg hover:shadow-xl"
            >
              <QrCode className="inline-block mr-2 size-5 md:size-6" />
              Scan & Order
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="px-6 md:px-8 py-3 md:py-4 bg-white/50 glass border-2 border-coffee-brown text-coffee-brown rounded-full text-base md:text-lg font-semibold hover:bg-white/70 transition-all"
            >
              View Menu
            </button>
          </div>
        </motion.div>

        {/* QR Code Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 md:mt-16 max-w-md mx-auto px-4"
        >
          <div className="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 relative">
              <QrCode className="size-32 md:size-48 mx-auto text-coffee-brown" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-coffee-brown text-white text-xs font-semibold rounded-full">
                Table 12
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Each table has a unique QR code</p>
            <p className="text-xs text-muted-foreground">Scan to auto-detect your table and start ordering instantly</p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-coffee-brown mb-8 md:mb-12">Why SmartCafe?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-xl md:rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex items-center justify-center size-12 md:size-16 bg-coffee-brown/10 rounded-full mb-3 md:mb-4">
                <feature.icon className="size-6 md:size-8 text-coffee-brown" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-coffee-brown">{feature.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-coffee-brown mb-8 md:mb-12">Featured Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-strong rounded-xl md:rounded-2xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
              onClick={() => navigate("/menu")}
            >
              <div className="relative">
                <div className="h-40 md:h-48 bg-gradient-to-br from-secondary to-cream-beige flex items-center justify-center">
                  <span className="text-6xl md:text-8xl group-hover:scale-110 transition-transform">{item.image}</span>
                </div>
                <span className="absolute top-3 md:top-4 right-3 md:right-4 px-2 md:px-3 py-1 bg-neon-highlight text-coffee-brown text-xs md:text-sm font-semibold rounded-full">
                  {item.badge}
                </span>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-coffee-brown mb-2">{item.name}</h3>
                <p className="text-xl md:text-2xl font-bold text-neon-highlight">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-6 md:py-8 mt-12 md:mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm md:text-base">&copy; 2026 SmartCafe. Premium dining experience.</p>
        </div>
      </footer>
    </div>
  );
}
