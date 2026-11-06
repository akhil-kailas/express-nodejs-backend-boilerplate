import { Router } from "express";
import adminRoutes from "../modules/admin/admin.routes.js";
import userRoutes from "../modules/user/user.routes.js";


const router = Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);


export default router;
