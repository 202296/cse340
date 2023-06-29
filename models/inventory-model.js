const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get the data for a specific vehicle in inventory by inventory_id
 * ************************** */
async function getVehicleInformationByInventoryId(inv_id) {
  try {
    const info = await pool.query(
      `SELECT 
         * 
       FROM 
         public.inventory 
       WHERE 
         inv_id = $1`, [inv_id]
    )
    return info.rows
  } catch (error) {
    console.error("get inventorybyid error" + error)
  }
}


/* *****************************
*   Add a new classification
* *************************** */
async function addNewClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

// async function addNewInventory(){
//   try {
//     const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *"
//     return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
//   } catch (error) {
//     return error.message
//   }
// }


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleInformationByInventoryId, addNewClassification
};