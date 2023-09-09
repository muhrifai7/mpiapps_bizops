import { Router } from "express";
import { getRole } from "../controllers/role/index.js";
const router = Router();
router.get("/", getRole);

export default router;
