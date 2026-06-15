UzPlagiat - Plagiarism Detection System

================================================
PROGRAMMING LANGUAGE(S) USED
================================================
- Backend: Python 3.10+
- Frontend: TypeScript / JavaScript
- Infrastructure: YAML (Docker Compose)

================================================
FRAMEWORK AND TECHNOLOGIES
================================================
Backend:
- FastAPI (High-performance web framework)
- Uvicorn (ASGI server)
- SQLAlchemy (Postgres ORM) & Beanie (MongoDB ODM)
- SentenceTransformers (Machine Learning text embedding)
- FAISS (Facebook AI Similarity Search for vector indexing)
- Stripe (Payment Gateway API)
- Google OAuth 2.0 (Authentication)

Frontend:
- Next.js 14 (React Framework)
- Tailwind CSS (Utility-first styling)
- Framer Motion (Smooth UI animations)
- Axios (HTTP client)
- Lucide React (Iconography)

================================================
DATABASE TYPE
================================================
This project uses a robust dual-database architecture:
1. PostgreSQL: A relational database used for structured, critical user data (Accounts, Authentication, Stripe Premium status).
2. MongoDB: A NoSQL document database used for analytics, flexible history tracking (Detection History logs), and IP-based rate limiting (Guest limits).

================================================
A BRIEF GUIDE TO GETTING STARTED
================================================

PREREQUISITES:
- Docker and Docker Compose installed
- Node.js (v18+) and npm installed
- Python 3.10+ (if running the backend locally without Docker)

STEP 1: ENVIRONMENT VARIABLES
Before starting the applications, ensure your environment variables are configured. 
- In the `backend/` folder, copy `.env.example` to `.env` and fill in your Stripe and Google OAuth keys.
- In the `frontend/` folder, copy `.env.example` to `.env` if necessary.

STEP 2: STARTING THE BACKEND
The entire backend infrastructure (FastAPI, PostgreSQL, and MongoDB) is containerized for easy setup.
1. Open your terminal and navigate to the `backend` folder.
2. Run the following command to build and start the containers:
   $ docker compose up --build

The API will be available at http://localhost:8000
The Swagger Documentation will be available at http://localhost:8000/docs

STEP 3: STARTING THE FRONTEND
1. Open a new terminal tab and navigate to the `frontend` folder.
2. Install the necessary Node dependencies:
   $ npm install
3. Start the Next.js development server:
   $ npm run dev

The web application will be accessible at http://localhost:3000

STEP 4: TESTING THE SYSTEM
1. Open http://localhost:3000 in your browser.
2. Paste text into the Plagiarism Checker (you have 5 free checks as a guest).
3. To test the premium system, create an account and click "Premium xarid qilish".
4. To add more texts to the plagiarism database, use the `POST /api/admin/upload-source` endpoint via Postman or the FastAPI docs.
