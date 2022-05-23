const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const pathCreateFolder = path.join(__dirname, 'project-dist');
const pathAssetsTo = path.join(pathCreateFolder, 'assets');
const pathCssTo = path.join(pathCreateFolder, 'style.css');
const pathHtmlTo = path.join(pathCreateFolder, 'index.html');

const pathToComponents = path.join(__dirname, 'components');
const pathAssetsFrom = path.join(__dirname, 'assets');
const pathCssFrom = path.join(__dirname, 'styles');
const pathHtmlFrom = path.join(__dirname, 'template.html');

async function createFolder(inputPath) {
  fs.access(inputPath, fs.F_OK, (err) => {
    if (err) {
      console.error(err)
      fsPromises.mkdir(inputPath);
    }
  })
}

async function createFile(inputPath, content) {
  fsPromises.writeFile(inputPath, content);
}

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
  createFile(pathToFile, arrOfStyles);
}

const copyDir = async (dirFrom, dirTo) => {
  await fsPromises.rm(dirTo, { recursive: true, force: true });
  await fsPromises.mkdir(dirTo, { recursive: true });
  const files = await fsPromises.readdir(dirFrom, { withFileTypes: true});

  for (const file of files) {
      let pathFileFrom = path.join(dirFrom, file.name);
      let pathFileTo = path.join(dirTo, file.name);

      if (file.isDirectory()) {
        await fsPromises.mkdir(pathFileTo, { recursive: true });
        await copyDir(pathFileFrom, pathFileTo);
  
      } else if (file.isFile()) {
          await fsPromises.copyFile(pathFileFrom, pathFileTo);
      }
  }
};

async function copyComponents(pathHtmlFrom, pathToComponents, pathHtmlTo) {
  let baseFile = await fsPromises.readFile(pathHtmlFrom, 'utf-8');
  const filesNameArr = await fsPromises.readdir(pathToComponents, { withFileTypes: true });

  for (let file of filesNameArr) {
    const componentContent = await fsPromises.readFile(path.join(pathToComponents, `${file.name}`), 'utf-8');
    const template = `{{${path.basename(file.name, '.html')}}}`;
    baseFile = baseFile.replace(template, componentContent);
  }

  createFile(pathHtmlTo, baseFile);
}

async function createPage() {
  createFolder(pathCreateFolder);
  addStyles(pathCssFrom, pathCssTo);
  copyDir(pathAssetsFrom, pathAssetsTo);
  copyComponents(pathHtmlFrom, pathToComponents, pathHtmlTo);
}

createPage();