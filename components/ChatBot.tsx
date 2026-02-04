

import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { chatWithGemini, ChatMessage } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatBotProps {
    contextData: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ contextData }) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        
        const newHistory: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
        setMessages(newHistory);
        setIsLoading(true);

        const aiResponse = await chatWithGemini(messages, userMsg, contextData);

        setMessages([...newHistory, { role: 'model', text: aiResponse }]);
        setIsLoading(false);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all duration-300 z-50 ${
                    isOpen ? 'bg-background-tertiary text-text-primary rotate-90' : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-110'
                }`}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <XMarkIcon className="w-6 h-6" /> : <ChatBubbleLeftRightIcon className="w-6 h-6" />}
            </button>

            {/* Chat Window */}
            <div 
                className={`fixed bottom-24 right-6 w-80 sm:w-96 bg-background-secondary rounded-2xl shadow-2xl flex flex-col transition-all duration-300 transform origin-bottom-right z-50 border border-border-primary ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
                }`}
                style={{ maxHeight: 'calc(100vh - 120px)', height: '500px' }}
            >
                {/* Header */}
                <div className="p-4 bg-primary-600 text-white rounded-t-2xl flex items-center shadow-md">
                    <SparklesIcon className="w-6 h-6 mr-2" />
                    <div>
                        <h3 className="font-bold">Trợ lý Thân Hữu AI</h3>
                        <p className="text-xs text-primary-100">Hỗ trợ bởi Gemini 3.0 Pro</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-primary">
                    {messages.length === 0 && (
                        <div className="text-center text-text-secondary mt-10">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-2 text-primary-300" />
                            <p>Xin chào! Tôi có thể giúp gì cho bạn về Nhóm Thân Hữu Phú Nhuận?</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                msg.role === 'user' 
                                ? 'bg-primary-600 text-white rounded-tr-none' 
                                : 'bg-background-tertiary text-text-primary rounded-tl-none border border-border-primary'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-background-tertiary px-4 py-2 rounded-2xl rounded-tl-none border border-border-primary flex items-center space-x-1">
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-border-primary bg-background-secondary rounded-b-2xl">
                    <div className="flex items-center space-x-2">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nhập câu hỏi của bạn..."
                            className="flex-1 px-4 py-2 bg-white border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-gray-900 placeholder-text-secondary"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputValue.trim() || isLoading}
                            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-background-tertiary disabled:text-text-secondary transition-colors"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
