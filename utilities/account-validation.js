const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
              throw new Error("Email exists. Please log in or use different email")
          }
          }),

      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .isLength({ min: 2 })
      .isAlphanumeric()
      .withMessage("Please provide a correct classification name."),
  ]
}

/* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}


/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // classification name is required and must be string
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),

    // make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."),

    // model is required
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."),

    // description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isLength({min: 3})
      .withMessage("Please provide a valid image link"),

    body("inv_thumbnail")
      .trim()
      .isLength({min: 3})
      .withMessage("Please provide a valid thumbnail link"),

    // price is required and must be decimal or integer number
    body("inv_price")
      .isFloat({min: 1})
      .withMessage("Please provide a valid decimal or integer number."),

    // year is required and must be four digit
    body("inv_year")
    .isInt({ min: 1000, max: 9999 })
    .withMessage("Please provide a valid four-digit year."),

    // miles is required and must be digit
    body("inv_miles")
      .isInt({ min: 0 })
      .isNumeric()
      .withMessage("Please provide only digits values for the field."),

    // color is required and must be string
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
  ]
}

/* ******************************
 * Check data and return errors or continue to inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
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
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let select = await utilities.buildClassSelect();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      select,
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
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to edit
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
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
    classification_id, 
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let select = await utilities.buildClassSelect(classification_id);
  const itemName = `${inv_make} ${inv_model}`
  res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      select,
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
      classification_id,
      
    })
    return
  }
  next()
}

validate.updateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const accountId = req.params.accountId;
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists && emailExists.account_id !== accountId) {
          throw new Error("Email already exists. Please choose a different email.");
        }
      }),
  ]
}


validate.checkUpdateAccount = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

validate.passwordRules = () => {
  return [
  // password is required and must be strong password
  body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
]
}

validate.reviewRule = () => {
  return [

    // firstname is required and must be string
    body("rev_firstname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide a first name."), // on error this message is sent.

  // lastname is required and must be string
  body("rev_lastname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide a last name."), // on error this message is sent.

  // valid email is required and cannot already exist in the database
  body("rev_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),

    // make is required and must be string
    body("rev_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."),

    // model is required
    body("rev_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."),

    body("rev_rating")
      .isInt({ min: 1, max: 6 })
      .withMessage("Please rate from 0 - 6"),

    body("rev_comments")
      .trim()
      .isLength({min: 2})
      .withMessage("Please put a correct comment"),

  ]

}
      

validate.checkReviewData = async (req, res, next) => {
  const { 
    rev_firstname, 
    rev_lastname, 
    rev_email, 
    rev_make, 
    rev_model, 
    rev_rating, 
    rev_comments
 } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/review", {
      title: "Leave a Review",
      nav,
      errors,
      rev_firstname, 
      rev_lastname, 
      rev_email,
      rev_make, 
      rev_model, 
      rev_rating, 
      rev_comments, 
      
    })
    return
  }
  next()
}

  module.exports = validate