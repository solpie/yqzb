var fs = require('fs');

function readFile(file, options, callback) {
    if (callback == null) {
        callback = options;

        options = {};
    }

    fs.readFile(file, options, function (err, data) {
        if (err) return callback(err);

        var obj;
        try {
            obj = JSON.parse(data, options ? options.reviver : null);
        } catch (err2) {
            return callback(err2);
        }

        callback(null, obj);
    })
}

function readFileSync(file, options) {
    options = options || {};
    if (typeof options === 'string') {
        options = {encoding: options};
    }

    var shouldThrow = 'throws' in options ? options.throw : true;

    if (shouldThrow) { // i.e. throw on invalid JSON
        return JSON.parse(fs.readFileSync(file, options), options.reviver);
    } else {
        try {
            return JSON.parse(fs.readFileSync(file, options), options.reviver);
        } catch (err) {
            return null;
        }
    }
}

function writeFile(file, obj, options, callback) {
    if (callback == null) {
        callback = options;
        options = {}
    }

    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
        ? options.spaces : this.spaces
        : this.spaces;

    var str = '';
    try {
        str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n'
    } catch (err) {
        if (callback) return callback(err, null)
    }

    fs.writeFile(file, str, options, callback)
}

function writeFileSync(file, obj, options) {
    options = options || {};

    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
        ? options.spaces : this.spaces
        : this.spaces;

    var str = JSON.stringify(obj, options.replacer, spaces) + '\n';
    // not sure if fs.writeFileSync returns anything, but just in case
    return fs.writeFileSync(file, str, options)
}
function queueFile(pathArr, callback) {
    var len = pathArr.length;
    var count = 0;
    var loadOne = function (err, jobj) {
        if (err)
            callback(err, null);
        else {
            pathArr[count].data = jobj;
            count++;
            if (count == len)
                callback(null, pathArr);
            else
                readFile(pathArr[count].src, null, loadOne)
        }
    };
    readFile(pathArr[0].src, null, loadOne);
}

var jsonfile = {
    spaces: null,
    readFile: readFile,
    readFileSync: readFileSync,
    writeFile: writeFile,
    writeFileSync: writeFileSync
};
//module.exports = jsonfile;

function base64ToPng(imgPath2, base64Data, callback?) {
    var base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
    var writePath = imgPath2;
    if (!isDev)
        writePath = M_path.join(appExecPath, imgPath2);
    writeFile(writePath, base64Data, 'base64', (err)=> {
        if (!err) {
            if (callback)
                callback('/' + imgPath2);
        }
    });
}