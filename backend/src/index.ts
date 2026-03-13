import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./env";
import { errorHandler } from "./middleware/error";
import authRouter from "./routes/auth";
import newsRouter from "./routes/news";
import registrationsRouter from "./routes/registrations";
import messagesRouter from "./routes/messages";
import teamRouter from "./routes/team";
import mediaRouter from "./routes/media";
import uploadsRouter from "./routes/uploads";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin,
    credentials: env.corsOrigin !== "*"
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/admin", authRouter);
app.use("/api/news", newsRouter);
app.use("/api/registrations", registrationsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/team", teamRouter);
app.use("/api/media", mediaRouter);
app.use("/api/uploads", uploadsRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`CFSMCCA backend running on ${env.baseUrl}`);
});
