const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, '../../tmp/');

function createTmpName() {
  return `${tmpDir}tmpImagefile`;
}
/**
 * 保存文件到临时目录
 * @param {FileStream} fileStream 需要保存的文件流
 * @returns Promise resolve => fileName
 */
function saveToTmpFile(fileStream) {
  return new Promise((resolve, reject) => {
    try {
      const tmpFileName = createTmpName();
      const tmpFile = fs.createWriteStream(tmpFileName);
      fileStream.pipe(tmpFile);
      tmpFile.on('close', () => {
        resolve(tmpFileName);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function moveFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(oldPath)) {
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      reject('文件不存在');
    }
  });
}
module.exports = {
  saveToTmpFile,
  moveFile
};