const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

/*───────────────────────────────
   HELPER: geocodare locație
────────────────────────────────*/
async function geocodeLocation(location) {
  if (!location) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    location
  )}&addressdetails=1&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "EventMe/1.0 (contact: admin@example.com)"
      }
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.log("⚠️ Nominatim nu a găsit locația.");
      return null;
    }

    const item = data[0];
    const addr = item.address || {};

    return {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      city:
        addr.city ||
        addr.town ||
        addr.village ||
        addr.county ||
        item.display_name.split(",")[0] ||
        null,
      country: addr.country || null
    };

  } catch (err) {
    console.error("❌ GEO ERROR:", err);
    return null;
  }
}

/*───────────────────────────────
   HELPER: Haversine distance
────────────────────────────────*/
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/*───────────────────────────────
   RUTE API EVENIMENTE
────────────────────────────────*/

// Test
app.get("/", (req, res) => {
  res.send("Serverul EventMe funcționează ✅");
});

// GET evenimente (cu filtrare după categorie)
app.get("/api/events", async (req, res) => {
  try {
    const { userLat, userLon, category } = req.query;

    const where = {};
    if (category) where.category = category;

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "asc" }
    });

    if (userLat && userLon) {
      const lat = parseFloat(userLat);
      const lon = parseFloat(userLon);

      return res.json(
        events.map(ev => ({
          ...ev,
          distance: ev.lat && ev.lon ? calculateDistance(lat, lon, ev.lat, ev.lon) : null
        }))
      );
    }

    res.json(events);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la încărcarea evenimentelor" });
  }
});

// GET un singur eveniment
app.get("/api/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) return res.status(404).json({ error: "Eveniment negăsit" });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la încărcarea evenimentului" });
  }
});

// POST — adăugare eveniment
app.post("/api/events", upload.single('image'), async (req, res) => {
  console.log("Received request to add event");
  console.log("Body:", req.body);
  console.log("File:", req.file);
  try {
    const { title, date, location, description, category, details } = req.body;
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    const geo = await geocodeLocation(location);

    const newEvent = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        location,
        description,
        category: category || null,
        details,
        imageUrl,
        lat: geo?.lat || null,
        lon: geo?.lon || null,
        city: geo?.city || null,
        country: geo?.country || null
      }
    });

    res.status(201).json(newEvent);

  } catch (err) {
    console.error("ERR ADD:", err);
    res.status(500).json({ error: "Eroare la adăugarea evenimentului" });
  }
});

// PUT — editare eveniment
app.put("/api/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, date, location, description, category, details } = req.body;

    const dataToUpdate = {
      title,
      date: new Date(date),
      description,
      category,
      details
    };

    if (location) {
      const geo = await geocodeLocation(location);

      dataToUpdate.location = location;
      dataToUpdate.lat = geo?.lat || null;
      dataToUpdate.lon = geo?.lon || null;
      dataToUpdate.city = geo?.city || null;
      dataToUpdate.country = geo?.country || null;
    }

    const updated = await prisma.event.update({
      where: { id },
      data: dataToUpdate
    });

    res.json(updated);

  } catch (err) {
    console.error("ERR EDIT:", err);
    res.status(500).json({ error: "Eroare la editarea evenimentului" });
  }
});

// DELETE eveniment
app.delete("/api/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.event.delete({ where: { id } });

    res.json({ message: "Eveniment șters cu succes" });

  } catch (err) {
    console.error("ERR DELETE:", err);
    res.status(500).json({ error: "Eroare la ștergerea evenimentului" });
  }
});

/*───────────────────────────────
   AUTENTIFICARE ADMIN
────────────────────────────────*/

const JWT_SECRET = "super_secret_eventme_key_123";

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "User inexistent" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Parolă greșită" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la autentificare" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword }
    });

    res.json(user);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Eroare la crearea utilizatorului" });
  }
});

/*───────────────────────────────
   PORNIRE SERVER
────────────────────────────────*/
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server pornit pe http://localhost:${PORT}`);
});