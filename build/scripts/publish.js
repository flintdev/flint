// upload latest release to github

const fs = require('fs');
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;
const mime = require('mime-types');
const ora = require('ora');
const pjsonStr = fs.readFileSync('./package.json');
const pjson = JSON.parse(pjsonStr);
const version = pjson.version;
const {host, owner, repo} = pjson.build.mac.publish[0];
const baseURL = `https://api.${host}/repos/${owner}/${repo}/releases`;
//
const releaseContent = fs.readFileSync('./build/latest-release.md').toString();
const settingsJson = JSON.parse(fs.readFileSync('./.settings.json'));
const githubToken = settingsJson.github.token;
const headers = {Authorization: `token ${githubToken}`};


const createRelease = async () => {
    const spinner = ora(`Creating new release of version ${version}`).start();
    const data = {
        tag_name: version,
        name: version,
        body: releaseContent,
        prerelease: true,
    };
    try {
        const response = await fetch(baseURL, {
            headers: {...headers, 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify(data)
        });
        spinner.succeed('Release is created');
        return await response.json();
    } catch (err) {
        spinner.fail('Unable to create release');
        console.log(err);
        return false;
    }
};

const uploadReleaseAsset = async (uploadURL, assetName, binary, mediaType) => {
    const url = uploadURL.replace('{?name,label}', `?name=${assetName}`);
    if (!binary) return false;
    try {
        const response = await fetch(url, {
            headers: {...headers, 'Content-Type': mediaType},
            method: 'POST',
            body: binary,
        });
        return await response.json();
    } catch (err) {
        console.log(err);
        return false;
    }
};

const getReleaseBinary = (version) => {
    const namePathMap = {
        "latest-mac.yml": "./dist/latest-mac.yml",
        [`Flint-${version}-mac.zip`]: `./dist/Flint-${version}-mac.zip`,
        [`Flint-${version}.dmg`]: `./dist/Flint-${version}.dmg`,
    };
    let nameBinaryList = [];
    for (let name of Object.keys(namePathMap)) {
        try {
            const filePath = namePathMap[name];
            const binary = fs.readFileSync(filePath);
            if (!binary) return false;
            const mediaType = mime.lookup(filePath);
            nameBinaryList.push({name, binary, mediaType});
        } catch (err) {
            console.log(err);
            return false
        }
    }
    return nameBinaryList;
};

async function publish () {
    const response = await createRelease();
    if (!response) return false;
    const uploadURL = response['upload_url'];
    const nameBinaryList = getReleaseBinary(version);
    if (!nameBinaryList || nameBinaryList.length === 0) {
        console.log(chalk.red("Unable to find binary files"));
        return false;
    }
    for (let item of nameBinaryList) {
        const {name, binary, mediaType} = item;
        const assetName = name;
        const spinner = ora(`Uploading ${name}`).start();
        try {
            const result = await uploadReleaseAsset(uploadURL, assetName, binary, mediaType);
            spinner.succeed(`${name} is uploaded`);
        } catch (err) {
            console.log(err);
            spinner.fail(`Unable to upload ${name}`);
        }
    }
}

publish().then(r => {});