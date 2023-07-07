const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const validator = require('../utilities/account-validation');

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegistration))

router.get("/update/:accountId", utilities.handleErrors(accountController.editAccount))

// Logout route
router.get("/logout", utilities.handleErrors(accountController.buildLogout));

// Process the registration data
router.post(
    "/register", 
    validator.registationRules(),
    validator.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    validator.loginRules(),
    validator.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
  )

router.post(
  "/update-account/", 
  validator.updateRules(),
  validator.checkUpdateAccount,
  utilities.handleErrors(accountController.updateAccount)
  )

router.post(
    "/update-password/", 
    validator.passwordRules(),
    utilities.handleErrors(accountController.updatePassword)
    )

module.exports = router;