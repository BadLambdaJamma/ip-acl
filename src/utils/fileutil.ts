import readline from 'readline-promise';
const fs = require('fs');
import {promises as fsPromise} from "fs"
const path = require('path');

export default class fileutil {

    public onloadMap?: (map:Map<string,string>,fileMap:Map<string,string>) => void

    public loadMap(filelist:Array<string>) {
        let ipMap = new Map<string, string>(); 
        let fileMap = new Map<string, string>(); 
        let fileCount = 0;
        let __this = this;
        filelist.forEach( async (i) => {
            if (!Array.isArray(i) &&  i.toString().endsWith('.ipset') ) {
              fileCount++ ; 
              fileMap.set(i.toString(),'');
                  
              const rlp = readline.createInterface({
                terminal: false,
                input: fs.createReadStream(i)
              });
              
              rlp.on('pause', function () {  rlp.resume(); });
    
              rlp.on('close', function () { 
                fileCount--;
                if (fileCount === 0) {
                  __this.onloadMap(ipMap,fileMap);  
                }
              });
    
              rlp.forEach((line, index) => {
                if (!line.startsWith('#')) {
                  ipMap.set(line,i.toString());
                } else {
                  fileMap.set(i.toString(),fileMap.get(i.toString()) + '\r\n' + line);
                }
              });
      
            }
        });    
    }


    public async getFilesFromDirectory(directoryPath)
    {
        const filesInDirectory = await fsPromise.readdir(directoryPath);
        const files = await Promise.all(
            filesInDirectory.map(async (file) => {
                const filePath = path.join(directoryPath, file);
                const stats = await fsPromise.stat(filePath);
                
                if (stats.isDirectory()) {
                    return this.getFilesFromDirectory(filePath);
                } else {
                    return filePath;
                }
            })
        );
        return files; 
    } 


}