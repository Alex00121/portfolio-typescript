import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { loadTodos, saveTodos } from '../storage';
import { Priority, Todo } from '../types';
import { priorityColor } from '../display';

interface AddOptions {
  priority?: string;
  due?: string;
  tags?: string;
}

export function addCommand(title: string, options: AddOptions): void {
  const priority = (options.priority as Priority) || 'medium';
  const validPriorities: Priority[] = ['low', 'medium', 'high'];

  if (!validPriorities.includes(priority)) {
    console.error(chalk.red(`Priorité invalide: "${priority}". Utilisez: low, medium, high`));
    process.exit(1);
  }

  if (options.due && !/^\d{4}-\d{2}-\d{2}$/.test(options.due)) {
    console.error(chalk.red(`Format de date invalide: "${options.due}". Utilisez: YYYY-MM-DD`));
    process.exit(1);
  }

  const todos = loadTodos();

  const todo: Todo = {
    id: uuidv4(),
    title: title.trim(),
    done: false,
    priority,
    dueDate: options.due || null,
    tags: options.tags ? options.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  todos.push(todo);
  saveTodos(todos);

  console.log(chalk.green('\n✅ Tâche ajoutée !'));
  console.log(`   ${chalk.white.bold(todo.title)}`);
  console.log(`   ID: ${chalk.dim(todo.id.slice(0, 8))}`);
  console.log(`   Priorité: ${priorityColor(priority, priority)}`);
  if (todo.dueDate) console.log(`   Échéance: ${chalk.cyan(todo.dueDate)}`);
  if (todo.tags.length > 0) console.log(`   Tags: ${chalk.magenta(todo.tags.join(', '))}`);
  console.log();
}
