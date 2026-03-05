import { CorsOptions } from "cors";

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

export const corsConfig: CorsOptions = {
  origin: corsOrigin,
  credentials: true,
};
