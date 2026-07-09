# 🧠 Synapse AI – Intelligent Gmail Assistant

<p align="center">
  <strong>An AI-powered Gmail Assistant built using React, Node.js, Supabase, Groq Llama 3.1, Retrieval-Augmented Generation (RAG), and Vector Embeddings.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-blue?logo=react">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?logo=node.js">
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase">
  <img src="https://img.shields.io/badge/Groq-LLM-orange">
  <img src="https://img.shields.io/badge/RAG-AI-red">
</p>

---

## 📖 Overview

Synapse AI is an AI-powered Gmail assistant designed to solve inbox overload by automatically extracting tasks, identifying deadlines, prioritizing emails, detecting phishing attempts, and enabling conversational search over emails using Retrieval-Augmented Generation (RAG).

Instead of manually scanning hundreds of emails, users can simply ask questions like:

> **"When is my assignment due?"**

or

> **"Show all high-priority tasks."**

Synapse AI intelligently retrieves the most relevant emails and provides accurate, context-aware responses.

---

# 🚀 Features

- 🔐 Secure Google OAuth2 Authentication
- 📩 Gmail Integration using Gmail API
- ✅ AI-powered Task & Deadline Extraction
- 🚨 Priority Classification (High / Medium /Low)
- 🏷️ Smart Email Labeling
- 🤖 Chat with Your Inbox
- 🔍 Semantic Search using RAG
- 🛡️ AI-powered Phishing Detection
- ⚡ Incremental Email Processing
- 📊 Interactive Productivity Dashboard

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- CSS

## Backend

- Node.js
- Express.js

## Database

- Supabase (PostgreSQL)
- pgvector

## AI

- Groq Cloud (Llama 3.1)
- Transformers.js
- Xenova/all-MiniLM-L6-v2

## APIs

- Google Gmail API
- Google OAuth2

---

# 🏗️ System Architecture

```
                  Google Gmail API
                          │
                          ▼
                 Fetch User Emails
                          │
                          ▼
                 Node.js Backend
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
   Task Extraction                Vector Embeddings
      (Groq LLM)                 (Transformers.js)
          │                               │
          ▼                               ▼
  Structured JSON                Semantic Search
          │                               │
          └───────────────┬───────────────┘
                          ▼
                Supabase + pgvector
                          │
                          ▼
                 React Dashboard
```

---

# ⚙️ Project Workflow

## 1. Authentication

- User logs in securely using Google OAuth2.
- Backend stores refresh tokens securely.
- Gmail permission is granted after authentication.

---

## 2. Email Ingestion

The application fetches recent emails using Gmail API.

Only required snippets and metadata are processed to improve efficiency.

---

## 3. AI Task Extraction

Email snippets are sent to Groq Llama 3.1.

The AI extracts:

- Tasks
- Deadlines
- Priority
- Labels

Example Output

```json
{
  "priority": "HIGH",
  "label": "APPLICATION_FORM",
  "tasks": [
    "Submit internship application",
    "Upload resume before Friday"
  ]
}
```

---

## 4. Incremental Processing

Before calling the AI, Synapse AI checks whether an email has already been processed.

If already processed:

- Results are fetched from Supabase.

Otherwise:

- AI processes the email.
- Results are stored for future use.

Benefits

- Faster Dashboard
- Lower API Cost
- Better Scalability

---

## 5. Retrieval-Augmented Generation (RAG)

When the user asks:

> "When is my assignment due?"

The system:

1. Converts the query into vector embeddings.
2. Searches similar emails using pgvector.
3. Retrieves relevant context.
4. Sends retrieved emails along with the query to Groq.
5. Generates a context-aware response.

---

# 🧠 AI Pipeline

### Step 1 — Embed

Convert email text into 384-dimensional vector embeddings using Transformers.js.

---

### Step 2 — Retrieve

Perform semantic similarity search using pgvector.

---

### Step 3 — Generate

Generate intelligent answers using Groq Llama 3.1 with retrieved email context.

---

# 🛡️ AI Phishing Detection

Synapse AI includes an intelligent phishing detection system.

The model identifies:

- Suspicious sender domains
- Social engineering attacks
- Fake urgency
- Credential stealing attempts
- Malicious links

This helps users identify potentially dangerous emails before interacting with them.

---

# 📂 Project Structure

```
Synapse-AI/
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── synapse-ai-agent.jsx
│
├── server/
│   ├── server.js
│   ├── embeddings.js
│   ├── llm.js
│   ├── actual-test.js
│   ├── test-extraction.js
│   ├── verify-env.js
│   ├── package.json
│   └── package-lock.json
│
├── package.json
├── vite.config.js
├── README.md
└── .env (Not Included)
```

---

# 📁 Important Files

| File | Description |
|------|-------------|
| `server/server.js` | Main Express server handling Gmail integration, API routing, authentication, task extraction, and RAG pipeline. |
| `server/llm.js` | Integrates Groq Llama 3.1 for AI inference. |
| `server/embeddings.js` | Generates vector embeddings using Transformers.js. |
| `server/test-extraction.js` | Tests task extraction functionality. |
| `server/actual-test.js` | Backend testing utilities. |
| `server/verify-env.js` | Validates environment variables before startup. |
| `src/synapse-ai-agent.jsx` | Core AI assistant UI component. |
| `src/App.jsx` | Root React component. |
| `src/main.jsx` | React application entry point. |

---

# 💡 Why Synapse AI?

Managing emails manually is time-consuming and inefficient.

Synapse AI solves this problem by:

- Automatically extracting actionable tasks.
- Identifying deadlines.
- Prioritizing emails intelligently.
- Allowing conversational email search.
- Detecting phishing attempts.
- Reducing API costs through incremental processing.

---

# 🔮 Future Improvements

- 📅 Google Calendar Integration
- 🔔 Smart Reminder Notifications
- 📱 Mobile Application
- 🌍 Multi-language Support
- 🎙️ Voice Assistant
- 📝 AI Email Summarization
- 👥 Team Workspace
- ⚡ Real-time Push Notifications

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/AVIS08/Synapse-AI.git
```

Move into the project directory

```bash
cd Synapse-AI
```

Install frontend dependencies

```bash
npm install
```

Start frontend

```bash
npm run dev
```

Install backend dependencies

```bash
cd server
npm install
```

Start backend

```bash
node server.js
```

---

# 🔑 Environment Variables

Create a `.env` file and configure the following variables:

```env
GROQ_API_KEY=

SUPABASE_URL=

SUPABASE_ANON_KEY=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REDIRECT_URI=
```

---

# 👨‍💻 Author

## Sarthak Agarwal

**B.Tech Computer Science Engineering**

Passionate about Artificial Intelligence, Full Stack Development, and Building Intelligent Applications.

GitHub: https://github.com/sarthak-yeti

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

Your support motivates future improvements and new AI projects.

---

## 📜 License

This project is developed for educational and learning purposes.

