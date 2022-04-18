"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

var fs = require("fs");
var path = require("path");

//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.join(__dirname, "./templates");

function findSync(startPath) {
  let result = [];
  function finder(startPath) {
    let files = fs.readdirSync(startPath);
    files.forEach(val => {
      let fPath = path.join(startPath, val);
      let stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) result.push(fPath);
    });
  }
  finder(startPath);
  return result;
}
function getDestDir(dirs) {
  return dirs.map(v => v.split("\\templates\\")[1].replace(/\\/g, "/"));
}
module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.option('sub', {
      type: String,
      required: false,
      desc: '切换Sub'
    });
  }
  default() {
    if (this.options.sub) {
      let options = { name: this.props.name };
      this.composeWith(require.resolve('../sub'), options);
    }
  }
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the superior ${chalk.red("generator-hzw-java")} generator!`
      )
    );
    const prompts = [
      // {
      //   type: 'confirm',
      //   name: 'version',
      //   message: 'Would you like to enable this option?',
      //   default: true
      // },
      {
        type: "input",
        name: "name",
        message: "输入项目:",
        default: "myProject"
      },
      {
        type: "input",
        name: "author",
        required: true,
        message: "输入开发者："
      },
      {
        type: "input",
        name: "moduleName",
        message: "输入包名："
      },
      {
        type: "list",
        name: "method",
        message: "请求方式?",
        choices: [
          {
            name: "GET",
            value: "GET"
          },
          {
            name: "POST",
            value: "static_method"
          },
          {
            name: "PUT",
            value: "custom_selector"
          }
        ]
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    let fileNames = findSync(filePath);
    const templates = getDestDir(fileNames);
    const dirMp = {
      moduleName: this.props.moduleName,
      projectName: this.props.name
    };
    const destDir = item => {
      for (let i in dirMp) {
        if (item.indexOf(i) >= 0) {
          var reg = new RegExp(i, "g");
          item = item.replace(reg, dirMp[i]);
        }
      }
      return item;
    };
    const templEn = (template, json) => {
      var pattern = /{(.*?)}/g;
      return template.replace(pattern, function(match, key, value) {
        return json[key];
      });
    };
    templates.forEach(item => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(templEn(item, dirMp)),
        this.props
      );
    });
  }
  install() {
    // this.installDependencies();
  }
  end() {
    this.log('构建完成！');
  }
};
