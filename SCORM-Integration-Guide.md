# SCORM Integration Guide - AI Avatar Chatbot

## Overview

This guide explains how to integrate the AI Avatar Chatbot as a SCORM-compliant learning object that can be embedded in Learning Management Systems (LMS) like Articulate Rise, Storyline, Moodle, Canvas, and others.

## What is SCORM?

SCORM (Sharable Content Object Reference Model) is a set of technical standards for e-learning software products. It enables content to be delivered across different LMS platforms while maintaining tracking and reporting capabilities.

## Package Structure

The SCORM package includes:

```
ai-avatar-chatbot-scorm/
├── imsmanifest.xml          # SCORM manifest file
├── metadata.xml             # Learning object metadata
├── scorm-launcher.html      # Main entry point for LMS
├── scorm-api.js            # SCORM API communication
├── scorm-wrapper.js        # Chatbot-specific SCORM integration
├── index.html              # Original chatbot interface
├── index.js                # Chatbot functionality with SCORM tracking
├── index.css               # Styling
├── server.js               # Node.js server (for development)
├── package.json            # Dependencies
└── favicon.ico             # Icon
```

## Features

### Learning Analytics Tracking
- **User Messages**: Every message sent by the learner
- **AI Responses**: Every response from the chatbot
- **Avatar Usage**: When learners enable/disable the avatar
- **Session Duration**: Time spent interacting with the chatbot
- **Engagement Score**: Calculated based on interaction patterns
- **Completion Status**: Automatic completion tracking

### SCORM Compliance
- **SCORM 2004 4th Edition** compatibility
- **LMS Communication**: Bidirectional data exchange
- **Progress Tracking**: Real-time progress updates
- **Score Reporting**: Engagement-based scoring (0-100%)
- **Session Management**: Proper initialization and termination

## Quick Start Guide

### 1. Standalone Testing

First, test the SCORM package locally:

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open the SCORM launcher
http://localhost:3000/scorm-launcher.html
```

### 2. Creating SCORM Package

To create a deployable SCORM package:

1. **Zip all files** into a single archive
2. **Name the archive** with `.zip` extension (e.g., `ai-chatbot-scorm.zip`)
3. **Ensure `imsmanifest.xml`** is in the root directory

```bash
# Example package creation
zip -r ai-chatbot-scorm.zip *.html *.js *.css *.xml *.json *.ico
```

### 3. LMS Deployment

#### For Articulate Rise:
1. **Add Web Object**: Insert a "Web Object" block
2. **Upload ZIP**: Select your SCORM package
3. **Set Dimensions**: Recommended 800x600 minimum
4. **Configure Triggers**: Set completion triggers if needed

#### For Articulate Storyline:
1. **Insert Web Object**: Use Insert > Web Object
2. **Select SCORM Package**: Choose your .zip file
3. **Set Properties**: Configure size and behavior
4. **Add Triggers**: Create completion triggers
5. **Publish**: Export as SCORM package

#### For Generic LMS:
1. **Upload Package**: Use LMS course builder
2. **Add to Course**: Insert as learning activity
3. **Configure Settings**: Set completion criteria
4. **Test**: Verify tracking functionality

## Tracking and Analytics

### Engagement Scoring

The system calculates engagement scores based on:

| Activity | Points | Description |
|----------|--------|-------------|
| User Message | 5 | Each message sent by learner |
| AI Response | 3 | Each response received |
| Avatar Enabled | 10 | Bonus for using avatar feature |
| Session Time | 2/min | Up to 20 points for active time |
| Quality Interaction | 20 | Balanced conversation rate |
| Completion Bonus | 10 | For completing session |

### SCORM Data Elements

The package tracks these standard SCORM elements:

- `cmi.completion_status` - incomplete/completed
- `cmi.success_status` - unknown/passed/failed
- `cmi.score.raw` - 0-100 engagement score
- `cmi.score.scaled` - 0.0-1.0 normalized score
- `cmi.session_time` - ISO 8601 duration
- `cmi.progress_measure` - 0.0-1.0 progress
- `cmi.interactions.n.*` - Detailed interaction records

### Interaction Types

| Type | Description | Example |
|------|-------------|---------|
| `fill-in` | User messages and AI responses | Text conversations |
| `true-false` | Avatar enable/disable | Feature usage |
| `performance` | Session completion | Final scores |

## Configuration Options

### Avatar Settings

You can customize the default avatar and voice:

```javascript
// In index.js
const avatarId = 'josh_lite3_20230714';  // Default HeyGen avatar
const voiceId = '2d5b0e6cf36f460aa7fc47e3eee4ba54';  // Default voice
```

### SCORM Settings

Modify completion criteria in `scorm-wrapper.js`:

```javascript
// Completion requirements
isComplete: this.messageCount >= 5 && this.responsesReceived >= 5

