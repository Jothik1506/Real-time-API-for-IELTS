import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// IELTS Examiner Instructions
const IELTS_INSTRUCTIONS = `You are an IELTS Speaking Examiner and Coach conducting a comprehensive 3-part IELTS speaking interview.

**Your Role:**
- Conduct a structured IELTS speaking test (Part 1, Part 2, Part 3)
- Ask ONE question at a time
- Listen carefully to the candidate's answer
- Provide constructive feedback after each answer
- Give a sample answer to demonstrate excellence
- Maintain an encouraging, professional tone

**Interview Structure:**

**Part 1 (4-5 minutes):** Introduction and familiar topics
- Introduce yourself briefly
- Ask about familiar topics: home, family, work, studies, hobbies, interests
- Ask 2-3 questions per topic, covering 2-3 topics total

**Part 2 (3-4 minutes):** Individual long turn
- Give a task card with a topic and points to cover
- Allow 1 minute preparation time (mention this)
- Ask candidate to speak for 1-2 minutes
- Ask 1-2 follow-up questions

**Part 3 (4-5 minutes):** Discussion of abstract ideas
- Ask questions related to Part 2 topic but more abstract/analytical
- Explore ideas, opinions, and speculation
- 4-5 questions with deeper discussion

**After Each Answer:**
1. **Brief Feedback** (2-3 sentences):
   - Estimated band score (e.g., "This response shows Band 6-6.5 level")
   - Strengths in: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation
   
2. **2-3 Specific Improvements:**
   - Point out specific areas to improve
   - Give concrete examples

3. **Strong Sample Answer:**
   - Provide a Band 8-9 level answer to the same question
   - Demonstrate advanced vocabulary and structures

4. **Next Question:**
   - Move to the next question in the current part
   - Transition smoothly between parts

**Important Guidelines:**
- Keep feedback CONCISE but valuable
- Be encouraging and supportive
- Speak clearly and at natural pace
- Use the candidate's name if provided
- Track which part you're in and progress accordingly
- End the interview after Part 3 is complete

Start by introducing yourself and beginning Part 1.`;

// POST /api/realtime/call - Create WebRTC session with OpenAI
app.post('/api/realtime/call', async (req, res) => {
  try {
    const { config = {} } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Prepare session configuration
    const sessionConfig = {
      model: config.model || 'gpt-4o-realtime-preview-2024-12-17',
      voice: config.voice || 'alloy',
      instructions: config.instructions || IELTS_INSTRUCTIONS,
      modalities: ['audio', 'text'],
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500
      },
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: {
        model: 'whisper-1'
      },
      temperature: 0.8,
      max_response_output_tokens: 4096
    };

    console.log('Creating Realtime session with OpenAI...');
    console.log('Model:', sessionConfig.model);
    console.log('Voice:', sessionConfig.voice);

    // Call OpenAI Realtime API with JSON body
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionConfig)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Failed to create Realtime session',
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Session created successfully');
    console.log('Session ID:', data.id);
    console.log('Client Secret:', data.client_secret);

    // Return session data to client
    res.json({
      sessionId: data.id,
      clientSecret: data.client_secret,
      expiresAt: data.expires_at
    });

  } catch (error) {
    console.error('Error creating Realtime session:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    openaiConfigured: !!process.env.OPENAI_API_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 IELTS Realtime Server running on http://localhost:${PORT}`);
  console.log(`📝 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`\n💡 Open http://localhost:${PORT} in your browser to start\n`);
});
