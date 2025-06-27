# 🤖 AI Avatar Chatbot

A modern, interactive chatbot that combines AI conversation with real-time avatar streaming using HeyGen's technology and OpenAI's GPT models.

## ✨ Features

- **💬 Intelligent Chat**: Powered by OpenAI GPT-3.5 for natural conversations
- **🎭 Interactive Avatar**: Real-time streaming avatar that speaks your responses
- **🎨 Modern UI**: Beautiful, responsive chat interface
- **🔄 Conversation Memory**: Maintains context throughout your chat session
- **🖼️ Background Removal**: Advanced green screen removal for avatar
- **📱 Mobile Friendly**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- OpenAI API key (required for chat functionality)
- HeyGen API key (required for avatar functionality)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/HeyGen-Official/StreamingAvatar.git
   cd StreamingAvatar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Keys**:
   - The HeyGen API key is already configured in `index.js`
   - The OpenAI API key is configured in `server.js`
   - **Note**: The OpenAI key in the code is for demo purposes and may not work

4. **Start the server**:
   ```bash
   node server.js
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - Start chatting immediately!

## 🎮 How to Use

### Text-Only Chat
1. Simply type your message in the chat input
2. Press Enter or click Send
3. The AI will respond instantly

### Avatar-Enhanced Chat
1. **Optional**: Enter custom Avatar ID and Voice ID in the configuration panel
2. Click "Enable Avatar" to start the streaming session
3. Wait for connection (you'll see "Connected" status)
4. Now your messages will be spoken by the avatar!
5. Toggle background removal for a cleaner look

### Available Avatar Options
- Leave Avatar ID and Voice ID empty to use defaults
- Check [HeyGen's streaming avatar page](https://app.heygen.com/streaming-avatar) for available avatars
- Use the [List Voices API](https://docs.heygen.com/reference/list-voices-v2) to find voice IDs

## 🛠️ Configuration

### OpenAI API Setup
If the chat isn't working, you need to configure your OpenAI API key:

1. Get your API key from [OpenAI](https://platform.openai.com/api-keys)
2. Open `server.js`
3. Replace the API key in this line:
   ```javascript
   const openai = new OpenAI({
     apiKey: "your-openai-api-key-here",
   });
   ```

### HeyGen API Setup
The HeyGen API key is already configured, but if you need to use your own:

1. Get your API key from [HeyGen Settings](https://app.heygen.com/settings?nav=API)
2. Open `index.js`
3. Replace the API key in the `heygen_API` object

## 🔧 Features Explained

### Chat Intelligence
- **Context Awareness**: Remembers previous messages in the conversation
- **Natural Responses**: Uses GPT-3.5 for human-like interactions
- **Error Handling**: Graceful handling of API errors with helpful messages

### Avatar Streaming
- **Real-time WebRTC**: Low-latency streaming for natural interactions
- **Voice Synthesis**: Text-to-speech with customizable voices
- **Background Removal**: Advanced chromakey processing

### User Interface
- **Modern Design**: Clean, professional chat interface
- **Responsive Layout**: Works on all screen sizes
- **Real-time Status**: Shows connection and chat status
- **Typing Indicators**: Visual feedback during AI processing

## 🚨 Troubleshooting

### Common Issues

**Chat not responding:**
- Check that OpenAI API key is configured correctly
- Verify you have sufficient OpenAI credits
- Check browser console for error messages

**Avatar not connecting:**
- Ensure HeyGen API key is valid
- Check that you haven't exceeded concurrent session limits (3 sessions max)
- Try using default avatar settings (leave fields empty)

**Poor avatar quality:**
- Try different avatar IDs from HeyGen's public avatars
- Check your internet connection speed
- Enable background removal for cleaner appearance

### API Limits
- **HeyGen**: Maximum 3 concurrent sessions for testing
- **OpenAI**: Rate limits based on your API plan
- Sessions automatically close after inactivity

## 🔗 API Endpoints

The server provides several endpoints:

- `POST /openai/complete` - Chat with AI
- `GET /health` - Server health check
- `GET /chat/status` - Chat system status

## 📋 Development

### Project Structure
```
├── index.html          # Main chat interface
├── index.css           # Styling and animations
├── index.js            # Frontend chatbot logic
├── server.js           # Backend API server
├── package.json        # Dependencies
└── README.md           # This file
```

### Key Technologies
- **Frontend**: Vanilla JavaScript, WebRTC, Canvas API
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-3.5 Turbo
- **Avatar**: HeyGen Streaming API

## 🤝 Contributing

This is a demo project showcasing AI avatar integration. Feel free to:
- Fork and modify for your use case
- Add new features and improvements
- Report issues or suggestions

## 📄 License

ISC License - See package.json for details

---

**🎉 Ready to chat with your AI avatar? Start the server and begin your conversation!**
