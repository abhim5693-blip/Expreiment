import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
http.createServer(async (req, res) => {
  let u = decodeURIComponent(req.url.split("?")[0]); if (u.endsWith("/")) u += "index.html"; const p = normalize(u).replace(/^[\/]+/, "");
  try { const b = await readFile(join(root, p)); res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream" }); res.end(b); }
  catch { res.writeHead(404); res.end("not found"); }
}).listen(5321, "127.0.0.1", () => console.log("http://127.0.0.1:5321"));
