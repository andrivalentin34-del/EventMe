const jwt = require("jsonwebtoken");

const JWT_SECRET = "super_secret_eventme_key_123";

module.exports = function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Acces interzis. Lipsă token." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalid" });
  }
};
const auth = require("./authMiddleware");

// protejează adăugarea
app.post("/api/events", auth, async (req, res) => {
  // ...
});

// protejează editarea
app.put("/api/events/:id", auth, async (req, res) => {
  // ...
});

// protejează ștergerea
app.delete("/api/events/:id", auth, async (req, res) => {
  // ...
});
