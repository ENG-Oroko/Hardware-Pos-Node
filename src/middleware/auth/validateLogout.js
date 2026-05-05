export const validateLogout = (req, res, next) => {
  if (!req.cookies?.token && !req.headers.authorization) {
    return res.status(400).json({
      success: false,
      message: "No active session found",
    });
  }

  next();
};