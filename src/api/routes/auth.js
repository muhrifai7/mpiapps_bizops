import { Router } from "express";
import {
  register,
  login,
  changePassword,
} from "../controllers/user/auth/index.js";
import { getRole } from "../controllers/role/index.js";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.put("/change-password", changePassword);
// router.get("/", register);
router.get("/", getRole);

export default router;
