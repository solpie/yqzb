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
class BaseInfo{
    
}