import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { env } from "../env";
import { hashPassword, verifyPassword } from "../utils/password";
import { adminLoginSchema, adminSetupSchema } from "../utils/validators";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/status", async (_req, res, next) => {
  try {
    const count = await prisma.adminUser.count();
    res.json({ hasAdmin: count > 0 });
  } catch (err) {
    next(err);
  }
});

router.post("/setup", async (req, res, next) => {
  try {
    const existing = await prisma.adminUser.count();
    if (existing > 0) {
      return res.status(409).json({ error: "Admin already exists." });
    }
    const payload = adminSetupSchema.parse(req.body);
    const passwordHash = await hashPassword(payload.password);
    const admin = await prisma.adminUser.create({
      data: { email: payload.email.toLowerCase(), passwordHash }
    });
    return res.status(201).json({ id: admin.id, email: admin.email });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = adminLoginSchema.parse(req.body);
    const admin = await prisma.adminUser.findUnique({
      where: { email: payload.email.toLowerCase() }
    });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const ok = await verifyPassword(payload.password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign(
      { sub: admin.id, email: admin.email },
      env.jwtSecret,
      { expiresIn: "24h" }
    );
    return res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    return next(err);
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  return res.json({ id: req.adminId, email: req.adminEmail });
});

export default router;
