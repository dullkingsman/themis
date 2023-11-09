import chalk from 'chalk';

export class Log {
  static e(message: string, tag: string): void {
    console.log(chalk.red(`[${tag ?? 'ERROR'}]:`), message);
  }

  static i(message: string, tag: string): void {
    console.log(chalk.gray(`[${tag ?? 'INFO'}]:`), message);
  }

  static w(message: string, tag: string): void {
    console.log(chalk.yellow(`[${tag ?? 'WARN'}]:`), message);
  }

  static s(message: string, tag: string): void {
    console.log(chalk.green(`[${tag ?? 'GREEN'}]:`), message);
  }

  static custom(
    message: string,
    tag = 'HTTP',
    tagColorizer = chalk.rgb(160, 90, 143),
  ): void {
    console.log(tagColorizer(`[${tag ?? 'HTTP'}]:`), message);
  }
}
