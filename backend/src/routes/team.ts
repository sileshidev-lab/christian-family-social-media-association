import { Router } from "express";
import { prisma } from "../prisma";
import { teamSchema } from "../utils/validators";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.teamMember.findMany({
      orderBy: { order: "asc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/admin", requireAuth, async (req, res, next) => {
  try {
    const payload = teamSchema.parse(req.body);
    const item = await prisma.teamMember.create({ data: payload });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    const payload = teamSchema.partial().parse(req.body);
    const item = await prisma.teamMember.update({
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
    await prisma.teamMember.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
