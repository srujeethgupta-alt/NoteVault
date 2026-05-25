const express = require("express");
const {
  getNotesByUser,
  createNote,
  getNoteByIdAndUser,
  deleteNoteById,
} = require("../db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const notes = await getNotesByUser(req.user.id);
  return res.json({ notes });
});

router.post("/", authenticate, async (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const note = await createNote({
    user_id: req.user.id,
    title,
    content: content || "",
  });

  return res.status(201).json({ note });
});

router.delete("/:id", authenticate, async (req, res) => {
  const noteId = Number(req.params.id);
  const note = await getNoteByIdAndUser(noteId, req.user.id);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  await deleteNoteById(noteId);
  return res.json({ success: true });
});

module.exports = router;
