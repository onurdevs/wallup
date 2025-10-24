import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { deleteUser, getProfile, getUsers, saveUser, updateUser } from "../controllers/user.controller.ts";
import { authorizeRole } from "../middlewares/role.middleware.ts";
import { UserRole } from "../enums/userRole.enum.js";

const router = Router();

router.get("/me", authMiddleware, getProfile)
router.get("/stats", authMiddleware, authorizeRole(UserRole.ADMIN), (req, res) => {
    res.json({
        message: "admin istatistiklerine erişildi",
        accessedBy: req.user.email
    })
})
router.post("", authMiddleware, saveUser);
router.get("", authMiddleware, getUsers);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/:id", authMiddleware, updateUser);

export default router;