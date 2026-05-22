import chalk from 'chalk';
import Table from 'cli-table3';
import { Todo, Priority } from './types';

export function priorityColor(priority: Priority, text: string): string {
  switch (priority) {
    case 'high':
      return chalk.red.bold(text);
    case 'medium':
      return chalk.yellow(text);
    case 'low':
      return chalk.green(text);
  }
}

export function priorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    high: '🔴 haute',
    medium: '🟡 moyenne',
    low: '🟢 basse',
  };
  return labels[priority];
}

function isOverdue(todo: Todo): boolean {
  if (!todo.dueDate || todo.done) return false;
  return new Date(todo.dueDate) < new Date(new Date().toISOString().split('T')[0]);
}

function formatDueDate(todo: Todo): string {
  if (!todo.dueDate) return chalk.dim('—');
  if (isOverdue(todo)) return chalk.bgRed.white(` ${todo.dueDate} `);
  return chalk.cyan(todo.dueDate);
}

function formatTitle(todo: Todo): string {
  if (todo.done) return chalk.dim.strikethrough(todo.title);
  return todo.title;
}

function formatId(todo: Todo): string {
  return chalk.dim(todo.id.slice(0, 8));
}

export function printTodoTable(todos: Todo[]): void {
  if (todos.length === 0) {
    console.log(chalk.dim('\n  Aucune tâche trouvée.\n'));
    return;
  }

  const table = new Table({
    head: [
      chalk.white.bold('ID'),
      chalk.white.bold('Titre'),
      chalk.white.bold('Priorité'),
      chalk.white.bold('Échéance'),
      chalk.white.bold('Tags'),
      chalk.white.bold('Statut'),
    ],
    style: { head: [], border: ['dim'] },
    colWidths: [10, 35, 14, 14, 20, 10],
    wordWrap: true,
  });

  for (const todo of todos) {
    const status = todo.done
      ? chalk.green('✓ fait')
      : isOverdue(todo)
      ? chalk.red('⚠ retard')
      : chalk.blue('○ en cours');

    table.push([
      formatId(todo),
      formatTitle(todo),
      priorityLabel(todo.priority),
      formatDueDate(todo),
      todo.tags.length > 0 ? chalk.magenta(todo.tags.join(', ')) : chalk.dim('—'),
      status,
    ]);
  }

  console.log(table.toString());
}
