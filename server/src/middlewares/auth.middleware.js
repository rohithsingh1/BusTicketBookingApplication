import env from "../config/env.js";
import User from "../models/user.model.js";
import {verifyAppToken} from "../utils/auth.js";

export const requireAuth=async (req, res, next) => {
  try {
    const bearerToken=req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      :null;

    const token=req.cookies?.[env.authCookieName]||bearerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const payload=verifyAppToken(token);
    const user=await User.findById(payload.sub).select("-__v");

    console.log("user in requireAuth>>>>>>>>", user);
    /**
     * Using the user ID stored in the JWT, fetch that user from MongoDB, 
     * wait for the result, and return the user object without the Mongoose 
     * internal __v field.
     */

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session is no longer valid.",
      });
    }

    req.user=user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};
