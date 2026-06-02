import { useState } from "react";
import { Save, Bell, Lock, Palette, Info } from "lucide-react";
import { motion } from "motion/react";

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    cafeName: "SmartCafe",
    taxRate: 5,
    currency: "INR",
    enableNotifications: true,
    enableSounds: true,
    autoAcceptOrders: false,
    maxTablesPerWaiter: 5,
    defaultPrepTime: 20,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-coffee-brown mb-2">Settings</h2>
        <p className="text-muted-foreground">Configure your cafe management system</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Info className="size-6 text-coffee-brown" />
            <h3 className="text-xl font-semibold text-coffee-brown">General Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-coffee-brown mb-2">Cafe Name</label>
              <input
                type="text"
                value={settings.cafeName}
                onChange={(e) => setSettings({ ...settings, cafeName: e.target.value })}
                className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-coffee-brown mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                  className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-brown mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-brown mb-2">
                Default Preparation Time (minutes)
              </label>
              <input
                type="number"
                value={settings.defaultPrepTime}
                onChange={(e) => setSettings({ ...settings, defaultPrepTime: Number(e.target.value) })}
                className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="size-6 text-coffee-brown" />
            <h3 className="text-xl font-semibold text-coffee-brown">Notifications</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/30 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-coffee-brown">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts for new orders and updates</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                className="size-6 rounded text-coffee-brown"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white/30 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-coffee-brown">Enable Sounds</p>
                <p className="text-sm text-muted-foreground">Play sound alerts for important events</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableSounds}
                onChange={(e) => setSettings({ ...settings, enableSounds: e.target.checked })}
                className="size-6 rounded text-coffee-brown"
              />
            </label>
          </div>
        </div>

        {/* Operations */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="size-6 text-coffee-brown" />
            <h3 className="text-xl font-semibold text-coffee-brown">Operations</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/30 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-coffee-brown">Auto-Accept Orders</p>
                <p className="text-sm text-muted-foreground">Automatically accept new orders without confirmation</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAcceptOrders}
                onChange={(e) => setSettings({ ...settings, autoAcceptOrders: e.target.checked })}
                className="size-6 rounded text-coffee-brown"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-coffee-brown mb-2">
                Max Tables Per Waiter
              </label>
              <input
                type="number"
                value={settings.maxTablesPerWaiter}
                onChange={(e) => setSettings({ ...settings, maxTablesPerWaiter: Number(e.target.value) })}
                className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                min="1"
                max="25"
              />
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="size-6 text-coffee-brown" />
            <h3 className="text-xl font-semibold text-coffee-brown">System Information</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-white/30 rounded-xl">
              <span className="text-muted-foreground">Version</span>
              <span className="font-semibold text-coffee-brown">1.0.0</span>
            </div>
            <div className="flex justify-between p-3 bg-white/30 rounded-xl">
              <span className="text-muted-foreground">Total Tables</span>
              <span className="font-semibold text-coffee-brown">25</span>
            </div>
            <div className="flex justify-between p-3 bg-white/30 rounded-xl">
              <span className="text-muted-foreground">System Status</span>
              <span className="font-semibold text-green-600">Online</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-coffee-brown text-white rounded-xl hover:bg-coffee-brown/90 transition-all shadow-lg"
          >
            <Save className="size-5" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
