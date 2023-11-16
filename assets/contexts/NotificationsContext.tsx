import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
} from 'react';

import { useState } from 'react';
import { NotificationProps } from 'rsuite';

interface Notification {
  text: string;
  notificationProps?: NotificationProps;
}

type NotificationContextType = {
  notifications: Array<Notification>;
  addNotification: (notification: Notification) => void;
};

const NotificationsContext = createContext<NotificationContextType | null>(
  null
);

export const useNotificationsContext = () =>
  useContext(NotificationsContext) as NotificationContextType;

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  const addNotification = (notification: Notification) => {
    setNotifications([...notifications, notification]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}
