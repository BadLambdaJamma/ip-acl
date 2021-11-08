export default interface ISettings {
    logging: {
        target: string;
        level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
        console: {
            enabled: boolean;
            pretty: boolean;
        };
    };
    storage: {
        provider: string;
        storagePath: string;
    };
    github : {
        repoBase :  string;
        repoName: string;
    },
    proxy : {
        target : string;
        manualBlockList : Array<string>;
        paths : Array<string>;
    }
}