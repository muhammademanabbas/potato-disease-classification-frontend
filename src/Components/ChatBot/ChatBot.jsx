import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
// The Chatbot component provides a floating chat icon that, when clicked,
// opens a chat interface for interaction with an AI bot.

const ChatBot = () => {
  // State variables for managing the chatbot's UI and data
  const [showChatbot, setShowChatbot] = useState(false); // Controls the visibility of the chatbox
  const [chatMessages, setChatMessages] = useState([]); // Stores the history of chat messages
  const [currentMessage, setCurrentMessage] = useState(""); // Stores the current message being typed by the user
  const [isBotTyping, setIsBotTyping] = useState(false); // Indicates if the bot is currently generating a response

  const username = useSelector(state=>state.auth.username)

  // Refs for DOM manipulation, particularly for auto-scrolling and input focusing
  const chatMessagesEndRef = useRef(null); // Reference to the bottom of the chat messages area for scrolling
  const chatInputRef = useRef(null); // Reference to the chat input field for focus management

  // useEffect hook to automatically scroll to the latest message whenever
  // new messages are added to the chatMessages array.
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // useEffect hook to add an initial greeting message from the bot
  // when the chatbot is first opened, provided no messages exist yet.
  useEffect(() => {
    if (showChatbot && chatMessages.length === 0) {
      setChatMessages([{ text: "Hi there! I'm your Potato Leaf Bot. How can I help you today?", sender: "bot" }]);
    }
  }, [showChatbot]);

  // Toggles the visibility of the chatbot interface.
  // When opening, it attempts to focus the input field after a slight delay.
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
    if (!showChatbot) {
      // Small delay to allow the modal to open before attempting to focus the input
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 100);
    }
  };

  // Handles changes to the chat input field, updating the currentMessage state.
  const handleChatMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  // Sends the user's message to the FastAPI backend and processes the bot's response.
  const sendChatMessage = async () => {
    // Only send if the message is not empty or just whitespace
    if (currentMessage.trim()) {
      const newUserMessage = { text: currentMessage, sender: "user" };
      // Add the user's message to the chat history
      setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setCurrentMessage(""); // Clear the input field
      setIsBotTyping(true); // Show the typing indicator

      try {
        // Corrected: The FastAPI backend expects a JSON payload with a 'message' field.
        const payload = { message: newUserMessage.text }; // *** Changed 'prompt' to 'message' here ***

        console.log(import.meta.env.GEMINI_CHAT_BOT)
        // ** IMPORTANT: Replace with the actual URL of your FastAPI backend **
        const apiUrl = String(import.meta.env.VITE_GEMINI_CHAT_BOT); // Assuming the frontend is served from the same domain as the backend or a proxy is set up
        console.log("The Url is ",apiUrl)

        // Make the API call to your FastAPI backend
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        // The FastAPI backend is designed to return {"response": "..."}
        if (response.ok && result && result.response) {
          const botResponseText = result.response;
          const botReply = { text: botResponseText, sender: "bot" };
          setChatMessages((prevMessages) => [...prevMessages, botReply]); // Add bot's response to chat history
        } else {
          // Fallback message if the backend's response is empty or malformed
          setChatMessages((prevMessages) => [...prevMessages, { text: "Bot: Sorry, I couldn't get a response from the server. Please try again.", sender: "bot" }]);
          console.error("Backend API response unexpected or error:", result);
        }
      } catch (error) {
        // Handle network or other unexpected errors during the API call
        console.error("Error calling backend API:", error);
        setChatMessages((prevMessages) => [...prevMessages, { text: "Bot: An error occurred while communicating with the server. Please try again.", sender: "bot" }]);
      } finally {
        setIsBotTyping(false); // Hide the typing indicator
        // Re-focus the input field after sending/receiving a message
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }
    }
  };

  // Handles keydown events in the input field, specifically for sending messages on Enter key press.
  const handleKeyDown = (event) => {
    // Allow Shift + Enter for new line in textarea
    if (event.key === "Enter" && !event.shiftKey && !isBotTyping) {
      event.preventDefault(); // Prevent default Enter behavior (new line)
      sendChatMessage();
    }
  };

  // Function to format message content for display, handling basic Markdown-like headings and bolding
  const formatMessageContent = (text) => {
    if (!text) return null;

    // Split text by newlines to process paragraphs/lines
    const lines = text.split('\n');

    return lines.map((line, index) => {
      // Check for Markdown-style headings (e.g., "# My Heading", "## Subheading")
      const headingMatch = line.match(/^(#+)\s*(.*)$/);
      if (headingMatch) {
        const headingLevel = headingMatch[1].length; // Count of '#' characters
        const headingText = headingMatch[2]; // The text after the hashes and space

        // Render as h1, h2, h3, etc., for semantic correctness and CSS application
        const HeadingTag = `h${Math.min(headingLevel, 6)}`; // Cap at h6
        return (
          <HeadingTag key={index} style={{ marginBottom: '0.2em' }}>
            {headingText}
          </HeadingTag>
        );
      }

      // Handle inline bold (**text**) and italic (*text*)
      // Using a simple regex replace and dangerouslySetInnerHTML for basic inline formatting.
      // For more robust solutions, consider a small, lightweight Markdown parser.
      let formattedLine = line;
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // **bold**
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');     // *italic*
      formattedLine = formattedLine.replace(/__(.*?)__/g, '<strong>$1</strong>'); // __bold__
      formattedLine = formattedLine.replace(/_(.*?)_/g, '<em>$1</em>');     // _italic_

      return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} style={{ marginBottom: '0.5em' }} />;
    });
  };

  // Effect to auto-resize the textarea based on its content
  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto'; // Reset height
      // Set height to scrollHeight, but cap at a reasonable max-height
      const maxHeight = 200; // Example max height in pixels
      chatInputRef.current.style.height = Math.min(chatInputRef.current.scrollHeight, maxHeight) + 'px';
      chatInputRef.current.style.overflowY = chatInputRef.current.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [currentMessage]); // Re-run when the current message changes

  return (
    <>
      {/* Custom CSS for animations and responsiveness */}
      <style>
        {`
          /* Base styles for the chatbot container, applies to all screen sizes initially */
          .chatbot-container {
            position: fixed; /* Always fixed relative to viewport */
            bottom: 1.5rem; /* Default bottom offset (e.g., for smaller desktop, or if mobile styling doesn't override fully) */
            right: 1.5rem;  /* Default right offset */
            width: 100%; /* Default to full width for small screens if not overridden */
            height: auto; /* Default height */
            max-width: 24rem; /* Max width for desktop (e.g., md:max-w-md) */
            max-height: 80vh; /* Max height to ensure it fits on screen */
            background-color: white;
            z-index: 50; /* Ensure it's above other content */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
            border-radius: 0.75rem; /* rounded-xl */
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease-in-out;
            transform: translateY(calc(100% + 1.5rem)); /* Start off-screen (icon height + gap) */
            /* This transform will handle sliding in/out for both mobile and desktop */
          }

          /* This class controls the "open" state */
          .chatbot-container.open {
            transform: translateY(0); /* Slide into view */
          }

          /* Mobile specific overrides (up to 768px, typical 'md' breakpoint) */
          @media (max-width: 768px) {
            .chatbot-container {
              top: 0; /* Take full height from top */
              left: 0; /* Take full width from left */
              width: 100vw; /* Full viewport width */
              height: 100%; /* Full viewport height */
              max-width: 100vw; /* Ensure max width is also full viewport */
              max-height: 100vh; /* Ensure max height is also full viewport */
              border-radius: 0; /* No rounded corners for full-screen mobile */
              /* bottom and right are implicitly overridden by top/left/width/height */
              /* transform is handled by the base .chatbot-container and .open rules */
              z-inedx-99;
            }
          }

          /* Styling for scrollable chat messages area */
          .chat-messages {
            overflow-y: auto;
            scroll-behavior: smooth;
          }

          /* Typing indicator animation */
          @keyframes typing-dot-bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-5px); }
          }
          .typing-dot {
            animation: typing-dot-bounce 0.6s infinite ease-in-out;
          }
          .typing-dot:nth-child(2) {
            animation-delay: 0.1s;
          }
          .typing-dot:nth-child(3) {
            animation-delay: 0.2s;
          }

          /* Default styling for chat message content */
          .chat-message-content {
            white-space: pre-wrap; /* Preserves whitespace and wraps text */
            word-break: break-word; /* Breaks long words if necessary */
          }

          /* Markdown specific styling for headings within chat messages */
          .chat-message-content h1,
          .chat-message-content h2,
          .chat-message-content h3,
          .chat-message-content h4,
          .chat-message-content h5,
          .chat-message-content h6 {
            font-weight: bold; /* Make all headings bold */
            margin-top: 0.5em; /* Add some space above headings */
            margin-bottom: 0.2em; /* Add some space below headings */
          }
          .chat-message-content h1 { font-size: 1.5em; }
          .chat-message-content h2 { font-size: 1.3em; }
          .chat-message-content h3 { font-size: 1.1em; }
          /* General paragraph spacing */
          .chat-message-content p {
            margin-bottom: 0.5em;
          }
          /* List styling */
          .chat-message-content ul,
          .chat-message-content ol {
            margin-left: 1.2em;
            margin-bottom: 0.5em;
          }
          .chat-message-content li {
            margin-bottom: 0.2em;
          }

          /* Styling for the textarea input field */
          textarea.chat-input {
            resize: none; /* Disable manual resizing by user */
            overflow-y: hidden; /* Hide scrollbar initially */
            min-height: 2.5rem; /* Equivalent to py-2 height for a single line */
            max-height: 10rem; /* Prevent it from growing too large, adjust as needed */
            padding-top: 0.625rem; /* Match px-4 py-2 visually for text alignment */
            padding-bottom: 0.625rem;
          }
        `}
      </style>

      {/* Chatbot Icon: Floats at the bottom right of the screen */}
      <div
        className="chatbot-icon fixed bottom-6 right-6 bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 z-40"
        onClick={toggleChatbot}
        title="Chat with Bot"
      >
        {/* Chatbot icon SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M4.804 21.607C5.314 20.317 6.434 19.5 8 19.5c.825 0 1.573.287 2.168.778l.587.587c.563.562 1.177.925 1.825 1.133a9.552 9.552 0 0 1 5.518-.584c.734-.135 1.43-.438 2.041-.895l.587-.587A9.5 9.5 0 0 0 16.5 8c0-1.657-.672-3.178-1.796-4.302a9.5 9.5 0 0 0-13.404 0C2.172 4.822 1.5 6.343 1.5 8c0 1.657.672 3.178 1.796 4.302a9.5 9.5 0 0 0 11.884 8.79l.587.586zM6.413 16.208a8 8 0 1 0 11.174-11.172L13.5 11.5v3c0 .562.224 1.096.61 1.481l1.118 1.118a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-1.72 1.72a.75.75 0 0 1-1.06 0L11.5 13.5h-3v-3a.75.75 0 0 0-1.06-.71l-3 3a.75.75 0 0 0 1.06 1.06l1.72-1.72a.75.75 0 0 1 1.06 0l1.118-1.118A2.25 2.25 0 0 0 16.5 8a8 8 0 0 0-11.313 11.313l-.1-.105z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Chatbot Interface: Hidden by default, slides up when 'showChatbot' is true */}
      <div className={`chatbot-container ${showChatbot ? 'open' : ''} flex flex-col`}>
        {/* Chatbot Header */}
        <div className="p-4 border-b bg-green-500 text-white flex justify-between items-center rounded-t-lg md:rounded-t-lg">
          <h2 className="text-lg font-semibold">Potato Leaf Bot</h2>
          {/* Close button for the chatbot */}
          <button onClick={toggleChatbot} className="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Messages Display Area */}
        <div className="chat-messages flex-grow p-4 overflow-y-auto bg-gray-50">
          {username && (
          <div className="flex justify-center items-center">
            <p className="text-lg text-gray-600 mb-4">
              Welcome,{" "}
              <span className="font-semibold text-green-600">{username+ "! "}&#x1F44B;</span>
            </p>
          </div>
        )}
          {chatMessages.length === 0 && !isBotTyping && (
            // Message displayed when no chat history exists
            <div className="text-center text-gray-500 italic mt-4">
              Type a message to start chatting with the bot!
            </div>
          )}
          {/* Render each message in the chat history */}
          {chatMessages.map((msg, index) => (
            <div key={index} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl max-w-[80%] ${msg.sender === 'user' ? 'bg-green-200 text-gray-800' : 'bg-gray-200 text-gray-800'} chat-message-content`}>
                {/* Render message content using the custom formatMessageContent function */}
                {formatMessageContent(msg.text)}
              </div>
            </div>
          ))}
          {/* Bot typing indicator */}
          {isBotTyping && (
            <div className="flex justify-start mb-3">
              <div className="p-3 rounded-xl bg-gray-200 text-gray-800 flex items-center space-x-1">
                <span className="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                <span className="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                <span className="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
              </div>
            </div>
          )}
          <div ref={chatMessagesEndRef} /> {/* Element to scroll into view for auto-scrolling */}
        </div>

        {/* Chat Input Area */}
        <div className="p-4 border-t flex items-center bg-white">
          <textarea
            ref={chatInputRef} // Attach ref for focusing and auto-resizing
            className="chat-input flex-grow border border-gray-300 rounded-xl px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={handleChatMessageChange}
            onKeyDown={handleKeyDown}
            disabled={isBotTyping} // Disable input while bot is typing
            rows="1" // Start with one row
          />
          {/* Send message button */}
          <button
            onClick={sendChatMessage}
            className="bg-green-600 text-white rounded-full p-3 shadow-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentMessage.trim() === "" || isBotTyping} // Disable if input is empty or bot is typing
          >
            {/* Send icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.542 60.542 0 0 0 18.44-5.218.75.75 0 0 0 0-1.217A60.55 60.55 0 0 0 3.478 2.405Z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;