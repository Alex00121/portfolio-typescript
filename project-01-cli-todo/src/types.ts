export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  completedAt: string | null;
}
