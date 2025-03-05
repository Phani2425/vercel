import path from 'path'

export function getContentType(filePath:string):string {
    const ext = path.extname(filePath).toLowerCase();
  
    const mimeTypes:Record<string,string> = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".zip": "application/zip",
      ".mp4": "video/mp4",
      ".mp3": "audio/mpeg",
    };
  
    return mimeTypes[ext] || "application/octet-stream"; 
  }