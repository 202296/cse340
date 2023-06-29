// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build a process to deliver a specific inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

router.get("/", utilities.handleErrors(invController.buildTheManagement));

router.get("/add-classification", utilities.handleErrors(invController.addClassification));


// POST route to add a new classification
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassData,
  utilities.handleErrors(invController.addNewClassification)
);


module.exports = router;