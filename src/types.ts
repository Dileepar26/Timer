export interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  status: 'idle' | 'running' | 'paused' | 'completed';
  remainingTime: number;
  halfwayAlert: boolean;
  halfwayAlertTriggered: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface TimerHistory {
  id: string;
  name: string;
  category: string;
  duration: number;
  completedAt: number;
}

export type Theme = 'light' | 'dark';