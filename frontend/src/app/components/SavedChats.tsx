import React, { useState, useEffect } from 'react';

interface SavedChat {
  chatRoomId: string;
  participants: string[];
  messages: string[];
}

const SavedChats: React.FC = () => {
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);

  useEffect(() => {
    fetch('/api/message') 
      .then((response) => response.json())
      .then((data) => setSavedChats(data))
      .catch((error) => console.error('Error fetching saved chats:', error));
  }, []);

  return (
    <div>
      <h3>Saved Chats</h3>
      <ul>
        {savedChats.map((chat, index) => (
          <li key={index}>
            Chat Room ID: {chat.chatRoomId}
            <ul>
              {chat.messages.map((message, messageIndex) => (
                <li key={messageIndex}>{message}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedChats;
