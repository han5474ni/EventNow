import React, { createContext, useContext } from 'react';
import useNotification from '../hooks/useNotification';
import NotificationContainer from '../components/common/Notification';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  } = useNotification();

  const contextValue = {
    addNotification,
    success,
    error,
    info,
    warning,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onDismiss={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
