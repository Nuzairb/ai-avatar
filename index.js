'use strict';

// Configuration
const heygen_API = {
  apiKey: 'ZjExYmFkODliMGQ4NDBjNmIzOTNiN2M0NTE4MTY2MmMtMTc1MDk1MjAyOA==',
  serverUrl: 'https://api.heygen.com',
};

// Chatbot Class
class AvatarChatbot {
  constructor() {
    this.apiKey = heygen_API.apiKey;
    this.serverUrl = heygen_API.serverUrl;
    this.sessionInfo = null;
    this.peerConnection = null;
    this.avatarEnabled = false;
    this.isConnecting = false;
    this.messageHistory = [];
    
    this.initializeElements();
    this.attachEventListeners();
    this.updateStatus();
  }

  initializeElements() {
    // Avatar elements
    this.avatarIDInput = document.getElementById('avatarID');
    this.voiceIDInput = document.getElementById('voiceID');
    this.toggleAvatarBtn = document.getElementById('toggleAvatarBtn');
    this.mediaElement = document.getElementById('mediaElement');
    this.canvasElement = document.getElementById('canvasElement');
    this.avatarPlaceholder = document.getElementById('avatarPlaceholder');
    this.avatarControls = document.getElementById('avatarControls');
    this.avatarStatus = document.getElementById('avatarStatus');
    this.removeBGCheckbox = document.getElementById('removeBGCheckbox');
    
    // Chat elements
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.typingIndicator = document.getElementById('typingIndicator');
    
    // Status elements
    this.chatStatus = document.getElementById('chatStatus');
    this.avatarStatusText = document.getElementById('avatarStatusText');
  }

  attachEventListeners() {
    // Avatar controls
    this.toggleAvatarBtn.addEventListener('click', () => this.toggleAvatar());
    this.removeBGCheckbox.addEventListener('change', () => this.toggleBackgroundRemoval());
    
    // Chat controls
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Media element events
    this.mediaElement.onloadedmetadata = () => {
      console.log('Video metadata loaded');
      this.mediaElement.play().then(() => {
        console.log('Video playing successfully');
        this.showElement(this.avatarControls);
        this.hideElement(this.avatarPlaceholder);
        this.showElement(this.mediaElement);
      }).catch(err => {
        console.error('Error playing video:', err);
      });
    };
    
    this.mediaElement.oncanplay = () => {
      console.log('Video can start playing');
      this.showElement(this.mediaElement);
      this.hideElement(this.avatarPlaceholder);
    };
  }

  // Chat functionality
  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    this.chatInput.value = '';
    this.addMessage('user', message);
    this.showTyping(true);
    this.sendBtn.disabled = true;

    // SCORM Tracking: Track user message
    if (window.chatbotSCORM) {
      window.chatbotSCORM.trackUserMessage(message);
    }

    try {
      // Get AI response
      const aiResponse = await this.getAIResponse(message);
      this.addMessage('bot', aiResponse);
      
      // SCORM Tracking: Track AI response
      if (window.chatbotSCORM) {
        window.chatbotSCORM.trackAIResponse(aiResponse);
      }
      
      // Make avatar speak if enabled
      if (this.avatarEnabled && this.sessionInfo) {
        await this.makeAvatarSpeak(aiResponse);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    } finally {
      this.showTyping(false);
      this.sendBtn.disabled = false;
      this.chatInput.focus();
    }
  }

