"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const util_1 = require("util");
const child_process_1 = require("child_process");
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("./utils");
const build_1 = require("./functions/build");
const emulator_1 = require("./functions/emulator");
const install_1 = require("./functions/install");
const package_json_1 = __importDefault(require("../package.json"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const log = console.log;
const version = package_json_1.default.version;
const program = new commander_1.Command();
program
    .version(version)
    .name('my-command')
    .requiredOption('-id, --applicationId [applicationId]', 'the application id to start')
    .option('-a, --androidFolder [androidFolder]', 'the android folder relative to the project root')
    .option('-s, --sdk [sdk]', 'location of the android sdk')
    .parse(process.argv);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { applicationId, androidFolder, sdk } = program.opts();
        const { stdout: currentUser } = yield execAsync(`cd /mnt/c && cmd.exe /C echo %username% ${(0, utils_1.removeLineEndings)()}`);
        const root = process.cwd();
        const spinner = (0, ora_1.default)('Running startup checks').start();
        const gradle = yield execAsync(`gradle -v | grep "Gradle" | tr -d $'Gradle ' ${(0, utils_1.removeLineEndings)()}`);
        if (gradle.stderr) {
            spinner.stop();
            log('Gradle is not installed or not available. Please install it or add it to your path.');
            return;
        }
        const linuxAdb = yield execAsync(`adb --version | grep "Android Debug Bridge" | tr -d $'Android Debug Bridge version ' ${(0, utils_1.removeLineEndings)()}`);
        if (linuxAdb.stderr) {
            spinner.stop();
            log('ADB is not installed or not available on WSL. Please install it or add it to your path.');
            return;
        }
        const cmd = ''; // 'cd /mnt/c && cmd.exe /C '
        const windowsAdb = yield execAsync(`${cmd}adb --version | grep "Android Debug Bridge" | tr -d $'Android Debug Bridge version ' ${(0, utils_1.removeLineEndings)()}`);
        if (windowsAdb.stderr) {
            spinner.stop();
            log('ADB is not installed or not available on Windows. Please install it or add it to your path.');
            return;
        }
        spinner.stop();
        log(`🥳 ${chalk_1.default.green.bold('All good!')}`);
        log(`Gradle is installed ${chalk_1.default.green.bold('📦v%s')}`, gradle.stdout);
        log(`ADB is installed on WSL ${chalk_1.default.green.bold('📦v%s')}`, linuxAdb.stdout);
        log(`ADB is installed on Windows ${chalk_1.default.green.bold('📦v%s')}`, windowsAdb.stdout);
        yield (0, build_1.buildApp)({ currentUser, root, androidFolder, sdk });
        yield (0, emulator_1.startEmulator)({ cmd });
        yield (0, install_1.installApp)({ cmd, androidFolder, applicationId });
    });
}
main().catch(e => {
    console.error(e);
});
