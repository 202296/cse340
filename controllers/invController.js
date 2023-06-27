const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}


/* ***************************
 *  Build a process to deliver a specific inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const info = await invModel.getVehicleInformationByInventoryId(inv_id)
  const detail = await utilities.buildVehicleDetail(info)
  let nav = await utilities.getNav()
  const className = `${info[0].inv_year} ${info[0].inv_make} ${info[0].inv_model}`
  res.render("./inventory/detail", {
    title: className,
    nav,
    detail,
  })
}


module.exports = invCont