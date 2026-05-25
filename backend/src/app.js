const path = require("path");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const healthRoutes = require("./routes/health");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/health", healthRoutes);

if (process.env.NODE_ENV === "production") {
  console.log("__dirname:", __dirname);
  console.log("dist path:", path.join(__dirname, "../../frontend/dist"));
  // Serve frontend build when present. __dirname is backend/src, so
  // ../../frontend/dist resolves to <repo-root>/frontend/dist
  const distPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

module.exports = app;
