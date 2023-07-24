import { Router } from "express";
import { getOutlet } from "../controllers/outlet/index.js";
const router = Router();

// AUTH
// EDIT

router.get("/", getOutlet);

export default router;
