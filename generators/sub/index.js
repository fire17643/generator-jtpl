"use strict";
const Generator = require("yeoman-generator");
var path = require("path");

//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.join(__dirname, "./templates/d.json");
module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'The new module name.'
    });
  }
  prompting() {
    const prompts = [
      {
        type: 'confirm',
        name: 'version',
        message: '可不可以?',
        default: true
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(filePath, this.options.name + '/d.json', {
      name: 'hzw-i',
      author: 'hzw'
    })
  }
};
