'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as React from "react";

interface Doc{
    pageContent?: string,
}


interface IMessage {
    role: 'assistant' | 'user';
    content?: string;
    documents?: string[];
}

const ChatComponent: React.FC = () => {
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState<IMessage[]>([]);

    const handleSendChatMsg = async () => {
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        try {
            const res = await fetch(`http://localhost:8000/chat?message=${message}`);
            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            console.log(data);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setMessage('');
        }
    };

    return (
        <div className="p-4 flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold">Chat with PDF</div>

            <div className="w-full max-w-xl space-y-2">
                {/* Message Display */}
                <div className="space-y-1 bg-gray-100 p-4 rounded overflow-y-auto max-h-64">
                    {messages.map((msg, index) => (
                        <div key={index} className={`text-sm ${msg.role === 'user' ? 'text-blue-600' : 'text-green-700'}`}>
                            <strong>{msg.role}:</strong> {msg.content}
                        </div>
                    ))}
                </div>

                {/* Input and Button */}
                <div className="flex gap-2">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your question"
                    />
                    <Button
                        onClick={handleSendChatMsg}
                        disabled={!message.trim()}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;
