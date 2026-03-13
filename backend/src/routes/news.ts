import { Router } from "express";
import { prisma } from "../prisma";
import { newsSchema } from "../utils/validators";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.news.findMany({
      where: { status: "published" },
      orderBy: { date: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get("/admin/all", requireAuth, async (req, res, next) => {
  try {
    const status = req.query.status as string | undefined;
    const items = await prisma.news.findMany({
      where: status ? { status: status as "published" | "draft" } : undefined,
      orderBy: { date: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/admin", requireAuth, async (req, res, next) => {
  try {
    const payload = newsSchema.parse(req.body);
    const item = await prisma.news.create({
      data: {
        ...payload,
        date: payload.date ? new Date(payload.date) : new Date(),
        status: payload.status ?? "published"
      }
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    const payload = newsSchema.partial().parse(req.body);
    const item = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        ...payload,
        date: payload.date ? new Date(payload.date) : undefined
      }
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.news.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!item || item.status !== "published") {
      return res.status(404).json({ error: "Not found." });
    }
    return res.json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
