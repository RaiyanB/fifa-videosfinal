const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');

// Utility: Safely load users from file
function loadUsers() {
  try {
    const data = fs.readFileSync(usersPath);
    return data.length ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read users.json:', err);
    return [];
  }
}

// GET /auth/register
exports.getRegister = (req, res) => {
  res.render('register', { error: null });
};

// POST /auth/register
exports.postRegister = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.render('register', { error: 'All fields are required' });
  }

  const users = loadUsers();
  const existingUser = users.find(u => u.email.trim() === email.trim());

  if (existingUser) {
    return res.render('register', { error: 'Email already registered' });
  }

  users.push({ name, email: email.trim(), password: password.trim() });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  req.session.message = 'Account created successfully. Please log in.';
  res.redirect('/auth/login');
};

// GET /auth/login
exports.getLogin = (req, res) => {
  const message = req.session.message;
  delete req.session.message;

  res.render('login', {
    error: null,
    message
  });
};

// POST /auth/login
exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please enter both email and password' });
  }

  const users = loadUsers();
  const user = users.find(
    u => u.email.trim() === email.trim() && u.password.trim() === password.trim()
  );

  if (!user) {
    return res.render('login', { error: 'Incorrect credentials' });
  }

  req.session.user = user;
  res.redirect('/video/dashboard/all');
};
