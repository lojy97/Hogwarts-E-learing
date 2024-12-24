import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiservice';
import Notification from '../components/Notification'; 
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const chatRoomId = ''; 

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await apiService.getConversationByChatRoom(chatRoomId);
        setMessages(data.messages);
      } catch (error) {
        console.error('Failed to fetch conversation:', error);
        setNotification('Failed to load conversation!');
      }
    };

    fetchConversation();
  }, [chatRoomId]);

  return (
    <div className="chat-room-container">
      {notification && <Notification message={notification} type="info" />}
      <div className="chat-room-header">Chat Room</div>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message._id} className="message">
            <div className="sender">{message.sender}</div>
            <div className="content">{message.content}</div>
          </div>
        ))}
      </div>
      {/* Add message input and send button */}
    </div>
  );
};

export default ChatPage;
