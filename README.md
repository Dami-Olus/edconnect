EdConnect SaaS Platform
EdConnect is a remote lessons platform for K–8, connecting teachers, students, and parents in an interactive online learning environment. Built with Next.js, TypeScript, Node.js, Express, and MongoDB.
🔍 Features
User Roles: Authentication and role-based access for teachers, students, and parents.


Programs & Courses: Teachers create programs, schedule classes, set availability, and manage enrollments.


Live Classes: Embedded Jitsi video for live lessons.


Assignments: Create, submit, grade, and view assignments and feedback.


Material Library: Upload and manage PDFs, images, and videos per class.


Dashboards: Tailored dashboards for teachers, students, and parents.


Notifications: In-app and email notifications.


📁 Repository Structure
backend/
├── controllers/       # Express controllers
├── models/            # Mongoose models
├── middlewares/       # Auth, error handling
├── routes/            # API route definitions
├── config/            # AWS, DB, environment setup
└── server.js          # App entry point

frontend/
├── components/        # Reusable React components
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages (Auth, Dashboard, etc.)
├── api/               # Frontend API wrappers
└── styles/            # Global styles

scripts/
└── seed.js            # Sample data seeding script

README.md
.env.example
package.json

🔧 Getting Started
Clone the repo

 git clone https://github.com/your-org/edconnect.git
cd edconnect


Install dependencies

 # Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install


Create .env files

 Copy .env.example to .env in both backend/ and frontend/ and set:

 # Backend
PORT=5050
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...
AWS_REGION=...
AWS_BUCKET=...

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:5050


Run the app

 # Start backend
cd backend && npm run dev

# Start frontend
cd ../frontend && npm run dev


Access the app at http://localhost:3000.
🚀 Scripts
npm run dev – Runs in development mode


npm run build – Builds for production


npm start – Starts the production server


npm run seed – Seeds the database with sample data


🛠 Technology Stack
Frontend: Next.js, React, TypeScript, Tailwind CSS


Backend: Node.js, Express, Mongoose, AWS S3


Database: MongoDB Atlas


🤝 Contributing
Fork the repository


Create a new branch: git checkout -b feat/your-feature


Commit your changes: git commit -m "feat: add new feature"


Push to branch: git push origin feat/your-feature


Open a Pull Request


📄 License
MIT License © [Your Name]

