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
exports.startEmulator = void 0;
const ora_1 = __importDefault(require("ora"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const utils_1 = require("../utils");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const log = console.log;
const startEmulator = ({ cmd, }) => __awaiter(void 0, void 0, void 0, function* () {
    const emulator = yield execAsync(`${cmd}adb.exe devices`);
    const spinner = (0, ora_1.default)('Starting emulator').start();
    if (!emulator.stdout.includes('emulator')) {
        (0, child_process_1.exec)(`${cmd}emulator.exe -avd $(${cmd}emulator.exe -list-avds) > /dev/null 2>&1`);
    }
    yield execAsync(`${cmd}adb.exe wait-for-device`);
    spinner.stop();
    const d1 = yield execAsync(`${cmd}adb.exe devices | grep -o "emulator-[0-9]*" ${(0, utils_1.removeLineEndings)()}`);
    log(`App will be installed on ${d1.stdout}`);
});
exports.startEmulator = startEmulator;
