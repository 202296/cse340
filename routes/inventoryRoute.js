// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build a process to deliver a specific inventory item detail view
router.get("/detail/:invId", invController.buildByInventoryId);


module.exports = router;