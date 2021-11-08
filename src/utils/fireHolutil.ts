import fileutil from './fileutil';
import EventAsPromise from 'event-as-promise';
import settings from '../settings';
import gitutil from './gitutil';
import ifirehol from '../interfaces/ifirehol';
/*
    FireHol IP filtering for NodeJs applications.

    Firehol is a currated list of IPV4 actors that 
    you may choose to deny access to your applications. 

    Traditionaly this tool chain has been used to deploy IP Tables
    configurations for nix based hosts. the goal of this library is 
    to provide the same capability to the nodeJs runtime.

    Koa, Express, and hapi applications can easily implement middlewares
    to filter all requests by the fireHol list.
    
    fireHol netset and ipset data is source from here: https://github.com/firehol/blocklist-ipsets

*/
export class fireHolutil {
    
    private ipMap : Map<string,string> = new Map<string,string>();
    private fileMap : Map<string,string> =  new Map<string,string>();
    private manualBlockCount : number = 0;
    private gitHash : string; 
    private watchDogTimer: NodeJS.Timeout;

     /**
     * Intializes the fireHol instance.
     * @remarks
     * intialization is method needs to be async, as such, this method is provided versus a constructor
     * @returns void
     */
    public async init() {
        
        [   this.ipMap,
            this.manualBlockCount, 
            this.fileMap,
            this.gitHash
        ] = await this.loadFireHol();
        
        this.watchDogTimer = setInterval(() => {
            this.watchDog();
        }, 1000*60*5);

    }

     /**
     * gets the status of the fireHol instance (loaded data state)
     * @returns {ifirehol}
     */
    public status() : ifirehol {
       const statusResult = { 'ip': { 
            'loaded' : this.ipMap.size,
            'manual' : this.manualBlockCount,
            'fileCount' : this.fileMap.size,
            'gitHash' : this.gitHash
       }};
       return statusResult
    }
    
    public isBlocked(ipAddress : string) : [boolean, string] {
        if (!this.ipMap.has(ipAddress)) return [false,''];
        return [true, this.ipMap.get(ipAddress)];     
    }

    private async watchDog()  {
        const git = new gitutil();
        const gitHash = await git.getCommitHash(settings.github.repoName,settings.storage.storagePath);
        if (gitHash != this.gitHash) {
            [   this.ipMap,
                this.manualBlockCount, 
                this.fileMap,
                this.gitHash
            ] = await this.loadFireHol();
        }    
    }

    private async loadFireHol() {
        const git = new gitutil();
        const file = new fileutil();
        await git.Clone(settings.github.repoBase,settings.github.repoName, settings.storage.storagePath);
        const fireholeFiles = await file.getFilesFromDirectory(`${settings.storage.storagePath}/${settings.github.repoName}`);
        const gitHash = await git.getCommitHash(settings.github.repoName,settings.storage.storagePath);
        const [blockList, fileMap, manualBlockCount] =  await this.getfireHolData(fireholeFiles); 
        return [blockList, manualBlockCount, fileMap, gitHash];
    }

    private async getfireHolData(filelist : Array<string>) {
        const doneLoadingPromise = new EventAsPromise({ array: true });
        const files = new fileutil(); 
        files.onloadMap = doneLoadingPromise.eventListener;
        files.loadMap(filelist);
        const [blockList,fileMap] = await doneLoadingPromise.one();
        settings.proxy.manualBlockList.forEach( async (value: string,) => {
            this.ipMap.set(value,'SYSTEM_DEFINED_BLOCK');
        });
        return   [blockList, fileMap, settings.proxy.manualBlockList.length];  
    }    
}