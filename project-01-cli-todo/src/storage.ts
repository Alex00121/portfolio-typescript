import fs from 'fs';
import path from 'path';
import os from 'os';
import { Todo } from './types';

const TODO_FILE = path.join(os.homedir(), '.portfolio-todos.json');

export function loadTodos(): Todo[] {
  if (!fs.existsSync(TODO_FILE)) return [];
  try {
    const content = fs.readFileSync(TODO_FILE, 'utf-8');
    return JSON.parse(content) as Todo[];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

export function findById(todos: Todo[], id: string): Todo | undefined {
  return todos.find((t) => t.id === id || t.id.startsWith(id));
}
