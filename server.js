/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const baseController = require("./controllers/baseController");
const app = express();
const utilities = require("./utilities/");
const errorRoute = require("./routes/errorRoute");



/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root


/* ***********************
 * Routes
 *************************/
app.use(utilities.handleErrors(require("./routes/static")));


// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));


// Inventory routes
app.use("/inv", utilities.handleErrors(require("./routes/inventoryRoute")));


app.use("/error", errorRoute);


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: `<video class="elementor-video" src="https://inzonedesign.com/wp-content/uploads/2021/02/flamingos-404-error-page-waza.mp4" autoplay="" loop="" muted="muted" controlslist="nodownload"></video>`})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = '<div id="trigger_error"><p>Oh no! There was a crash. Maybe try a different route?</p></div>'}
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});