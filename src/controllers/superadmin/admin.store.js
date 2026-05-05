import db from "../../config/db.js";
import bcrypt from "bcrypt";

/* =========================
   CREATE STORE + ADMIN
========================= */
export const createStoreWithAdmin = async (req, res) => {
  try {
    const {
      // STORE DATA
      store_name,
      store_email,
      store_phone,
      store_address,
      kra_pin,
      logo,

      // ADMIN DATA
      admin_first_name,
      admin_second_name,
      admin_surname,
      admin_email,
      admin_password,
    } = req.body;

    /* =========================
       1. CREATE STORE
    ========================= */
    const storeResult = await db.query(
      `INSERT INTO stores (
        name,
        email,
        phone,
        address,
        kra_pin,
        logo
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        store_name,
        store_email,
        store_phone,
        store_address,
        kra_pin || null,
        logo || null,
      ]
    );

    const store = storeResult.rows[0];

    /* =========================
       2. HASH PASSWORD
    ========================= */
    const hashedPassword = await bcrypt.hash(admin_password, 10);

    /* =========================
       3. CREATE ADMIN USER
    ========================= */
    const adminResult = await db.query(
      `INSERT INTO users (
        first_name,
        second_name,
        surname,
        email,
        password,
        role,
        store_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        admin_first_name,
        admin_second_name,
        admin_surname,
        admin_email,
        hashedPassword,
        "admin",
        store.id,
      ]
    );

    const admin = adminResult.rows[0];

    /* =========================
       RESPONSE
    ========================= */
    res.status(201).json({
      success: true,
      message: "Store and admin created successfully",
      store,
      admin,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};