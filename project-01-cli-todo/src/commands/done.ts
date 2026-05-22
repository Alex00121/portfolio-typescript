import chalk from 'chalk';
import { loadTodos, saveTodos, findById } from '../storage';

export function doneCommand(id: string): void {
  const todos = loadTodos();
  const todo = findById(todos, id);

  if (!todo) {
    console.error(chalk.red(`\n❌ Tâche introuvable: "${id}"\n`));
    process.exit(1);
  }

  if (todo.done) {
    console.log(chalk.yellow(`\n⚠️  Cette tâche est déjà marquée comme terminée !\n`));
    return;
  }

  todo.done = true;
  todo.completedAt = new Date().toISOString();
  saveTodos(todos);

  console.log(chalk.green('\n🎉 Félicitations ! Tâche terminée !'));
  console.log(`   ${chalk.white.bold(todo.title)}`);
  console.log(`   Terminée le: ${chalk.cyan(new Date().toLocaleDateString('fr-FR'))}`);
  console.log();
}
