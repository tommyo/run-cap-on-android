import { Command } from 'commander';
import { promisify } from 'util';
import { exec } from 'child_process';
import ora from 'ora';
import chalk from 'chalk';
import { removeLineEndings } from './utils';
import { buildApp } from './functions/build';
import { startEmulator } from './functions/emulator';
import { installApp } from './functions/install';
import packageJson from '../package.json';

const execAsync = promisify(exec);

const log = console.log;

const version: string = packageJson.version;

const program = new Command();

program
  .version(version)
  .name('my-command')
  .requiredOption(
    '-id, --applicationId [applicationId]',
    'the application id to start'
  )
  .option(
    '-a, --androidFolder [androidFolder]',
    'the android folder relative to the project root'
  )
  .option('-s, --sdk [sdk]', 'location of the android sdk')
  .parse(process.argv);

async function main() {
  const { applicationId, androidFolder, sdk } = program.opts() as {
    applicationId: string;
    androidFolder?: string;
    sdk?: string;
  };

  const { stdout: currentUser } = await execAsync(
    `cd /mnt/c && cmd.exe /C echo %username% ${removeLineEndings()}`
  );

  const root = process.cwd();
  const spinner = ora('Running startup checks').start();

  const gradle = await execAsync(
    `gradle -v | grep "Gradle" | tr -d $'Gradle ' ${removeLineEndings()}`
  );

  if (gradle.stderr) {
    spinner.stop();
    log(
      'Gradle is not installed or not available. Please install it or add it to your path.'
    );
    return;
  }

  const linuxAdb = await execAsync(
    `adb --version | grep "Android Debug Bridge" | tr -d $'Android Debug Bridge version ' ${removeLineEndings()}`
  );

  if (linuxAdb.stderr) {
    spinner.stop();
    log(
      'ADB is not installed or not available on WSL. Please install it or add it to your path.'
    );
    return;
  }

  const cmd = ''; // 'cd /mnt/c && cmd.exe /C '
  const windowsAdb = await execAsync(
    `${cmd}adb --version | grep "Android Debug Bridge" | tr -d $'Android Debug Bridge version ' ${removeLineEndings()}`
  );

  if (windowsAdb.stderr) {
    spinner.stop();
    log(
      'ADB is not installed or not available on Windows. Please install it or add it to your path.'
    );
    return;
  }

  spinner.stop();

  log(`🥳 ${chalk.green.bold('All good!')}`);
  log(`Gradle is installed ${chalk.green.bold('📦v%s')}`, gradle.stdout);
  log(`ADB is installed on WSL ${chalk.green.bold('📦v%s')}`, linuxAdb.stdout);
  log(
    `ADB is installed on Windows ${chalk.green.bold('📦v%s')}`,
    windowsAdb.stdout
  );

  await buildApp({ currentUser, root, androidFolder, sdk });

  await startEmulator({ cmd });

  await installApp({ cmd, androidFolder, applicationId });
}

main().catch(e => {
  console.error(e);
});
