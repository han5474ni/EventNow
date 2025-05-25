import { useState, useCallback, useEffect } from 'react';

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [nextId, setNextId] = useState(0);

  const addNotification = useCallback(({ message, type = 'info', duration = 5000 }) => {
    const id = nextId;
    setNextId(prev => prev + 1);
    
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, [nextId]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message, duration = 5000) => {
    return addNotification({ message, type: 'success', duration });
  }, [addNotification]);

  const error = useCallback((message, duration = 5000) => {
    return addNotification({ message, type: 'error', duration });
  }, [addNotification]);

  const info = useCallback((message, duration = 5000) => {
    return addNotification({ message, type: 'info', duration });
  }, [addNotification]);

  const warning = useCallback((message, duration = 5000) => {
    return addNotification({ message, type: 'warning', duration });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };
};

export default useNotification;
