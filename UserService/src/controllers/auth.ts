import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, {IUser} from "../models/user";
import { Request, Response } from "express";
import { sendMessage } from "../utils/logService";

export const register = async(req:Request, res:Response) => {
  try {
    const { username, password, role } = req.body

    const token = jwt.sign({ username }, process.env["JWT_SECRET"] || "")
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    const isExist = await User.find({ username })
    if(isExist.length !== 0){
      return res.status(400).json({
        success: false,
        msg: "this username already exist"
      })
    }

    const user = await User.create({
      username,
      role,
      password:hashed
    })

    await sendMessage('Log', 'new user register', { username, role });
    res.status(200).json({
      success: true,
      token,
      username: user.username
    })
  }
  catch (err) {
    res.status(500).json({ message: err })
  }
}
export const login = async(req:Request, res:Response)=>{
  try {
    const { username, password } = req.body;

    //Validate email and password
    if (!username || !password) {
      return res.status(400).json({ success: false, msg: "Please provide an email and password" });
    }
    //Check for user
    const user = await User.findOne({username}).select('+password +pin');

    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      await sendMessage('Log', 'user login with failed password', { username });
      return res.status(401).json({success: false, msg: "Invalid credentials"});
    }

    await sendMessage('Log', 'user login success', { username });
    const token = jwt.sign({ username }, process.env["JWT_SECRET"] || "")
    res.status(200).json({success: true, token});

  } catch (err) {
    return res.status(500).json({ success:false, msg:err });
  }
}

export const logout = async(req:Request, res:Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10*1000),
    httpOnly: true
  });
  res.status(200).json({ success: true });
}

export const getCurrentUser = async(req:Request, res:Response) => {
  try {
    const user = await User.findOne({ username:req.user?.username }) as IUser
    res.status(200).json({
      success: true,
      username: user.username
    })
  }
  catch (err) {
    res.status(500).json({ success:false });
  }
}