import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'info' | 'warning' | 'success'; 
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer); 
  }, []);

  if (!visible) return null;

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
