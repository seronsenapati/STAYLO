const cloudinary = require("cloudinary").v2;

// Check if required environment variables are set
const requiredEnvVars = ['CLOUD_NAME', 'CLOUD_API_KEY', 'CLOUD_API_SECRET'];
let cloudinaryConfigured = true;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Missing required environment variable: ${envVar}. Cloudinary functionality will be disabled.`);
    cloudinaryConfigured = false;
  }
}

// Configure cloudinary only if all required variables are present
if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
}

const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Create storage only if cloudinary is configured
let storage;
if (cloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "staylo_DEV",
      allowedFormats: ["jpg", "png", "jpeg"],
    },
  });
} else {
  // Fallback storage configuration
  console.warn("Using fallback storage as Cloudinary is not configured");
  storage = null;
}

module.exports = { cloudinary, storage, cloudinaryConfigured };