import chalk from 'chalk';
import { loadTodos } from '../storage';
import { Priority, Todo } from '../types';
import { printTodoTable } from '../display';

interface ListOptions {
  all?: boolean;
  done?: boolean;
  pending?: boolean;
  priority?: string;
  tag?: string;
}

export function listCommand(options: ListOptions): void {
  let todos = loadTodos();

  if (todos.length === 0) {
    console.log(chalk.dim('\n  Aucune tâche. Utilisez `todo add "Titre"` pour commencer.\n'));
    return;
  }

  if (options.done) {
    todos = todos.filter((t) => t.done);
  } else if (options.pending) {
    todos = todos.filter((t) => !t.done);
  } else if (!options.all) {
    todos = todos.filter((t) => !t.done);
  }

  if (options.priority) {
    const p = options.priority as Priority;
    todos = todos.filter((t) => t.priority === p);
  }

  if (options.tag) {
    todos = todos.filter((t) => t.tags.includes(options.tag!));
  }

  const label = options.done
    ? 'terminées'
    : options.pending || !options.all
    ? 'en cours'
    : 'toutes';

  console.log(chalk.bold(`\n📋 Tâches ${label} (${todos.length})\n`));
  printTodoTable(todos);
}
