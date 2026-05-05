export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production (HTTPS)
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};