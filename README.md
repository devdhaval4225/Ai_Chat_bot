# AI Chat Bot Clone

A Node.js API service for AI chat bots, supporting multiple AI providers.

## Features

- REST API for chat bot interactions
- Supports OpenAI, Mistral AI, Gemini, and DeepSeek
- Daily usage limits
- Sequelize ORM for MySQL database

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MySQL server
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your database and API keys.

4. **Run database migrations (if using CLI):**
   ```bash
   npx run migrate
   ```

5. **Run database seeder (if using CLI):**
   ```bash
   npn run seed
   ```

6. **Start the API service:**
   ```bash
   npm run dev
   ```
   Or for production with PM2:
   ```bash
   pm2 start service.js --time --name "api"
   ```

## Environment Variables

See `.env.example` for all required variables:
- `PORT`: API server port
- `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_DIALECT`: MySQL connection
- `SECRET_KEY`: Internal and external Opration secret
- `OPEN_AI_API_KEY`, `MISTRAL_AI_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`: AI provider keys
- `DAILY_LIMIT`: Daily usage limit per user

## Usage

- Send requests to the API endpoints as documented in your codebase.
- Integrate with your frontend or other services.