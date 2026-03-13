import { Router } from "express";
import { prisma } from "../prisma";
import { contactSchema } from "../utils/validators";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const payload = contactSchema.parse(req.body);
    const message = await prisma.contactMessage.create({
      data: { ...payload, createdAt: new Date() }
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

router.get("/admin", requireAuth, async (_req, res, next) => {
  try {
    const items = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.patch("/admin/:id/read", requireAuth, async (req, res, next) => {
  try {
    const raw = req.body?.isRead;
    const isRead = raw === true || raw === "true";
    const item = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead }
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
