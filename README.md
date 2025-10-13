# 🚀 TickiSpot

**TickiSpot** is a modern **event management and ticketing platform** built with the MERN stack.  
It enables organizers to **create, manage, and promote events**, while users can **purchase tickets, join livestreams, and engage in real-time chat** — all in one seamless experience.

---

## 🧱 Tech Stack

**Frontend:** React.js, Context API, TailwindCSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Others:** JWT Authentication, Cloudinary, EmailJS, Socket.io  

---

## ⚙️ Getting Started

### 🧩 1. Clone the Repository
```bash
git clone https://github.com/Dcrony/Eventer.git
cd eventer
📦 2. Install Dependencies
Frontend:

bash
Copy code
cd client
npm install
Backend:

bash
Copy code
cd server
npm install

🔐 Environment Variables
Create .env files in both client and server directories:

🖥️ Server .env
env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYSTACK_SECRET=paystack_api_secret
PAYSTACK_CALLBACK=paystack_callback


🌐 Client .env
env
Copy code
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
REACT_APP_EMAILJS_USER_ID=your_emailjs_user_id
VITE_API_URL=http://localhost:5000/api


✅ Important:
Add these to .gitignore to protect your environment variables:

bash
Copy code
.env
.env.local
.env.production
If you’ve already committed .env, remove it from Git tracking:

bash
Copy code
git rm --cached .env
git commit -m "Removed .env from tracking"
git push

🧠 Running the App
Start Backend:
bash
Copy code
cd server
npm start

Start Frontend:
bash
Copy code
cd client
npm run dev
App runs locally at:

Frontend → http://localhost:3000

Backend API → http://localhost:5000

🪜 Branch Naming Convention
Branch	Purpose
main	Production-ready code
dev	Testing and staging
feature/*	New feature development
fix/*	Bug fixes
docs/*	Documentation updates

👥 Contributors
Name	Role	GitHub
Ibrahim Abdulmajeed (Dcrony)	Lead Fullstack Developer / Founder	@realdcrony
Mani	Fullstack Developer	—
Tojah	Fullstack Developer / Graphic Designer	—
Tee Shine (Nexa Tech)	Fullstack Developer	—

💡 Interested in contributing? Open an issue or pull request to get involved.

📁 Project Structure
bash
Copy code


tickispot/
│
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page views (Home, Events, etc.)
│   │   ├── contexts/      # Theme, Auth, and global context
│   │   ├── api/           # Axios configuration
│   │   ├── assets/        # Images, icons, etc.
│   │   └── App.js
│   └── package.json
│
├── server/                # Express backend
│   ├── controllers/       # Logic for each route
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication, validation, etc.
│   ├── config/            # DB connection and environment setup
│   └── server.js
│
└── README.md
🧾 License
Licensed under the MIT License — free to use, modify, and distribute with credit.

