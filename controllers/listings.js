/**
 * Controller for handling listing-related operations
 * @module controllers/listings
 */

const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// Check if MAP_TOKEN is available and valid before initializing the client
let geocodingClient;
let mapToken = process.env.MAP_TOKEN;

if (mapToken && mapToken !== "your-mapbox-access-token") {
  try {
    geocodingClient = mbxGeocoding({ accessToken: mapToken });
  } catch (error) {
    console.warn("Failed to initialize Mapbox client:", error.message);
    geocodingClient = null;
  }
} else {
  console.warn("MAP_TOKEN not set or invalid. Geocoding functionality will be disabled.");
}

/**
 * Display all listings with pagination and sorting
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
module.exports.index = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 12; // Show 12 listings per page
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalCount = await Listing.countDocuments({});
    
    // Fetch listings with optimized query
    const allListings = await Listing.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance
      
    const totalPages = Math.ceil(totalCount / limit);
    
    res.render("listings/index.ejs", { 
      allListings,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching listings:", error);
    }
    
    req.flash("error", "Error loading listings. Please try again.");
    res.redirect("/listings");
  }
};

/**
 * Render the form for creating a new listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

/**
 * Display a specific listing with its details and reviews
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
module.exports.showListing = async (req, res) => {
  try {
    let { id } = req.params;
    // Optimized query with lean() for better performance
    const listing = await Listing.findById(id)
      .populate({ 
        path: "reviews", 
        populate: { 
          path: "author",
          select: "username" // Only select needed fields
        } 
      })
      .populate({
        path: "owner",
        select: "username" // Only select needed fields
      })
      .lean();
      
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error showing listing:", error);
    }
    
    req.flash("error", "Error loading listing. Please try again.");
    res.redirect("/listings");
  }
};

/**
 * Create a new listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
module.exports.createListing = async (req, res, next) => {
  try {
    if (!req.file) {
      req.flash("error", "Please upload an image");
      return res.redirect("/listings/new");
    }

    // Skip geocoding if token is not available
    let geometryData = null;
    if (geocodingClient) {
      try {
        let response = await geocodingClient
          .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
          .send();

        if (!response.body.features || response.body.features.length === 0) {
          req.flash("error", "Could not geocode the location");
          return res.redirect("/listings/new");
        }
        
        geometryData = response.body.features[0].geometry;
      } catch (error) {
        console.warn("Geocoding failed:", error.message);
        // Fallback geometry if geocoding fails
        geometryData = { type: "Point", coordinates: [0, 0] };
      }
    } else {
      // Fallback geometry if geocoding is disabled
      geometryData = { type: "Point", coordinates: [0, 0] };
      console.warn("Using fallback coordinates as MAP_TOKEN is not set");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    // Optimize image URL for display
    if (url && url.includes('cloudinary')) {
      // For Cloudinary images, we can use transformation URLs
      url = url.replace('/upload/', '/upload/w_800,h_600,c_fill/');
    } else if (url) {
      // For local storage, use the path directly
      url = `/uploads/${filename}`;
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = geometryData;

    let savedListing = await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error creating listing:", error);
    }
    
    // Provide user-friendly error message
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash("error", "Validation Error: " + messages.join(", "));
    } else {
      req.flash("error", "Error creating listing. Please try again.");
    }
    res.redirect("/listings/new");
  }
};

/**
 * Render the form for editing an existing listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
module.exports.renderEditForm = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }

    // Optimize image URL for editing view
    let originalImageUrl = listing.image.url;
    if (originalImageUrl) {
      // Apply Cloudinary transformations for better display
      if (originalImageUrl.includes('cloudinary')) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300,h_200,c_fill");
      }
      // For local images, use as is
    } else {
      // Fallback image if none exists
      originalImageUrl = "https://placehold.co/300x200?text=No+Image";
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error loading edit form:", error);
    }
    
    req.flash("error", "Error loading edit form. Please try again.");
    res.redirect("/listings");
  }
};

/**
 * Update an existing listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { 
          new: true, 
          runValidators: true,
          projection: { // Only select needed fields
            title: 1, 
            description: 1, 
            price: 1, 
            location: 1, 
            country: 1,
            image: 1,
            updatedAt: 1
          }
        });
    
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;

      // Optimize image URL for display
      if (url && url.includes('cloudinary')) {
        // For Cloudinary images, we can use transformation URLs
        url = url.replace('/upload/', '/upload/w_800,h_600,c_fill/');
      } else if (url) {
        // For local storage, use the path directly
        url = `/uploads/${filename}`;
      }

      listing.image = { url, filename };
      await listing.save();
    }
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error updating listing:", error);
    }
    
    // Provide user-friendly error message
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash("error", "Validation Error: " + messages.join(", "));
    } else {
      req.flash("error", "Error updating listing. Please try again.");
    }
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

/**
 * Delete a listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
module.exports.deleteListing = async (req, res) => {
  try {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    
    if (!deletedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    
    // Removed console.log for production
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
  } catch (error) {
    // Log the error for debugging in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error deleting listing:", error);
    }
    
    req.flash("error", "Error deleting listing. Please try again.");
    res.redirect("/listings");
  }
};