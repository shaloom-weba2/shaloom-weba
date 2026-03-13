import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.resolve(process.cwd(), "data.json");

async function readData() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const data = await readData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/data", async (req, res) => {
    try {
      // Simple auth check for demo (in real app use JWT)
      const authHeader = req.headers.authorization;
      if (authHeader !== "Bearer cyber-secret-token") {
        return res.status(401).json({ error: "Unauthorized" });
      }
      await writeData(req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to write data" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = await readData();
      const newMessage = {
        id: Date.now().toString(),
        ...req.body,
        date: new Date().toISOString(),
      };
      data.messages.push(newMessage);
      await writeData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
