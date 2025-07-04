/**
 * SCORM Wrapper Integration for AI Avatar Chatbot
 * Bridges the chatbot functionality with SCORM tracking
 */

class ChatbotSCORMIntegration {
  constructor() {
    this.messageCount = 0;
    this.sessionStartTime = new Date();
    this.engagementScore = 0;
    this.avatarUsed = false;
    this.questionsAsked = 0;
    this.responsesReceived = 0;
    this.totalChatTime = 0;
    
    this.initializeTracking();
  }

  initializeTracking() {
    setTimeout(() => {
      if (window.scorm && window.scorm.isAvailable()) {
        console.log('SCORM tracking initialized for AI Chatbot');
        this.trackEvent('session_start', 'Session started', 'correct');
        this.updateProgress(0.1);
      } else {
        console.log('Running in standalone mode - no SCORM tracking');
      }
    }, 1000);
  }

  trackUserMessage(message) {
    this.messageCount++;
    this.questionsAsked++;
    
    this.trackEvent(
      `user_message_${this.messageCount}`,
      'fill-in',
      message,
      'correct',
      `User message: ${message.substring(0, 50)}...`
    );
    
    this.updateEngagementScore(5);
    
    const progress = Math.min(0.1 + (this.messageCount * 0.1), 0.8);
    this.updateProgress(progress);
    
    console.log(`SCORM: Tracked user message #${this.messageCount}`);
  }

  trackAIResponse(response) {
    this.responsesReceived++;
    
    this.trackEvent(
      `ai_response_${this.responsesReceived}`,
      'fill-in',
      response,
      'correct',
      `AI response: ${response.substring(0, 50)}...`
    );
    
    this.updateEngagementScore(3);
    
    console.log(`SCORM: Tracked AI response #${this.responsesReceived}`);
  }

  trackAvatarEnabled() {
    this.avatarUsed = true;
    
    this.trackEvent(
      'avatar_enabled',
      'true-false',
      'true',
      'correct',
      'User enabled avatar functionality'
    );
    
    this.updateEngagementScore(10);
    
    console.log('SCORM: Tracked avatar enabled');
  }

  trackAvatarDisabled() {
    this.trackEvent(
      'avatar_disabled',
      'true-false',
      'false',
      'correct',
      'User disabled avatar functionality'
    );
    
    console.log('SCORM: Tracked avatar disabled');
  }

  trackSessionComplete() {
    this.updateSessionTime();
    
    let finalScore = this.calculateFinalScore();
    
    if (window.scorm && window.scorm.isAvailable()) {
      window.scorm.setCompletionStatus('completed');
      window.scorm.setScore(finalScore);
      window.scorm.setProgressMeasure(1.0);
      
      this.trackEvent(
        'session_complete',
        'performance',
        finalScore.toString(),
        finalScore >= 80 ? 'correct' : 'incorrect',
        `Session completed with score: ${finalScore}`
      );
      
      window.scorm.commit();
    }
    
    console.log(`SCORM: Session completed with score: ${finalScore}`);
  }

  updateEngagementScore(points) {
    this.engagementScore += points;
    
    if (this.engagementScore % 20 === 0) {
      const currentScore = this.calculateCurrentScore();
      if (window.scorm && window.scorm.isAvailable()) {
        window.scorm.setScore(currentScore);
      }
    }
  }

  calculateCurrentScore() {
    let score = 0;
    
    score += Math.min(this.messageCount * 4, 40);
    
    if (this.avatarUsed) {
      score += 20;
    }
    
    const timeMinutes = (Date.now() - this.sessionStartTime) / (1000 * 60);
    score += Math.min(timeMinutes * 2, 20);
    
    const avgMessagesPerMinute = this.messageCount / Math.max(timeMinutes, 1);
    if (avgMessagesPerMinute > 0.5 && avgMessagesPerMinute < 5) {
      score += 20;
    }
    
    return Math.min(Math.round(score), 100);
  }

  calculateFinalScore() {
    let finalScore = this.calculateCurrentScore();
    finalScore += 10;
    return Math.min(finalScore, 100);
  }

  updateProgress(progress) {
    if (window.scorm && window.scorm.isAvailable()) {
      window.scorm.setProgressMeasure(progress);
    }
  }

  updateSessionTime() {
    this.totalChatTime = (Date.now() - this.sessionStartTime) / 1000;
    
    if (window.scorm && window.scorm.isAvailable()) {
      window.scorm.updateSessionTime();
    }
  }

  trackEvent(id, type, response, result, description = '') {
    if (window.scorm && window.scorm.isAvailable()) {
      window.scorm.addInteraction(id, type, response, result, description);
    }
  }

  getSessionStats() {
    return {
      messageCount: this.messageCount,
      questionsAsked: this.questionsAsked,
      responsesReceived: this.responsesReceived,
      avatarUsed: this.avatarUsed,
      engagementScore: this.engagementScore,
      currentScore: this.calculateCurrentScore(),
      sessionDuration: (Date.now() - this.sessionStartTime) / 1000,
      isComplete: this.messageCount >= 5 && this.responsesReceived >= 5
    };
  }

  markComplete() {
    this.trackSessionComplete();
  }
}

window.chatbotSCORM = new ChatbotSCORMIntegration();

setTimeout(() => {
  if (window.chatbotSCORM) {
    console.log('Auto-completing session after 30 minutes');
    window.chatbotSCORM.trackSessionComplete();
  }
}, 30 * 60 * 1000);

window.addEventListener('beforeunload', () => {
  if (window.chatbotSCORM && window.chatbotSCORM.getSessionStats().isComplete) {
    window.chatbotSCORM.trackSessionComplete();
  }
});
