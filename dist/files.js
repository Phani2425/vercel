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
exports.getAllFilePath = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
// const getAllFilePath = (rootPath:string) => {
//    let response:string[] = [];
//    const allfilesAndFolders = fs.readdirSync(rootPath);
//    allfilesAndFolders.forEach(file => {
//     const fullFilePath = path.join(rootPath,file);
//     if(fs.statSync(fullFilePath).isDirectory()){
//          response = response.concat(getAllFilePath(fullFilePath));
//     }else{
//         response.push(fullFilePath);
//     }
//    });
//    return response;
// }
const getAllFilePath = (rootPath) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, fast_glob_1.default)(`${rootPath}/**/*`, { onlyFiles: true, dot: true });
});
exports.getAllFilePath = getAllFilePath;
