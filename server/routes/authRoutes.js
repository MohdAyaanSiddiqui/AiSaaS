import express from "express";
import { Login, Logout, SignUp } from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(SignUp);
router.route("/login").post(Login);
router.route("/logout").post(Logout)
export default router;