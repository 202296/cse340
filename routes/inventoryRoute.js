// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validator = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build a process to deliver a specific inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Item details route
router.get('/inventory/:itemId', invController.itemDetails);


// Inventory by classification route
router.get('/classification/:classificationId', invController.inventoryByClassification);

router.get("/", utilities.handleErrors(invController.buildTheManagement));

router.get("/add-classification", utilities.handleErrors(invController.addClassification));

router.get("/add-inventory", utilities.handleErrors(invController.addInventory));

// POST route to add a new classification
router.post(
  "/add-classification",
  validator.classificationRules(),
  validator.checkClassData,
  utilities.handleErrors(invController.addNewClassification)
);

// POST route to add a new inventory
router.post(
  "/add-inventory",
  validator.inventoryRules(),
  validator.checkInvData,
  utilities.handleErrors(invController.addNewInventory)
);


module.exports = router;