export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Superadmin only",
    });
  }
  next();
};

export const isAdminOrSuperAdmin = (req, res, next) => {
  if (!["admin", "superadmin"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  next();
};