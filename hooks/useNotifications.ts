import { useState, useEffect, useCallback } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Ensure this only runs on the client side
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ thông báo.');
      return;
    }
    
    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      new Notification('Thông báo đã được bật!', {
        body: 'Bạn sẽ nhận được thông báo về các hoạt động mới của nhóm.',
        icon: '/logo.png' 
      });
    } else if (result === 'denied') {
        alert('Bạn đã chặn thông báo. Vui lòng vào cài đặt trình duyệt để cho phép.');
    }
  }, []);
  
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      const notification = new Notification(title, options);
      notification.onclick = () => {
          window.focus();
      };
    }
  }, [permission]);

  return { permission, requestPermission, showNotification };
};