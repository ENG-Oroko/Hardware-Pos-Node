import { body, validationResult } from "express-validator";

/* ======================
   LOGIN VALIDATION
====================== */
export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),

  // handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => err.msg),
      });
    }

    next();
  },
];