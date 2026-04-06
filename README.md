# 🛒 MyShop — Full Stack Ecommerce Platform

A fully functional ecommerce web application built with the MERN stack, featuring Razorpay payment integration, JWT authentication, and a complete admin dashboard.

🔗 **Live Demo:** [ecommerce-dun-tau.vercel.app](https://ecommerce-dun-tau.vercel.app)  
🔗 **Backend API:** [ecommerce-production-7416.up.railway.app](https://ecommerce-production-7416.up.railway.app)

---

## ✨ Features

### Customer Side
- Browse products on a responsive homepage grid
- Register and login with JWT-based authentication
- Shopping cart with quantity controls, remove item, and clear cart
- Checkout with shipping address form and pincode auto-fill
- Razorpay payment integration (test mode)
- Order history page with full order details
- Cancel orders, request returns/replacements, and write reviews

### Admin Side
- Dashboard with stats: total revenue, orders, products, users
- Product management — add, edit, delete products
- Order management — mark as delivered, approve/reject return requests
- User management — view and delete users

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Tokens) |
| Payment | Razorpay |
| Deployment | Vercel (frontend), Railway (backend) |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Razorpay account (test keys)

### 1. Clone the repo
\`\`\`bash
git clone https://github.com/gokulmp-dev/ecommerce.git
cd ecommerce
\`\`\`

### 2. Setup Backend
\`\`\`bash
cd backend
npm install
\`\`\`

Create a \`.env\` file in the \`backend/\` folder:
\`\`\`env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=5000
\`\`\`

\`\`\`bash
node server.js
\`\`\`

### 3. Setup Frontend
\`\`\`bash
cd frontend
npm install
\`\`\`

Create a \`.env\` file in the \`frontend/\` folder:
\`\`\`env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

---

## 🌐 Deployment

| Service | Platform | Config |
|---|---|---|
| Frontend | Vercel | Root dir: \`frontend/\`, add env vars |
| Backend | Railway | Root dir: \`backend/\`, add env vars |

---

## 🔑 Test Credentials

For Razorpay test payments use card: \`4111 1111 1111 1111\`, any future date, any CVV.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
