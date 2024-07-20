import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Layout } from "../components";

interface Message {
  senderId: string;
  content: string;
}

interface DirectMessagingProps {
  userId: string;
}

const DirectMessaging: React.FC<DirectMessagingProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const socket = io('http://localhost:5173'); // Replace with your server URL

  useEffect(() => {
    socket.on(`receiveMessage_${userId}`, ({ senderId, content }: Message) => {
      setMessages(prevMessages => [...prevMessages, { senderId, content }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = () => {
    if (messageInput.trim() === '') return;

    axios.post<Message>('/messages', { receiverId: userId, content: messageInput })
      .then(response => {
        const { senderId, content } = response.data;
        setMessages(prevMessages => [...prevMessages, { senderId, content }]);
        setMessageInput(''); // Clear input after sending message
        socket.emit('sendMessage', { senderId, receiverId: userId, content });
      })
      .catch(error => console.error('Error sending message:', error));
  };

  return (
	<Layout expand={false} hasHeader={false}>

<div className="direct-messaging" style={{ marginTop: '20px' }}>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
	</Layout>

  );
};

export default DirectMessaging;
