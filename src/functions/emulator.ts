import ora from 'ora';
import { promisify } from 'util';
import { exec } from 'child_process';
import { removeLineEndings } from '../utils';

const execAsync = promisify(exec);

const log = console.log;

export const startEmulator = async ({
  cmd,
}: {
  cmd: string;
}): Promise<void> => {
  const emulator = await execAsync(`${cmd}adb.exe devices`);

  const spinner = ora('Starting emulator').start();

  if (!emulator.stdout.includes('emulator')) {
    exec(
      `${cmd}emulator.exe -avd $(${cmd}emulator.exe -list-avds) > /dev/null 2>&1`
    );
  }

  await execAsync(`${cmd}adb.exe wait-for-device`);

  spinner.stop();

  const d1 = await execAsync(
    `${cmd}adb.exe devices | grep -o "emulator-[0-9]*" ${removeLineEndings()}`
  );

  log(`App will be installed on ${d1.stdout}`);
};
