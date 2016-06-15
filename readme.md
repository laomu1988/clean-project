# 清理项目
* 查找没有使用到的文件
* 查找缺失的文件
* 查找重复的文件

## 说明
  将从html文件开始计算其引用文件，引用文件再次计算引用，一级一级一直到全部计算完毕为止。

## 安装
```
npm install clean-project
```

## 使用：
```
var clean = require('clean-project');
clean(__dirname + '/project/');
```
将根据项目输出类似下面内容
```
WARNING 02:35:59 :  The Following files is No Use in project： 
/node_modules/clean-project/project/output/nouse.css

WARNING 02:35:59 :  The Following file is out of project: 
/node_modules/clean-project/project/output/index.js  IncludeBy:/node_modules/clean-project/project/output/test2.html
/node_modules/clean-project/project/test.js  IncludeBy:/node_modules/clean-project/project/output/test2.html
/node_modules/clean-project/project/output/backgroundimage.png  IncludeBy:/node_modules/clean-project/project/output/index.css
/node_modules/clean-project/project/output/test.css  IncludeBy:/node_modules/clean-project/project/output/index.css


WARNING 02:35:59 :  The following file has SAME Content: 
/node_modules/clean-project/project/output/index.html
/node_modules/clean-project/project/output/test.html

```



## todo：
* 指定从什么文件开始匹配
* 指定不判断的文件路径
* 使用命令行清理项目