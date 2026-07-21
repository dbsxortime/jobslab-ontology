// Local dev server — production uses nginx directly
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3009;
const PUBLIC = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".json": "application/json",
  ".png":  "image/png",
  ".svg":  "image/svg+xml",
};

const ROUTES = {
  "/":         "/index.html",
  "/mock":     "/mock.html",
  "/guide":    "/guide.html",
  "/ax-check": "/ax-check.html",
};

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = ROUTES[url.pathname] ?? url.pathname;
  if (!filePath.startsWith("/")) filePath = "/" + filePath;
  const abs = path.join(PUBLIC, filePath);

  if (!abs.startsWith(PUBLIC)) {
    res.writeHead(403); res.end(); return;
  }

  fs.readFile(abs, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    const ext = path.extname(abs);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => console.log(`ontology server :${PORT}`));
