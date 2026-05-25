const fs = require("fs");
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
  const distPath = path.join(__dirname, "../../frontend/dist");
  const indexHtml = path.join(distPath, "index.html");

  if (fs.existsSync(indexHtml)) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(indexHtml);
    });
  } else {
    app.get("/", (req, res) => {
      res.json({
        status: "NoteVault backend only",
        message: "Frontend build not found. Use /api/auth, /api/notes, and /api/health.",
      });
    });
  }
} else {
  app.get("/", (req, res) => {
    res.json({
      status: "NoteVault backend",
      message: "Backend is running. In development, start the frontend separately.",
    });
  });
}

module.exports = app;
