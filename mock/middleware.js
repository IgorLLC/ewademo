module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/api/login') {
    const { email, password } = req.body;
    
    // Simple mock authentication
    const db = require('./db.json');
    const user = db.users.find(u => u.email === email);
    
    if (user) {
      res.status(200).json({
        token: 'mock-jwt-token-' + Date.now(),
        user
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
    return;
  }
  
  if (req.method === 'POST' && req.path === '/api/logout') {
    res.status(200).json({ success: true });
    return;
  }
  
  next();
}
