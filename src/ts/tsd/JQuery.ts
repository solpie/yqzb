interface JQuery {
    fadeIn(): JQuery;
    fadeOut(): JQuery;
    focus(): JQuery;
    focusout(): JQuery;
    html(): string;
    html(val:string): JQuery;
    data(val:string):JQuery;
    css(val):JQuery;
    show(): JQuery;
    hide(): JQuery;
    addClass(className:string): JQuery;
    removeClass(className:string): JQuery;
    on(type:string, func):JQuery;
    remove();
    append(el:HTMLElement): JQuery;
    offset(): any;
    val(): string;
    val(value:string): JQuery;
    width(): string;
    width(value:number): JQuery;
    height(): string;
    height(value:number): JQuery;
    scrollTop(value:number): JQuery;
    scrollLeft(value:number): JQuery;
    unbind(value:string): JQuery;
    change(func:any): JQuery;
    trigger(type:any): JQuery;
    attr(attrName:string,param?): string;
    position():any;
    (selector:string): any;
}

export {$}
declare var $:{
    get(val:string, func:any);
    (el:HTMLElement): JQuery;
    (selector:string): any;
    post(url:string,option:any,callback:any): any;
    (readyCallback:() => void): JQuery;
};

interface HTMLElement {
    getContext(val:string):any;
    toDataURL(val:string):any;
    src:string;
    width:any;
    height:any;
}
interface Navigator {
    webkitGetUserMedia:any;
}
declare var webkitURL:{
    createObjectURL(stream:any):any;
};
// declare var Mustache:{
//     render(tpl:string, data?:Object);
// };

function chooseFile(name):JQuery {
    var chooser = $(name);
    chooser.unbind('change');
    //chooser.change(function (evt) {
    //});
    chooser.trigger('click');
    return chooser;
}
//trackingjs
interface Tracker {
    setInitialScale(v:number):any;
    setStepSize(v:number):any;
    setEdgesDensity(v:number):any;
    on(evt:string, func:any);
}
declare var tracking:{
    track(elm:string, tracker:any, option:Object):Tracker;
    ObjectTracker(type:string):void;
};

var sortCompare = function (prop) {
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
};