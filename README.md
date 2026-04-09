# 🤖 NexusAI - Premium MERN AI Chatbot

A full-stack, production-ready AI chatbot built using the **MERN** stack (MongoDB, Express, React, Node.js) and the **Google Gemini 1.5 Flash API**. 

Featuring a stunning dark-mode glassmorphism interface, token-by-token streaming responses (like ChatGPT), full authentication, and a complete conversation history database.

---

## ✨ Features

- **Streaming AI Responses**: Real-time token streaming using `Socket.io` and the Google Gemini API.
- **Beautiful UI/UX**: Custom-designed dark mode interface with glassmorphism components and animations.
- **Markdown & Code Support**: Full support for rendering Markdown lists, bold text, and syntax-highlighted code blocks with copy buttons.
- **Full Authentication**: Secure JWT-based login/register system with HTTP-only cookies.
- **Conversation History**: Chat sessions are automatically saved and organized in a sidebar.
- **Responsive Design**: Works perfectly on desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Zustand (State Management), React Router, Vanilla CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.js, Socket.io, JWT, bcryptjs.
- **Database**: MongoDB & Mongoose.
- **AI Service**: Google Generative AI (`@google/generative-ai`).

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (or local MongoDB server)
- A Generate API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/leomessi1077/chat-boat-.git
cd chat-boat-
```

### 2. Install dependencies

Since this is a full-stack application, you need to install node modules in both the `server` and `client` folders.

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 3. Setup Environment Variables

Go to the `server` folder and rename the `.env.example` file to `.env`:

```bash
cd ../server
cp .env.example .env
```

Open the `server/.env` file and insert your actual keys:

```ini
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_secure_random_string
GEMINI_API_KEY=your_google_ai_studio_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Run the Application

You will need two terminal windows to run both the frontend and backend servers simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*(You should see a message saying "MongoDB Connected" and "Server running on http://localhost:5000")*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### 5. Access the app
Open your browser and navigate to: **[http://localhost:5173](http://localhost:5173)**

Create an account, and you can start chatting with NexusAI immediately!

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
