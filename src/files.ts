import path from "path";
import fs from "fs";
import fg from "fast-glob"

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

// ANOTHER APPROACH
const getAllFilePath = async (rootPath: string): Promise<string[]> => {
    return await fg(`${rootPath}/**/*`, { onlyFiles: true,dot:true });
};

export {getAllFilePath};