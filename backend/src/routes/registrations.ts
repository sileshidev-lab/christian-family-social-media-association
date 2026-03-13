import { Router } from "express";
import { prisma } from "../prisma";
import { registrationSchema } from "../utils/validators";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const payload = registrationSchema.parse(req.body);
    const registration = await prisma.registration.create({
      data: {
        ...payload,
        otherPlatforms: payload.otherPlatforms ?? [],
        submittedAt: new Date()
      }
    });
    res.status(201).json(registration);
  } catch (err) {
    next(err);
  }
});

router.get("/admin", requireAuth, async (_req, res, next) => {
  try {
    const items = await prisma.registration.findMany({
      orderBy: { submittedAt: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    const item = await prisma.registration.findUnique({
      where: { id: req.params.id }
    });
    if (!item) return res.status(404).json({ error: "Not found." });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.patch("/admin/:id/status", requireAuth, async (req, res, next) => {
  try {
    const status = req.body?.status as "pending" | "approved" | "rejected";
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Missing status." });
    }
    const item = await prisma.registration.update({
      where: { id: req.params.id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: req.body?.reviewedBy ?? "admin"
      }
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.registration.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
