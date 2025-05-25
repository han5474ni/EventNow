import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ notification, onDismiss }) => {
  const { id, message, type = 'info' } = notification;
  const timerRef = useRef();

  // Set up auto-dismiss timer
  useEffect(() => {
    if (notification.duration > 0) {
      timerRef.current = setTimeout(() => {
        onDismiss(id);
      }, notification.duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [id, notification.duration, onDismiss]);

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: '100%' }}
      className={`relative p-4 mb-2 rounded-lg border ${getBgColor()} shadow-lg max-w-sm w-full`}
    >
      <div className="flex items-start">
        <span className="text-xl mr-2 mt-0.5">{getIcon()}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const NotificationContainer = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-h-screen overflow-y-auto">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
