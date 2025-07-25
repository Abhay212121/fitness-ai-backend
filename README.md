# 🧠 FitHub Backend – AI-Powered Fitness API

This is the backend server for **FitHub**, an AI-based fitness platform that generates personalized workout and diet plans based on user metrics and preferences. It also supports logging and tracking of mood and sleep for a holistic fitness approach.

## 🚀 Features

- 🔐 **JWT Authentication** – Secure user registration and login
- 🤖 **AI Integration** – Uses OpenAI API to generate custom fitness and diet plans
- 📝 **Smart Form Data Handling** – Collects and processes personal inputs (goals, sleep, mood, etc.)
- 📊 **Tracking Support** – Stores mood and sleep logs to monitor user wellness
- 🌐 **RESTful API** – Built with scalability and maintainability in mind

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL 
- **Authentication**: JWT, bcrypt
- **AI Integration**: OpenAI API
- **Environment Management**: dotenv

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key

## 🧪 Getting Started

📬 API Endpoints Overview
Method	Route	Description <br/>
POST	/api/auth/register	Register a new user <br/>
POST	/api/auth/login	Login and get JWT <br/>
POST	/api/plan/generate	Generate fitness/diet plan (AI) <br/>
POST	/api/track/mood	Log mood entry <br/>
POST	/api/track/sleep	Log sleep entry <br/>
GET	/api/track/mood	Get mood history <br/>
GET	/api/track/sleep	Get sleep history <br/>

📄 License
MIT License

👨‍💻 Author
Abhay Sharma
LinkedIn • GitHub
