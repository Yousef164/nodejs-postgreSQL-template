import express from "express";

import authvalidation from "./auth.validation.js";
import authController from "./auth.controller.js";
import validationHandler from "../../middlewares/validationHandler.js";

const router = express.Router();

router
  .post("/signup", authvalidation, validationHandler, authController.signup)
  .post("/login", authController.login)
  .get("/verify-email", authController.verifyEmail);

export default router;
