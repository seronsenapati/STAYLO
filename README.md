# STAYLO - Vacation Rental Platform

A full-stack web application for vacation rentals built with Node.js, Express, MongoDB, and EJS. Discover and book unique accommodations around the world.

**Live Demo: [https://staylo.up.railway.app](https://staylo.up.railway.app)**

**Alternative Demo: [https://staylo-swvf.onrender.com/listings](https://staylo-swvf.onrender.com/listings)**

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Technologies Used](#technologies-used)
- [Security Considerations](#security-considerations)
- [License](#license)
- [Author](#author)

## Features

- User authentication and authorization (Passport.js)
- Create, read, update, and delete vacation listings
- Image upload with Cloudinary integration
- Interactive maps with Mapbox
- Review system with ratings
- Responsive design with Bootstrap 5
- Form validation with Joi
- Error handling and flash messaging
- Comprehensive test suite with Jest

## Railway Deployment

The application is deployed on Railway at [https://staylo.up.railway.app](https://staylo.up.railway.app). Railway provides a seamless deployment experience with automatic builds and deployments from the GitHub repository.

Key features of the Railway deployment:
- Automatic SSL certificate provisioning
- Continuous deployment from the main branch
- Environment variable management through Railway dashboard
- Automatic scaling based on demand
- Built-in monitoring and logging

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

### Railway Deployment

To deploy on Railway:
1. Connect your GitHub repository to Railway
2. Set the environment variables in the Railway dashboard
3. Railway will automatically build and deploy your application
4. Access your application at `https://staylo.up.railway.app`

## Environment Variables

| Variable | Description | Required |
|---------|-------------|----------|
| `ATLASDB_URL` | MongoDB connection string | Yes |
| `SECRET` | Session secret for authentication | Yes |
| `CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUD_API_KEY` | Cloudinary API key | Yes |
| `CLOUD_API_SECRET` | Cloudinary API secret | Yes |
| `MAP_TOKEN` | Mapbox access token | Yes |
| `PORT` | Server port (default: 8080) | No |
| `NODE_ENV` | Environment mode (development/production) | No |

For Railway deployment, these environment variables are configured in the Railway dashboard. In local development, they should be stored in a `.env` file in the root directory.

## Project Structure

```
STAYLO/
├── app.js                 # Main application file
├── cloudConfig.js         # Cloudinary configuration
├── middleware.js          # Custom middleware functions
├── schema.js             # Joi validation schemas
├── controllers/          # Route controllers
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── models/              # MongoDB models
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/              # Express routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── utils/               # Utility functions
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/               # EJS templates
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   ├── users/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   └── error.ejs
├── public/              # Static files (CSS, JS, images)
├── tests/               # Test files
└── README.md            # Project documentation
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

## Testing

The application includes a comprehensive test suite using Jest and Supertest.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Categories

1. **Unit Tests**: Model validation tests
2. **Integration Tests**: Route and controller tests
3. **Authentication Tests**: User signup, login, and logout flows

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with Local Strategy
- **File Upload**: Multer with Cloudinary
- **Maps**: Mapbox GL JS
- **Frontend**: EJS templates, Bootstrap 5
- **Validation**: Joi
- **Sessions**: Express-session with MongoDB store
- **Testing**: Jest, Supertest
- **Deployment**: Railway (Primary), Render (Backup)

## Security Considerations

- Passwords are securely hashed using Passport.js
- Sessions are configured with secure flags in production
- Input validation and sanitization using Joi
- XSS prevention through proper escaping in EJS templates
- CSRF protection through proper form handling
- Error messages are sanitized in production environments

## License

ISC License

## Author

Seron Senapati