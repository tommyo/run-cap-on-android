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
exports.installApp = void 0;
const ora_1 = __importDefault(require("ora"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const log = console.log;
const installApp = ({ cmd, androidFolder, applicationId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, ora_1.default)('Installing and starting the app').start();
    const install = yield execAsync(`powershell.exe /C adb install ${`${androidFolder || ''}`}android/app/build/outputs/apk/debug/app-debug.apk`);
    if (install.stderr) {
        throw new Error(install.stderr);
    }
    yield execAsync(`${cmd}adb.exe shell cmd activity start-activity $(${cmd}adb.exe shell cmd package resolve-activity --brief -c android.intent.category.LAUNCHER ${applicationId} | tail -1)`);
    spinner.stop();
    log(`🥳 ${chalk_1.default.green.bold('App installed and started!')}`);
});
exports.installApp = installApp;
