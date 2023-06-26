const utilities = require("../utilities/");


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    const login = await utilities.buildUserAccount()
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      login,
    })
  }


  async function buildRegistration(req, res, next) {
    const register = await utilities.buildUserRegistration()
    let nav = await utilities.getNav()
    res.render("account/registration", {
      title: "Register",
      nav,
      register,
    })
  }
  
  module.exports = { buildLogin, buildRegistration}