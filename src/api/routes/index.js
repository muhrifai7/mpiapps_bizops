import { Router } from "express";
// import { specs, swaggerConfig } from '../../config/index.js';
import outlet from "./outlet.js";
const router = Router();
router.use("/outlet", outlet);

console.log(router, "router");
export default router;