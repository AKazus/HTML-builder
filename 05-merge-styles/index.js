const fsPromises = require('fs/promises');
const path = require('path');

async function addStyles(pathFromFolder, pathToFile) {
  let arrOfStyles = [];
  const filesNameArr = await fsPromises.readdir(pathFromFolder, { withFileTypes: true });

  for (let item of filesNameArr) {
    const pathToCurrentFile = path.join(pathFromFolder, item.name);
    const fileType = path.extname(pathToCurrentFile).slice(1);

    if (fileType === 'css') {
      const cssContent = await fsPromises.readFile(pathToCurrentFile, 'utf8');
      arrOfStyles.push(`${cssContent}\r\n`);
    }
  }
  await fsPromises.writeFile(pathToFile, arrOfStyles);
}

const pathToFile = path.join(__dirname, 'project-dist', 'bundle.css');
const pathFromFolder = path.join(__dirname, 'styles');

addStyles(pathFromFolder, pathToFile);