const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image_of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the specific vehicle's information view HTML
* ************************************ */
Util.buildVehicleDetail = async function(info) {
  let detail
  if(info.length > 0) {
    detail = '<div id="display_detail">'
    info.forEach(data => {
      detail += `<img src="${data.inv_image}" alt="Image_of ${data.inv_make} ${data.inv_model} Details on CSE Motors">`
      detail += '<div class="detail">'
      detail += '<h2> '+ data.inv_make +' ' + data.inv_model +' Details </h2>'
      detail += `<span class="span"> Price: $${new Intl.NumberFormat('en-US').format(data.inv_price)} </span>`
      detail += '<p class="desc"> <span class="descript"> Description:</span> '+ data.inv_description +' </p>'
      detail += '<h3 class="color"><span class="colors">Color:</span> '+ data.inv_color +' </h3>'
      detail += `<h3><span class="miles">Miles: </span> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} </h3>`
      detail += `<h3><a href="/inv/review/${data.inv_id}">Review</a></h3>`
      detail += '</div>'
    })

    

    detail += '</div>'
  } else { 
    detail += '<p class="notice">Sorry, no matching detail could be found.</p>'
  }
  return detail
}

Util.insertName = async function (revi) {
  let name = ''
  name += `<div class="form-group">
    <label for="revMake">Make:</label>
    <input type="text" id="revMake" name="rev_make" minlength="3" title="The minimum alphabetic characters is three" placeholder="Min of 3 characters" required value="${revi.inv_make}" readonly>
  </div>
  <div class="form-group">
    <label for="revModel">Model:</label>
    <input type="text" id="revModel" name="rev_model" minlength="3" title="The minimum alphabetic characters is three" placeholder="Min of 3 characters" required value="${revi.inv_model}" readonly>
  </div>`
  return name
}

Util.buildClassSelect = async function(id = null) {
      const data = await invModel.getClassifications();
      const selectList = `
        <label for="classificationList">Classification:</label>
        <select id="classificationList" name="classification_id" required>
          <option value="" disabled ${!id ? "selected" : ""}>Choose a Classification</option>
          ${data.rows.map(classif => `
            <option value="${classif.classification_id}" ${id === classif.classification_id ? "selected" : ""}>
              ${classif.classification_name}
            </option>
          `)}
        </select>
      `;
      return selectList;
    };
  

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 Util.checkAccess = (req, res, next) => {
  if (res.locals.loggedin && res.locals.accountData && (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
    next();
  } else {
    req.flash("notice", "Unauthorized access");
    return res.redirect("/account/login");
  }
};

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util