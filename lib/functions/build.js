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
exports.buildApp = void 0;
const ora_1 = __importDefault(require("ora"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const log = console.log;
const buildApp = ({ currentUser, root, androidFolder, sdk, }) => __awaiter(void 0, void 0, void 0, function* () {
    let spinner = (0, ora_1.default)('Running capacitor sync...').start();
    yield execAsync('npx cap sync', {
        cwd: root,
    });
    spinner.stop();
    log(`🆗 ${chalk_1.default.green.bold('Capacitor sync complete!')}`);
    spinner = (0, ora_1.default)('Initiating gradle sync, this might take a while...').start();
    yield execAsync('./gradlew syncDebugLibJars', {
        env: {
            ANDROID_SDK_ROOT: sdk || `/mnt/c/Users/${currentUser}/AppData/Local/Android/Sdk`,
        },
        cwd: `${root}/${androidFolder || ''}android`,
    });
    spinner.stop();
    log(`🆗 ${chalk_1.default.green.bold('Gradle sync complete!')}`);
    spinner = (0, ora_1.default)('Building your app, this might take a while...').start();
    yield execAsync('chmod +x ./gradlew', {
        cwd: `${root}/${androidFolder || ''}android`,
    });
    yield execAsync('./gradlew assembleDebug', {
        env: {
            ANDROID_SDK_ROOT: sdk || `/mnt/c/Users/${currentUser}/AppData/Local/Android/Sdk`,
        },
        cwd: `${root}/${androidFolder || ''}android`,
    });
    spinner.stop();
    log(`👷 ${chalk_1.default.green.bold('App built!')}`);
});
exports.buildApp = buildApp;
