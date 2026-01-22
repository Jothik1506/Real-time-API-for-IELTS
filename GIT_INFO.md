# Git Repository

## Repository URL
https://github.com/Jothik1506/Real-time-API-for-IELTS.git

## Important Security Notes

✅ **API Key Protection**
- The `.env` file containing your OpenAI API key is **excluded** from Git via `.gitignore`
- Only `.env.example` (template without actual key) is committed to the repository
- Your API key is safe and will never be pushed to GitHub

## Setup for New Users

When someone clones this repository, they need to:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jothik1506/Real-time-API-for-IELTS.git
   cd Real-time-API-for-IELTS
   ```

2. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Add their own OpenAI API key**
   - Edit `server/.env`
   - Replace `your-api-key-here` with their actual OpenAI API key

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open browser**
   - Navigate to http://localhost:3000

## Latest Commit

Initial commit with complete IELTS Speaking Interview Bot implementation:
- WebRTC audio streaming
- OpenAI Realtime API integration
- Push-to-talk functionality
- IELTS 3-part interview structure
- Real-time feedback and transcription
- Modern dark mode UI

## Files Committed

- `.gitignore` - Excludes sensitive files
- `README.md` - Complete setup guide
- `QUICKSTART.md` - Quick start instructions
- `client/` - Frontend (HTML, CSS, JS)
- `server/` - Backend (Node.js, Express)
- `server/.env.example` - Environment template (no actual API key)
