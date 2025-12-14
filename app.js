if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/staylo_dev";

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // In production, we should exit since we can't run without a database
    if (process.env.NODE_ENV === "production") {
      console.error("Production database connection failed. Exiting...");
      process.exit(1);
    } else {
      console.warn("Development mode: App may have limited functionality without database");
    }
  }
}

main();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Create store only if MongoDB connection is successful
let store;
try {
  store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET || "fallback-secret-key",
    },
    touchAfter: 24 * 60 * 60, // 24 hours
  });
} catch (err) {
  console.warn("Failed to create MongoStore, using default memory store:", err.message);
}

const sessionOptions = {
  store: store || undefined, // Use memory store if MongoStore creation failed
  secret: process.env.SECRET || "fallback-secret-key",
  resave: false,
  saveUninitialized: false, // Security improvement: don't save uninitialized sessions
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure cookies in production
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Catch-all route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found !!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details in development but not in production
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  
  // Set default values
  let { statusCode = 500, message = "Something went wrong" } = err;
  
  // Don't expose internal error details in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Internal server error";
  }
  
  res.status(statusCode).render("error.ejs", { err: { statusCode, message } });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/listings`);
});