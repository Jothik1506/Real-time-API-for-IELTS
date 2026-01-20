# IELTS Speaking Interview Bot - WebRTC

A real-time IELTS speaking practice application using OpenAI's Realtime API with WebRTC for low-latency audio streaming.

## Features

- ✅ **WebRTC Audio Streaming** - Low-latency bidirectional audio
- ✅ **Push-to-Talk** - Press and hold to speak
- ✅ **Interruption Support** - Interrupt the examiner anytime
- ✅ **Live Transcripts** - See your speech transcribed in real-time
- ✅ **IELTS Structure** - Complete 3-part interview (Part 1, 2, 3)
- ✅ **Detailed Feedback** - Band scores, criteria analysis, improvements
- ✅ **Sample Answers** - Learn from Band 8-9 responses
- ✅ **Conversation Log** - Track the entire interview

## Prerequisites

- Node.js 18+ installed
- OpenAI API key with Realtime API access
- Modern browser (Chrome, Edge, or Firefox recommended)

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3000
```

### 3. Start the Server

```bash
cd server
npm start
```

You should see:
```
🚀 IELTS Realtime Server running on http://localhost:3000
📝 OpenAI API Key: ✓ Configured
💡 Open http://localhost:3000 in your browser to start
```

### 4. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## How to Use

1. **Start Interview** - Click to request microphone access and connect
2. **Listen** - The AI examiner will introduce themselves and ask questions
3. **Respond** - Press and hold "Hold to Talk" button while speaking
4. **Release** - Let go when finished to send your response
5. **Review Feedback** - Check your band score, criteria, and improvements
6. **Continue** - The examiner will ask the next question

### Tips

- 💡 You can interrupt the examiner by pressing the Talk button while they're speaking
- 💡 Speak clearly and at a natural pace
- 💡 The interview follows standard IELTS structure (Part 1: 4-5 min, Part 2: 3-4 min, Part 3: 4-5 min)
- 💡 Review the sample answers to learn advanced vocabulary and structures

## Project Structure

```
d:\REAL TIME API\
├── server/
│   ├── server.js          # Express server with WebRTC endpoint
│   ├── package.json       # Dependencies
│   ├── .env              # Environment variables (create this)
│   └── .env.example      # Template
├── client/
│   ├── index.html        # UI structure
│   ├── styles.css        # Modern styling
│   └── app.js            # WebRTC client logic
└── main.py               # Reference WebSocket implementation
```

## Configuration

### Change Voice

Edit `client/app.js`:
```javascript
const CONFIG = {
    serverUrl: 'http://localhost:3000',
    model: 'gpt-4o-realtime-preview-2024-12-17',
    voice: 'alloy' // Options: alloy, echo, shimmer
};
```

### Change Model

Edit the same `CONFIG` object in `client/app.js` or modify `server/server.js` for server-side defaults.

### Customize Instructions

Edit `server/server.js` - look for `IELTS_INSTRUCTIONS` constant to modify the examiner's behavior.

## Troubleshooting

### Microphone Not Working
- Check browser permissions (click the lock icon in address bar)
- Ensure no other application is using the microphone
- Try a different browser

### Connection Failed
- Verify OpenAI API key is correct in `.env`
- Check that server is running on port 3000
- Check browser console for errors

### No Audio Output
- Check browser audio permissions
- Ensure speakers/headphones are working
- Check volume levels

### WebRTC Not Supported
- Use Chrome 90+, Edge 90+, or Firefox 88+
- Update your browser to the latest version

## Development

### Run in Development Mode

```bash
cd server
npm run dev
```

This uses Node's `--watch` flag to auto-restart on file changes.

### Debug Mode

Open browser DevTools (F12) and check:
- Console for logs
- Network tab for API calls
- Application > Storage for any issues

## API Reference

### POST /api/realtime/call

Creates a WebRTC session with OpenAI Realtime API.

**Request:**
```json
{
  "sdpOffer": "v=0\no=...",
  "config": {
    "model": "gpt-4o-realtime-preview-2024-12-17",
    "voice": "alloy"
  }
}
```

**Response:**
```json
{
  "sessionId": "sess_...",
  "clientSecret": {...},
  "expiresAt": 1234567890
}
```

## License

MIT

## Credits

Built with OpenAI Realtime API and WebRTC.
