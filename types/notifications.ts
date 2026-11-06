export type NotificationTone = 'info' | 'success' | 'warning' | 'achievement';

export interface ToastPayload {
  id: string;
  title: string;
  message: string;
  tone: NotificationTone;
  durationMs?: number;
}
