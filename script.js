
const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMessageButton = document.querySelector("#send-message");

// Replace this with your real API key
const API_KEY = "AIzaSyDX3kW0iqq3ddvnjKOgY2TU8N8PT3BVtmo";
const API_URL = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1:generateText?key=${API_KEY}`;

const createMessageElement = (content, classes) => {
  const div = document.createElement("div");
  div.classList.add("message", classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async (userMessage) => {
  const requestBody = {
    prompt: {
      text: userMessage
    },
    temperature: 0.7,
    candidateCount: 1,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "API error");

    const text = data.candidates?.[0]?.output || "No response.";
    const botMessageContent = `<div class="message-text">${text}</div>`;
    const botMessageElement = createMessageElement(botMessageContent, "bot-message");

    // Remove the "thinking" indicator if present
    const lastMessage = chatBody.querySelector(".bot-message:last-child");
    if (lastMessage && lastMessage.querySelector(".thinking-indicator")) {
      chatBody.removeChild(lastMessage);
    }

    chatBody.appendChild(botMessageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = `<div class="message-text">Error: ${error.message}</div>`;
    const errorElement = createMessageElement(errorMessage, "bot-message");
    chatBody.appendChild(errorElement);
  }
};

const handleOutgoingMessage = (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message) return;

  messageInput.value = "";

  // Show user message
  const userMessageContent = `<div class="message-text">${message}</div>`;
  const userMessageElement = createMessageElement(userMessageContent, "user-message");
  chatBody.appendChild(userMessageElement);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Show bot thinking animation
  const botThinkingContent = `
    <svg class="chat-bot-logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
      <!-- SVG path omitted -->
    </svg>
    <div class="message-text">
      <div class="thinking-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>`;
  const botThinkingElement = createMessageElement(botThinkingContent, "bot-message");
  chatBody.appendChild(botThinkingElement);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Generate bot response
  generateBotResponse(message);
};

// Event Listeners
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleOutgoingMessage(e);
  }
});
sendMessageButton.addEventListener("click", (e) => {
  handleOutgoingMessage(e);
});