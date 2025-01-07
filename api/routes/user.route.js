import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  addUser,
  editUser,
  getUserProfile,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { verifyTokenforRole } from "../utils/verifyToken.js";
const router = express.Router();

// Admin or Manager can add a new user
router.post(
  "/user",
  verifyTokenforRole,
  checkRole(["admin", "manager"]),
  addUser
);

router.put(
  "/user/:userId",
  verifyTokenforRole,
  checkRole(["admin", "manager"]),
  editUser
);

// Admin route for deleting a user
router.delete(
  "/user/:userId",
  verifyTokenforRole,
  checkRole(["admin"]),
  deleteUser
);

router.get("/", test);

router.get("/profile", verifyTokenforRole, getUserProfile);
router.post("/update/:id", verifyToken, updateUser);

// working
router.get(
  "/users",
  verifyTokenforRole,
  checkRole(["admin", "manager"]),
  getUsers
);

export default router;
