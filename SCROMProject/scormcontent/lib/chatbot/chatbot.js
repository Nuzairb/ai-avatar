// Simple Q&A Chatbot
const chatbotData = [
  { question: "What is this course about?", answer: "This course teaches you how to handle guest complaints professionally at the front desk." },
  { question: "How do I complete the course?", answer: "Go through all the modules and follow the instructions. Your progress will be tracked automatically." },
  { question: "Who is this course for?", answer: "This course is for hotel front desk staff and anyone interested in guest service excellence." },
  { question: "How can I contact support?", answer: "Please contact your supervisor or the training department for support." },
  { question: "Hi", answer: "Hello! How can I help you today?" },
  { question: "Hello", answer: "Hi there! Do you have any questions about the course?" },
  { question: "How are you?", answer: "I'm just a chatbot, but I'm here to help you!" },
  { question: "What can you do?", answer: "I can answer your questions about this course and help guide you through the content." },
  { question: "Tell me a tip", answer: "Always listen carefully to guest concerns and respond with empathy." },
  { question: "Thank you", answer: "You're welcome! If you have more questions, just ask." },
  { question: "Bye", answer: "Goodbye! Have a great day and enjoy the course." }
];

function createChatbotUI() {
  const chatContainer = document.createElement('div');
  chatContainer.id = 'chatbot-container';
  chatContainer.innerHTML = `
    <div id="chatbot-header">Help Desk <span id="chatbot-close">×</span></div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input-area">
      <input id="chatbot-input" type="text" placeholder="Ask a question..." />
      <button id="chatbot-send">Send</button>
    </div>
  `;
  document.body.appendChild(chatContainer);

  document.getElementById('chatbot-close').onclick = () => chatContainer.style.display = 'none';
  document.getElementById('chatbot-send').onclick = sendMessage;
  document.getElementById('chatbot-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
  });

  // Close chatbot when clicking outside
  document.addEventListener('mousedown', function(event) {
    const btn = document.getElementById('chatbot-open-btn');
    if (
      chatContainer.style.display !== 'none' &&
      !chatContainer.contains(event.target) &&
      (!btn || !btn.contains(event.target))
    ) {
      chatContainer.style.display = 'none';
    }
  });
}

function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const userMsg = input.value.trim();
  if (!userMsg) return;
  messages.innerHTML += `<div class='chatbot-user'>${userMsg}</div>`;
  input.value = '';
  const response = getChatbotResponse(userMsg);
  setTimeout(() => {
    messages.innerHTML += `<div class='chatbot-bot'>${response}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 400);
}

function getChatbotResponse(userMsg) {
  const found = chatbotData.find(qa => userMsg.toLowerCase().includes(qa.question.toLowerCase()));
  if (found) return found.answer;
  // Try partial match
  for (const qa of chatbotData) {
    if (userMsg.toLowerCase().includes(qa.question.split(' ')[0].toLowerCase())) {
      return qa.answer;
    }
  }
  return "Sorry, I don't have an answer for that. Please try another question.";
}

// Add a button to open the chatbot
function addChatbotButton() {
  const btn = document.createElement('button');
  btn.id = 'chatbot-open-btn';
  btn.innerText = 'Chat with us';
  btn.onclick = function() {
    const container = document.getElementById('chatbot-container');
    if (container) container.style.display = 'block';
  };
  document.body.appendChild(btn);
}

window.addEventListener('DOMContentLoaded', () => {
  createChatbotUI();
  addChatbotButton();
  document.getElementById('chatbot-container').style.display = 'none';
});
