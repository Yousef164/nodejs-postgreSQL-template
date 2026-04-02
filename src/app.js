import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import errorHandler from "./middlewares/errorHandler.js";
import authRoute from "./modules/auth/auth.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = YAML.load(join(__dirname, "../openapi.yaml"));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

app.use(errorHandler);

export default app;
