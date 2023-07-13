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

/* ***************************
 *  Build a process to deliver the management view
 * ************************** */
invCont.buildTheManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassSelect()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
  })
}

/* ***************************
 *  Build a process to deliver the classification view
 * ************************** */
invCont.addClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
};

/* ***************************
 *  Build a process to deliver the inventory view
 * ************************** */
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.reviews = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render("inventory/review", {
    title: "Leave a Review",
    nav,
    errors: null,
  })
};




/* ****************************************
*  Process of adding a new classification
* *************************************** */
invCont.addNewClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body;

  const classificationData = await invModel.addNewClassification(classification_name);
  const classificationSelect = await utilities.buildClassSelect()
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
      classificationSelect,
    });
  } else {
    req.flash("notice", "Provide a correct classification name.")
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
const classificationSelect = await utilities.buildClassSelect() 
  if (inventoryData) {
    req.flash(
      "notice",
      `The ${inv_make} inventory was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
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

/* ***************************
 *  Build a process to deliver the edit inventory view
 * ************************** */
invCont.updateInventory = async function(req, res, next) {
  let nav = await utilities.getNav();
  const inventory_id = parseInt(req.params.inv_id)
  const invItem = await invModel.getVehicleInformationByInventoryId(inventory_id);
  let select = await utilities.buildClassSelect(invItem[0].classification_id);
  const itemName = `${invItem[0].inv_make} ${invItem[0].inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    select: select,
    errors: null,
    inv_id: invItem[0].inv_id,
    inv_make: invItem[0].inv_make,
    inv_model: invItem[0].inv_model,
    inv_year: invItem[0].inv_year,
    inv_description: invItem[0].inv_description,
    inv_image: invItem[0].inv_image,
    inv_thumbnail: invItem[0].inv_thumbnail,
    inv_price: invItem[0].inv_price,
    inv_miles: invItem[0].inv_miles,
    inv_color: invItem[0].inv_color,
    classification_id: invItem[0].classification_id
  })
};

/* ***************************
 *  Build a process to deliver the delete inventory view
 * ************************** */
invCont.delectInventory = async function(req, res, next) {
  let nav = await utilities.getNav();
  const invent_id = parseInt(req.params.inv_id)
  const invData = await invModel.getVehicleInformationByInventoryId(invent_id)
  let select = await utilities.buildClassSelect(invData[0].classification_id);
  const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    select: select,
    errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_price: invData[0].inv_price,
    classification_id: invData[0].classification_id
  })
};

invCont.modifyInventory = async function(req, res) {
  let nav = await utilities.getNav()

  const {
    inv_id,
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
  
  const updateResult = await invModel.modifyInventory(
      inv_id,
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
  const classificationSelect = await utilities.buildClassSelect()
  if (updateResult) {
    const itemName = `${inv_make} ${inv_model}`
    req.flash(
      "notice",
      `The ${itemName} was successfully updated.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
    });
  } else {
    let select = await utilities.buildClassSelect(classification_id);
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      select: select,
      errors: null,
      inv_id,
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
    })
  }

}

invCont.removeInventory = async function(req, res) {
  let nav = await utilities.getNav()

  const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      classification_id
  } = req.body;
  
  const deleteResult = await invModel.removeInventory(
      inv_id);
  const classificationSelect = await utilities.buildClassSelect()
  if (deleteResult) {
    const itemName = `${inv_make} ${inv_model}`
    req.flash(
      "notice",
      `The ${itemName} was successfully deleted.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
    });
  } else {
    let select = await utilities.buildClassSelect(classification_id);
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      select: select,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      classification_id
    })
  }

}


invCont.addNewReview = async function(req, res) {
    let nav = await utilities.getNav()
  
    const {
      rev_firstname, 
      rev_lastname, 
      rev_email, 
      rev_make, 
      rev_model, 
      rev_rating, 
      rev_comments,
    } = req.body;
    
    const reviewResult = await invModel.reviewVehicle(
      rev_firstname, 
      rev_lastname, 
      rev_email, 
      rev_make, 
      rev_model, 
      rev_rating, 
      rev_comments,
    );

    if (reviewResult) {
      const itemName = `${rev_make} ${rev_model}`
      req.flash(
        "notice",
        `The ${itemName} was successfully review.`
      );
      res.redirect("/")
    } else {
      let nav = await utilities.getNav()
      req.flash("notice", "Sorry, the review failed.")
      res.status(501).render("inventory/review", {
        title: "Leave a Review",
        nav,
        errors: null,
      })
    }
  
  }

module.exports = invCont