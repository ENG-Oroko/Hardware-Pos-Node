import db from "../../config/db.js";
import { hashPassword } from "../../utils/hashPassword.js";

/* =========================
   CREATE STORE + ADMIN (FAST)
========================= */
export const createStoreWithAdmin = async (req, res) => {
  const client = await db.connect();

  try {
    const {
      store_name,
      store_email,
      store_phone,
      store_address,
      kra_pin,
      logo,

      admin_first_name,
      admin_second_name,
      admin_surname,
      admin_email,
      admin_password,
    } = req.body;

    // ⚡ FAST VALIDATION (early exit)
    if (!store_name || !admin_email || !admin_password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    await client.query("BEGIN");

    // ⚡ FAST DUPLICATE CHECK
    const exists = await client.query(
      "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
      [admin_email]
    );

    if (exists.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Admin email already exists",
      });
    }

    // ⚡ PARALLEL EXECUTION (store + hash)
    const storePromise = client.query(
      `INSERT INTO stores (name, email, phone, address, kra_pin, logo)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [
        store_name,
        store_email,
        store_phone,
        store_address,
        kra_pin || null,
        logo || null,
      ]
    );

    const hashPromise = hashPassword(admin_password);

    const [storeResult, hashedPassword] = await Promise.all([
      storePromise,
      hashPromise,
    ]);

    const storeId = storeResult.rows[0].id;

    // ⚡ CREATE ADMIN (minimal return)
    const adminResult = await client.query(
      `INSERT INTO users (
        first_name,
        second_name,
        surname,
        email,
        password,
        role,
        store_id
      )
      VALUES ($1,$2,$3,$4,$5,'admin',$6)
      RETURNING id, email, role, store_id`,
      [
        admin_first_name,
        admin_second_name,
        admin_surname,
        admin_email,
        hashedPassword,
        storeId,
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Store and admin created successfully",
      store_id: storeId,
      admin: adminResult.rows[0],
    });

  } catch (err) {
    await client.query("ROLLBACK");

    return res.status(500).json({
      success: false,
      message: "Server error",
    });

  } finally {
    client.release();
  }
};