const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
  }


  async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Registration",
        nav,
        errors: null,
    })
  }

  async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
    })
  }

  async function editAccount(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = parseInt(req.params.accountId)
    const account = await accountModel.myAccount(account_id)
    res.render("account/update-account", {
        title: "Update Account",
        nav,
        errors: null,
        account_id: account.account_id,
        account_firstname: account.account_firstname,
        account_lastname: account.account_lastname,
        account_email: account.account_email
    })
  }
  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req,res) {
  let nav = await utilities.getNav()
 const { account_email, account_password } = req.body
 const accountData = await accountModel.getAccountByEmail(account_email)
 if (!accountData) {
  req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
   title: "Login",
   nav,
   errors: null,
   account_email,
  })
 return
 }
 try {
  if (await bcrypt.compare(account_password, accountData.account_password)) {
  delete accountData.account_password
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
  return res.redirect("/account/")
  }
 } catch (error) {
  return new Error('Access Forbidden')
 }
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id} = req.body

  const updResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email, 
    account_id
  )

  if (updResult) {
    req.flash(
      "notice",
      `Congratulations, ${account_firstname} your account is updated successfully.`
    )
    const updatedAccount = await accountModel.myAccount(account_id);
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccount,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname,
    account_lastname,
    account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, the process for updating your password failed.')
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname, 
      account_lastname, 
      account_email
    })
  }

  const passResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )

  if (passResult) {
    req.flash(
      "notice",
      `Congratulations, your password as been successfully updated.`
    )
    const updatedAccount = await accountModel.myAccount(account_id);
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      updatedAccount
    })
  } else {
    req.flash("notice", "Sorry, the process for updating your password failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

async function buildLogout(req, res) {
  try {
    // Clear the token cookie
    res.clearCookie("jwt");

    // Redirect to the home view
    res.redirect("/");
  } catch (error) {
    console.error("Logout error: ", error);
    res.redirect("/");
  }
}

  module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildAccountManagement, editAccount, updateAccount, updatePassword, buildLogout}