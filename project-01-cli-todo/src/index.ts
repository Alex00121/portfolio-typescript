#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { doneCommand } from './commands/done';
import { deleteCommand } from './commands/delete';
import { clearCommand } from './commands/clear';
import { statsCommand } from './commands/stats';
import { launchInteractive } from './interactive';

const ASCII_HEADER = figlet.textSync('Todo CLI', {
  font: 'Small',
  horizontalLayout: 'default',
});

function printHeader(): void {
  console.log(chalk.cyan(ASCII_HEADER));
  console.log(chalk.dim('  Gestionnaire de tâches en ligne de commande — TypeScript\n'));
}

const program = new Command();

program
  .name('todo')
  .description('Gestionnaire de tâches CLI en TypeScript')
  .version('1.0.0');

program
  .command('add <title>')
  .description('Ajouter une nouvelle tâche')
  .option('-p, --priority <level>', 'Priorité: low | medium | high', 'medium')
  .option('-d, --due <date>', 'Date d\'échéance (YYYY-MM-DD)')
  .option('-t, --tags <tags>', 'Tags séparés par virgule')
  .action((title: string, options) => {
    printHeader();
    addCommand(title, options);
  });

program
  .command('list')
  .description('Lister les tâches')
  .option('-a, --all', 'Toutes les tâches')
  .option('--done', 'Tâches terminées uniquement')
  .option('--pending', 'Tâches en cours uniquement')
  .option('-p, --priority <level>', 'Filtrer par priorité')
  .option('-t, --tag <tag>', 'Filtrer par tag')
  .action((options) => {
    printHeader();
    listCommand(options);
  });

program
  .command('done <id>')
  .description('Marquer une tâche comme terminée')
  .action((id: string) => {
    printHeader();
    doneCommand(id);
  });

program
  .command('delete <id>')
  .description('Supprimer une tâche')
  .action(async (id: string) => {
    printHeader();
    await deleteCommand(id);
  });

program
  .command('clear')
  .description('Supprimer toutes les tâches terminées')
  .action(async () => {
    printHeader();
    await clearCommand();
  });

program
  .command('stats')
  .description('Afficher les statistiques')
  .action(() => {
    printHeader();
    statsCommand();
  });

if (process.argv.length <= 2) {
  printHeader();
  launchInteractive().catch(console.error);
} else {
  program.parse(process.argv);
}
