# 🛍️ HandCraft – MERN Dropshipping Platform for Handcrafted Items

**HandCraftify** is a full-stack **MERN-based eCommerce platform** designed to facilitate seamless **dropshipping of handcrafted items**. The application offers a robust product management system, secure user authentication, integrated payment gateway, and an optimized order fulfillment workflow that supports both customers and vendors.

---

## 🚀 Tech Stack

**Frontend:** React.js, Redux Toolkit, React Router DOM, Axios, TailwindCSS / ShadCN UI  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT (JSON Web Token)  
**Payment Integration:** Razorpay
**Cloud & Storage:** Cloudinary (for image hosting)  
**Deployment:** Render 

---

## 🧩 Core Features

### 🛒 Customer-Facing Features
- View detailed product information with high-resolution images
- Secure checkout with integrated payment options  
- Real-time order status tracking and email notifications  

### 🧑‍💼 Admin Dashboard
- View customer activity and transaction history  

## ⚙️ System Architecture
Frontend (React) → Backend API (Express) → Database (MongoDB)
↓
Payment Gateway (Razorpay)
↓
Cloud Storage (Cloudinary)


---

## 🧰 Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Node.js ≥ 18
- MongoDB Atlas or local instance
- npm or yarn

### Steps to Run Locally

# Clone the repository
git clone [https://github.com/TusharAm9/HandCraft]
cd HandCraft

# Install dependencies for backend
cd Server
npm install

# Install dependencies for frontend
cd ../Frontend
npm install

# Create environment files
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


# Run backend
cd ../Server
npm run dev

# Run frontend
cd ../Frontend
npm start

