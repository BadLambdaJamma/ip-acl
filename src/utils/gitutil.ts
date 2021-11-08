const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export default class gitutil {

    public async Clone(repoBase: string, repo:string, dataDir: string)  {
        const repoDir = path.join(dataDir, repo);
        const repoFullPath = `${repoBase}/${repo}`;
        await exec(`rm -rf ${repoDir}`);
        await exec(`git clone ${repoFullPath} ${repoDir}`);
    }

    public async getCommitHash(repo:string, dataDir: string)  {
        const repoDir = path.join(dataDir, repo);
        const {err, stdout, stderr}  = await exec("git describe --always --dirty --long --tags", { cwd: repoDir});
        return stdout;
    }

}

