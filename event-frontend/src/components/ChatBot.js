import React, { useState } from 'react';
import axios from 'axios';
import { ChatDotsFill, XCircleFill, SendFill } from 'react-bootstrap-icons';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Hi! How can I help you today?", sender: 'bot' }]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput("");

        try {
            const res = await axios.post('http://localhost:8080/api/chat', { message: input });
            setMessages([...newMessages, { text: res.data.reply, sender: 'bot' }]);
        } catch (err) {
            setMessages([...newMessages, { text: "Sorry, I'm having trouble connecting.", sender: 'bot' }]);
        }
    };

    return (
        /* UPDATED: Changed positioning and added pointer-events logic */
        <div 
            className="fixed-bottom d-flex flex-column align-items-end p-3" 
            style={{ 
                zIndex: 2000, 
                left: 'auto', 
                right: '20px', 
                bottom: '20px',
                pointerEvents: 'none' // Allows clicking elements BEHIND the empty space of this div
            }}
        >
            {isOpen ? (
                <div 
                    className="card shadow-lg border-0 rounded-4 mb-2" 
                    style={{ 
                        width: '320px', 
                        height: '450px',
                        pointerEvents: 'auto' // Re-enable clicking for the actual chat window
                    }}
                >
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                        <div className="d-flex align-items-center">
                            <ChatDotsFill className="me-2" />
                            <span className="fw-bold">Event AI Assistant</span>
                        </div>
                        <XCircleFill 
                            onClick={() => setIsOpen(false)} 
                            style={{ cursor: 'pointer', opacity: 0.8 }} 
                        />
                    </div>
                    
                    <div className="card-body overflow-auto p-3" style={{ backgroundColor: '#f8f9fa' }}>
                        {messages.map((m, i) => (
                            <div key={i} className={`d-flex ${m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                                <div 
                                    className={`p-2 px-3 rounded-4 shadow-sm small ${
                                        m.sender === 'user' 
                                        ? 'bg-primary text-white' 
                                        : 'bg-white text-dark border'
                                    }`}
                                    style={{ maxWidth: '80%' }}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card-footer bg-white border-top p-3">
                        <div className="input-group shadow-sm rounded-pill overflow-hidden border">
                            <input 
                                type="text" 
                                className="form-control border-0 px-3" 
                                placeholder="Ask something..."
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
                            />
                            <button 
                                className="btn btn-primary border-0 px-3" 
                                onClick={sendMessage}
                            >
                                <SendFill />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button 
                    className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center" 
                    style={{ 
                        width: '60px', 
                        height: '60px', 
                        pointerEvents: 'auto', // Re-enable clicking for the button
                        transition: 'transform 0.2s'
                    }} 
                    onClick={() => setIsOpen(true)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <ChatDotsFill size={28} />
                </button>
            )}
        </div>
    );
};

export default ChatBot;