  async getAIResponse(message) {
    // Add to message history
    this.messageHistory.push({ role: 'user', content: message });
    
    const response = await fetch('/openai/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: message,
        history: this.messageHistory.slice(-10) // Keep last 10 messages for context
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.text;
    
    // Add AI response to history
    this.messageHistory.push({ role: 'assistant', content: aiResponse });
    
    return aiResponse;
  }

  addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = type === 'user' ? '👤' : '🤖';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textP = document.createElement('p');
    textP.textContent = content;
    
    const timeSmall = document.createElement('small');
    timeSmall.className = 'message-time';
    timeSmall.textContent = new Date().toLocaleTimeString();
    
    contentDiv.appendChild(textP);
    contentDiv.appendChild(timeSmall);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  showTyping(show) {
    if (show) {
      this.showElement(this.typingIndicator);
    } else {
      this.hideElement(this.typingIndicator);
    }
  }

  // Avatar functionality
  async toggleAvatar() {
    if (this.avatarEnabled) {
      await this.disableAvatar();
    } else {
      await this.enableAvatar();
    }
  }

  async enableAvatar() {
    if (this.isConnecting) return;
    
    this.isConnecting = true;
    this.toggleAvatarBtn.disabled = true;
    this.toggleAvatarBtn.textContent = 'Connecting...';
    this.updateAvatarStatus('Connecting...');

    try {
      // Use proper default HeyGen avatar and voice IDs
      const avatarId = this.avatarIDInput.value.trim() || 'josh_lite3_20230714';
      const voiceId = this.voiceIDInput.value.trim() || '2d5b0e6cf36f460aa7fc47e3eee4ba54';
      
      await this.createAvatarSession(avatarId, voiceId);
      await this.startAvatarStreaming();
      
      this.avatarEnabled = true;
      this.toggleAvatarBtn.textContent = 'Disable Avatar';
      this.toggleAvatarBtn.classList.add('enabled');
      this.updateAvatarStatus('Connected');
      
      // SCORM Tracking: Track avatar enabled
      if (window.chatbotSCORM) {
        window.chatbotSCORM.trackAvatarEnabled();
      }
      this.hideElement(this.avatarPlaceholder);
      this.showElement(this.mediaElement);
      
      // Ensure video element is properly displayed
      this.mediaElement.style.display = 'block';
      this.mediaElement.style.visibility = 'visible';
      
    } catch (error) {
      console.error('Failed to enable avatar:', error);
      this.updateAvatarStatus('Connection Failed');
      
      // More detailed error message
      let errorMessage = 'Failed to connect avatar. You can still chat with me in text mode!';
      if (error.message.includes('400')) {
        errorMessage = 'Invalid avatar or voice ID. Try leaving the fields empty to use defaults, or check HeyGen documentation for valid IDs.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Invalid API key. Please check the HeyGen API configuration.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Too many requests. You may have reached the concurrent session limit (3 max).';
      }
      
      this.addMessage('bot', errorMessage);
    } finally {
      this.isConnecting = false;
      this.toggleAvatarBtn.disabled = false;
    }
  }

  async disableAvatar() {
    try {
      if (this.sessionInfo) {
        await this.closeAvatarSession();
      }
      
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
      
      this.avatarEnabled = false;
      this.sessionInfo = null;
      this.toggleAvatarBtn.textContent = 'Enable Avatar';
      this.toggleAvatarBtn.classList.remove('enabled');
      this.updateAvatarStatus('Disconnected');
      this.hideElement(this.mediaElement);
      this.hideElement(this.canvasElement);
      this.hideElement(this.avatarControls);
      this.showElement(this.avatarPlaceholder);
      
      // SCORM Tracking: Track avatar disabled
      if (window.chatbotSCORM) {
        window.chatbotSCORM.trackAvatarDisabled();
      }
      
    } catch (error) {
      console.error('Error disabling avatar:', error);
    }
  }

  async createAvatarSession(avatarId, voiceId) {
    console.log('Creating avatar session with:', { avatarId, voiceId });
    
    const requestBody = {
      quality: 'low',
      avatar_name: avatarId,
      voice: { voice_id: voiceId },
    };
    
    const response = await fetch(`${this.serverUrl}/v1/streaming.new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      let errorMessage = `Failed to create session: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('HeyGen API Error:', errorData);
        if (errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }
      } catch (e) {
        console.error('Could not parse error response');
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Session created successfully:', data);
    this.sessionInfo = data.data;
    
    // Create WebRTC connection
    const { sdp: serverSdp, ice_servers2: iceServers } = this.sessionInfo;
    this.peerConnection = new RTCPeerConnection({ iceServers });
    
    // Handle incoming streams
    this.peerConnection.ontrack = (event) => {
      console.log('Received track:', event.track.kind);
      if (event.track.kind === 'audio' || event.track.kind === 'video') {
        this.mediaElement.srcObject = event.streams[0];
        console.log('Video stream assigned to media element');
        
        // Ensure video is visible and playing
        this.mediaElement.style.display = 'block';
        this.mediaElement.style.visibility = 'visible';
        this.showElement(this.mediaElement);
        this.hideElement(this.avatarPlaceholder);
      }
    };
    
    // Handle ICE candidates
    this.peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        this.handleICE(this.sessionInfo.session_id, candidate.toJSON());
      }
    };
    
    // Set remote description
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(serverSdp));
  }

  async startAvatarStreaming() {
    if (!this.sessionInfo || !this.peerConnection) {
      throw new Error('Session not initialized');
    }
    
    // Create and set local description
    const localDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(localDescription);
    
    // Start the session
    const response = await fetch(`${this.serverUrl}/v1/streaming.start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
      },
      body: JSON.stringify({
        session_id: this.sessionInfo.session_id,
        sdp: localDescription
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to start session: ${response.status}`);
    }
  }

  async makeAvatarSpeak(text) {
    if (!this.sessionInfo) return;
    
    try {
      const response = await fetch(`${this.serverUrl}/v1/streaming.task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
        },
        body: JSON.stringify({
          session_id: this.sessionInfo.session_id,
          text: text
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to make avatar speak:', response.status);
      }
    } catch (error) {
      console.error('Error making avatar speak:', error);
    }
  }

  async handleICE(sessionId, candidate) {
    try {
      await fetch(`${this.serverUrl}/v1/streaming.ice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
        },
        body: JSON.stringify({ session_id: sessionId, candidate }),
      });
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  async closeAvatarSession() {
    if (!this.sessionInfo) return;
    
    try {
      await fetch(`${this.serverUrl}/v1/streaming.stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
        },
        body: JSON.stringify({ session_id: this.sessionInfo.session_id }),
      });
    } catch (error) {
      console.error('Error closing session:', error);
    }
  }

  // Background removal functionality
  toggleBackgroundRemoval() {
    if (!this.avatarEnabled || !this.sessionInfo) {
      this.removeBGCheckbox.checked = false;
      return;
    }
    
    if (this.removeBGCheckbox.checked) {
      this.hideElement(this.mediaElement);
      this.showElement(this.canvasElement);
      this.startBackgroundRemoval();
    } else {
      this.hideElement(this.canvasElement);
      this.showElement(this.mediaElement);
      this.stopBackgroundRemoval();
    }
  }

  startBackgroundRemoval() {
    this.renderID = Math.random();
    const currentRenderID = this.renderID;
    
    const processFrame = () => {
      if (currentRenderID !== this.renderID || !this.removeBGCheckbox.checked) return;
      
      this.canvasElement.width = this.mediaElement.videoWidth;
      this.canvasElement.height = this.mediaElement.videoHeight;
      
      const ctx = this.canvasElement.getContext('2d');
      ctx.drawImage(this.mediaElement, 0, 0, this.canvasElement.width, this.canvasElement.height);
      
      const imageData = ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
      const data = imageData.data;
      
      // Remove green background
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        
        if (this.isCloseToGreen([red, green, blue])) {
          data[i + 3] = 0; // Make transparent
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(processFrame);
    };
    
    processFrame();
  }

  stopBackgroundRemoval() {
    this.renderID = null;
  }

  isCloseToGreen(color) {
    const [red, green, blue] = color;
    return green > 90 && red < 90 && blue < 90;
  }

  // Utility methods
  updateStatus() {
    this.chatStatus.textContent = 'Ready';
    this.avatarStatusText.textContent = this.avatarEnabled ? 'Connected' : 'Disabled';
  }

  updateAvatarStatus(status) {
    this.avatarStatus.textContent = status;
    this.avatarStatusText.textContent = status;
    
    if (status === 'Connected') {
      this.avatarStatus.classList.add('connected');
    } else {
      this.avatarStatus.classList.remove('connected');
    }
  }

  hideElement(element) {
    element.classList.add('hide');
    element.classList.remove('show');
    if (element === this.mediaElement) {
      element.style.display = 'none';
    }
  }

  showElement(element) {
    element.classList.add('show');
    element.classList.remove('hide');
    if (element === this.mediaElement) {
      element.style.display = 'block';
      element.style.visibility = 'visible';
    }
  }
}

// Initialize the chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
  new AvatarChatbot();
});
