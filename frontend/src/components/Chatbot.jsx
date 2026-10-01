import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const PREDEFINED_PROMPTS = [
  "What kinds of old photos do users struggle to retrieve?",
  "What information do people actually remember about a photo?",
  "What information have they forgotten?",
  "How do users formulate searches when their memory is incomplete?",
  "Why are Trips and Vacations the highest opportunity for Event Anchoring?"
];

const PREDEFINED_RESPONSES = {
  "What kinds of old photos do users struggle to retrieve?": "Based on our AI analysis of 3,239 scraped reviews, users struggle the most to retrieve two distinct categories:\n\n1. **Everyday Utility Images**: Screenshots of receipts, recipes, or Wi-Fi passwords. These lack inherent textual metadata.\n2. **Specific Event/Life Chapter Photos**: Images tied to specific colloquial memories (e.g., 'that small café during our Goa trip' or 'the medicine I took when I was sick last year'). Because these photos are buried chronologically and lack exact dates, users experience complete retrieval failure.",
  "What information do people actually remember about a photo?": "Our opportunity matrix reveals that human memory is highly associative rather than chronological. People strongly remember:\n\n- **Social Context**: Who they were with ('I was with my sister').\n- **General Visuals**: Distinct colors or objects ('I was wearing a red jacket').\n- **Life Chapters**: The broader event ('during my college graduation').\n\nUsers remember the *intent* and *context* of the photo, but current search engines only reward strict keyword matching.",
  "What information have they forgotten?": "Users suffer heavily from two phenomena, which cause the current Google Photos search engine to break down:\n\n1. **Temporal Confusion (Our #1 Friction Point)**: Users completely forget the exact year or month a photo was taken. They cannot search by rigid calendar dates.\n2. **Spatial Disorientation**: They forget the specific city name, exact GPS landmark, or the name of the curated album they created.\n\nWithout these rigid metadata points, the user is forced into endless, frustrating chronological scrolling.",
  "How do users formulate searches when their memory is incomplete?": "When memory is incomplete, users abandon keyword searches and naturally attempt to formulate **Semantic, Natural-Language Queries**. \n\nInstead of typing 'Goa June 2019', they will search for: *'That small cafe we went to during our Goa trip.'* \n\nBecause the current Google Photos engine relies on rigid chronological timelines and exact object detection, it completely fails to interpret this human intent. This proves that building an **Event Anchoring Search Engine** is our biggest product opportunity.",
  "Are potentially relevant results difficult to evaluate?": "Yes, absolutely. Because the current Google Photos search relies on exact visual matching rather than semantic context, a vague search returns hundreds of scattered images across a massive chronological feed.\n\nThis forces a massive **cognitive load** on the user. They must manually evaluate, scroll, and filter through visually similar but irrelevant photos. This overwhelming manual evaluation is exactly why users abandon the search. Event Anchoring solves this by semantically filtering out the noise.",
  "Why are Trips and Vacations the highest opportunity for Event Anchoring?": "Our data proves that Trips and Vacations generate the absolute highest volume of retrieval failures. This happens because of a perfect storm of memory mechanics:\n\n1. **High Photo Density**: Users take thousands of photos in a compressed 3 to 7 day window, creating massive photo clusters.\n2. **High Context Retention**: Years later, users remember exactly *who* they were with and *where* they went (the 'Event Anchor').\n3. **Zero Date Retention (Temporal Confusion)**: The brain completely deletes the exact calendar date of the trip.\n\nBecause users remember the Event but forget the Date, forcing them to search chronologically is guaranteed to fail. Building an Event Anchoring Search specifically for Travel is our most lucrative MVP."
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
      const lowerText = text.toLowerCase();
      let response = "Based on my analysis, Semantic Retrieval Failure and Temporal Confusion are the primary bottlenecks. I recommend focusing strictly on Event Anchoring to solve this.";
      
      // Ultra-robust Keyword Matching (handles typos)
      if (lowerText.includes("strug") || lowerText.includes("kind") || lowerText.includes("old photo")) {
        response = PREDEFINED_RESPONSES["What kinds of old photos do users struggle to retrieve?"];
      } else if (lowerText.includes("remember") || lowerText.includes("actual")) {
        response = PREDEFINED_RESPONSES["What information do people actually remember about a photo?"];
      } else if (lowerText.includes("forgot") || lowerText.includes("forget")) {
        response = PREDEFINED_RESPONSES["What information have they forgotten?"];
      } else if (lowerText.includes("search") || lowerText.includes("how") || lowerText.includes("formulate")) {
        response = PREDEFINED_RESPONSES["How do users formulate searches when their memory is incomplete?"];
      } else if (lowerText.includes("eval") || lowerText.includes("diff") || lowerText.includes("result")) {
        response = PREDEFINED_RESPONSES["Are potentially relevant results difficult to evaluate?"];
      } else if (lowerText.includes("trip") || lowerText.includes("vacation") || lowerText.includes("travel")) {
        response = PREDEFINED_RESPONSES["Why are Trips and Vacations the highest opportunity for Event Anchoring?"];
      } else if (PREDEFINED_RESPONSES[text]) {
        response = PREDEFINED_RESPONSES[text];
      }

      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const [inputText, setInputText] = useState("");

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

        <div className="chatbot-input-container" style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend(inputText);
                  setInputText("");
                }
              }}
              placeholder="Type your own question here..."
              style={{ flex: 1, padding: '12px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }}
              disabled={isTyping}
            />
            <button 
              onClick={() => {
                handleSend(inputText);
                setInputText("");
              }}
              disabled={isTyping || !inputText.trim()}
              style={{ padding: '12px 20px', borderRadius: '24px', backgroundColor: 'var(--google-blue)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Send
            </button>
          </div>
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
