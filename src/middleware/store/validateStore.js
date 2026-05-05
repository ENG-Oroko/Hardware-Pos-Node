export const validateStore = (req, res, next) => {
  const {
    store_name,
    store_email,
    admin_email,
    admin_password,
  } = req.body;

  if (!store_name || !admin_email || !admin_password) {
    return res.status(400).json({
      success: false,
      message: "store_name, admin_email and admin_password are required",
    });
  }

  next();
};