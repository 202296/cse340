const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build a process to deliver a specific inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function(req, res, next) {
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


invCont.buildTheManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}


invCont.addClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
};

invCont.addInventory = async function(req, res, next) {
  let select = await utilities.buildClassSelect();
  let nav = await utilities.getNav();
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    select: select,
    errors: null,
  })
};


/* ****************************************
*  Process of adding a new classification
* *************************************** */
invCont.addNewClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body;
  console.log(`error ${classification_name} not found`)

try {
  const classificationData = await invModel.addNewClassification(classification_name);

  if (classificationData) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    );
    // The navigation immediately by fetching the updated classifications
    const classifications = await invModel.getClassifications();
    const nav = await utilities.getNav(classifications);

    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("notice", "Provide a correct classification name.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
 } catch (error) {
  req.flash("error", "An error occurred while adding the classification.");
  res.status(501).render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

}



invCont.addNewInventory = async function(req, res) {
  let nav = await utilities.getNav()

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  let select = await utilities.buildClassSelect();
  
  const inventoryData = await invModel.addNewInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id);

  if (inventoryData) {
    req.flash(
      "notice",
      `The ${inv_make} inventory was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("notice", "Provide a correct inventory name.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      select: select,
      errors: null,
    })
  }

}

module.exports = invCont