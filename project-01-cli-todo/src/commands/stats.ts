import chalk from 'chalk';
import { loadTodos } from '../storage';

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}j ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}min`;
  return `${minutes}min`;
}

export function statsCommand(): void {
  const todos = loadTodos();
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const pending = total - done;
  const rate = total > 0 ? Math.round((done / total) * 100) : 0;

  const completedWithTimes = todos.filter((t) => t.done && t.completedAt);
  let avgDuration = '—';
  if (completedWithTimes.length > 0) {
    const totalMs = completedWithTimes.reduce((sum, t) => {
      return sum + (new Date(t.completedAt!).getTime() - new Date(t.createdAt).getTime());
    }, 0);
    avgDuration = formatDuration(totalMs / completedWithTimes.length);
  }

  const highCount = todos.filter((t) => t.priority === 'high' && !t.done).length;
  const overdueCount = todos.filter((t) => {
    if (!t.dueDate || t.done) return false;
    return new Date(t.dueDate) < new Date(new Date().toISOString().split('T')[0]);
  }).length;

  console.log(chalk.bold('\n📊 Statistiques\n'));
  console.log(`  Total        : ${chalk.white.bold(total)}`);
  console.log(`  Terminées    : ${chalk.green(done)}`);
  console.log(`  En cours     : ${chalk.blue(pending)}`);
  console.log(`  Taux         : ${rate >= 80 ? chalk.green(`${rate}%`) : rate >= 50 ? chalk.yellow(`${rate}%`) : chalk.red(`${rate}%`)}`);
  console.log(`  Durée moy.   : ${chalk.cyan(avgDuration)}`);
  console.log(`  Urgentes     : ${highCount > 0 ? chalk.red(highCount) : chalk.dim('0')}`);
  console.log(`  En retard    : ${overdueCount > 0 ? chalk.bgRed.white(` ${overdueCount} `) : chalk.dim('0')}`);
  console.log();
}