// Auto-complete timeout (30 minutes)
setTimeout(() => {
  window.chatbotSCORM.trackSessionComplete();
}, 30 * 60 * 1000);
```

### Metadata Customization

Update `metadata.xml` for your specific needs:

```xml
<title>
  <langstring xml:lang="en">Your Custom Title</langstring>
</title>
<description>
  <langstring xml:lang="en">Your description</langstring>
</description>
<typicallearningtime>
  <datetime>PT30M</datetime>  <!-- 30 minutes -->
</typicallearningtime>
```

## Troubleshooting

### Common Issues

1. **SCORM API Not Found**
   - Ensure the package is properly embedded in LMS
   - Check browser console for errors
   - Verify LMS supports SCORM 2004

2. **Avatar Not Working**
   - Check internet connection
   - Verify HeyGen API key is valid
   - Ensure WebRTC is supported in browser

3. **Tracking Not Working**
   - Open browser developer tools
   - Check for SCORM API errors
   - Verify LMS is receiving data

4. **Completion Not Triggering**
   - Ensure minimum interactions are met
   - Check completion criteria settings
   - Verify LMS completion rules

### Debug Mode

Enable debug logging by opening browser console:

```javascript
// Check SCORM status
console.log('SCORM Available:', window.scorm.isAvailable());

// View session stats
console.log('Session Stats:', window.chatbotSCORM.getSessionStats());

// Manual completion (for testing)
window.chatbotSCORM.markComplete();
```

## Advanced Integration

### Custom Event Tracking

Add custom tracking events in your code:

```javascript
// Track specific topics
window.chatbotSCORM.trackEvent(
  'topic_customer_service',
  'performance', 
  'discussed',
  'correct',
  'User discussed customer service topics'
);

// Track feature usage
window.chatbotSCORM.trackEvent(
  'background_removal_used',
  'true-false',
  'true',
  'correct',
  'User enabled background removal'
);
```

### Custom Scoring

Modify the scoring algorithm in `scorm-wrapper.js`:

```javascript
calculateCurrentScore() {
  let score = 0;
  
  // Custom scoring logic
  score += this.messageCount * 3;  // 3 points per message
  score += this.avatarUsed ? 25 : 0;  // 25 points for avatar
  
  // Add your custom criteria
  if (this.specificTopicDiscussed) {
    score += 15;
  }
  
  return Math.min(score, 100);
}
```

### Integration with xAPI (Tin Can API)

For modern LMS supporting xAPI, you can extend the tracking:

```javascript
// Example xAPI statement
const statement = {
  actor: { name: learnerName, mbox: `mailto:${learnerEmail}` },
  verb: { id: 'http://adlnet.gov/expapi/verbs/completed' },
  object: { id: 'http://your-domain.com/chatbot-session' },
  result: { score: { scaled: 0.85 }, completion: true }
};
```

## Best Practices

### For Course Designers

1. **Set Clear Objectives**: Define what learners should achieve
2. **Provide Context**: Explain the chatbot's purpose
3. **Set Expectations**: Clarify completion requirements
4. **Follow Up**: Use tracked data for personalized feedback

### For Developers

1. **Test Thoroughly**: Test in target LMS environment
2. **Handle Errors**: Implement graceful error handling
3. **Optimize Performance**: Minimize file sizes
4. **Document Changes**: Keep track of customizations

### For LMS Administrators

1. **Verify Compatibility**: Ensure SCORM 2004 support
2. **Set Permissions**: Configure appropriate access levels
3. **Monitor Usage**: Review completion and engagement data
4. **Provide Support**: Train users on the interface

## Support and Maintenance

### Regular Updates

- **API Keys**: Monitor HeyGen API usage and limits
- **Dependencies**: Keep Node.js packages updated
- **Browser Compatibility**: Test with latest browsers
- **LMS Updates**: Verify compatibility with LMS updates

### Performance Monitoring

Track these metrics:
- **Completion Rates**: Percentage of learners completing
- **Engagement Scores**: Average interaction quality
- **Technical Issues**: Error rates and types
- **User Feedback**: Satisfaction and usability

## Conclusion

This SCORM integration transforms the AI Avatar Chatbot into a fully trackable learning experience suitable for any SCORM-compliant LMS. The comprehensive tracking, automatic completion detection, and detailed analytics provide valuable insights into learner engagement and learning outcomes.

For technical support or customization requests, please refer to the project documentation or contact the development team. 