import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Coffee, Download, ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function QRCodeDemo() {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState("1");

  const tables = Array.from({ length: 25 }, (_, i) => (i + 1).toString());

  const getQRUrl = (tableNumber: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu?table=${tableNumber}`;
  };

  const downloadQR = (tableNumber: string) => {
    const svg = document.getElementById(`qr-demo-${tableNumber}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1200;

      if (!ctx) return;

      ctx.fillStyle = "#F5E6D3";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#6F4E37";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SmartCafe", canvas.width / 2, 80);

      ctx.font = "32px sans-serif";
      ctx.fillText(`Table ${tableNumber}`, canvas.width / 2, 130);

      ctx.drawImage(img, 100, 180, 800, 800);

      ctx.font = "24px sans-serif";
      ctx.fillText("Scan to Order", canvas.width / 2, 1050);
      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#8B6F47";
      ctx.fillText("Premium Cafe Experience", canvas.width / 2, 1100);

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `SmartCafe-Table-${tableNumber}-QR.png`;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-beige via-background to-secondary py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/switch")}
            className="flex items-center gap-2 text-coffee-brown hover:bg-coffee-brown/10 rounded-lg px-3 py-2 mb-4 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Back to Roles</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Coffee className="size-10 text-coffee-brown" />
            <h1 className="text-4xl font-bold text-coffee-brown">QR Code Generator</h1>
          </div>
          <p className="text-muted-foreground">Generate unique QR codes for each table</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Table Selector */}
          <div>
            <h2 className="text-xl font-semibold text-coffee-brown mb-4">Select Table</h2>
            <div className="glass-strong rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-5 gap-3">
                {tables.map((table) => (
                  <button
                    key={table}
                    onClick={() => setSelectedTable(table)}
                    className={`aspect-square rounded-xl flex items-center justify-center font-bold text-xl border-2 transition-all ${
                      selectedTable === table
                        ? "bg-coffee-brown text-white border-coffee-brown ring-4 ring-coffee-brown/30"
                        : "bg-white/50 text-coffee-brown border-coffee-brown/20 hover:border-coffee-brown/50"
                    }`}
                  >
                    {table}
                  </button>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="font-semibold text-coffee-brown mb-3">How It Works</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="size-8 bg-coffee-brown text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-coffee-brown">Each table gets a unique QR code</p>
                    <p className="text-muted-foreground text-xs">The QR code contains the table number in the URL</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="size-8 bg-coffee-brown text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-coffee-brown">Customer scans the QR code</p>
                    <p className="text-muted-foreground text-xs">Opens the menu with table number auto-detected</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="size-8 bg-coffee-brown text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-coffee-brown">Order is linked to the table</p>
                    <p className="text-muted-foreground text-xs">Kitchen and waiters know exactly where to deliver</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          <div>
            <h2 className="text-xl font-semibold text-coffee-brown mb-4">QR Code Preview</h2>
            <motion.div
              key={selectedTable}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <Coffee className="size-10 text-coffee-brown mx-auto mb-3" />
                <h3 className="text-3xl font-bold text-coffee-brown mb-1">Table {selectedTable}</h3>
                <p className="text-sm text-muted-foreground">SmartCafe QR Code</p>
              </div>

              <div className="bg-white rounded-2xl p-8 inline-block mb-6 shadow-lg w-full flex justify-center">
                <QRCodeSVG
                  id={`qr-demo-${selectedTable}`}
                  value={getQRUrl(selectedTable)}
                  size={280}
                  level="H"
                  includeMargin={true}
                  fgColor="#6F4E37"
                />
              </div>

              <div className="mb-6 p-4 bg-white/30 rounded-xl">
                <p className="text-xs text-muted-foreground mb-2">Scan URL:</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-coffee-brown break-all flex-1">{getQRUrl(selectedTable)}</p>
                  <button
                    onClick={() => window.open(getQRUrl(selectedTable), "_blank")}
                    className="p-2 hover:bg-coffee-brown/10 rounded-lg transition-colors flex-shrink-0"
                    title="Open in new tab"
                  >
                    <ExternalLink className="size-4 text-coffee-brown" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => downloadQR(selectedTable)}
                  className="w-full py-3 bg-coffee-brown text-white rounded-xl font-semibold hover:bg-coffee-brown/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="size-5" />
                  Download QR Code
                </button>
                <button
                  onClick={() => navigate(getQRUrl(selectedTable))}
                  className="w-full py-3 bg-white/50 glass border border-coffee-brown text-coffee-brown rounded-xl font-semibold hover:bg-white/70 transition-colors"
                >
                  Test QR Code (Open Menu)
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
