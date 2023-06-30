const invModel = require("../models/inventory-model")
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
      detail += '</div>'
    })

    detail += '</div>'
  } else { 
    detail += '<p class="notice">Sorry, no matching detail could be found.</p>'
  }
  return detail
}

Util.buildClassSelect = async function(req, res, next) {
  let data = await invModel.getClassifications()
  let selectList = ''
  data.rows.forEach(classification => {
  selectList += `<option value="${classification.classification_id}">${classification.classification_name}</option>`
  })

return selectList
}

// Util.buildInventory = async function(classifications) {

// let inv_form = ''

// inv_form += `<div id="inventory_container">`
// inv_form += `<form action="/inv/add-inventory" method="post">`
// inv_form += `<div class="form-group">`
// inv_form +=  `<label for="classification">Classification:</label>`
// inv_form += `<select id="classification" name="classification_id" required>`
// inv_form +=  classifications
// inv_form += `</select>`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="make">Make:</label>`
// inv_form += `<input type="text" id="invMake" name="inv_make" pattern="[A-Za-z]{3}" title="Please enter three alphabetic characters" placeholder="Min of 3 characters" required value="${locals.inv_make}">`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="model">Model:</label>`
// inv_form += `<input type="text" id="invModel" name="inv_model" pattern="[A-Za-z]{3}" title="Please enter three alphabetic characters" placeholder="Min of 3 characters" required value="${locals.inv_model}">`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="description">Description:</label>`
// inv_form += `<input type="text" id="invDescription" name="inv_description" required value="${locals.inv_description}">`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="image">Image Path:</label>`
// inv_form += `<input type="text" id="invImage" name="inv_image" required value="/images/vehicles/no-image.png">`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="thumbnail">Thumbnail Path:</label>`
// inv_form += `<input type="text" id="invThumbnail" name="inv_thumbnail" required value="/images/vehicles/no-image.png">`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="price">Price:</label>`
// inv_form += `<input type="number" id="invPrice" name="inv_price" pattern="^(?:\d+|\d*\.\d+)$" title="Please enter a decimal or integer number" placeholder="decimal or integer" required value="${locals.inv_price}">`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="year">Year:</label>`
// inv_form += `<input type="number" id="invYear" name="inv_year" pattern="\d{4}" title="Please enter a four-digit year" required placeholder="4-digit year" value="${locals.inv_year}">`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="miles">Miles:</label>`
// inv_form += `<input type="number" id="invMiles" name="inv_miles" pattern="[0-9]+" title="Please enter digits only" placeholder="digits only" required value="${locals.inv_miles}">`
// inv_form += `</div>`
// inv_form += `<div class="form-group">`
// inv_form += `<label for="color">Color:</label>`
// inv_form += `<input type="text" id="invColor" name="inv_color" required value="${locals.inv_color}">`
// inv_form += `</div>`
// inv_form += `<button type="submit">Add Inventory</button>`
// inv_form += `</form>`
// inv_form += `</div>`

// return inv_form;
// }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util