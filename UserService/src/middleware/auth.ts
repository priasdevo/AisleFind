import jwt, { JwtPayload } from "jsonwebtoken"
import User, { IUser } from "../models/user";
import { NextFunction, Request, Response } from "express";

export const protect = async(req:Request, res:Response, next:NextFunction)=>{

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  //Make sure token exists
  if (!token || token == "null") {
    return res.status(401).json({success: false, msg: "Not authorize to access this route"});
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env["JWT_SECRET"] || "") as JwtPayload;
    console.log(decoded);

    req.user = await User.findOne({username: decoded.username});
    next();

  } catch (err) {
    console.log(err);
    return res.status(401).json({success: false, msg: "Not authorize to access this route"});
  }

}

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null
    }
  }
}

export {}