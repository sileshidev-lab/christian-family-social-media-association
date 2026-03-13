import { Router } from "express";
import { prisma } from "../prisma";
import { mediaSchema } from "../utils/validators";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const type = req.query.type as "photo" | "video" | undefined;
    const items = await prisma.mediaItem.findMany({
      where: type ? { type } : undefined,
      orderBy: { date: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/admin", requireAuth, async (req, res, next) => {
  try {
    const payload = mediaSchema.parse(req.body);
    const item = await prisma.mediaItem.create({
      data: {
        ...payload,
        date: new Date()
      }
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    const payload = mediaSchema.partial().parse(req.body);
    const item = await prisma.mediaItem.update({
      where: { id: req.params.id },
      data: payload
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.mediaItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
