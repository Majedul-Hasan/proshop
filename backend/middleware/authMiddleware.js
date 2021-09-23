import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

//user middleware

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // console.log(decoded);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorize, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorize, no token");
  }
});

export { protect };
