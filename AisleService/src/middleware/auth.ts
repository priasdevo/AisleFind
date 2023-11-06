// import jwt, { JwtPayload } from "jsonwebtoken"
import User, { IUser } from "../models/user";
import axios from 'axios';
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { getURL } from "../utils/consul";

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
    // TODO : send request to userService to verify
    const service_URL = await getURL('User-service');
    try {
        const response = await axios({
            method: 'GET',
            url: `${service_URL}/auth/user`,
            data: req.body,
            headers: {
                'Authorization': `Bearer ${token}` // Send the bearer token in the request header
            }
        });
        // res.send(response.data);
        if(!response.data.success){
            return res.status(401).json({success: false, msg: "Not authorize to access this route"});
        }
        req.user = response.data;

    } catch (error) {
        console.log("Error : ", error);
        res.status(500).send(`Error forwarding to Service at ${service_URL}/auth/user`);
    }
    next();

  } catch (err) {
    console.log(err);
    return res.status(401).json({success: false, msg: "Not authorize to access this route"});
  }

}

export const isOwner = async(req:Request, res:Response, next:NextFunction)=>{
    // Ensure user exists on the request object
    if (!req.user) {
        return res.status(401).json({success: false, msg: "Not authorize to access this route"});
    }

    // Check if user's role is 'owner'
    if (req.user.role !== 'owner') {
        return res.status(403).json({success: false, msg: "You do not have the required permissions"});
    }

    next();
}


declare global {
  namespace Express {
    interface Request {
      user?: IUser | null
    }
  }
}

export {}