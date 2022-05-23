const fsPromises = require('fs/promises');
const { join } = require('path');
const { stdout, stderr } = require('process');

const copyDir = async (dirFrom, dirTo) => {
    await fsPromises.rm(dirTo, {
        recursive: true,
        force: true
    });
    await fsPromises.mkdir(dirTo, {
        recursive: true
    });
    const files = await fsPromises.readdir(dirFrom, {
        withFileTypes: true
    });

    for (const file of files) {
        let pathFileFrom = join(dirFrom, file.name);
        let pathFileTo = join(dirTo, file.name);

        if (file.isFile()) {
            await fsPromises.copyFile(pathFileFrom, pathFileTo);
        }
    }
    return true;
};

const dirFrom = join(__dirname, 'files');
const dirTo = join(__dirname, 'files-copy');

async function startCopy() {
    try {
        await copyDir(dirFrom, dirTo);
        stdout.write(`Done. Dir name: ${dirTo}\r\n`);
    } catch (err) {
        stderr.write(`Failed. ${err}`);
    }
}

startCopy();