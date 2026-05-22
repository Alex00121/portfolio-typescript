import chalk from 'chalk';
import inquirer from 'inquirer';
import { loadTodos, saveTodos } from '../storage';

export async function clearCommand(): Promise<void> {
  const todos = loadTodos();
  const done = todos.filter((t) => t.done);

  if (done.length === 0) {
    console.log(chalk.dim('\n  Aucune tâche terminée à supprimer.\n'));
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Supprimer les ${chalk.yellow(done.length)} tâche(s) terminée(s) ?`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(chalk.dim('\nSuppression annulée.\n'));
    return;
  }

  const remaining = todos.filter((t) => !t.done);
  saveTodos(remaining);
  console.log(chalk.green(`\n🧹 ${done.length} tâche(s) terminée(s) supprimée(s).\n`));
}
