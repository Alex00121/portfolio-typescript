import chalk from 'chalk';
import inquirer from 'inquirer';
import { loadTodos, saveTodos } from './storage';
import { printTodoTable } from './display';
import { addCommand } from './commands/add';
import { statsCommand } from './commands/stats';
import { clearCommand } from './commands/clear';
import { Priority, Todo } from './types';

export async function launchInteractive(): Promise<void> {
  console.log(chalk.dim('Mode interactif — appuyez sur Ctrl+C pour quitter\n'));

  let running = true;

  while (running) {
    const todos = loadTodos();
    const pending = todos.filter((t) => !t.done).length;

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: chalk.cyan(`Que voulez-vous faire ? (${pending} tâche(s) en cours)`),
        choices: [
          { name: '➕  Ajouter une tâche', value: 'add' },
          { name: '📋  Voir les tâches', value: 'list' },
          { name: '✅  Marquer comme terminée', value: 'done' },
          { name: '🗑️   Supprimer une tâche', value: 'delete' },
          { name: '🧹  Supprimer les terminées', value: 'clear' },
          { name: '📊  Statistiques', value: 'stats' },
          new inquirer.Separator(),
          { name: '🚪  Quitter', value: 'quit' },
        ],
      },
    ]);

    switch (action) {
      case 'add': {
        const answers = await inquirer.prompt([
          { type: 'input', name: 'title', message: 'Titre de la tâche :', validate: (v) => v.trim().length > 0 || 'Le titre est requis' },
          {
            type: 'list',
            name: 'priority',
            message: 'Priorité :',
            choices: [
              { name: '🟢 Basse', value: 'low' },
              { name: '🟡 Moyenne', value: 'medium' },
              { name: '🔴 Haute', value: 'high' },
            ],
            default: 'medium',
          },
          {
            type: 'input',
            name: 'due',
            message: 'Échéance (YYYY-MM-DD, laisser vide) :',
            validate: (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Format invalide (YYYY-MM-DD)',
          },
          { type: 'input', name: 'tags', message: 'Tags (séparés par virgule, laisser vide) :' },
        ]);
        addCommand(answers.title, {
          priority: answers.priority,
          due: answers.due || undefined,
          tags: answers.tags || undefined,
        });
        break;
      }

      case 'list': {
        const { filter } = await inquirer.prompt([
          {
            type: 'list',
            name: 'filter',
            message: 'Afficher :',
            choices: [
              { name: 'Toutes les tâches', value: 'all' },
              { name: 'En cours uniquement', value: 'pending' },
              { name: 'Terminées uniquement', value: 'done' },
            ],
          },
        ]);
        const filtered =
          filter === 'all' ? todos : filter === 'done' ? todos.filter((t) => t.done) : todos.filter((t) => !t.done);
        console.log(chalk.bold(`\n📋 Tâches (${filtered.length})\n`));
        printTodoTable(filtered);
        break;
      }

      case 'done': {
        const pending = todos.filter((t) => !t.done);
        if (pending.length === 0) {
          console.log(chalk.dim('\n  Aucune tâche en cours.\n'));
          break;
        }
        const { selectedId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedId',
            message: 'Quelle tâche marquer comme terminée ?',
            choices: pending.map((t) => ({
              name: `[${t.id.slice(0, 8)}] ${t.title}`,
              value: t.id,
            })),
          },
        ]);
        const todo = todos.find((t) => t.id === selectedId)!;
        todo.done = true;
        todo.completedAt = new Date().toISOString();
        saveTodos(todos);
        console.log(chalk.green(`\n🎉 Tâche terminée : "${todo.title}"\n`));
        break;
      }

      case 'delete': {
        if (todos.length === 0) {
          console.log(chalk.dim('\n  Aucune tâche à supprimer.\n'));
          break;
        }
        const { selectedId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedId',
            message: 'Quelle tâche supprimer ?',
            choices: todos.map((t) => ({
              name: `[${t.id.slice(0, 8)}] ${t.title} ${t.done ? '(terminée)' : ''}`,
              value: t.id,
            })),
          },
        ]);
        const todo = todos.find((t) => t.id === selectedId)!;
        const { confirm } = await inquirer.prompt([
          { type: 'confirm', name: 'confirm', message: `Supprimer "${todo.title}" ?`, default: false },
        ]);
        if (confirm) {
          saveTodos(todos.filter((t) => t.id !== selectedId));
          console.log(chalk.green(`\n🗑️  Tâche supprimée : "${todo.title}"\n`));
        } else {
          console.log(chalk.dim('\nSuppression annulée.\n'));
        }
        break;
      }

      case 'clear':
        await clearCommand();
        break;

      case 'stats':
        statsCommand();
        break;

      case 'quit':
        running = false;
        console.log(chalk.cyan('\nAu revoir ! 👋\n'));
        break;
    }
  }
}
