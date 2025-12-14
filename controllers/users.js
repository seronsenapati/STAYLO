/**
 * Controller for handling user authentication operations
 * @module controllers/users
 */

const User = require("../models/user");

/**
 * Render the user signup form
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

/**
 * Handle user signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/signup");
    }
    
    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters long");
      return res.redirect("/signup");
    }
    
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Register Successfully. Welcome to Staylo!");
      res.redirect("/listings");
    });
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error signing up user:", error);
    }
    
    // Provide user-friendly error message
    if (error.name === "UserExistsError") {
      req.flash("error", "A user with the given username or email is already registered");
    } else if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash("error", "Validation Error: " + messages.join(", "));
    } else {
      req.flash("error", "Error signing up. Please try again.");
    }
    res.redirect("/signup");
  }
};

/**
 * Render the user login form
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

/**
 * Handle user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
module.exports.login = async (req, res) => {
  try {
    req.flash("success", "Welcome back to STAYLO!");
    res.redirect(res.locals.redirectUrl || "/listings");
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error during login:", error);
    }
    
    req.flash("error", "Error during login. Please try again.");
    res.redirect("/login");
  }
};

/**
 * Handle user logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      // Log the error for debugging in development
      if (process.env.NODE_ENV !== "production") {
        console.error("Error during logout:", err);
      }
      req.flash("error", "Error during logout. Please try again.");
      return res.redirect("/listings");
    }
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};
