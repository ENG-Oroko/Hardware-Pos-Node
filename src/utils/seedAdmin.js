import bcrypt from "bcrypt";
import db from "../config/db.js";

const seedSuperAdmin = async () => {
  try {
    const {
      SUPER_ADMIN_FIRST_NAME,
      SUPER_ADMIN_SECOND_NAME,
      SUPER_ADMIN_SURNAME,
      SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD,
      SUPER_ADMIN_ROLE,
    } = process.env;

    // check if exists
    const existing = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [SUPER_ADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
      console.log("🟡 Super admin already exists");
      return;
    }

    // hash password
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    // insert using NEW schema
    await db.query(
      `INSERT INTO users 
      (first_name, second_name, surname, email, password, role)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        SUPER_ADMIN_FIRST_NAME,
        SUPER_ADMIN_SECOND_NAME || null,
        SUPER_ADMIN_SURNAME || null,
        SUPER_ADMIN_EMAIL,
        hashedPassword,
        SUPER_ADMIN_ROLE || "superadmin",
      ]
    );

    console.log("🟢 Super admin created successfully");

  } catch (err) {
    console.error("🔴 Error creating super admin:", err.message);
  }
};

export default seedSuperAdmin;