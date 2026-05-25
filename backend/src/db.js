const fs = require("fs");
const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const filePath = path.join(__dirname, "../app.json");
const adapter = new JSONFile(filePath);
const db = new Low(adapter);

async function initDb() {
  await db.read();
  if (!db.data) {
    db.data = {
      users: [],
      notes: [],
      lastUserId: 0,
      lastNoteId: 0,
    };
    await db.write();
  }
}

initDb().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});

async function getUserByEmail(email) {
  await db.read();
  return db.data.users.find((user) => user.email === email);
}

async function getUserById(id) {
  await db.read();
  return db.data.users.find((user) => user.id === id);
}

async function createUser({ name, email, password }) {
  await db.read();
  const id = ++db.data.lastUserId;
  const user = {
    id,
    name,
    email,
    password,
    created_at: new Date().toISOString(),
  };
  db.data.users.push(user);
  await db.write();
  return user;
}

async function createNote({ user_id, title, content }) {
  await db.read();
  const id = ++db.data.lastNoteId;
  const note = {
    id,
    user_id,
    title,
    content: content || "",
    created_at: new Date().toISOString(),
  };
  db.data.notes.push(note);
  await db.write();
  return note;
}

async function getNotesByUser(user_id) {
  await db.read();
  return db.data.notes
    .filter((note) => note.user_id === user_id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function getNoteByIdAndUser(id, user_id) {
  await db.read();
  return db.data.notes.find(
    (note) => note.id === id && note.user_id === user_id
  );
}

async function deleteNoteById(id) {
  await db.read();
  const index = db.data.notes.findIndex((note) => note.id === id);
  if (index === -1) {
    return false;
  }
  db.data.notes.splice(index, 1);
  await db.write();
  return true;
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  createNote,
  getNotesByUser,
  getNoteByIdAndUser,
  deleteNoteById,
};
