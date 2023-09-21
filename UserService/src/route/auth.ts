import express, {Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const router = express.Router()

router.post('/register',async(req:Request, res:Response)=> {
  try {
    const { username, password } = req.body

    const token = jwt.sign({ username }, process.env["JWT_SECRET"] || "")
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const user = await User.create({ username, password:hashed })
    res.status(200).json({
      success: true,
      token,
      username: user.username
    })
  }
  catch (err) {
    res.status(500).json({ message: err })
  }
})


export default router