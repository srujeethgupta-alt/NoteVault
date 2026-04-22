const express = require("express");
const db = require("../db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/", authenticate, (req, res) => {
  const notes = db
    .prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.id);

  return res.json({ notes });
});

router.post("/", authenticate, (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const result = db
    .prepare("INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)")
    .run(req.user.id, title, content || "");

  const note = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(result.lastInsertRowid);

  return res.status(201).json({ note });
});

router.delete("/:id", authenticate, (req, res) => {
  const note = db
    .prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.id);
  return res.json({ success: true });
});

module.exports = router;
