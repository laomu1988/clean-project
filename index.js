var md5_file = require('md5-file').sync;
var folder = require('filter-files');
var _ = require('lodash');
var path = require('path');
var logger = require('logger-color');
var quote = require('quote-files');
var _config = {
    // 项目根目录
    folder: '',
    // 从什么文件开始匹配
    from: '.html'
};

var cache_md5 = {}, cache_ext = {}, cache_file = {}, chche_name = {}, needCal = [], needFile = [];


module.exports = function (config) {
    if (typeof config === 'string') {
        config = {folder: config};
    }
    if (typeof config !== 'object' || !config.folder) {
        throw new Error('clean project need right arguments');
        return;
    }

    var files = folder.sync(config.folder);
    for (var i = 0; i < files.length; i++) {
        var filepath = files[i];
        var ext = path.extname(filepath) + '';
        if (cache_ext[ext]) {
            cache_ext[ext].push(filepath);
        } else {
            cache_ext[ext] = [filepath];
        }

        var md5 = md5_file(filepath);
        if (cache_md5[md5]) {
            cache_md5[md5].push(filepath);
        } else {
            cache_md5[md5] = [filepath];
        }
        cache_file[filepath] = {
            md5: md5,
            fullPath: filepath,
            ext: ext,
            name: path.basename(filepath),
            isUsed: false,
            caled: false
        };
        if (ext == '.html') {
            needCal.push(cache_file[filepath]);
        }
    }

    // 判断文件引入
    while (needCal.length > 0) {
        var info = needCal.pop();
        if (info.caled) {
            continue;
        }
        var fullPath = info.fullPath;
        info.caled = true;
        info.isUsed = true;
        var quotefiles = quote(fullPath, config.folder);
        if (quotefiles && quotefiles.length > 0) {
            info.quotes = quotefiles;
            for (var i = 0; i < quotefiles.length; i++) {
                var file = quotefiles[i];
                if (file.isLocal) {
                    if (file.isExist && cache_file[file.absolute]) {
                        needCal.push(cache_file[file.absolute]);
                    } else {
                        // todo: not include file
                        file.ref = fullPath;
                        needFile.push(file);
                    }
                }
            }
        }
    }

    // 输出未使用的文件
    var output = '';
    for (var fullPath in cache_file) {
        if (!cache_file[fullPath].isUsed) {
            output += fullPath + '\n';
        }
    }
    if (output) {
        logger.warning('The Following files is No Use in project：');
        console.log(output);
    }

    // 输出项目中缺失的文件
    if (needFile.length > 0) {
        logger.warning('The Following file is out of project:');
        for (var i = 0; i < needFile.length; i++) {
            console.log(needFile[i].absolute + '  IncludeBy:' + needFile[i].ref);
        }
        console.log('\n');
    }


    // 输出重复文件
    for (var md5 in cache_md5) {
        if (cache_md5[md5] && cache_md5[md5].length > 1) {
            logger.warning('The following file has SAME Content:');
            console.log(cache_md5[md5].join('\n'));
        }
    }
};