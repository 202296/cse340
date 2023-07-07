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

// Route to build a process to deliver the inventory management view.
router.get("/", utilities.checkAccess, utilities.handleErrors(invController.buildTheManagement));

// Route to build a process to deliver the classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.addClassification));

// Route to build a process to deliver the inventory view.
router.get("/add-inventory",
utilities.handleErrors(invController.addInventory));

// Route to build a process to deliver all the inventories item through an URL
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build a process to deliver a specific inventory item detail to be modify.
router.get("/edit/:inv_id", utilities.handleErrors(invController.updateInventory))

// Route to build a process to deliver a specific inventory item detail to be delect.
router.get("/delete/:inv_id", utilities.handleErrors(invController.delectInventory))

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

router.post(
  "/update/", 
  validator.inventoryRules(), 
  validator.checkUpdateData,
  utilities.handleErrors(invController.modifyInventory))

router.post(
  "/delete/", 
  utilities.handleErrors(invController.removeInventory))

module.exports = router;