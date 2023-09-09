import { Router } from "express";
import { getUser, editUser } from "../controllers/user/index.js";
import { auth } from "../middlewares/index.js";

const router = Router();

router.get("/", auth, getUser);
router.put("/edit-user/:id", auth, editUser);

export default router;
