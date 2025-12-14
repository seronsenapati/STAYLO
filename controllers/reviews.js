/**
 * Controller for handling review-related operations
 * @module controllers/reviews
 */

const Listing = require("../models/listing");
const Review = require("../models/review");

/**
 * Create a new review for a listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
module.exports.createReview = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review submitted successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error creating review:", error);
    }
    
    // Provide user-friendly error message
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash("error", "Validation Error: " + messages.join(", "));
    } else {
      req.flash("error", "Error creating review. Please try again.");
    }
    res.redirect(`/listings/${req.params.id}`);
  }
};

/**
 * Delete a review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
module.exports.deleteReview = async (req, res) => {
  try {
    let { id, reviewId } = req.params;
    
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { projection: { _id: 1 } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error deleting review:", error);
    }
    
    req.flash("error", "Error deleting review. Please try again.");
    res.redirect(`/listings/${req.params.id}`);
  }
};
