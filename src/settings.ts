
import ISettings from './interfaces/settings';

const settings: ISettings = {
    'logging': {
        'target': 'console',
        'level': 'debug',
        'console': {
            'enabled': true,
            'pretty': true
        }
    },
    'storage': {
        'provider': 'fs',
        'storagePath' : '/Users/jnewell/ip-acl/data'
    },
    'github' : {
        'repoBase' : 'https://github.com/firehol',
        'repoName' : 'blocklist-ipsets'
    },
    'proxy' : {
            'target' : 'https://jsonplaceholder.typicode.com' ,
            'manualBlockList' : ['127.0.0.1'],
            'paths' : ['/users']
    }
};

export default settings;