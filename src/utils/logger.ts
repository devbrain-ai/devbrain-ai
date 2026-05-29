import chalk from 'chalk';

export const logger = {
  info: (msg: string) => console.log(chalk.blue(msg)),
  success: (msg: string) => console.log(chalk.green(msg)),
  warn: (msg: string) => console.log(chalk.yellow(msg)),
  error: (msg: string, err?: any) => console.error(chalk.red(msg), err || ''),
  dim: (msg: string) => console.log(chalk.dim(msg))
};
