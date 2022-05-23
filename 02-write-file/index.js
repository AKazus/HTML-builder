const process = require('process');
const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mynotes.txt');
const streamWrite = fs.createWriteStream(filePath, 'utf-8');

const appendToFile = (text) => {
  streamWrite.write(text);
}

const onExit = () => {
  console.log('Thank you!');
};

const readLine = require('readline').createInterface({
  input: stdin,
  output: stdout
});

readLine.write('Введите текст:\r\n');
readLine.on('line', (data) => {
  if (data.trim().toLowerCase() === 'exit') {
    process.exit();
  } else {
    appendToFile(data);
  }
});

process.on('exit', onExit);
process.on('SIGINT', onExit);
