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
const session = require("express-session");
const pool = require("./database/");
const account = require("./routes/accountRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");



/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.use(cookieParser());

app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(utilities.handleErrors(require("./routes/static")));


// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));


// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"));

app.use("/account", account);

app.use("/error", errorRoute);


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: `<img class="elementor-video" src="../images/404_image.PNG" alt="404 error images">`})
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