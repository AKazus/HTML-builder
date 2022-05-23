const { readdir } = require('fs/promises');
const { stat } = require('fs');
const path = require('path');
const { stdout, stderr } = require('process');

const dir = 'secret-folder';
const pathName = path.join(__dirname, dir);

function writeFileList(file) {
    const filePath = path.join(__dirname, dir, file.name);

    stat(filePath, (error, stats) => {
        if (error) {
            stderr.write(`Error: ${error}`);
        } else if (stats.isFile()) {
            let ext = path.extname(filePath).slice(1);
            let fileInfo = `${file.name} - ${ext} - ${stats.size / 1024}kb`;
            stdout.write(fileInfo + '\r\n');
        }
    });
}

async function getDirInfo() {
    try {
        const files = await readdir(pathName, {
            withFileTypes: true
        });
        for (const file of files) writeFileList(file);
    } catch (err) {
        stderr.write(`Error: ${err}`);
    }
}

getDirInfo();