# STAYLO - Vacation Rental Platform

A full-stack web application for vacation rentals built with Node.js, Express, MongoDB, and EJS.

**Live Demo: [https://staylo-swvf.onrender.com/listings](https://staylo-swvf.onrender.com/listings)**


## Features

- User authentication and authorization
- Create, read, update, and delete vacation listings
- Image upload with Cloudinary
- Interactive maps with Mapbox
- Review system with ratings
- Responsive design with Bootstrap

## Prerequisites

- Node.js (v22.12.0 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Mapbox account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd STAYLO
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
ATLASDB_URL=mongodb://127.0.0.1:27017/staylo

# Session Secret
SECRET=your-session-secret-key-here

# Cloudinary Configuration
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# Mapbox Configuration
MAP_TOKEN=your-mapbox-access-token

# Server Configuration
PORT=8080
NODE_ENV=development
```

4. Start the application:
```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080/listings`

## Environment Variables

- `ATLASDB_URL`: MongoDB connection string
- `SECRET`: Session secret for authentication
- `CLOUD_NAME`: Cloudinary cloud name
- `CLOUD_API_KEY`: Cloudinary API key
- `CLOUD_API_SECRET`: Cloudinary API secret
- `MAP_TOKEN`: Mapbox access token
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment mode (development/production)

## Project Structure

```
STAYLO/
├── app.js                 # Main application file
├── cloudConfig.js         # Cloudinary configuration
├── middleware.js          # Custom middleware functions
├── schema.js             # Joi validation schemas
├── controllers/          # Route controllers
├── models/              # MongoDB models
├── routes/              # Express routes
├── utils/               # Utility functions
├── views/               # EJS templates
├── public/              # Static files (CSS, JS, images)
└── init/                # Database initialization
```

## API Endpoints

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Create new listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Add review to listing
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Users
- `GET /signup` - Signup form
- `POST /signup` - Register new user
- `GET /login` - Login form
- `POST /login` - User login
- `GET /logout` - User logout

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with Local Strategy
- **File Upload**: Multer with Cloudinary
- **Maps**: Mapbox GL JS
- **Frontend**: EJS templates, Bootstrap 5
- **Validation**: Joi
- **Sessions**: Express-session with MongoDB store

## License

ISC License

## Author

Seron Senapati 
