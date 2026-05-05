import db from "../../config/db.js";

export const createBranch = async (req, res) => {
  try {
    const { branch_name, location, phone, store_id } = req.body;

    let finalStoreId;

    if (req.user.role === "superadmin") {
      if (!store_id) {
        return res.status(400).json({
          success: false,
          message: "store_id is required for superadmin",
        });
      }
      finalStoreId = store_id;
    }

    if (req.user.role === "admin") {
      finalStoreId = req.user.store_id;

      if (!finalStoreId) {
        return res.status(403).json({
          success: false,
          message: "Admin has no store assigned",
        });
      }
    }

    const result = await db.query(
      `INSERT INTO branches (
        store_id,
        branch_name,
        location,
        phone
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [finalStoreId, branch_name, location, phone]
    );

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      branch: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};