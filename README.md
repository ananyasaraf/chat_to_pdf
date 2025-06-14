# 📚 PDF-RAG Chatbot

Chat with any PDF using powerful AI models via [OpenRouter](https://openrouter.ai), vector search with [Qdrant](https://qdrant.tech), and embeddings from LangChain.

---

## 🚀 Features

- 📄 Upload a PDF and store its chunks with vector embeddings
- 🤖 Ask natural-language questions about the PDF
- 🧠 Retrieval-augmented generation using vector search
- ⚡ Background queue processing with BullMQ
- 🧱 Qdrant for scalable vector storage
- 🎨 Clean ChatGPT-style frontend UI (React + Tailwind)

---

## 🧰 Tech Stack

| Layer       | Tech Used                         |
|-------------|-----------------------------------|
| Backend     | Node.js, Express, LangChain       |
| Vector DB   | Qdrant (localhost:6333)           |
| Queue       |  BullMQ,Valkey                    |
| Embeddings  | Google Generative AI Embeddings   |
| LLM         | OpenRouter (DeepSeek/Qwen3 models)|
| Frontend    | React, Tailwind CSS               |

---

## 🛠️ Installation

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/pdf-rag-chatbot.git
cd pdf-rag-chatbot 
---

### Install Server Dependencies####

cd server
pnpm install

###Install Client Dependencies###
cd ../client
pnpm install


Configuration
Backend Environment
Create a .env file in the server/ folder:

OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxx
GOOGLE_GENAI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxx
QDRANT_URL=http://localhost:6333
valkey_HOST=localhost
valkey_PORT=6379


 Run the App
Start Qdrant & valkey
Use Docker:
services:
  valkey:
    image: valkey/valkey
    ports:
      - 6379:6379      
  
  qdrant:
    image: qdrant/qdrant
    ports:
      - 6333:6333

Start Backend Server
cd Server
pnpm run dev

Start Frontend client
cd client
pnpm run dev
