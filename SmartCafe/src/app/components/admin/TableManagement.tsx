import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Printer, Grid3x3, Coffee } from "lucide-react";
import { motion } from "motion/react";
import { useStore, TableStatus } from "../../store";

export function TableManagement() {
  const { tables, orders } = useStore();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const getQRUrl = (tableNumber: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/table/${tableNumber}`;
  };

  const downloadQR = (tableNumber: string) => {
    const svg = document.getElementById(`qr-${tableNumber}`);
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

  const printQR = (tableNumber: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const qrUrl = getQRUrl(tableNumber);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SmartCafe - Table ${tableNumber} QR Code</title>
          <style>
            @page { size: A4; margin: 2cm; }
            body {
              font-family: sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #F5E6D3;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: white;
              border-radius: 20px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            h1 {
              color: #6F4E37;
              font-size: 48px;
              margin-bottom: 10px;
            }
            h2 {
              color: #8B6F47;
              font-size: 36px;
              margin-bottom: 30px;
            }
            .qr-container {
              padding: 20px;
              background: white;
              border: 3px solid #6F4E37;
              border-radius: 15px;
              display: inline-block;
              margin: 20px 0;
            }
            p {
              color: #6F4E37;
              font-size: 24px;
              margin-top: 20px;
            }
            .url {
              color: #8B6F47;
              font-size: 14px;
              margin-top: 10px;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>☕ SmartCafe</h1>
            <h2>Table ${tableNumber}</h2>
            <div class="qr-container">
              ${document.getElementById(`qr-${tableNumber}`)?.outerHTML || ""}
            </div>
            <p>Scan to Order</p>
            <p class="url">${qrUrl}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const downloadAllQRs = () => {
    tables.forEach((table, index) => {
      setTimeout(() => {
        downloadQR(table.number);
      }, index * 500);
    });
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-300";
      case "occupied":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "cleaning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const getTableOrders = (tableNumber: string) => {
    return orders.filter((o) => o.tableNumber === tableNumber && o.status !== "delivered");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coffee-brown mb-2">Table Management</h1>
          <p className="text-muted-foreground">Generate and manage QR codes for each table</p>
        </div>
        <button
          onClick={downloadAllQRs}
          className="px-6 py-3 bg-coffee-brown text-white rounded-xl font-semibold hover:bg-coffee-brown/90 transition-colors flex items-center gap-2"
        >
          <Download className="size-5" />
          Download All QR Codes
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Table List */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-coffee-brown mb-4">All Tables</h2>
          <div className="grid grid-cols-5 gap-3">
            {tables.map((table) => {
              const tableOrders = getTableOrders(table.number);
              return (
                <button
                  key={table.number}
                  onClick={() => setSelectedTable(table.number)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center font-bold text-lg border-2 transition-all ${
                    selectedTable === table.number
                      ? "ring-4 ring-coffee-brown border-coffee-brown bg-coffee-brown text-white"
                      : getStatusColor(table.status)
                  }`}
                >
                  <span className="text-2xl">{table.number}</span>
                  {tableOrders.length > 0 && (
                    <span className="text-xs mt-1 opacity-70">{tableOrders[0].id}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="glass-strong rounded-xl p-4 mt-4">
            <h3 className="font-semibold text-coffee-brown mb-3">Status Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-4 bg-green-100 border-2 border-green-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                <span>Cleaning</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="glass-strong rounded-2xl p-8">
          {selectedTable ? (
            <motion.div
              key={selectedTable}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-6">
                <Coffee className="size-12 text-coffee-brown mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-coffee-brown mb-1">Table {selectedTable}</h2>
                <p className="text-sm text-muted-foreground">QR Code</p>
              </div>

              <div className="bg-white rounded-2xl p-8 inline-block mb-6 shadow-lg">
                <QRCodeSVG
                  id={`qr-${selectedTable}`}
                  value={getQRUrl(selectedTable)}
                  size={280}
                  level="H"
                  includeMargin={true}
                  fgColor="#6F4E37"
                />
              </div>

              <div className="mb-6 p-4 bg-white/30 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Scan URL:</p>
                <p className="text-sm font-mono text-coffee-brown break-all">{getQRUrl(selectedTable)}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => downloadQR(selectedTable)}
                  className="flex-1 py-3 bg-coffee-brown text-white rounded-xl font-semibold hover:bg-coffee-brown/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="size-5" />
                  Download PNG
                </button>
                <button
                  onClick={() => printQR(selectedTable)}
                  className="flex-1 py-3 bg-white/50 glass border border-coffee-brown text-coffee-brown rounded-xl font-semibold hover:bg-white/70 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="size-5" />
                  Print
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Grid3x3 className="size-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a table to view its QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
