import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { Todo } from './types';

const TODO_FILE = path.join(os.homedir(), '.portfolio-todos.json');

export function loadTodos(): Todo[] {
  if (!fs.existsSync(TODO_FILE)) return [];
  try {
    const content = fs.readFileSync(TODO_FILE, 'utf-8');
    return JSON.parse(content) as Todo[];
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(chalk.red(`\n⚠️  Fichier de tâches corrompu (${TODO_FILE}). Sauvegardez-le avant de continuer.\n`));
      process.exit(1);
    }
    throw err;
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`\n❌ Impossible d'enregistrer les tâches: ${msg}\n`));
    process.exit(1);
  }
}

export function findById(todos: Todo[], id: string): Todo | undefined {
  if (!id) return undefined;
  const exact = todos.find((t) => t.id === id);
  if (exact) return exact;
  const matches = todos.filter((t) => t.id.startsWith(id));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    console.error(chalk.red(`\n⚠️  Identifiant ambigu: ${matches.length} tâches commencent par "${id}". Utilisez plus de caractères.\n`));
    process.exit(1);
  }
  return undefined;
}
