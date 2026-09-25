import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const PREDEFINED_PROMPTS = [
  "What kinds of old photos do users struggle to retrieve?",
  "What information do people actually remember about a photo?",
  "What information have they forgotten?",
  "How do users formulate searches when their memory is incomplete?"
];

const PREDEFINED_RESPONSES = {
  "What kinds of old photos do users struggle to retrieve?": "Based on our AI analysis of 3,239 scraped reviews, users struggle the most to retrieve two distinct categories:\n\n1. **Everyday Utility Images**: Screenshots of receipts, recipes, or Wi-Fi passwords. These lack inherent textual metadata.\n2. **Specific Event/Life Chapter Photos**: Images tied to specific colloquial memories (e.g., 'that small café during our Goa trip' or 'the medicine I took when I was sick last year'). Because these photos are buried chronologically and lack exact dates, users experience complete retrieval failure.",
  "What information do people actually remember about a photo?": "Our opportunity matrix reveals that human memory is highly associative rather than chronological. People strongly remember:\n\n- **Social Context**: Who they were with ('I was with my sister').\n- **General Visuals**: Distinct colors or objects ('I was wearing a red jacket').\n- **Life Chapters**: The broader event ('during my college graduation').\n\nUsers remember the *intent* and *context* of the photo, but current search engines only reward strict keyword matching.",
  "What information have they forgotten?": "Users suffer heavily from two phenomena, which cause the current Google Photos search engine to break down:\n\n1. **Temporal Confusion (Our #1 Friction Point)**: Users completely forget the exact year or month a photo was taken. They cannot search by rigid calendar dates.\n2. **Spatial Disorientation**: They forget the specific city name, exact GPS landmark, or the name of the curated album they created.\n\nWithout these rigid metadata points, the user is forced into endless, frustrating chronological scrolling.",
  "How do users formulate searches when their memory is incomplete?": "When memory is incomplete, users abandon keyword searches and naturally attempt to formulate **Semantic, Natural-Language Queries**. \n\nInstead of typing 'Goa June 2019', they will search for: *'That small cafe we went to during our Goa trip.'* \n\nBecause the current Google Photos engine relies on rigid chronological timelines and exact object detection, it completely fails to interpret this human intent. This proves that building an **Event Anchoring Search Engine** is our biggest product opportunity."
};

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am the Google Photos Theme Intelligence Engine. Ask me questions about the 3,239 reviews I just analyzed." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setIsTyping(true);

    // Simulate AI thinking and generating a detailed response
    setTimeout(() => {
      const response = PREDEFINED_RESPONSES[text] || "Based on my analysis, Semantic Retrieval Failure and Temporal Confusion are the primary bottlenecks. I recommend focusing strictly on Event Anchoring to solve this.";
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className={`chatbot-overlay ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-backdrop" onClick={onClose}></div>
      <div className="chatbot-panel">
        <div className="chatbot-header">
          <div className="chatbot-title">
            <span className="chatbot-icon">🧠</span>
            Theme Intelligence AI
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-container ${msg.sender}`}>
              {msg.sender === 'ai' && <div className="chat-avatar">AI</div>}
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>
                    {line.includes('**') ? (
                      <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ) : line.startsWith('- ') ? (
                      <li style={{ marginLeft: '16px' }}>{line.replace('- ', '')}</li>
                    ) : (
                      line
                    )}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-container ai">
              <div className="chat-avatar">AI</div>
              <div className="chat-bubble ai typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-prompts">
          <p className="prompts-title">Select a Presentation Question:</p>
          <div className="prompts-list">
            {PREDEFINED_PROMPTS.map((prompt, idx) => (
              <button 
                key={idx} 
                className="prompt-chip" 
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                style={{ textAlign: 'left', whiteSpace: 'normal', height: 'auto', padding: '12px' }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
