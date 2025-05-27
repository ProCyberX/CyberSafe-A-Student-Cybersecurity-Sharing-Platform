require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const { JWT_SECRET, MONGODB_URI, PORT } = process.env;

// --- Mongoose setup ---
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --- Schemas & Models ---

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'user' }
});
const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  username: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

const resourceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  username: String,
  link: String,
  createdAt: { type: Date, default: Date.now }
});
const Resource = mongoose.model('Resource', resourceSchema);

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// JWT check
function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.sendStatus(401);
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload; // { userId, username, role }
    next();
  });
}

// --- Routes ---

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash });
    await user.save();
    res.status(201).json({ message: 'Registered' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, username: user.username, role: user.role });
});

// Create a forum post
app.post('/posts', authenticateToken, async (req, res) => {
  const { text } = req.body;
  const post = new Post({
    userId: req.user.userId,
    username: req.user.username,
    text
  });
  await post.save();
  res.status(201).json(post);
});

// List all posts
app.get('/posts', authenticateToken, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Create a resource link
app.post('/resources', authenticateToken, async (req, res) => {
  const { link } = req.body;
  const resource = new Resource({
    userId: req.user.userId,
    username: req.user.username,
    link
  });
  await resource.save();
  res.status(201).json(resource);
});

// List all resources
app.get('/resources', authenticateToken, async (req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.json(resources);
});

// Start
const port = PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});