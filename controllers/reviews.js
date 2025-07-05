const Listing = require("../models/listing");
const Review = require("../models/review");

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
    req.flash("error", "Error creating review: " + error.message);
    res.redirect(`/listings/${req.params.id}`);
  }
};

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
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    req.flash("error", "Error deleting review: " + error.message);
    res.redirect(`/listings/${req.params.id}`);
  }
};
