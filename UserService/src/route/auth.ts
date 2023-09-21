import express from "express";
import { protect } from "../middleware/auth";
import { register, login, logout, getCurrentUser } from "../controllers/auth";

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/user', protect, getCurrentUser)

export default router