import chalk from 'chalk';
import inquirer from 'inquirer';
import { loadTodos, saveTodos, findById } from '../storage';

export async function deleteCommand(id: string): Promise<void> {
  const todos = loadTodos();
  const todo = findById(todos, id);

  if (!todo) {
    console.error(chalk.red(`\n❌ Tâche introuvable: "${id}"\n`));
    process.exit(1);
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Supprimer "${chalk.yellow(todo.title)}" ?`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(chalk.dim('\nSuppression annulée.\n'));
    return;
  }

  const filtered = todos.filter((t) => t.id !== todo.id);
  saveTodos(filtered);
  console.log(chalk.green(`\n🗑️  Tâche supprimée: "${todo.title}"\n`));
}
