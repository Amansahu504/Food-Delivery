# Mom's Magic Food Delivery App

A full-stack food delivery application that allows users to browse menus, place orders, and track their delivery status.

![Mom's Magic Food Delivery App](https://via.placeholder.com/800x400?text=Mom's+Magic+Food+Delivery+App)

## Features

- **User Authentication**
  - Email and password login
  - OTP-based authentication
  - User registration with profile image upload
  - Secure JWT-based authentication

- **Food Ordering**
  - Browse food items by category
  - Add items to cart with quantity selection
  - Apply discount coupons
  - Real-time order tracking
  - Order history

- **User Profile Management**
  - Update personal information
  - Manage delivery addresses
  - View order history

- **Responsive Design**
  - Mobile-friendly interface
  - Intuitive navigation
  - Modern UI with smooth animations

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Bootstrap and MDB React UI components
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
  
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3004
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
moms-magic-food-delivery-app/
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── router/
│   └── app.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── screens/
    │   ├── services/
    │   └── App.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/createuser` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/sendotp` - Send OTP for verification
- `POST /api/auth/otplogin` - Login with OTP

### User
- `POST /api/auth/getUserDetails` - Get user profile details
- `POST /api/auth/updatePhoneNumber` - Update user phone number
- `POST /api/auth/updateAddress` - Update user address

### Orders
- `POST /api/auth/orderData` - Place a new order
- `POST /api/auth/myOrderData` - Get user's order history

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Ensure you're using the correct email and password
   - For OTP login, make sure to enter the correct OTP sent to your email
   - If you're redirected to login after placing an order, try logging in again

2. **Order Placement Issues**
   - Make sure your cart is not empty
   - Provide a valid delivery address
   - Check your internet connection

3. **Backend Connection Issues**
   - Verify that the backend server is running
   - Check if the MongoDB connection is established
   - Ensure the correct port is being used

