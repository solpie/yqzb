//Array.sort(sortProp('prop'))
function sortProp(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}

function formatSecond(sec, minStr = ":", secStr = "") {
    var min = Math.floor(sec / 60);
    var s = sec % 60;
    var strMin = min + "";
    var strSec = s + "";
    if (min < 10)
        strMin = "0" + strMin;
    if (s < 10)
        strSec = "0" + strSec;
    return strMin + minStr + strSec + secStr;
}