const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  getUserByEmail,
  getUserById,
  createUser,
} = require("../db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "supersecret_change_in_production_123";

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await getUserByEmail(normalizedEmail);

  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hashed = bcrypt.hashSync(password, 12);
  const user = await createUser({
    name,
    email: normalizedEmail,
    password: hashed,
  });

  const token = jwt.sign(
    { id: user.id, email: normalizedEmail, name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(201).json({
    token,
    user: { id: user.id, name, email: normalizedEmail },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await getUserByEmail(normalizedEmail);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

router.get("/me", authenticate, async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ user: {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  } });
});

module.exports = router;
