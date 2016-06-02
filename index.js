var md5_file = require('md5-file').sync;
var folder = require('filter-files');
var _ = require('lodash');
var path = require('path');
var logger = require('logger-color');
var _config = {
    // 项目根目录
    folder: '',
    // 从什么文件开始匹配
    from: '.html'
};

var cache_md5 = {};
var cache_ext = {};


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
        var ext = path.extname(filepath);
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
    }

    // 引入文件规则

    // 输出重复文件
    for (var md5 in cache_md5) {
        if (cache_md5[md5] && cache_md5[md5].length > 1) {
            logger.warning('The following file has SAME Content...\n', cache_md5[md5].join('\n'), '\n');
        }
    }
};