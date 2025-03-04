
import { spawn } from 'child_process';

export const buildProject = async(path:string) => {
   console.log('initialising building for the project having id:-', path.split('output/')[1]);

   await runCommand('npm install',path);
   await runCommand('npm run build',path);
}


const runCommand = (command: string, path: string) => {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(" ");
    const process = spawn(cmd, args, { cwd: path, stdio: "inherit", shell: true });

    process.on("close", (code) => {
      if (code === 0) {
        console.log("Successful command", command);
        resolve("Successful command");
      } else {
        console.log(`${command} Process exited with code ${code}`);
        reject(`${command} Process exited with code ${code}`);
      }
    });
  });
};



export function getContentType(fileName: string): string {
    if (fileName.endsWith(".html")) return "text/html";
    if (fileName.endsWith(".css")) return "text/css";
    if (fileName.endsWith(".js")) return "application/javascript";
    if (fileName.endsWith(".json")) return "application/json";
    if (fileName.endsWith(".png")) return "image/png";
    if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
    return "application/octet-stream";
  }