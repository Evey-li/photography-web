const Controller = require('egg').Controller;
const Response = require('../util/response');
const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const md5File = require('md5-file');
const FileUtil = require('../util/file');

class FileController extends Controller {
  async uploadAvatar() {
    const stream = await this.ctx.getFileStream();
    const filename = encodeURIComponent(stream.fields.id) + path.extname(stream.filename).toLowerCase();
    const target = path.join(this.config.baseDir, 'public/avatar', filename);
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
    this.ctx.body = new Response(Response.SUCCESS, {
      url: `/public/avatar/${filename}`
    }, null);
  }
  async uploadFile() {
    let result = '';
    const stream = await this.ctx.getFileStream();

    if (!stream.filename) {
      return;
    }
    try {
      const extname = path.extname(stream.filename).toLowerCase();
      const tmpFilePath = await FileUtil.saveToTmpFile(stream);
      const hash = md5File.sync(tmpFilePath);
      const target = path.join(this.config.baseDir, 'public/', hash + extname);
      FileUtil.moveFile(tmpFilePath, target);
      result = new Response(Response.SUCCESS, {
        url: `/public/${hash + extname}`
      }, null);
    } catch (err) {
      await sendToWormhole(stream);
      console.log(err);
    }
    this.ctx.body = result;
  }
}

module.exports = FileController;