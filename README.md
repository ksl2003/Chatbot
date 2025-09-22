# 🚀 ChitiChat

> **Your AI-Powered Conversational Sidekick**


Welcome to **ChitiChat** — the next-generation chatbot that brings your conversations to life! Powered by Google Gemini AI, ChitiChat is more than just a chatbot: it's your creative partner, productivity booster, and always-on assistant. Whether you're brainstorming, learning, or just having fun, ChitiChat is here to help — anytime, anywhere.

---

## ✨ Features at a Glance

- 🤖 **Smart AI Conversations** — Natural, context-aware replies powered by Google Gemini (Gemini 1.5 Flash)
- 🔒 **Secure Auth** — Robust sign-up/sign-in with JWT & bcrypt.js
- 💬 **Persistent Chat History** — Never lose a conversation, thanks to MongoDB
- 🖼️ **Image Uploads** — Share and view images in your chats (ImageKit.io)
- 📱 **Responsive UI** — Beautiful, modern design for all devices
- ⚡ **Real-Time Streaming** — Instant, streaming AI responses
- 🛠️ **Full-Stack Power** — Node.js, Express, React, MongoDB, and more

---

## 🖼️ Screenshots


- **Landing Page:** Eye-catching, modern welcome
- **Sign Up / Sign In:** Secure, stylish forms
- **Dashboard:** Start new chats with a click
- **Chat UI:** Animated bubbles, avatars, and image previews

---

## 🛠️ Tech Stack

**Frontend:**
- React.js, React Router DOM
- @tanstack/react-query
- ImageKit.io React SDK
- React Markdown
- Vite, CSS3

**Backend:**
- Node.js, Express.js
- MongoDB, Mongoose
- bcrypt.js, JWT
- dotenv, ImageKit.io Node SDK

**AI & Cloud:**
- Google Gemini (Generative AI)
- ImageKit.io
- Netlify

---

## ⚡ Quickstart

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB
- Google Cloud Project (Gemini API enabled)
- ImageKit.io account

### 2. Installation

**Clone the repo:**
```bash
git clone <your-repo-link>
cd ChatBot
```

**Backend:**
```bash
cd backend
npm install
```
Create a `.env` file in `/backend`:
```env
MONGO=<MongoDB Connection String>
JWT_SECRET=<JWT Secret>
IMAGE_KIT_ENDPOINT=<ImageKit Endpoint>
IMAGE_KIT_PUBLIC_KEY=<ImageKit Public Key>
IMAGE_KIT_PRIVATE_KEY=<ImageKit Private Key>
CLIENT_URL=http://localhost:3000
PORT=3001
```
Start the backend:
```bash
npm start
```

**Frontend:**
```bash
cd ../client
npm install
```
Create a `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_GEMINI_PUBLIC_KEY=<Google Gemini API Key>
VITE_IMAGE_KIT_ENDPOINT=<ImageKit Endpoint>
VITE_IMAGE_KIT_PUBLIC_KEY=<ImageKit Public Key>
```
Start the frontend:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start chatting!

---

## 🤝 Contribute

We 💙 open source! Found a bug? Have a feature idea? PRs and issues are welcome:

1. Fork this repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👋 Connect

**Sarthak Porwal**   
[Project Repo](https://github.com/sarthakporwal/chatbot)
