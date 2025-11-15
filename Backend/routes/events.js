const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// GET toate evenimentele
router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Eroare server." });
  }
});

// GET un singur eveniment după ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) return res.status(404).json({ message: "Eveniment negăsit" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Eroare server." });
  }
});

// POST - adaugă eveniment
router.post("/", async (req, res) => {
  const { title, date, location, description } = req.body;

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        location,
        description
      }
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Eroare la creare eveniment." });
  }
});

// PUT - actualizează eveniment
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, date, location, description } = req.body;

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        date: date ? new Date(date) : undefined,
        location,
        description
      }
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(404).json({ message: "Eveniment negăsit." });
  }
});

// DELETE - șterge eveniment
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.event.delete({
      where: { id }
    });

    res.json({ message: "Eveniment șters cu succes" });
  } catch (error) {
    res.status(404).json({ message: "Eveniment negăsit." });
  }
});

module.exports = router;
