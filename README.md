# GramSathi AI 🌾🤖

GramSathi AI is an intelligent agricultural Q&A and chat application built to assist farmers and agricultural enthusiasts. It leverages modern frontend technologies and advanced AI tools to provide context-aware, reliable answers based on agricultural datasets.

The project is divided into two main components:
1. **Frontend**: An Angular-based web application.
2. **Backend**: A FastAPI-based Python server utilizing LangChain, Qdrant (Vector DB), and Ollama for Retrieval-Augmented Generation (RAG).

---

## 🌟 Features

- **Interactive Chat Interface**: A modern, responsive chat UI built with Angular.
- **AI-Powered Responses**: Uses advanced Large Language Models via Ollama.
- **RAG Architecture**: Retrieves context from the `KisanVaani/agriculture-qa-english-only` dataset using Qdrant vector database.
- **Fast and Scalable**: Backend built with FastAPI for high performance.
- **Server-Side Rendering (SSR)**: Angular SSR support for better SEO and initial load times.

---

## 🏗️ Project Structure
```text
Gram Sathi AI/
├── frontend/                 # Angular Frontend Application
│   ├── src/                  # Frontend source code (components, services, etc.)
│   ├── backend/              # Python FastAPI Backend Services
│   │   ├── app/              # FastAPI application (routes, models, db)
│   │   ├── ingest_dataset.py # Script to load dataset into Qdrant Vector DB
│   │   ├── requirements.txt  # Python dependencies
│   │   └── ...
│   ├── package.json          # Node.js dependencies and scripts
│   └── ...
```
*(Note: The `backend` directory is currently nested inside the `frontend` folder based on the existing structure.)*

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)
- [Python 3.9+](https://www.python.org/downloads/)
- [Ollama](https://ollama.com/) (Must be installed and running locally for LLM inference)

---

## 🚀 Setup & Installation

### 1. Backend Setup (FastAPI + AI)

The backend handles the chat API, user authentication, and AI response generation using Qdrant and LangChain.

1. **Navigate to the backend directory**:
   ```bash
   cd "frontend/backend"
   ```

2. **Create and activate a virtual environment**:
   - **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Ingest the Knowledge Base (Dataset)**:
   This script downloads the agriculture QA dataset and indexes it into the local Qdrant Vector Database.
   ```bash
   python ingest_dataset.py
   ```
   *Wait for the "Dataset indexed successfully" message.*

5. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will start running at `http://127.0.0.1:8000`. You can view the automatically generated API documentation at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup (Angular)

The frontend provides the user interface for chatting and signing in.

1. **Open a new terminal window** and navigate to the `frontend` directory:
   ```bash
   cd "frontend"
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the Angular development server**:
   ```bash
   ng serve
   ```
   The frontend application will start running. Open your browser and navigate to `http://localhost:4200/`.

---

## 🧠 How the Project Works (Architecture)

1. **Data Ingestion**: Using `ingest_dataset.py`, agricultural questions and answers are embedded using Sentence Transformers and stored in a Qdrant vector database.
2. **User Query**: A user asks an agricultural question via the Angular Chat UI.
3. **API Request**: The frontend sends an HTTP request to the FastAPI backend.
4. **Vector Search (RAG)**: The backend embeds the user's query and searches the Qdrant database for the most relevant agricultural knowledge.
5. **LLM Generation**: The retrieved context + the user's query is sent to Ollama (via LangChain) to generate a helpful, accurate, and localized response.
6. **Response Display**: The text is streamed or returned to the Angular frontend and displayed to the user with typing animations.

---

## 🛠️ Available Commands

### Frontend
- **Start Dev Server**: `ng serve` (or `npm start`)
- **Build for Production**: `ng build`
- **Run SSR**: `npm run serve:ssr:frontend`
- **Run Tests**: `ng test` (uses Vitest)

### Backend
- **Start Server**: `uvicorn app.main:app --reload`
- **Ingest Data**: `python ingest_dataset.py`

## 🤝 Contributing

When contributing to this project, please ensure frontend changes are made within `frontend/src` and backend features/endpoints are added to `frontend/backend/app/`. Make sure to test both ends to ensure CORS and API structures align properly.
