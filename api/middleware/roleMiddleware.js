import User from "../models/user.model.js";

export const checkRole = (roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        message: "Permission denied. You do not have the right role.",
      });
    }

    req.user = user;
    next();
  };
};
