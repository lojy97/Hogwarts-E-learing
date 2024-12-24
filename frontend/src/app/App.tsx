import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}


const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};


const ChatPage: React.FC = () => {
  return <div>Chat Page</div>;
};

const App: React.FC = () => {
  return (
    <div className="app">
      <Notification message="Welcome to the chat!" type="info" /> {/* Pass props */}
      <ChatPage />
    </div>
  );
};

export default App;
