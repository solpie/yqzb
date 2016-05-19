var isdef = function (val) {
    return val != undefined
};
var prop = function (obj, paramName, v, callback?) {
    if (isdef(v)) {
        obj[paramName] = v;
        if (callback)
            callback();
    }
    else
        return obj[paramName]
};

var obj2Class = function (obj, cls) {
    var c = new cls;
    for (var paramName in obj) {
        c[paramName] = obj[paramName];
    }
    return c;
};
class BaseInfo {

}