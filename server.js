const express = require('express');
const OpenAI = require('openai')
const path = require('path');
const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: "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",
});

const systemSetup = `You are an AI assistant with an avatar that can speak to users through a streaming video interface. 

Your personality:
- Friendly, helpful, and conversational
- Professional but approachable  
- Knowledgeable across many topics
- Always try to be helpful and provide accurate information

Guidelines for responses:
- Keep responses concise but informative (1-3 sentences usually)
- Be natural and conversational in tone
- If you don't know something, admit it honestly
- Ask follow-up questions when appropriate to continue the conversation
- Remember you have a visual avatar, so you can refer to "seeing" the user or "speaking" to them
- Adapt your response length based on whether it will be spoken by the avatar (shorter) or just displayed as text

Please provide helpful, accurate, and engaging responses to user questions and conversations.`;

app.use(express.static(path.join(__dirname, '.')));

// Enhanced chat endpoint with conversation context
app.post('/openai/complete', async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;
    
    // Build conversation history for context
    const messages = [
      { role: 'system', content: systemSetup }
    ];
    
    // Add recent conversation history for context
    if (history && history.length > 0) {
      messages.push(...history.slice(-6)); // Keep last 6 messages for context
    }
    
    // Add current user message
    messages.push({ role: 'user', content: prompt });
    
    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
      max_tokens: 150, // Limit response length for better avatar speech
      temperature: 0.7, // Balanced creativity
    });

    const response = chatCompletion.choices[0].message.content;
    
    // Log the conversation for debugging
    console.log(`User: ${prompt}`);
    console.log(`AI: ${response}`);
    
    res.json({ text: response });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // Provide helpful error messages
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded. Please check your API credits.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'OpenAI API key is invalid. Please check the server configuration.';
    }
    
    res.status(500).json({ 
      error: 'OpenAI API Error',
      message: errorMessage 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      openai: openai.apiKey ? 'configured' : 'not configured',
      express: 'running'
    }
  });
});

// Chat status endpoint
app.get('/chat/status', (req, res) => {
  res.json({
    status: 'ready',
    features: {
      textChat: true,
      avatarIntegration: true,
      conversationHistory: true
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`🤖 AI Avatar Chatbot Server running on port ${PORT}!`);
  console.log(`🌐 Open http://localhost:${PORT} to start chatting`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  // Check OpenAI configuration
  if (openai.apiKey) {
    console.log(`✅ OpenAI API configured`);
  } else {
    console.log(`⚠️  OpenAI API key not found - chat will not work`);
  }
});
